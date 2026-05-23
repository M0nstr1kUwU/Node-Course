import * as THREE from "three";
import { MaterialManager } from '../core/MaterialManager.js';

export class PartsShip {
  constructor() {
      this.ship = null;
      this.materialManager = new MaterialManager();
      this.spawn_position = 0;
  }

  addCabin(group, key) {
    this.ship = group;
    const geometry = new THREE.SphereGeometry(1, 32,32)/*(1.8,5,5,8,1,false,0.29,3,);*/
    const material = this.materialManager.createMaterial(key);
    material.side = 2;
    console.log(material);
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.x = this.spawn_position;
    this.spawn_position += 3;
    this.ship.add(cylinder);
  }
}
