import * as THREE from 'three';
import { TechnicolorShader } from 'three/examples/jsm/Addons.js';


export class World extends THREE.Mesh {

    constructor(width, height) {

        super();

        this.terrain_width = width;
        this.terrain_height = height;
        this.treeCount = 10;
        this.rockCount = 10;
        this.bushCount = 10;

        this.character_x_position = -1 * this.terrain_width / 2 + 1.5;
        this.character_y_position = this.terrain_width / 2 - 1.5;


        this.createTerrian();

        this.generateBorders();

        this.generateCharacters();


    }

    createTerrian() {

        if (this.terrain) {
            this.terrain.material.dispose();
            this.terrain.geometry.dispose();
            this.remove(this.terrain);
        }


        const framebox = new THREE.BoxGeometry(1, 1);



        const terrainGeometry = new THREE.PlaneGeometry(this.terrain_width, this.terrain_height, this.terrain_width, this.terrain_height);
        const terrainMaterial = new THREE.MeshStandardMaterial({color: 'green', wireframe: true});
        this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        // this.terrain.rotation.x = Math.PI;
        this.terrain.rotation.y = Math.PI / 2;
        this.terrain.position.set(0, 0 , 0);
        this.add(this.terrain);


    }

    createTrees() {

        const treeRadius = 0.2;
        const treeHeight = 1;

        const treeGeometry  = new THREE.ConeGeometry(treeRadius, treeHeight, 8);
        const treeMaterial = new THREE.MeshStandardMaterial({
            color: '#5ef547',
            flatShading: true,
    
        });

        this.trees = new THREE.Group();

        this.add(this.trees);

        for (let i = 0; i < this.treeCount; i++) {

            const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
    
            treeMesh.position.set(0 ,0 , 0 );

            this.trees.add(treeMesh);

        }

    }

    createRocks() {

        const minRockRadius = 0.1;
        const maxRockRadius = 0.3;

        const minRockHeight = 0.5;
        const maxRockHeight = 0.8;

        
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: '#c4d1c1',
            flatShading: true,
    
        });

        this.rocks = new THREE.Group();

        this.add(this.rocks);

        for (let i = 0; i < this.rockCount; i++) {


            const radius = minRockRadius + (Math.random() * (maxRockRadius - minRockRadius));
            const rockGeometry  = new THREE.SphereGeometry(radius);
            const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);
    
            rockMesh.scale.y = minRockHeight + (Math.random() * (maxRockHeight - minRockHeight));

            this.rocks.add(rockMesh);

        }

    }

    createBush() {

        const minBushRadius = 0.1;
        const maxBushRadius = 0.3;

        const maxBushHeight = 1.5;
        const minBushHeight = 0.3;

        
        const bushMaterial = new THREE.MeshStandardMaterial({
            color: '#20461b',
            flatShading: true,
    
        });

        this.bush = new THREE.Group();

        this.add(this.bush);

        for (let i = 0; i < this.bushCount; i++) {


            const radius = minBushRadius + (Math.random() * (maxBushRadius - minBushRadius));
            const bushGeometry  = new THREE.SphereGeometry(radius);
            const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);
    
            // bushMesh.position.set(Math.floor(Math.random() * (this.terrain_width )) + 0.5 , 0 , Math.floor(Math.random() * (this.terrain_height )) + 0.5 );

            bushMesh.scale.y = minBushHeight + (Math.random() * (maxBushHeight - minBushHeight));

            this.bush.add(bushMesh);

        }

    }

    generateBorders() {

        if (this.boundary) {
            
            const child_list = [];

            this.boundary.children.forEach((child) => {
                child.material.dispose();
                child.geometry.dispose();
                child_list.push(child);
            });

            child_list.forEach((child) => {
                this.boundary.remove(child);
            })
            
        } else {
            this.boundary = new THREE.Group();
            this.add(this.boundary);
        }

        const box = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial( {color: '#af5050'} ); 

        this.generateSmallPolyHedrons(this.terrain_width / 2 + 0.4, this.terrain_height / 2, false);
        
        for(let i=0; i < this.terrain_width; i++) {

            if (i == 1 || i == this.terrain_width - 2) {
                continue;
            }


            const cube = new THREE.Mesh( box, material );

            const x_pos = this.terrain_width / 2  - i - 0.5;

            cube.position.set(0, this.terrain_height / 2 - 0.5, x_pos);

            this.boundary.add(cube);
            
            this.generateSmallPolyHedrons(x_pos, this.terrain_height / 2, true);
            

        }

        this.generateSmallPolyHedrons(this.terrain_width / 2 + 0.4, -this.terrain_height / 2 + 1, false);

        for(let i=0; i < this.terrain_width; i++) {

            if (i == 1 || i == this.terrain_width - 2) {
                continue;
            }

            const cube = new THREE.Mesh( box, material );

            const x_pos = this.terrain_width / 2  - i - 0.5;

            cube.position.set(0, -this.terrain_height / 2 + 0.5, x_pos);

            this.boundary.add(cube);
            
            this.generateSmallPolyHedrons(x_pos, -this.terrain_height / 2 + 1, true);
            

        }


        for(let i=0; i < this.terrain_width; i++) {


            const cube = new THREE.Mesh( box, material );

            const x_pos = this.terrain_width / 2  - i - 0.5;

            cube.position.set(0, x_pos, this.terrain_height / 2 - 0.5);

            this.boundary.add(cube);
        
            
            if (i < this.terrain_height - 3) {
                this.generateSmallPolyHedrons2(this.terrain_height / 2 - 0.5, x_pos - 0.45, true);
            }

            if (i == this.terrain_height - 3) {
                this.generateSmallPolyHedrons2(this.terrain_height / 2 - 0.5, x_pos - 0.45, false);
            }

        }

        for(let i=0; i < this.terrain_width; i++) {


            const cube = new THREE.Mesh( box, material );

            const x_pos = this.terrain_width / 2  - i - 0.5;

            cube.position.set(0, x_pos, -this.terrain_height / 2 + 0.5);

            this.boundary.add(cube);
        
            
            if (i < this.terrain_height - 3) {
                this.generateSmallPolyHedrons2(-this.terrain_height / 2 + 0.5, x_pos - 0.45, true);
            }

            if (i == this.terrain_height - 3) {
                this.generateSmallPolyHedrons2(-this.terrain_height / 2 + 0.5, x_pos - 0.45, false);
            }
            

        }

    }

    generateSmallPolyHedrons(x, y, show) {

        const color = '#873b3b';

        const verticesOfCube = [
            -1,-1,-1,        -1, 1,-1,
            -1,-1, 1,        -1, 1, 1,
            0, 0, 0,
        ];
        
        const indicesOfFaces = [
            0, 3, 2, 0, 1, 3,
            0, 1, 4, 0, 2, 4, 0, 3, 4,
            1, 2, 4, 1, 3, 4
        ];

        // const desGroup = new THREE.Group();
        
        const geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 0.1, 0 );

        const material = new THREE.MeshStandardMaterial( {color: '#671e41'} ); 

        for(let i = -9; i < 0; i++) {

            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(0.55, y + i * (0.1) - 0.05, x - 0.45);

            this.boundary.add(mesh);
        }

        if (show) {

            for(let i = -4; i < 6; i++) {

                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.set(0.55, y - 0.05, x + i * (0.1) -0.05);

                this.boundary.add(mesh);
            }

            for(let i = -4; i < 6; i++) {

                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.set(0.55, y - 0.95, x + i * (0.1) - 0.05);

                this.boundary.add(mesh);
            }

        }

    }

    generateSmallPolyHedrons2(x, y, show) {

        const color = '#873b3b';

        const verticesOfCube = [
            -1,-1,-1,        -1, 1,-1,
            -1,-1, 1,        -1, 1, 1,
            0, 0, 0,
        ];
        
        const indicesOfFaces = [
            0, 3, 2, 0, 1, 3,
            0, 1, 4, 0, 2, 4, 0, 3, 4,
            1, 2, 4, 1, 3, 4
        ];

        // const desGroup = new THREE.Group();
        
        const geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 0.1, 0 );

        const material = new THREE.MeshStandardMaterial( {color: '#671e41'} ); 


        for(let i = -8; i < 1; i++) {

            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(0.55, y + i * (0.1) - 0.05, x + 0.45);

            this.boundary.add(mesh);
        }

        for(let i = -8; i < 1; i++) {

            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(0.55, y + i * (0.1) - 0.05, x - 0.45);

            this.boundary.add(mesh);
        }


        for(let i = -4; i < 6; i++) {

            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(0.55, y - 0.95, x + i * (0.1) - 0.05);

            this.boundary.add(mesh);
        }

    }


    generateCharacters() {


        const character_color = '#60bfd7';

        const verticesOfCube = [
            -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
            -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
        ];
        
        const indicesOfFaces = [
            0, 3, 1, 3, 7, 1, 7, 5, 1, 5, 7, 4, 5, 0, 1, 4, 0, 5 
               
        ];

        this.character = new THREE.Group();

        this.add(this.character);

        const geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 0.8, 0 );

        const material = new THREE.MeshStandardMaterial( {color: character_color, } ); 

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set( 0, -1 * this.terrain_width / 2 + 1.5, this.terrain_width / 2 - 1.5 );

        this.character.add(mesh);

        const tgeometry = new THREE.TorusGeometry( 0.2, 0.04, 16, 100 ); 
        const tmaterial = new THREE.MeshBasicMaterial( { color: '#c82d80' } ); 
        const torus = new THREE.Mesh( tgeometry, tmaterial );

        torus.position.set(0, -1 * this.terrain_width / 2 + 1.5, this.terrain_width / 2 - 1.5 );
        torus.rotateY(Math.PI / 2);
        torus.rotateX(3 * Math.PI / 4);

        this.character.add(torus);


    }

    moveCharacter(y, x) {


        const chracter = this.character;

        const speed = 1

        if (this.character_x_position + x < (this.terrain_width / 2 - 1) && this.character_x_position + x > -1 * (this.terrain_width / 2 - 1)) {
            this.character.translateY(x);
            this.character_x_position += x;
        }


        if (this.character_y_position + y < (this.terrain_width / 2 - 1) && this.character_y_position + y > -1 * (this.terrain_width / 2 - 1)) {
            this.character.translateZ(y);
            this.character_y_position += y;
        }

    }


}