import * as THREE from 'three';
import {SCENE_CONFIG} from "../config/scene.js";

export class SkyGenerator {
    constructor(scene) {
        this.scene = scene;
        this.stars = null;
    }
    
    generateAll() {
        this._generateStars();
        this._createSkyBody();
    }

    _generateStars(){
        const counts = SCENE_CONFIG.stars.counts;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(counts * 3);

        for (let i = 0; i < counts; i++) {
            // Случайные координаты в кубе
            positions[i * 3] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2000 * 0.6;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2000 * 0.5 - 50;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: SCENE_CONFIG.stars.color,
            size: SCENE_CONFIG.stars.size,
            transparent: true,
            opacity: 0.8
        });

        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
    }

    _createSkyBody(){
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        const sprite = new THREE.TextureLoader().load( '../../textures/disc.png' );
        sprite.colorSpace = THREE.SRGBColorSpace;

        for ( let i = 0; i < 100; i ++ ) {

            const x = 2000 * Math.random() - 10;
            const y = 2000 * Math.random() - 10;
            const z = 2000 * Math.random() - 10;

            vertices.push( x, y, z );

        }

        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        const material = new THREE.PointsMaterial( { size: 35, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );
        material.color.setHSL( 0.1, 0.1, 0.7, THREE.SRGBColorSpace );

        const particles = new THREE.Points( geometry, material );
        this.scene.add( particles );
    }

}