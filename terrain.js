import * as THREE from 'three';
import { TechnicolorShader } from 'three/examples/jsm/Addons.js';


export class Terrain extends THREE.Mesh {

    constructor(width, height) {

        super();

        this.terrain_width = width;
        this.terrain_height = height;
        this.treeCount = 10;


        this.createTerrian();
        
   
        // this.rotation.x = -1 * Math.PI / 2;

        this.createTrees();
    }

    createTerrian() {

        const terrainGeometry = new THREE.PlaneGeometry(this.terrain_width, this.terrain_height);

        const terrainMaterial = new THREE.MeshStandardMaterial({color: '#43a30f'});


        if (this.terrain) {

            console.log(this.terrain_width, this.terrain_height)

            this.terrain.geometry.dispose();
            this.terrain.material.dispose();

            // this.terrain = null;

            this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);


            return;
        }

        


        this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);

        // this.terrain.rotation.x = -1 * Math.PI / 2;

        this.add(this.terrain);
        

        // this.position.set(this.width / 2, 0, this.height / 2);

    }

    createTrees() {

        const treeRadius = 0.2;
        const treeHeight = 1;

        const treeGeometry  = new THREE.ConeGeometry(treeRadius, treeHeight, 8);
        const treeMaterial = new THREE.MeshStandardMaterial({
            color: '#e91e63',
            flatShading: true,
        });

        const trees = new THREE.Group();

        for (let i = 0; i < this.treeCount; i++) {

            const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
    
            treeMesh.rotation.x = Math.PI / 2;

            treeMesh.position.set(Math.random() * (this.terrain_width / 2) ,Math.random() * (this.terrain_height / 2) , treeHeight / 2 );

            this.add(treeMesh);

        }


    }


}