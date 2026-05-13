import * as THREE from 'three';
import {LIGHTS_CONFIG} from "../config/light.js";

export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
    }
    
    createAll(){
        this._creatAmbientLight();
        this._createMainLight();
    }
    
    _createMainLight(){
        const config = LIGHTS_CONFIG.main;
        const light = new THREE.DirectionalLight(config.color, config.intensity);
        this.scene.add(light);
        this.lights.main = light;
    }
    
    _creatAmbientLight(){
        const config = LIGHTS_CONFIG.ambient;
        const light = new THREE.AmbientLight(config.color, config.intensity);
        this.scene.add(light);
        this.lights.ambient = light;
        
    }
    
    getLight(name){
        return this.lights[name];
    }
}