import * as THREE from 'three';
import {SceneManager} from './core/SceneManager.js';
import {CameraManager} from './core/CameraManager.js';
import {LightManager} from './core/LightManager.js';
import {TestObject} from './helpers/test.js';
import {Generator} from './helpers/Generator.js';

class Game{
    constructor(){
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.renderer = null;
        
        this.test = null;
        this.generator = null;
        
        
        
        this.init();
    }
    
    init(){
        this.sceneManager = new SceneManager();
        const scene = this.sceneManager.create();
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
        
        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.cameraManager.create();
        this.cameraManager.createControls();
        
        this.lightManager = new LightManager(scene);
        this.lightManager.createAll();
        
        this.test = new TestObject(scene);
        this.test.createAll();
        
        this.generator = new Generator(scene);
        this.generator.generateAll();

        window.addEventListener( 'resize', () => this.onWindowResize());
        
        this.animate();
    }

    onWindowResize() {
        this.cameraManager.onWindowResize();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
    
    animate = ()=> {
        requestAnimationFrame(this.animate);

        this.test.cube.rotation.x += 0.01;
        this.test.cube.rotation.y += 0.01;
        this.cameraManager.update();
        this.sceneManager.update(this.generator.stars);
        
        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera()
        );
    }
}

const game = new Game();