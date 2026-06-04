import * as THREE from 'three';
import {Asteroid} from '../entities/Asteroid.js'
import {MaterialManager} from '../core/MaterialManager.js'

export class AsteroidManager{
    constructor(scene, ship){
        this.materialManager = new MaterialManager();
        this.scene = scene;
        this.asteroids = [];
        this.ship = ship;
        this.spawn_count = 10;
    }

    createAsteroid(){
        const asteroid = new Asteroid(this.materialManager);
        this.scene.add(asteroid.mesh);
        this.asteroids.push(asteroid);
    }

    spawnAsteroids(){
        for(let i = 0; i < this.spawn_count; i++){
            this.createAsteroid();
        }
    }

    updateAsteroids(){
        for(let i = 0; i < this.asteroids.length; i++){
            if(this.ship.position.distanceTo(this.asteroids[i].mesh.position) < 5){
                this.scene.remove(this.asteroids[i].mesh);
                this.asteroids.splice(i);
            }
        }
    }


}