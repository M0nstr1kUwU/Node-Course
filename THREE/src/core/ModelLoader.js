import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {MODEL_CONFIG} from '../config/model.js'

export class ModelLoader{
    constructor(scene){
        this.scene = scene;
        this.model = null;
        this.modelLoader = new GLTFLoader();
    }
    
    async load(url_index, key){
        const url_config = MODEL_CONFIG[key][url_index]
        this.model = await this.modelLoader.loadAsync( url_config );
        this.scene.add( this.model.scene );
        this.model.scene.position.y = 1;
    }

    getModel(){
        return this.model.scenes[0].children[0];
    }
}