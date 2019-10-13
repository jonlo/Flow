import * as THREE from 'three';
import { Vector2 } from 'three';

const width =1 ;
const height=1;
const depth=1;

export default class DropCube {
    constructor( color, mapPosition) {
        var position = new THREE.Vector3(mapPosition.x ,mapPosition.y ,0);
        this.cube = createCube(width, height, depth, position, color)
        this.mapPosition = mapPosition;
    }

}

function createCube(width, height, depth, position, color) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial({ color: color });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    return cube;
}
