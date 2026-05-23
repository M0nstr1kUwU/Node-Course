import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelLoader{
    constructor(scene){
        this.scene = scene;
        this.model = null;
        this.modelLoader = new GLTFLoader();
    }
    
    async load(){
        this.model = await this.modelLoader.loadAsync( '../../models/freighter.glb' );
        this.scene.add( this.model.scene );
        this.model.scene.position.y = 4;
    }
}