import { createScene } from './scene.js';
import { InputController } from './input.js';
import { Player } from './player.js';
import { CollectibleManager } from './collectibles.js';
import { GameState, GamePhase } from './gameState.js';
import { UIController } from './ui.js';
import { CONFIG } from './config.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

const { scene, camera, renderer } = createScene();
const input = new InputController();
const player = new Player(); player.addTo(scene);
const collectibles = new CollectibleManager(scene);
const state = new GameState();
const ui = new UIController(state);

// Initial orbs for title demo (optional) - we keep minimal
collectibles.spawnInitial(5);

// --- Camera orbit control (mouse drag) ---
let isDragging = false;
let lastX = 0;
let yaw = 0; // radians; 0 means camera looking from +Z toward -Z
const ORBIT_RADIUS = 25; // horizontal distance
const ORBIT_HEIGHT = 25; // Y height
const canvas = document.getElementById('game-canvas');
canvas.style.cursor = 'grab';
const onPointerDown = (e)=>{ isDragging = true; lastX = e.clientX; canvas.style.cursor = 'grabbing'; };
const onPointerMove = (e)=>{ if(!isDragging) return; const dx = e.clientX - lastX; lastX = e.clientX; yaw -= dx * 0.005; };
const onPointerUp = ()=>{ isDragging = false; canvas.style.cursor = 'grab'; };
canvas.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);

let last = performance.now();
function loop(now){
  const dt = Math.min(0.033, (now - last)/1000); // clamp dt
  last = now;

  state.update(dt);

  if(state.phase === GamePhase.PLAYING){
    const dir = input.getDirection();
    player.update(dt, dir);
    player.clamp(CONFIG.FIELD_SIZE);

    // Orbs spawn scaling
    const targetOrbs = state.currentMaxOrbs();
    collectibles.ensureCount(targetOrbs);

    const collected = collectibles.tryCollect(player);
    if(collected){ state.addScore(collected); }
  }

  collectibles.update(dt, state.elapsed);

  // Minor camera follow (simple smoothing)
  if(state.phase === GamePhase.PLAYING){
    // Desired orbit position based on yaw
    const target = player.mesh.position;
    const desired = new THREE.Vector3(
      target.x + Math.sin(yaw) * ORBIT_RADIUS,
      ORBIT_HEIGHT,
      target.z + Math.cos(yaw) * ORBIT_RADIUS
    );
    camera.position.lerp(desired, 0.08);
    camera.lookAt(target.x, target.y, target.z);
  }

  ui.update(collectibles.getActiveCount());
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Expose for debug
window.__game = { scene, camera, player, collectibles, state };

// TODO: Audio hooks [P3]
// TODO: Gamepad input extension [P3]
