// ============================================================================
// THE NARROW WAY — ZONE 1: 3D STAGE BUILDER, ELIAS COMPANION & INTERACTABLES
// ============================================================================
// Builds the 6 canonical 3D stages of Elias's Seoul and the Sea of Glass,
// renders Elias Cho as a 3D companion walking beside the Fellow-Traveler
// (never a skin the player wears), and places interactive nodes with clean
// proximity-only short name tags.

import * as THREE from 'three';
import {
  createPainterlyTexture,
  createSkyDome,
  createSeaOfGlassMaterial,
  loadStageArtTexture,
  PORTRAIT_ART_MAP
} from './painterly.js';
import { createWorldRelicPedestal } from './relics.js';

function makeCompactNameTag(text, accentHex = '#5cc8ff') {
  const clean = String(text || '').trim();
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 68;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(8, 14, 26, 0.88)';
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(10, 8, 236, 52, 26);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 23px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(clean, 128, 35);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    depthTest: true
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.65, 0.44, 1);
  return sprite;
}

export function getShortNodeLabel(node, isLocked = false) {
  if (!node) return '';
  if (node.type === 'well') {
    const num = (node.wellId || '').replace('well_', '') || '1';
    return `Well ${num}`;
  }
  if (node.type === 'stand') {
    const num = (node.standId || '').replace('stand_', '') || '1';
    return `Stand ${num}`;
  }
  if (node.type === 'treasure') {
    const num = (node.treasureId || '').replace('treasure_', '') || '1';
    return `Treasure ${num}`;
  }
  if (node.type === 'wisdom') {
    const num = (node.wisdomId || '').replace('wisdom_', '') || '1';
    return `Wisdom ${num}`;
  }
  if (node.type === 'relic') {
    if (node.relicId === 'aquamarine-tuning-stone') return 'Token';
    if (node.relicId === 'davids-cypress-kinnor') return 'Relic 2';
    return 'Relic 3';
  }
  if (node.type === 'portal') {
    const next = (node.targetStageIdx ?? 1) + 1;
    return isLocked ? `🔒 Stage ${next}` : `Stage ${next} →`;
  }
  if (node.type === 'gatehouse_finale') {
    return isLocked ? '🔒 Treasure Gate' : 'Treasure Gate';
  }
  return 'Inspect';
}

export function createCharacterFigure({
  coatHex = 0x26354d,
  scarfHex = 0x5cc8ff,
  skinHex = 0xe8c5a5,
  hairHex = 0x111827,
  hasGuitarCase = false,
  hasHarp = false,
  portraitKey = null,
  label = 'Elias',
  shortTag = null,
  alwaysShowTag = false
}) {
  const group = new THREE.Group();
  const coatMat = new THREE.MeshStandardMaterial({ color: coatHex, roughness: 0.55 });
  const scarfMat = new THREE.MeshStandardMaterial({
    color: scarfHex,
    emissive: scarfHex,
    emissiveIntensity: 0.28,
    roughness: 0.4
  });
  const skinMat = new THREE.MeshStandardMaterial({ color: skinHex, roughness: 0.55 });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairHex, roughness: 0.75 });

  const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.75, 8), hairMat);
  legs.position.y = 0.38;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.82, 10), coatMat);
  torso.position.y = 1.1;
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.055, 6, 16), scarfMat);
  scarf.rotation.x = Math.PI / 2;
  scarf.position.y = 1.48;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 10), skinMat);
  head.position.y = 1.72;
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.58), hairMat);
  hair.position.y = 1.75;
  group.add(legs, torso, scarf, head, hair);

  if (hasGuitarCase) {
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x4a2c18, roughness: 0.55 });
    const gCase = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.88, 0.16), caseMat);
    gCase.position.set(0.06, 1.18, -0.26);
    gCase.rotation.z = -0.18;
    group.add(gCase);
  }
  if (hasHarp) {
    const harpMat = new THREE.MeshStandardMaterial({ color: 0xb07c3a, roughness: 0.4 });
    const harp = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 6, 14, Math.PI * 1.45), harpMat);
    harp.position.set(0.32, 1.18, 0.16);
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.06, 0),
      new THREE.MeshStandardMaterial({ color: 0x5cc8ff, emissive: 0x38bdf8, emissiveIntensity: 0.6 })
    );
    gem.position.set(0.32, 1.0, 0.22);
    group.add(harp, gem);
  }
  if (portraitKey && PORTRAIT_ART_MAP[portraitKey] && portraitKey !== 'elias') {
    const pTex = loadStageArtTexture(0, label, PORTRAIT_ART_MAP[portraitKey]);
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(0.36, 20),
      new THREE.MeshBasicMaterial({ map: pTex, side: THREE.DoubleSide })
    );
    disc.position.set(0, 2.75, 0);
    const rim = new THREE.Mesh(
      new THREE.RingGeometry(0.36, 0.4, 20),
      new THREE.MeshBasicMaterial({ color: scarfHex, side: THREE.DoubleSide })
    );
    rim.position.set(0, 2.75, 0.01);
    group.add(disc, rim);
  }

  const displayTag = shortTag || (label ? label.split(' ')[0] : '');
  if (displayTag) {
    const sprite = makeCompactNameTag(displayTag, '#7dd3fc');
    sprite.position.set(0, 2.22, 0);
    sprite.visible = Boolean(alwaysShowTag);
    group.add(sprite);
    group.userData.nameTag = sprite;
  }
  return group;
}

const NODE_STYLES = {
  well: { color: 0x38bdf8, hex: '#38bdf8' },
  stand: { color: 0xf97316, hex: '#fb923c' },
  treasure: { color: 0xfacc15, hex: '#facc15' },
  wisdom: { color: 0xa7f3d0, hex: '#6ee7b7' },
  relic: { color: 0x60a5fa, hex: '#93c5fd' },
  portal: { color: 0xc084fc, hex: '#d8b4fe' },
  gatehouse_finale: { color: 0xfbbf24, hex: '#fde047' }
};

export function createNodeMonument(node, isCompleted = false, isLocked = false) {
  const style = NODE_STYLES[node.type] || NODE_STYLES.wisdom;
  const group = new THREE.Group();
  group.position.set(node.pos[0], node.pos[1] || 0, node.pos[2]);
  group.userData.node = node;

  const ringColor = isCompleted ? 0x34d399 : isLocked ? 0x64748b : style.color;
  const ringMat = new THREE.MeshBasicMaterial({
    color: ringColor,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.78
  });
  const baseRing = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.32, 24), ringMat);
  baseRing.rotation.x = -Math.PI / 2;
  baseRing.position.y = 0.04;
  group.add(baseRing);
  group.userData.haloRing = baseRing;

  if (node.type === 'relic') {
    const ped = createWorldRelicPedestal(node.relicId || node.refId);
    group.add(ped);
    group.userData.floatingMesh = ped.userData.spinTarget;
  } else if (node.type === 'well') {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.85,
      roughness: 0.15
    });
    const curb = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, 0.72, 16), stoneMat);
    curb.position.y = 0.36;
    const pool = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.66, 16), waterMat);
    pool.position.y = 0.39;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), waterMat);
    gem.position.y = 1.35;
    group.add(curb, pool, gem);
    group.userData.floatingMesh = gem;
  } else if (node.type === 'stand') {
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x3b232a, roughness: 0.45 });
    const coreMat = new THREE.MeshStandardMaterial({
      color: isCompleted ? 0x34d399 : 0xf97316,
      emissive: isCompleted ? 0x059669 : 0xea580c,
      emissiveIntensity: 0.85,
      roughness: 0.22
    });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.85, 0.7, 8), pillarMat);
    base.position.y = 0.35;
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), coreMat);
    crystal.position.y = 1.45;
    group.add(base, crystal);
    group.userData.floatingMesh = crystal;
  } else if (node.type === 'treasure') {
    const pedMat = new THREE.MeshStandardMaterial({ color: 0x3f3a36, roughness: 0.55 });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xd97706,
      emissiveIntensity: 0.78,
      roughness: 0.22,
      metalness: 0.6
    });
    const ped = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.85), pedMat);
    ped.position.y = 0.425;
    const crown = new THREE.Mesh(new THREE.TorusKnotGeometry(0.28, 0.08, 32, 8), goldMat);
    crown.position.y = 1.42;
    group.add(ped, crown);
    group.userData.floatingMesh = crown;
  } else {
    const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45 });
    const scrollMat = new THREE.MeshStandardMaterial({
      color: isLocked ? 0x64748b : style.color,
      emissive: isLocked ? 0x334155 : style.color,
      emissiveIntensity: isLocked ? 0.25 : 0.48,
      roughness: 0.25
    });
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.45, 1.0, 10), standMat);
    pillar.position.y = 0.5;
    const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.82, 0.12), scrollMat);
    tablet.position.y = 1.45;
    tablet.rotation.x = -0.22;
    group.add(pillar, tablet);
    group.userData.floatingMesh = tablet;
  }

  const shortText = getShortNodeLabel(node, isLocked);
  const label = makeCompactNameTag(
    isCompleted ? `✓ ${shortText}` : shortText,
    isCompleted ? '#34d399' : isLocked ? '#94a3b8' : style.hex
  );
  label.position.set(0, 2.35, 0);
  label.visible = false; // Shown only when within interact range, one at a time (nearest wins)
  group.add(label);
  group.userData.labelSprite = label;
  return group;
}

function addWarmStreetLamps(envGroup, ecoMode = false) {
  const poleGeo = new THREE.CylinderGeometry(0.07, 0.09, 3.6, 8);
  const lanternGeo = new THREE.SphereGeometry(0.22, 8, 8);
  const haloGeo = new THREE.SphereGeometry(0.55, 8, 8);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.4 });
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe4a0 });
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffcf70,
    transparent: true,
    opacity: 0.22,
    depthWrite: false
  });
  const positions = [
    [-4.8, -4],
    [4.8, -11],
    [-4.8, -18],
    [4.8, -24]
  ];
  positions.forEach(([x, z]) => {
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(x, 1.8, z);
    const lantern = new THREE.Mesh(lanternGeo, bulbMat);
    lantern.position.set(x, 3.68, z);
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(x, 3.68, z);
    envGroup.add(pole, lantern, halo);
  });
  // Use a single central warm fill PointLight instead of 4 per-lamp PointLights to keep per-fragment lighting fast
  if (!ecoMode) {
    const centralWarmLight = new THREE.PointLight(0xffcf70, 2.0, 28, 1.2);
    centralWarmLight.position.set(0, 4.5, -14);
    envGroup.add(centralWarmLight);
  }
}

function populateStageScenery(stageId, envGroup, ecoMode = false) {
  const wallMat = new THREE.MeshStandardMaterial({
    map: createPainterlyTexture('#263349', '#384b6b', '#172030', 48),
    roughness: 0.72
  });
  const warmMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.85
  });
  const neonBlueMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.95
  });
  const neonCoralMat = new THREE.MeshStandardMaterial({
    color: 0xfb7185,
    emissive: 0xe11d48,
    emissiveIntensity: 0.85
  });

  addWarmStreetLamps(envGroup, ecoMode);

  if (stageId === 'seoul_corridor' || stageId === 'alley_to_glass') {
    for (let i = -3; i <= 3; i++) {
      const bL = new THREE.Mesh(new THREE.BoxGeometry(4.5, 9 + Math.abs(i) * 1.5, 4.5), wallMat);
      bL.position.set(-8.8, 4.5, i * 6.2);
      const bR = new THREE.Mesh(new THREE.BoxGeometry(4.5, 8.5 + (i % 2) * 2, 4.5), wallMat);
      bR.position.set(8.8, 4.2, i * 6.2);
      const signMat = i % 3 === 0 ? neonCoralMat : i % 2 === 0 ? neonBlueMat : warmMat;
      const sign = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 2.3), signMat);
      sign.position.set(i % 2 === 0 ? -6.4 : 6.4, 3.8, i * 6.2);
      envGroup.add(bL, bR, sign);
    }
    if (stageId === 'alley_to_glass') {
      const david = createCharacterFigure({
        coatHex: 0x0284c7,
        scarfHex: 0x7dd3fc,
        hasHarp: true,
        portraitKey: 'david',
        label: 'David the King',
        shortTag: 'David',
        alwaysShowTag: false
      });
      david.position.set(3.2, 0, -15.8);
      david.rotation.y = -0.5;
      envGroup.add(david);
    }
  } else if (stageId === 'mapo_hannam') {
    for (let i = -2; i <= 2; i++) {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(5.2, 12, 4.8), wallMat);
      tower.position.set(i * 6.5, 6, -15.5);
      const glassWindow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 8.5), i % 2 === 0 ? neonBlueMat : warmMat);
      glassWindow.position.set(i * 6.5, 6, -13.05);
      envGroup.add(tower, glassWindow);
    }
  } else if (stageId === 'columbarium_autumn') {
    const stoneWall = new THREE.Mesh(new THREE.BoxGeometry(18, 5.5, 1.2), wallMat);
    stoneWall.position.set(0, 2.75, -14.5);
    envGroup.add(stoneWall);
    for (let r = 0; r < 3; r++) {
      for (let c = -3; c <= 3; c++) {
        const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 0.08), warmMat);
        plaque.position.set(c * 1.6, 1.4 + r * 1.1, -13.85);
        envGroup.add(plaque);
      }
    }
  } else if (stageId === 'basement_kitchen') {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 0.55), wallMat);
      chair.position.set(-4.5 + Math.cos(angle) * 2.4, 0.38, 1.5 + Math.sin(angle) * 2.4);
      chair.lookAt(-4.5, 0.38, 1.5);
      envGroup.add(chair);
    }
    const counter = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.05, 1.1), wallMat);
    counter.position.set(4.5, 0.52, -3.5);
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.11, 0.42, 10),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.2, transparent: true, opacity: 0.88 })
    );
    bottle.position.set(4.5, 1.26, -3.5);
    envGroup.add(counter, bottle);
  } else if (stageId === 'sea_of_glass_climax') {
    const witnesses = [
      { name: 'David the King', shortTag: 'David', x: -5.2, z: -3.5, coat: 0x0284c7, harp: true, portrait: 'david' },
      { name: 'Daniel the Prophet', shortTag: 'Daniel', x: 5.2, z: -3.5, coat: 0x15803d, harp: false, portrait: 'daniel' },
      { name: 'Paul the Apostle', shortTag: 'Paul', x: -6.4, z: -9.5, coat: 0x1d4ed8, harp: false, portrait: 'paul' },
      { name: 'Queen Esther', shortTag: 'Esther', x: 6.4, z: -9.5, coat: 0xb91c1c, harp: false, portrait: 'esther' },
      { name: 'Adaeze & Matthias & Talia', shortTag: 'Adaeze', x: -3.8, z: 3.5, coat: 0x4f46e5, harp: false, portrait: 'adaeze' }
    ];
    for (const w of witnesses) {
      const fig = createCharacterFigure({
        coatHex: w.coat,
        scarfHex: 0xfde047,
        hasHarp: w.harp,
        portraitKey: w.portrait,
        label: w.name,
        shortTag: w.shortTag,
        alwaysShowTag: false
      });
      fig.position.set(w.x, 0, w.z);
      fig.lookAt(0, 0, -4);
      envGroup.add(fig);
    }
  }
}

export class WorldStageManager {
  constructor(scene) {
    this.scene = scene;
    this.stageGroup = new THREE.Group();
    this.scene.add(this.stageGroup);
    this.nodeGroups = [];
    this.seaMaterial = null;
    this.particles = null;
    this.skyDome = null;
    this.hemiLight = null;
    this.ambLight = null;
    this.dirLight = null;
    this.rimDirLight = null;
    this.eliasCompanion = createCharacterFigure({
      coatHex: 0x283852,
      scarfHex: 0x38bdf8,
      hasGuitarCase: true,
      portraitKey: 'elias',
      label: 'Elias Cho',
      shortTag: 'Elias',
      alwaysShowTag: true
    });
    this.scene.add(this.eliasCompanion);
  }

  buildStage(stage, isNodeDoneFn, ecoMode = false, isNodeLockedFn = null) {
    while (this.stageGroup.children.length > 0) {
      this.stageGroup.remove(this.stageGroup.children[0]);
    }
    this.nodeGroups = [];
    const pal = stage.palette || {};
    this.scene.fog = new THREE.FogExp2(pal.fog || '#162238', 0.0115);

    const sky = createSkyDome(
      pal.skyTop || '#121e36',
      pal.skyHorizon || '#2e4b73'
    );
    this.skyDome = sky;
    this.stageGroup.add(sky);

    const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x3b2f26, 1.55);
    const amb = new THREE.AmbientLight(0xfffbeb, 0.9);
    const dir = new THREE.DirectionalLight(0xffe8b3, 2.25);
    dir.position.set(10, 22, 12);
    const rimDir = new THREE.DirectionalLight(pal.aquamarine || '#5cc8ff', 1.35);
    rimDir.position.set(-10, 14, -18);
    this.hemiLight = hemi;
    this.ambLight = amb;
    this.dirLight = dir;
    this.rimDirLight = rimDir;
    this.stageGroup.add(hemi, amb, dir, rimDir);

    const theme = stage.theme || stage.id;
    const isGlassStage = theme === 'alley_to_glass' || theme === 'sea_of_glass_climax';
    if (isGlassStage) {
      this.seaMaterial = createSeaOfGlassMaterial();
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 48, 16, 16), this.seaMaterial);
      floor.rotation.x = -Math.PI / 2;
      this.stageGroup.add(floor);
    } else {
      this.seaMaterial = null;
      const gHex = pal.ground || '#222b3a';
      const floorMat = new THREE.MeshStandardMaterial({
        map: createPainterlyTexture(gHex, '#384c6b', '#172030', 72),
        roughness: 0.62,
        metalness: 0.22
      });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 48), floorMat);
      floor.rotation.x = -Math.PI / 2;
      this.stageGroup.add(floor);
    }

    const pathMat = new THREE.MeshStandardMaterial({
      color: pal.accent || '#38bdf8',
      emissive: pal.accent || '#38bdf8',
      emissiveIntensity: 0.35,
      roughness: 0.35,
      transparent: true,
      opacity: 0.52
    });
    const pathMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 36), pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(0, 0.02, -12);
    this.stageGroup.add(pathMesh);

    populateStageScenery(theme, this.stageGroup, ecoMode);

    // 3D Stage Art Mural Frame
    const artTex = loadStageArtTexture(stage.idx ?? 0, stage.title);
    const frameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(8.4, 5.2, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.68 })
    );
    frameMesh.position.set(0, 4.4, -29.2);
    const canvasPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(7.9, 4.75),
      new THREE.MeshBasicMaterial({ map: artTex })
    );
    canvasPlane.position.set(0, 4.4, -29.06);
    this.stageGroup.add(frameMesh, canvasPlane);
    this.currentStageArtTexture = artTex;

    const count = ecoMode ? 60 : 140;
    const pGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      posArr[i * 3] = (Math.random() - 0.5) * 26;
      posArr[i * 3 + 1] = Math.random() * 11 + 0.5;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 34;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const pMat = new THREE.PointsMaterial({
      color: isGlassStage ? 0xfde047 : 0x93c5fd,
      size: isGlassStage ? 0.14 : 0.09,
      transparent: true,
      opacity: 0.72
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.stageGroup.add(this.particles);

    for (const node of stage.nodes) {
      const done = isNodeDoneFn ? isNodeDoneFn(node) : false;
      const locked = isNodeLockedFn ? isNodeLockedFn(node) : false;
      const mon = createNodeMonument(node, done, locked);
      this.stageGroup.add(mon);
      this.nodeGroups.push(mon);
    }
  }

  // Updates the Sea of Glass ending moment (0 <= progress <= 1)
  updateFinaleMoment(progress, elapsed, playerMesh, camera, ecoMode = false) {
    const t = Math.max(0, Math.min(1, progress));
    const smooth = t * t * (3 - 2 * t);

    // Move player & Elias side by side at the crystalline shore
    const shoreZ = -23.5;
    if (playerMesh) {
      playerMesh.position.x += (0.85 - playerMesh.position.x) * 0.08;
      playerMesh.position.z += (shoreZ - playerMesh.position.z) * 0.08;
      playerMesh.rotation.y = Math.PI;
    }
    if (this.eliasCompanion) {
      this.eliasCompanion.position.x += (-0.85 - this.eliasCompanion.position.x) * 0.08;
      this.eliasCompanion.position.z += (shoreZ - this.eliasCompanion.position.z) * 0.08;
      this.eliasCompanion.rotation.y = Math.PI;
    }

    // Brighten golden-aquamarine dawn over the Sea of Glass
    if (this.hemiLight) {
      this.hemiLight.intensity = 1.55 + smooth * (ecoMode ? 1.0 : 1.6);
    }
    if (this.dirLight) {
      this.dirLight.intensity = 2.25 + smooth * (ecoMode ? 1.1 : 1.85);
    }
    if (this.ambLight) {
      this.ambLight.intensity = 0.9 + smooth * 0.65;
    }
    if (this.skyDome && this.skyDome.material && this.skyDome.material.uniforms) {
      this.skyDome.material.uniforms.uHorizonColor.value.set('#ffe49e');
      this.skyDome.material.uniforms.uTopColor.value.set('#255c85');
      this.skyDome.material.uniforms.uTime.value = elapsed;
    }
    if (this.seaMaterial && this.seaMaterial.uniforms) {
      this.seaMaterial.uniforms.uTime.value = elapsed * 1.4;
      this.seaMaterial.uniforms.uGlassBlend.value = 0.72 + smooth * 0.26;
    }
    if (this.scene.fog) {
      this.scene.fog.density = 0.0115 * (1 - smooth * 0.55);
    }

    // Camera rises gently above the shore looking across the Sea of Glass and the four Mentors
    if (camera) {
      const camX = Math.sin(smooth * 0.55) * 2.2;
      const camY = 3.4 + smooth * 4.2;
      const camZ = shoreZ + 6.8 + smooth * 2.4;
      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 1.8 + smooth * 0.8, shoreZ - 5.5);
    }
  }

  update(dt, elapsed, playerPos) {
    if (this.seaMaterial && this.seaMaterial.uniforms) {
      this.seaMaterial.uniforms.uTime.value = elapsed;
    }
    if (this.particles) {
      this.particles.rotation.y = elapsed * 0.03;
    }

    // Find the single nearest node within interact range (4.2m) so only 1 short label shows at a time
    let nearestMon = null;
    let bestDist = 4.2;
    for (const mon of this.nodeGroups) {
      const d = Math.hypot(mon.position.x - playerPos.x, mon.position.z - playerPos.z);
      if (d < bestDist) {
        bestDist = d;
        nearestMon = mon;
      }
    }

    for (const mon of this.nodeGroups) {
      if (mon.userData.floatingMesh) {
        mon.userData.floatingMesh.rotation.y = elapsed * 0.9;
        mon.userData.floatingMesh.position.y = 1.42 + Math.sin(elapsed * 2.2 + mon.position.x) * 0.08;
      }
      if (mon.userData.haloRing) {
        const s = 1 + Math.sin(elapsed * 3.0) * 0.06;
        mon.userData.haloRing.scale.set(s, s, 1);
      }
      if (mon.userData.labelSprite) {
        mon.userData.labelSprite.visible = mon === nearestMon;
      }
    }

    // Elias walks beside the Fellow-Traveler to the left-forward so his small "Elias" tag never covers the player center
    const targetX = playerPos.x - 1.75;
    const targetZ = playerPos.z - 1.15;
    this.eliasCompanion.position.x += (targetX - this.eliasCompanion.position.x) * Math.min(1, dt * 4.5);
    this.eliasCompanion.position.z += (targetZ - this.eliasCompanion.position.z) * Math.min(1, dt * 4.5);
    this.eliasCompanion.position.y = Math.abs(Math.sin(elapsed * 3.2)) * 0.04;
  }

  getNearestNode(playerPos, maxDist = 4.2) {
    let best = null;
    let bestD = maxDist;
    for (const mon of this.nodeGroups) {
      const dx = mon.position.x - playerPos.x;
      const dz = mon.position.z - playerPos.z;
      const d = Math.hypot(dx, dz);
      if (d < bestD) {
        bestD = d;
        best = mon.userData.node;
      }
    }
    return best;
  }
}
