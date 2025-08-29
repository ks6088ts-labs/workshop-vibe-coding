import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0a1724');
  // Fog for edge guidance
  scene.fog = new THREE.Fog('#0a1724', 40, 70);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 200);
  camera.position.set(0, 25, 25);
  camera.lookAt(0,0,0);

  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias:true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(15,30,10);
  scene.add(dir);

  // Ground
  const grid = new THREE.GridHelper(50, 50, 0x1b4965, 0x1b4965);
  grid.material.opacity = 0.3; grid.material.transparent = true;
  scene.add(grid);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer };
}
