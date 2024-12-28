import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js'
import {GUI} from 'three/addons/libs/lil-gui.module.min.js'
import { World } from './world';

const gui = new GUI();
const stats = new Stats()
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,1 , 1010);
const controls = new OrbitControls( camera, renderer.domElement );

const world = new World(18, 18);
scene.add(world);

const sun = new THREE.DirectionalLight();
sun.position.set(10, 10, 10);
scene.add(sun);

const ambient = new THREE.AmbientLight();
ambient.intensity = 2;
scene.add(ambient);

camera.position.set(20, 0, 0);
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


const worldFolder = gui.addFolder('world');

worldFolder.add(world, 'terrain_width', 1, 20, 1).name('Width');

worldFolder.add(world, 'terrain_height', 1, 20, 1).name('Height');

worldFolder.addColor(world.terrain.material, 'color');


document.addEventListener('keydown', (ev) => {

    if (ev.key == 'ArrowUp') {
        world.moveCharacter(0, 1);
    } else if (ev.key == 'ArrowDown') {
        world.moveCharacter(0, -1);
    } else if (ev.key == 'ArrowLeft') {
        world.moveCharacter(1, 0);
    } else if (ev.key == 'ArrowRight') {
        world.moveCharacter(-1, 0);
    }

    if (ev.key == 'l') {
        world.turnCharacter('l');
    }
    if (ev.key == 'r') {
        world.turnCharacter('r');
    }
    if (ev.key == 'u') {
        world.turnCharacter('u');
    }
    if (ev.key == 'd') {
        world.turnCharacter('d');
    }

    // world.moveCharacter()
})

worldFolder.onChange(() => {
    world.createTerrian();
    world.generateBorders();
})