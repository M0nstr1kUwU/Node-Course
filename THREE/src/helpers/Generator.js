import * as THREE from 'three';
import {SCENE_CONFIG} from "../config/scene.js";

export class Generator {
    constructor(scene) {
        this.scene = scene;
        this.stars = null;
    }
    
    generateAll() {
        this._generateStars();
        this._createSkyBody();
    }
    
    /*_generateStars(){
        const count = SCENE_CONFIG.stars.counts;

        const positions = [];

        for ( let i = 0; i < count; i ++ ) {

            positions.push( 2000 * Math.random() - 1000, 2000 * Math.random() - 1000, 2000 * Math.random() - 1000 );

        }

        const positionAttribute = new THREE.InstancedBufferAttribute( new Float32Array( positions ), 3 );

        const map = new THREE.TextureLoader().load( '../../textures/snowflake1.png' );
        map.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.SpriteNodeMaterial( { sizeAttenuation: true, map, alphaMap: map, alphaTest: 0.1 } );
        material.color.setHSL( 1.0, 0.3, 0.7, THREE.SRGBColorSpace );
        material.positionNode = instancedBufferAttribute( positionAttribute );
        material.rotationNode = time.add( instanceIndex ).sin();
        material.scaleNode = uniform( 15 );
        

        const particles = new THREE.Sprite( material );
        particles.count = count;

        this.scene.add( particles );
    }*/

    _generateStars(){
        const counts = SCENE_CONFIG.stars.counts;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(counts * 3);

        for (let i = 0; i < counts; i++) {
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
        const material = new THREE.PointsMaterial( { size: 55, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );
        material.color.setHSL( 1.0, 0.3, 0.7, THREE.SRGBColorSpace );

        const particles = new THREE.Points( geometry, material );
        this.scene.add( particles );
    }

}