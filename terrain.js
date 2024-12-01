import * as THREE from 'three';


export class Terrain extends THREE.Mesh {

    constructor(width, height) {

        super();

        this.terrain_width = width;
        this.terrain_height = height;
        this.treeCount = 10;


        this.createTerrian();
        
   
        this.rotation.x = -1 * Math.PI / 2;

        this.createTrees();
    }

    createTerrian() {

        this.geometry?.dispose();

        const terrainMaterial = new THREE.MeshStandardMaterial({color: '#43a30f'});

        const terrainGeometry = new THREE.PlaneGeometry(this.terrain_width, this.terrain_height);

        const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);

        terrainMesh.rotate
        

        // this.position.set(this.width / 2, 0, this.height / 2);

    }

    createTrees() {

        const treeRadius = 0.2;
        const treeHeight = 1;

        for (let i = 0; i < this.treeCount; i++) {

            console.log('hereadsf asdf')

            const treeGeometry  = new THREE.ConeGeometry(treeRadius, treeHeight, 8);
            const treeMaterial = new THREE.MeshStandardMaterial({
                color: '#0c3706',
                flatShading: true,
            });

            const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
            treeMesh.rotation.x = Math.PI / 2;

            treeMesh.position.z = treeHeight / 2;

            this.add(treeMesh);
        }

    }


}