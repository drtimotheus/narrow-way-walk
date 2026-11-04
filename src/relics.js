// ============================================================================
// THE NARROW WAY — ZONE 1: RELIC WORKSHOP & 3D GLB TURNTABLE INSPECTOR
// ============================================================================
// Loads assets/models/relics-manifest.json and .glb
// models using GLTFLoader + MeshoptDecoder (with procedural fallback), builds
// world relic pedestals, and powers the interactive 3D Relic Workshop modal.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

let manifestCache = null;
const glbCache = new Map();
const gltfLoader = new GLTFLoader();
try {
  gltfLoader.setMeshoptDecoder(MeshoptDecoder);
} catch {
  // Meshopt optional if uncompressed GLB
}

export async function loadRelicsManifest() {
  if (manifestCache) return manifestCache;
  try {
    const res = await fetch('./assets/models/relics-manifest.json');
    manifestCache = await res.json();
    return manifestCache;
  } catch {
    manifestCache = { totalBytes: 42708, models: [] };
    return manifestCache;
  }
}

export function buildProceduralFallbackMesh(relicId) {
  const group = new THREE.Group();
  if (relicId === 'aquamarine-tuning-stone') {
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0x5cc8ff,
      emissive: 0x16537e,
      emissiveIntensity: 0.45,
      roughness: 0.14,
      metalness: 0.1,
      transmission: 0.65,
      transparent: true,
      opacity: 0.92
    });
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 1), gemMat);
    gem.scale.set(0.85, 1.3, 0.55);
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.06, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 })
    );
    band.rotation.x = Math.PI / 2;
    group.add(gem, band);
  } else if (relicId === 'davids-cypress-kinnor') {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x7c4d25, roughness: 0.65 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.35, 0.25), woodMat);
    base.position.y = -0.45;
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.15, 10), woodMat);
    armL.position.set(-0.42, 0.1, 0);
    armL.rotation.z = 0.14;
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.15, 10), woodMat);
    armR.position.set(0.42, 0.1, 0);
    armR.rotation.z = -0.14;
    const yoke = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.05, 10), woodMat);
    yoke.position.set(0, 0.62, 0);
    yoke.rotation.z = Math.PI / 2;
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.13, 0),
      new THREE.MeshStandardMaterial({ color: 0x5cc8ff, emissive: 0x2277aa })
    );
    gem.position.set(0, -0.45, 0.15);
    group.add(base, armL, armR, yoke, gem);
  } else {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 0.68, 0.26),
      new THREE.MeshStandardMaterial({ color: 0x2b2d38, roughness: 0.5, metalness: 0.4 })
    );
    const tape = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.12, 0.28),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.7 })
    );
    tape.rotation.z = 0.18;
    group.add(body, tape);
  }
  return group;
}

export async function loadRelicModel(relicId, fileUrl) {
  if (glbCache.has(relicId)) {
    return glbCache.get(relicId).clone(true);
  }
  return new Promise((resolve) => {
    gltfLoader.load(
      fileUrl || `./assets/models/${relicId}.glb`,
      (gltf) => {
        const root = gltf.scene || gltf.scenes[0];
        root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (relicId === 'aquamarine-tuning-stone' && child.material) {
              child.material.emissive = new THREE.Color(0x1b6ca8);
              child.material.emissiveIntensity = 0.28;
            }
          }
        });
        glbCache.set(relicId, root);
        resolve(root.clone(true));
      },
      undefined,
      () => {
        const fallback = buildProceduralFallbackMesh(relicId);
        glbCache.set(relicId, fallback);
        resolve(fallback.clone(true));
      }
    );
  });
}

export function createWorldRelicPedestal(relicId = 'aquamarine-tuning-stone') {
  const group = new THREE.Group();
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1a2639,
    roughness: 0.4,
    metalness: 0.35
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x5cc8ff,
    emissive: 0x1b6ca8,
    emissiveIntensity: 0.55,
    roughness: 0.25
  });
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.82, 1.05, 16), baseMat);
  plinth.position.y = 0.525;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.045, 12, 32), trimMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 1.06;
  group.add(plinth, ring);

  const holder = new THREE.Group();
  holder.position.y = 1.65;
  group.add(holder);
  group.userData.spinTarget = holder;

  loadRelicModel(relicId).then((model) => {
    model.scale.setScalar(0.55);
    holder.add(model);
  });
  return group;
}

export class RelicTurntableInspector {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    this.camera.position.set(0, 0.55, 3.1);
    this.camera.lookAt(0, 0, 0);
    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);
    this.isDragging = false;
    this.prevX = 0;
    this.prevY = 0;
    this.autoRotate = true;
    this.active = false;
    this._setupLights();
    this._bindEvents();
  }

  _setupLights() {
    this.scene.add(new THREE.AmbientLight(0xdbeafe, 1.3));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 5, 4);
    const rim = new THREE.PointLight(0x5cc8ff, 2.8, 12);
    rim.position.set(-3, 2, -3);
    const gold = new THREE.PointLight(0xfbbf24, 1.6, 10);
    gold.position.set(2, -2, 2);
    this.scene.add(key, rim, gold);
  }

  _bindEvents() {
    if (!this.canvas) return;
    this.canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
    });
    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevX;
      const dy = e.clientY - this.prevY;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
      this.pivot.rotation.y += dx * 0.012;
      this.pivot.rotation.x = Math.max(-0.8, Math.min(0.8, this.pivot.rotation.x + dy * 0.01));
    });
    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.position.z = Math.max(1.8, Math.min(4.8, this.camera.position.z + e.deltaY * 0.002));
    }, { passive: false });
  }

  async showRelic(relicId, fileUrl) {
    if (!this.canvas) return;
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }
    const w = this.canvas.clientWidth || 340;
    const h = this.canvas.clientHeight || 260;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    while (this.pivot.children.length > 0) {
      this.pivot.remove(this.pivot.children[0]);
    }
    this.pivot.rotation.set(0.18, 0.35, 0);
    this.autoRotate = true;
    const model = await loadRelicModel(relicId, fileUrl);
    model.scale.setScalar(1.05);
    this.pivot.add(model);
    if (!this.active) {
      this.active = true;
      this._tick();
    }
  }

  stop() {
    this.active = false;
  }

  _tick() {
    if (!this.active || !this.renderer) return;
    requestAnimationFrame(() => this._tick());
    if (this.autoRotate) {
      this.pivot.rotation.y += 0.011;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
