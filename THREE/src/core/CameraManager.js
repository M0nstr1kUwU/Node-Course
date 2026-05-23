//================================
// менеджер управления камерой
//================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {CAMERA_CONFIG} from '../config/camera.js';

export class CameraManager{
    constructor(rendererDomElement){
        this.camera = null;
        this.controls = null;
        this.rendererDomElement = rendererDomElement;
    }
    
    create(){
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
            CAMERA_CONFIG.target.x,
            CAMERA_CONFIG.target.y,
            CAMERA_CONFIG.target.z,
        )
        return this.camera
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    
    createControls() {
        const { 
            enablePan,
            autoRotate, 
            dampingFactor, 
            enableDamping,
            rotateSpeed , 
            enableZoom, 
            zoomSpeed} = CAMERA_CONFIG.controls;
        this.controls = new OrbitControls(this.camera, this.rendererDomElement);

        this.controls.enableDamping = enableDamping;
        this.controls.enablePan = enablePan;
        this.controls.autoRotate = autoRotate;
        this.controls.dampingFactor = dampingFactor;
        this.controls.rotateSpeed = rotateSpeed;
        this.controls.enableZoom = enableZoom;
        this.controls.zoomSpeed = zoomSpeed;
        
        this.controls.target.set(0, 0, 0);
        
        return this.controls;
    }
    
    update(){
        this.controls.update();
    }
    
    getCamera(){
        return this.camera
    }
    
    getControls(){
        return this.controls;
    }
}