import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import DropCube from './CubeGeneration/CubeGenerator'

'use strict';

var container,
    camera,
    scene,
    renderer,
    controls,
    cubeLevels,
    cubeMap;

main();

function main() {

    initScene();
}

function initScene() {
    // dom
    container = document.createElement('div');
    window.addEventListener('resize', onWindowResize, false);
    container.addEventListener('mousedown', mouseDown);
    document.body.appendChild(container);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();
    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(10, 10, 15);

    controls = new OrbitControls(camera, renderer.domElement);
    //controls.update() must be called after any manual changes to the camera's transform
    controls.update();
    var dropCube = new DropCube(0x00ff00, new THREE.Vector2(0, 0));
    scene.add(dropCube.cube);
    var cubeLevelZero = [dropCube];
    cubeLevels = [];
    cubeMap = [dropCube];
    cubeLevels.push(cubeLevelZero);
    window.dropCube = dropCube;
    window.scene = scene;
    generateCubeLevels(10);
    Window.cubeMap = cubeMap;
}

function generateCubeLevels(levels) {
    for (let index = 0; index < levels; index++) {
        generateCubesForLevel(index);
    }
}

function generateCubesForLevel(level) {
    var cubes = cubeLevels[level];
    var newLevelCubes = [];
    cubes.forEach(cube => {
        var newCubes = addNeighbours(cube);
        newCubes.forEach(cube => {
            newLevelCubes.push(cube);
        });
        newCubes.forEach(dropCube => {
            scene.add(dropCube.cube);
        });
    });
    cubeLevels.push(newLevelCubes);
}

function addNeighbours(dropCube) {
    var cubes = [];
    var leftCubePosition = new THREE.Vector2(dropCube.mapPosition.x - 1, dropCube.mapPosition.y);
    var leftCube = getCubeAtMapPosition(leftCubePosition);
    if (!leftCube) {
        let newNeighbour = new DropCube(0x00ffff, leftCubePosition);
        cubes.push(newNeighbour);
        cubeMap.push(newNeighbour);
        console.log("cube pos: " + newNeighbour.mapPosition.x + " " + newNeighbour.mapPosition.y);
    }

    var rightCubePosition = new THREE.Vector2(dropCube.mapPosition.x + 1, dropCube.mapPosition.y);
    var rightCube = getCubeAtMapPosition(rightCubePosition);
    if (!rightCube) {
        let newNeighbour = new DropCube(0x00ffff, rightCubePosition);
        cubes.push(newNeighbour);
        cubeMap.push(newNeighbour);
        console.log("cube pos: " + newNeighbour.mapPosition.x + " " + newNeighbour.mapPosition.y);

    }

    var frontCubePosition = new THREE.Vector2(dropCube.mapPosition.x, dropCube.mapPosition.y + 1);
    var frontCube = getCubeAtMapPosition(frontCubePosition);
    if (!frontCube) {
        let newNeighbour = new DropCube(0x00ffff, frontCubePosition);
        cubes.push(newNeighbour);
        cubeMap.push(newNeighbour);
        console.log("cube pos: " + newNeighbour.mapPosition.x + " " + newNeighbour.mapPosition.y);

    }


    var rearCubePosition = new THREE.Vector2(dropCube.mapPosition.x, dropCube.mapPosition.y - 1);
    var rearCube = getCubeAtMapPosition(rearCubePosition);
    if (!rearCube) {
        let newNeighbour = new DropCube(0x00ffff, rearCubePosition);
        cubes.push(newNeighbour);
        cubeMap.push(newNeighbour);
        console.log("cube pos: " + newNeighbour.mapPosition.x + " " + newNeighbour.mapPosition.y);

    }

    return cubes;
}

function getCubeAtMapPosition(mapPosition) {
    var cubeAtPos = cubeMap.find(dropCube => dropCube.mapPosition.x === mapPosition.x &&  dropCube.mapPosition.y === mapPosition.y) ;
    if(cubeAtPos){
        console.log("There is a cube at "+mapPosition.x +" " +mapPosition.y);
    }
    return cubeAtPos;
}

function render() {
    renderer.render(scene, camera);
}

// animate            
(function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();

}());

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function mouseDown(e) {
    var mousePos = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);

}


