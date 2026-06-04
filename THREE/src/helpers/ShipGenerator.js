import * as THREE from 'three';
import {PartsShip} from './PartsShip.js';

export class ShipGenerator{
    constructor(scene){
        this.scene = scene;
        this.partsShip = new PartsShip();
        this.ship = null;
    }
    
    createShip(){
        this.ship = new THREE.Group();    // 1 пустая группа корабля
        this.partsShip.addCabin(this.ship);        // 2 добавляем кабину
        
        this.scene.add( this.ship );       // добавляем корабль на сцену
    }
}