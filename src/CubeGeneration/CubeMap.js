import { Vector3 } from 'three';
import { BoxGeometry } from 'three';
import { MeshBasicMaterial } from 'three';
import { Mesh } from 'three';
import { Box3 } from 'three';
import { Box3Helper } from 'three';

const width = 1;
const height = 1;
const depth = 1;

class DropCube {

    constructor(color, mapPosition, flow, cubeMap, cubeIndex) {
        this.cubeMap = cubeMap;
        this.cubeIndex = cubeIndex;
        this.createCube = function (width, height, depth, position, color) {
            var geometry = new BoxGeometry(width, height, depth);
            var material = new MeshBasicMaterial({ color: color, transparent: true });
            var cube = new Mesh(geometry, material);
            cube.position.set(position.x, position.y, position.z);
            return cube;
        }

        this.setContent = function (value) {
            this.content = value;
            this.cube.material.opacity = value * 0.08;
        }

        this.getNeighborsPromise = function () {
            return new Promise(resolve => {
                var neighbor = this.getNeighbors(this);
                resolve(neighbor);
            });
        }

        var position = new Vector3(mapPosition.x, mapPosition.y, mapPosition.z);
        this.cube = this.createCube(width, height, depth, position, color)
        this.mapPosition = mapPosition;
        this.setContent(0);
        this.flow = flow;
    }

    update() {
        this.updateAsync();
    }

    async updateAsync() {
        console.log('calling');
        var neighbors = await this.getNeighborsPromise(this);
        var neighbourIndex = Math.floor(neighbors.length * Math.random());
        var neighbor = neighbors[neighbourIndex];
        var currentContent = this.content - neighbor.flow;

        if (this.content > neighbor.content) {
            neighbor.setContent(neighbor.content + neighbor.flow);
            this.setContent(currentContent);
        }
    }

    getNeighbors() {
        var neighbors = [];

        var topCubePosition = new Vector3(this.mapPosition.x, this.mapPosition.y + 1, this.mapPosition.z);
        var topCube = this.cubeMap.getCubeAtMapPosition(topCubePosition);
        var frontCubePosition = new Vector3(this.mapPosition.x, this.mapPosition.y, this.mapPosition.z + 1);
        var frontCube = this.cubeMap.getCubeAtMapPosition(frontCubePosition);
        var rearCubePosition = new Vector3(this.mapPosition.x, this.mapPosition.y, this.mapPosition.z - 1);
        var rearCube = this.cubeMap.getCubeAtMapPosition(rearCubePosition);
        var rightCubePosition = new Vector3(this.mapPosition.x + 1, this.mapPosition.y, this.mapPosition.z);
        var rightCube = this.cubeMap.getCubeAtMapPosition(rightCubePosition);
        var leftCubePosition = new Vector3(this.mapPosition.x - 1, this.mapPosition.y, this.mapPosition.z);
        var leftCube = this.cubeMap.getCubeAtMapPosition(leftCubePosition);
        var bottomCubePosition = new Vector3(this.mapPosition.x, this.mapPosition.y - 1, this.mapPosition.z);
        var bottomCube = this.cubeMap.getCubeAtMapPosition(bottomCubePosition);

        if (frontCube) {
            neighbors.push(frontCube);
        }
        if (rearCube) {
            neighbors.push(rearCube);
        }
        if (rightCube) {
            neighbors.push(rightCube);
        }
        if (leftCube) {
            neighbors.push(leftCube);
        }
        if (topCube) {
            neighbors.push(topCube);
        }
        if (bottomCube) {
            neighbors.push(bottomCube);
        }
        return neighbors;
    }

}

class CubeMap {

    constructor(scene) {
        this.cubes = [];
        this.scene = scene;
        this.centerCube = null;
        this.cubeIndex = 0;
        this.generateCubeMap = function (levels, flow, minShareValue) {
            this.levels = levels;
            this.flow = flow;
            this.minShareValue = minShareValue;
            for (let indexX = 0; indexX < levels; indexX++) {
                for (let indexY = 0; indexY < levels; indexY++) {
                    for (let indexZ = 0; indexZ < levels; indexZ++) {
                        var color = 0xffffff;
                        let dropCube = new DropCube(color, new Vector3(indexX, indexY, indexZ), flow, this, this.cubeIndex);
                        this.cubeIndex++;
                        this.cubes.push(dropCube);
                        this.scene.add(dropCube.cube);
                    }
                }
            }
        };

        this.getCubeAtMapPosition = function (mapPosition) {
            var cubeAtPos = this.cubes.find(dropCube => dropCube.mapPosition.x === mapPosition.x && dropCube.mapPosition.y === mapPosition.y && dropCube.mapPosition.z === mapPosition.z);
            return cubeAtPos;
        };

    }

    update() {
        var cubes = this.cubes.filter(cube => cube.content > this.minShareValue);
        cubes.sort(this.compareContent);
        cubes.forEach(cube => {
            cube.update();
        });

    }

    compareContent(a, b) {
        if (a.content < b.content) {
            return -1;
        }
        if (a.content > b.content) {
            return 1;
        }
        return 0;
    }

    setStartCube(cube) {
        this.startCube = cube;
    }

    createCubeMapHelper() {
        var box = new Box3();
        box.setFromCenterAndSize(new Vector3((this.levels / 2) - 0.5, (this.levels / 2) - 0.5,(this.levels / 2) - 0.5), new Vector3(this.levels, this.levels, this.levels));
        var helper = new Box3Helper(box, 0xffff00);
        this.scene.add(helper);
        this.box = box;
    }

}
export {
    CubeMap,
    DropCube,
}

