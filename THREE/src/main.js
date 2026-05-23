//================================
// главный файл - точка запуска
//================================
import * as THREE from 'three';
import {SceneManager} from './core/SceneManager.js';
import {CameraManager} from './core/CameraManager.js';
import {LightManager} from './core/LightManager.js';
import {TestObject} from './helpers/test.js';  // скрипт для разработки и тестирования
import {SkyGenerator} from './helpers/SkyGenerator.js';
import {ModelLoader} from './core/ModelLoader.js';
import {ShipGenerator} from './helpers/ShipGenerator.js';
import {PaneConstructor} from './helpers/PaneConstructor.js'

class Game{
    constructor(){
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.modelLoader = null;
        this.renderer = null;
        
        this.test = null;
        this.skyGenerator = null;
        this.shipGenerator = null;
        
        this.model = null;
        this.pane = null;
        
        this.init();
    }
    
    init(){
        this.sceneManager = new SceneManager();
        const scene = this.sceneManager.create();
        
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(this.renderer.domElement);
        
        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.cameraManager.create();
        this.cameraManager.createControls();
        
        this.lightManager = new LightManager(scene);
        this.lightManager.createAll();
        
        this.test = new TestObject(scene);
        this.test.createAll();
        this.model = this.test.group;
        
        this.skyGenerator = new SkyGenerator(scene);
        this.skyGenerator.generateAll();
        
        //this.modelLoader = new ModelLoader(scene);
        //this.modelLoader.load();
        
        this.shipGenerator = new ShipGenerator(scene);
        //this.shipGenerator.createShip();

        this.pane = new PaneConstructor();
        this.pane.createAll(this.model);

        window.addEventListener( 'resize', () => this.onWindowResize());
        
        this.animate();
    }

    onWindowResize() {
        this.cameraManager.onWindowResize();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
    
    animate = ()=> {
        requestAnimationFrame(this.animate);

        //this.test.cube.rotation.x += 0.01;
        //this.test.cube.rotation.y += 0.01;
        this.cameraManager.update();
        this.sceneManager.update(this.skyGenerator.stars);
        
        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera()
        );
    }
}

export const game = new Game();