import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {CubeMapGenerator} from './CubeGeneration/CubeGenerator'

'use strict';

var container,
    camera,
    scene,
    renderer,
    controls,
    cubeMapGenerator,
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
    levels = 14;
    cubeMapGenerator = new CubeMapGenerator(scene);
    cubeMapGenerator.generateCubeMap(levels);
    controls.target = new THREE.Vector3(levels/2,levels/2,levels/2);
    var centerCubeIndex = Math.floor(cubeMapGenerator.cubeMap.length * Math.random());
    console.log("total cubes = "+cubeMapGenerator.cubeMap.length+" selected index :" +centerCubeIndex);
    var centerCube = cubeMapGenerator.cubeMap[centerCubeIndex]; //cubeMapGenerator.getCubeAtMapPosition(new THREE.Vector3(centerCubeIndex,centerCubeIndex,centerCubeIndex));
    cubeMapGenerator.setCenterCube (centerCube);
    centerCube.setContent(5000);
    window.cubeMapGen = cubeMapGenerator;
}

function render() {
    renderer.render(scene, camera);
    cubeMapGenerator.update();
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



