import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {CubeMap} from './CubeGeneration/CubeMap'

'use strict';

var container,
    camera,
    scene,
    renderer,
    controls,
    cubeMap,
    levels;

main();

function main() {

    initScene();
}

function initScene() {
    // dom
    container = document.createElement('div');
    window.addEventListener('resize', onWindowResize, false);
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
    levels = 20;
    cubeMap = new CubeMap(scene);
    cubeMap.generateCubeMap(levels);
    controls.target = new THREE.Vector3(levels/2,levels/2,levels/2);
    var centerCubeIndex = Math.floor(cubeMap.cubes.length * Math.random());
    console.log("total cubes = "+cubeMap.cubes.length+" selected index :" +centerCubeIndex);
    var centerCube = cubeMap.cubes[centerCubeIndex]; //cubeMapGenerator.getCubeAtMapPosition(new THREE.Vector3(centerCubeIndex,centerCubeIndex,centerCubeIndex));
    cubeMap.setCenterCube (centerCube);
    centerCube.setContent(5000);
    window.cubeMap = cubeMap;
}

function render() {
    renderer.render(scene, camera);
    cubeMap.update();
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



