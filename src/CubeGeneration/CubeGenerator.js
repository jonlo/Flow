import { Vector3 } from 'three';
import { BoxGeometry } from 'three';
import { MeshBasicMaterial } from 'three';
import { Mesh } from 'three';

const width = 1;
const height = 1;
const depth = 1;

class DropCube {

    constructor(color, mapPosition, flow, cubeMapGenerator) {
        this.cubeMapGenerator = cubeMapGenerator;
        this.createCube = function (width, height, depth, position, color) {
            var geometry = new BoxGeometry(width, height, depth);
            var material = new MeshBasicMaterial({ color: color, transparent: true });
            var cube = new Mesh(geometry, material);
            cube.position.set(position.x, position.y, position.z);
            return cube;
        }

        this.setContent = function (value) {
            this.content = value;
            this.cube.material.opacity = value * 0.1;
        }

        this.updateCube = function () {
            if (this.content < 0.2) { return; }
            var neighbors = this.getNeighborgs(this);
            neighbors.forEach(neighbor => {
                var currentContent = this.content - neighbor.flow;
                if (currentContent > 0.2 && this.content > neighbor.content) {
                    neighbor.setContent(neighbor.content + neighbor.flow);
                    this.setContent(currentContent);
                }
            });

        }

        var position = new Vector3(mapPosition.x, mapPosition.y, mapPosition.z);
        this.cube = this.createCube(width, height, depth, position, color)
        this.mapPosition = mapPosition;
        this.setContent(0);
        this.flow = flow;
    }

    getNeighborgs() {
        var neighbors = [];
        var rightCubePosition = new Vector3(this.mapPosition.x + 1, this.mapPosition.y, this.mapPosition.z);
        var rightCube = this.cubeMapGenerator.getCubeAtMapPosition(rightCubePosition);
        if (rightCube) {
            neighbors.push(rightCube);
        }
        var leftCubePosition = new Vector3(this.mapPosition.x - 1, this.mapPosition.y, this.mapPosition.z);
        var leftCube = this.cubeMapGenerator.getCubeAtMapPosition(leftCubePosition);
        if (leftCube) {
            neighbors.push(leftCube);
        }

        var topCubePosition = new Vector3(this.mapPosition.x, this.mapPosition.y + 1, this.mapPosition.z);
        var topCube = this.cubeMapGenerator.getCubeAtMapPosition(topCubePosition);
        if (topCube) {
            neighbors.push(topCube);
        }

        var bottomCubePosition = new Vector3(this.mapPosition.x, this.mapPosition.y - 1, this.mapPosition.z);
        var bottomCube = this.cubeMapGenerator.getCubeAtMapPosition(bottomCubePosition);
        if (bottomCube) {
            neighbors.push(bottomCube);
        }

        var frontCubePosition = new Vector3(this.mapPosition.x, this.mapPosition.y, this.mapPosition.z + 1);
        var frontCube = this.cubeMapGenerator.getCubeAtMapPosition(frontCubePosition);
        if (frontCube) {
            neighbors.push(frontCube);
        }

        var rearCubePosition = new Vector3(this.mapPosition.x, this.mapPosition.y, this.mapPosition.z - 1);
        var rearCube = this.cubeMapGenerator.getCubeAtMapPosition(rearCubePosition);
        if (rearCube) {
            neighbors.push(rearCube);
        }

        return neighbors;
    }

    update() {
        this.updateCube();
    }

}

class CubeMapGenerator {

    constructor(scene) {
        this.cubeMap = [];
        this.scene = scene;
        this.centerCube = null;

        this.generateCubeMap = function (levels) {
            this.levels = levels;
            for (let indexX = 0; indexX < levels; indexX++) {
                for (let indexY = 0; indexY < levels; indexY++) {
                    for (let indexZ = 0; indexZ < levels; indexZ++) {
                        var color = 0xff00ff;
                        let dropCube = new DropCube(color, new Vector3(indexX, indexY, indexZ), Math.random() * 0.5, this);
                        this.cubeMap.push(dropCube);
                        this.scene.add(dropCube.cube);
                    }
                }
            }
        };

        this.getCubeAtMapPosition = function (mapPosition) {
            var cubeAtPos = this.cubeMap.find(dropCube => dropCube.mapPosition.x === mapPosition.x && dropCube.mapPosition.y === mapPosition.y && dropCube.mapPosition.z === mapPosition.z);
            return cubeAtPos;
        };

        this.compare = function (a, b) {
            if (a.flow > b.flow) {
                return -1;
            }
            if (a.flow < b.flow) {
                return 1;
            }
            return 0;
        }
    }

    update() {
        this.cubeMap.sort(this.compare);
        this.cubeMap.forEach(cube => {
            cube.update();
        });
    }

    setCenterCube(cube) {
        this.centerCube = cube;
        var color = 0xff0000;
        //this.centerCube.cube.material.color = color;
    }





}
export {
    CubeMapGenerator,
    DropCube,
}

