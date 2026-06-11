import * as THREE from 'three';
import { TEXTURES_CONFIG } from '../config/texture.js';

export class TextureLoader {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
    }

    load(index, key) {
        let ship_map = TEXTURES_CONFIG.url[key][index];
        const texture = this.textureLoader.load(ship_map)
        return texture;
    }
}