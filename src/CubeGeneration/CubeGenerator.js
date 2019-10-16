import { Vector3 } from 'three';
import { BoxGeometry } from 'three';
import { MeshBasicMaterial } from 'three';
import { Mesh } from 'three';

const width = 1;
const height = 1;
const depth = 1;

class DropCube {

    constructor(color, mapPosition, flow) {

        this.createCube = function (width, height, depth, position, color) {
            var geometry = new BoxGeometry(width, height, depth);
            var material = new MeshBasicMaterial({ color: color, transparent: true });
            var cube = new Mesh(geometry, material);
            cube.position.set(position.x, position.y, position.z);
            return cube;
        }

        this.setWater = function (value) {
            this.water = value;
            this.cube.material.opacity = value;
        }

        var position = new Vector3(mapPosition.x, mapPosition.y, mapPosition.z);
        this.actualTick = 0;
        this.cube = this.createCube(width, height, depth, position, color)
        this.mapPosition = mapPosition;
        this.setWater(0);
        this.flow = flow;
    }


}

class CubeMapGenerator {

    constructor(scene) {
        this.tickIndex = 0;
        this.cubeMap = [];
        this.scene = scene;

        this.generateCubeMap = function (levels) {
            this.levels = levels;
            for (let indexX = 0; indexX < levels; indexX++) {
                for (let indexY = 0; indexY < levels; indexY++) {
                    for (let indexZ = 0; indexZ < levels; indexZ++) {
                        var color = 0x00ffff;
                        let dropCube = new DropCube(color, new Vector3(indexX, indexY, indexZ), Math.random() * 0.5);
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

        this.updateCube = function (cube) {
            var neighbors = this.getNeighborgs(cube);
            //console.log(neighbors);
            neighbors.forEach(neighbor => {
                if (this.tickIndex === neighbor.actualTick) {
                    return;
                }
                neighbor.actualTick++;
                var currentWater = cube.water - neighbor.flow;
                if (currentWater > 0.2) {
                    neighbor.setWater(neighbor.water + neighbor.flow);
                    cube.setWater(currentWater);
                    this.updateCube(neighbor);
                }

               
            });
        }
        this.centerCube = null;
    }

    update() {
        this.tickIndex++;
        this.updateCube(this.centerCube);
    }


    setCenterCube(cube) {
        this.centerCube = cube;
        var color = 0xff0000;
        //this.centerCube.cube.material.color = color;
    }


    getNeighborgs(cube) {
        var neighbors = [];
        var rightCubePosition = new Vector3(cube.mapPosition.x + 1, cube.mapPosition.y, cube.mapPosition.z);
        var rightCube = this.getCubeAtMapPosition(rightCubePosition);
        if (rightCube) {
            neighbors.push(rightCube);
        }
        var leftCubePosition = new Vector3(cube.mapPosition.x - 1, cube.mapPosition.y, cube.mapPosition.z);
        var leftCube = this.getCubeAtMapPosition(leftCubePosition);
        if (leftCube) {
            neighbors.push(leftCube);
        }

        var topCubePosition = new Vector3(cube.mapPosition.x, cube.mapPosition.y + 1, cube.mapPosition.z);
        var topCube = this.getCubeAtMapPosition(topCubePosition);
        if (topCube) {
            neighbors.push(topCube);
        }

        var bottomCubePosition = new Vector3(cube.mapPosition.x, cube.mapPosition.y - 1, cube.mapPosition.z);
        var bottomCube = this.getCubeAtMapPosition(bottomCubePosition);
        if (bottomCube) {
            neighbors.push(bottomCube);
        }

        var frontCubePosition = new Vector3(cube.mapPosition.x, cube.mapPosition.y, cube.mapPosition.z + 1);
        var frontCube = this.getCubeAtMapPosition(frontCubePosition);
        if (frontCube) {
            neighbors.push(frontCube);
        }

        var rearCubePosition = new Vector3(cube.mapPosition.x, cube.mapPosition.y, cube.mapPosition.z - 1);
        var rearCube = this.getCubeAtMapPosition(rearCubePosition);
        if (rearCube) {
            neighbors.push(rearCube);
        }

        return neighbors;
    }

}
export {
    CubeMapGenerator,
    DropCube,
}

