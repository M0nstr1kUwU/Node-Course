//================================
// менеджер управления камерой
//================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import {CAMERA_CONFIG} from '../config/camera.js';

export class CameraManager{
    constructor(rendererDomElement){
        this.camera = null;
        this.controls = null;
        this.rendererDomElement = rendererDomElement;
    }
    
    create(ship){
        this.camera = new THREE.PerspectiveCamera(
            CAMERA_CONFIG.fov,
            window.innerWidth / window.innerHeight,
            CAMERA_CONFIG.near,
            CAMERA_CONFIG.far
        );
        this.camera.position.set(
            CAMERA_CONFIG.position.x,
            CAMERA_CONFIG.position.y,
            CAMERA_CONFIG.position.z,
        )
        this.camera.lookAt(
            ship.position.x,
            ship.position.y,
            ship.position.z
        )
        return this.camera
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    
    createOrbitControls(ship) {
        const { enablePan,autoRotate, dampingFactor, enableDamping,rotateSpeed , enableZoom, zoomSpeed} = CAMERA_CONFIG.controls;
        this.controls = new OrbitControls(this.camera, this.rendererDomElement);

        this.controls.enableDamping = enableDamping;
        this.controls.enablePan = enablePan;
        this.controls.autoRotate = autoRotate;
        this.controls.dampingFactor = dampingFactor;
        this.controls.rotateSpeed = rotateSpeed;
        this.controls.enableZoom = enableZoom;
        this.controls.zoomSpeed = zoomSpeed;
        
        this.controls.target.set(
            ship.position.x,
            ship.position.y,
            ship.position.z
        );
        
        return this.controls;
    }

    createFlyControls(){
        this.controls = new FlyControls( this.camera, this.rendererDomElement );

		this.controls.movementSpeed = 20;
	    this.controls.rollSpeed = 0.2;
		this.controls.autoForward = true;
		this.controls.dragToLook = true;
    }
    
    update(delta, ship){
        this.controls.update(delta);

        if(ship){
            this.camera.lookAt(ship.position.x,ship.position.y,ship.position.z);
        }
    }
    
    getCamera(){
        return this.camera
    }
    
    getControls(){
        return this.controls;
    }
}