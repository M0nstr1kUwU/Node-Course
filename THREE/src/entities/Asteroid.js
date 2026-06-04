import * as THREE from 'three';

export class Asteroid{
    constructor(materialManager){
        this.materialManager = materialManager;
        this.material = materialManager.createMaterial('rock');
        this.geometry = new THREE.SphereGeometry(1, 16, 16);

        this.spawn();
    }

    spawn(){
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = (Math.random() - 0.5) * 50,
        this.mesh.position.y = (Math.random() - 0.5) * 2,
        this.mesh.position.z = (Math.random() - 0.5) * 50
        return this.mesh;
    }


}