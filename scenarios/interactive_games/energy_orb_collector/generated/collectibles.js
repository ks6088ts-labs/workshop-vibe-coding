import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';
import { CONFIG } from './config.js';

const ORB_COLORS = [0xff9e00,0xffd166,0xffc300,0xffb347];

export class CollectibleManager {
  constructor(scene){
    this.scene = scene;
    this.orbs = [];
    this.tmpVec = new THREE.Vector3();
  }
  currentMax(count, elapsed){
    // Managed externally via spawner schedule; kept for potential logic.
  }
  spawnInitial(n){
    for(let i=0;i<n;i++) this._spawnOne();
  }
  getActiveCount(){ return this.orbs.length; }
  _randomPos(){
    const size = CONFIG.FIELD_SIZE/2 - CONFIG.FIELD_MARGIN;
    return new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(size*2),
      CONFIG.ORB_RADIUS + 0.2,
      THREE.MathUtils.randFloatSpread(size*2)
    );
  }
  _spawnOne(){
    const geo = new THREE.SphereGeometry(CONFIG.ORB_RADIUS, 16, 12);
    const color = ORB_COLORS[Math.floor(Math.random()*ORB_COLORS.length)];
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity:0.4 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(this._randomPos());
    mesh.userData.isOrb = true;
    this.scene.add(mesh);
    this.orbs.push(mesh);
  }
  ensureCount(target){
    while(this.orbs.length < target) this._spawnOne();
    // If needing to reduce (not for MVP) we could remove extras.
  }
  tryCollect(player){
    let collected = 0;
    for(let i=this.orbs.length-1;i>=0;i--){
      const orb = this.orbs[i];
      if(player.distanceTo(orb) <= CONFIG.PICKUP_DISTANCE){
        // simple collect
        this.scene.remove(orb);
        this.orbs.splice(i,1);
        collected += 1;
        // Respawn a single orb
        this._spawnOne();
      }
    }
    return collected;
  }
  update(dt, elapsed){
    // simple pulse animation (optional minimal)
    const pulse = 0.2*Math.sin(elapsed*2)+1;
    for(const orb of this.orbs){ orb.scale.setScalar(pulse); }
  }
}
