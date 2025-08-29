import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';
import { CONFIG } from './config.js';

export class Player {
  constructor(){
    const geo = new THREE.SphereGeometry(1, 24, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffc300, emissive:0x331900, roughness:0.4 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(0,1,0);
    this.velocity = new THREE.Vector3();
  }
  addTo(scene){ scene.add(this.mesh); }
  update(dt, dir){
    const speed = CONFIG.PLAYER_SPEED;
    this.velocity.set(dir.x*speed, 0, -dir.y*speed); // forward = -Z
    this.mesh.position.addScaledVector(this.velocity, dt);
  }
  clamp(field){
    const half = field/2 - 1; // margin
    this.mesh.position.x = Math.min(half, Math.max(-half, this.mesh.position.x));
    this.mesh.position.z = Math.min(half, Math.max(-half, this.mesh.position.z));
  }
  distanceTo(obj){ return this.mesh.position.distanceTo(obj.position); }
}
