import * as THREE from 'three';

export class TestObject{
    constructor(scene){
        this.scene = scene;
        this.cube = null;
        this.grid = null;
    }
    
    createAll(){
        this._createCube();
        this._createGrid();
        this._createAxesHelper();
    }
    
    _createCube(){
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        console.log(geometry);
        const material = new THREE.MeshStandardMaterial({color: 0xffffff});
        console.log(material);
        this.cube = new THREE.Mesh(geometry, material);
        console.log(this.cube);
        this.cube.position.x = 5;
        this.scene.add(this.cube);
        
        return this.cube;
    }
    
    _createGrid(){
        const size = 10;
        const divisions = 10;
        const gridHelper = new THREE.GridHelper( size, divisions );
        console.log(gridHelper);
        this.scene.add( gridHelper );
    }
    
    _createAxesHelper(){
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
    }
}