import { Vector3 } from 'three';
import { BoxGeometry } from 'three';
import { MeshBasicMaterial } from 'three';
import { Mesh } from 'three';

const width = 1;
const height = 1;
const depth = 1;

class DropCube {
    constructor(color, mapPosition, water, flow) {

        this.createCube = function (width, height, depth, position, color) {
            var geometry = new BoxGeometry(width, height, depth);
            var material = new MeshBasicMaterial({ color: color });
            var cube = new Mesh(geometry, material);
            cube.position.set(position.x, position.y, position.z);
            return cube;
        }

        var position = new Vector3(mapPosition.x, mapPosition.y, mapPosition.z);
        this.cube = this.createCube(width, height, depth, position, color)
        this.mapPosition = mapPosition;
        this.water = water;
        this.flow = flow;
    }

}

class CubeMapGenerator {
    constructor(scene) {
        this.cubeMap = [];
        this.scene = scene;

        this.generateCubeMap = function (levels) {
            for (let indexX = 0; indexX < levels; indexX++) {
                for (let indexY = 0; indexY < levels; indexY++) {
                    for (let indexZ = 0; indexZ < levels; indexZ++) {
                        let dropCube = new DropCube(Math.random() * 0xffffff, new Vector3(indexX, indexY, indexZ));
                        this.cubeMap.push(dropCube);
                        this.scene.add(dropCube.cube);
                    }
                }
            }
        };

        this.getCubeAtMapPosition = function (mapPosition) {
            var cubeAtPos = cubeMap.find(dropCube => dropCube.mapPosition.x === mapPosition.x && dropCube.mapPosition.y === mapPosition.y && dropCube.mapPosition.z === mapPosition.z);
            return cubeAtPos;
        };
    }
}
export {
    CubeMapGenerator,
    DropCube,
}

