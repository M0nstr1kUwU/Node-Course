//================================
// главный файл - точка запуска
//================================
import * as THREE from 'three';
import {SceneManager} from './core/SceneManager.js';
import {CameraManager} from './core/CameraManager.js';
import {LightManager} from './core/LightManager.js';
import {SkyGenerator} from './helpers/SkyGenerator.js';
import {ModelLoader} from './core/ModelLoader.js';
import {AsteroidManager} from './core/AsteroidManager.js';

class Game{
    constructor(){
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.modelLoader = null;
        this.renderer = null;
        
        this.skyGenerator = null;
        this.asteroidManager = null;

        this.ship = null;

        this.clock = null;
        
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
        this.cameraManager.createOrbitControls();
        
        this.lightManager = new LightManager(scene);
        this.lightManager.createAll();

        this.modelLoader = new ModelLoader(scene);
        this.modelLoader.load(1, 'ships');

        setTimeout(() => {
            this.ship = this.modelLoader.getModel();
            this.asteroidManager = new AsteroidManager(scene, this.ship);
            this.asteroidManager.spawnAsteroids();
        }, 1000)
        
        this.skyGenerator = new SkyGenerator(scene);
        this.skyGenerator.generateAll();


        this.clock = new THREE.Clock();

        window.addEventListener( 'resize', () => this.onWindowResize());

        window.addEventListener( 'keydown', (event) => {
            if(event.key === 'a'){
                this.ship.position.z += 0.1;
                this.ship.position.x += 0.1;
                this.ship.rotation.z += 0.01;
            }
            if(event.key === 'd'){
                this.ship.position.z -= 0.1;
                this.ship.position.x += 0.1;
                this.ship.rotation.z -= 0.01;
            }
            if(event.key === 'w'){
                this.ship.position.y += 0.1;
                this.ship.position.x += 0.1;
                this.ship.rotation.y += 0.01;
            }
            if(event.key === 's'){
                this.ship.position.y -= 0.1;
                this.ship.position.x += 0.1;
                this.ship.rotation.y -= 0.01;
            }
        });
        
        this.animate();
    }

    onWindowResize() {
        this.cameraManager.onWindowResize();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
    
    animate = ()=> {
        requestAnimationFrame(this.animate);

        const delta = this.clock.getDelta();

        this.cameraManager.update(delta, this.ship);
        this.sceneManager.update(this.skyGenerator.stars);

        const camera = this.cameraManager.camera;

        if(this.ship){
            this.ship.position.x += 0.01;

            this.asteroidManager.updateAsteroids();
        }
        
        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera()
        );
    }
}

export const game = new Game();