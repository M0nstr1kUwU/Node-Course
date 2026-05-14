import * as THREE from 'three';
import {SCENE_CONFIG} from "../config/scene.js";

export class SceneManager {
    constructor() {
        this.scene = null;
    }
    
    create() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(SCENE_CONFIG.background);
        this.scene.fog = new THREE.FogExp2( SCENE_CONFIG.fog.color, SCENE_CONFIG.fog.density );
        
        return this.scene;
    }
    
    update(stars) {
        if (stars && stars.material) {
            stars.material.opacity = 0.7 + Math.sin(5 * 0.3) * 0.1;
        }
    }
    
    getScene() {
        return this.scene;
    }
}