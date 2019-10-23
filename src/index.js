import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CubeMap } from './CubeGeneration/CubeMap'

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
    levels = 15;
    cubeMap = new CubeMap(scene);
    cubeMap.generateCubeMap(levels,0.5,1);
    controls.target = new THREE.Vector3(levels / 2, levels / 2, levels / 2);
    cubeMap.createCubeMapHelper(levels);
    var startCubeIndex = Math.floor(cubeMap.cubes.length * Math.random());
    console.log("total cubes = " + cubeMap.cubes.length + " selected index :" + startCubeIndex);
    var startCube = cubeMap.cubes[startCubeIndex]; //cubeMapGenerator.getCubeAtMapPosition(new THREE.Vector3(centerCubeIndex,centerCubeIndex,centerCubeIndex));
    cubeMap.setStartCube(startCubeIndex);
    startCube.setContent(5000);
    window.cubeMap = cubeMap;
    fitCameraToSelection(camera,controls,cubeMap.box);
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

function fitCameraToSelection( camera, controls, box, fitOffset = 2) {
  
    const size = box.getSize( new THREE.Vector3() );
    const center = box.getCenter( new THREE.Vector3() );
    const maxSize = Math.max( size.x, size.y, size.z );
    const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );
    
    const direction = controls.target.clone()
      .sub( camera.position )
      .normalize()
      .multiplyScalar( distance );
  
    controls.maxDistance = distance * 10;
    controls.target.copy( center );
    
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
  
    camera.position.copy( controls.target ).sub(direction);
    
    controls.update();
    
  }
