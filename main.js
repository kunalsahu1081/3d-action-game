import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js'
import {GUI} from 'three/addons/libs/lil-gui.module.min.js'
import { Terrain } from './terrain';

const gui = new GUI();
const stats = new Stats()
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new OrbitControls( camera, renderer.domElement );

const terrain = new Terrain(10, 10);
scene.add(terrain);

const sun = new THREE.DirectionalLight();
sun.position.set(1, 2, 3);
scene.add(sun);

const ambient = new THREE.AmbientLight();
ambient.intensity = 1;
scene.add(ambient);

camera.position.set(10, 2, 10);
controls.update();

function animate() {

	controls.update();

	renderer.render( scene, camera );

    stats.update();

}

window.addEventListener('resize' , () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})


const folder = gui.addFolder('Terrain');

folder.add(terrain, 'width', 1, 20, 1).name('Width');

folder.add(terrain, 'height', 1, 20, 1).name('Height');

folder.addColor(terrain.material, 'color');

folder.onChange(() => {
    terrain.createGeometry();
})