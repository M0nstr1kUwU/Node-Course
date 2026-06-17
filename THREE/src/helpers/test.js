import * as THREE from 'three';
import { PartsShip } from './PartsShip.js';

export class TestObject{
    constructor(scene){
        this.scene = scene;
        this.grid = null;
        this.group = null;
        this.partsShip = new PartsShip();
    }
    
    createAll(){
        //this._createFigure();
        this._createGrid();
        //this._createAxesHelper();
    }
    
    _createFigure(){
        this.group = new THREE.Group();
        this.partsShip.addCabin(this.group, 'rock');
        this.partsShip.addCabin(this.group, 'armor');
        this.partsShip.addCabin(this.group, 'lunar');
        this.scene.add(this.group);
    }
    
    _createGrid(){
        const gridHelper = new THREE.GridHelper( 20, 20,'cyan', 'cyan');
        this.scene.add( gridHelper );
    }
    
    _createAxesHelper(){
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
    }
}