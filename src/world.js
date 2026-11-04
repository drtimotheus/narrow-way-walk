// ============================================================================
// THE NARROW WAY — ZONE 1: 3D STAGE BUILDER, ELIAS COMPANION & INTERACTABLES
// ============================================================================
// FLAG: DEC-01, DEC-02 — Builds the 6 canonical 3D stages of Elias's Seoul and
// the Sea of Glass, renders Elias Cho as a 3D companion walking beside the
// Fellow-Traveler (never a skin the player wears), and places interactive nodes.

import * as THREE from 'three';
import {
  createPainterlyTexture,
  createSkyDome,
  createSeaOfGlassMaterial,
  loadStageArtTexture,
  PORTRAIT_ART_MAP
} from './painterly.js';
import { createWorldRelicPedestal } from './relics.js';

function makeLabelSprite(title, sub, accentHex = '#5cc8ff') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(10, 15, 28, 0.86)';
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 144, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accentHex;
  ctx.font = 'bold 24px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(title.slice(0, 36), 256, 62);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText((sub || '').slice(0, 44), 256, 110);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(4.2, 1.32, 1);
  return sprite;
}

export function createCharacterFigure({
  coatHex = 0x1e293b,
  scarfHex = 0x5cc8ff,
  skinHex = 0xe8c5a5,
  hairHex = 0x111827,
  hasGuitarCase = false,
  hasHarp = false,
  portraitKey = null,
  label = 'Elias Cho',
  roleSub = 'Companion · Walk Beside Him'
}) {
  const group = new THREE.Group();
  const coatMat = new THREE.MeshStandardMaterial({ color: coatHex, roughness: 0.65 });
  const scarfMat = new THREE.MeshStandardMaterial({
    color: scarfHex,
    emissive: scarfHex,
    emissiveIntensity: 0.2,
    roughness: 0.45
  });
  const skinMat = new THREE.MeshStandardMaterial({ color: skinHex, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairHex, roughness: 0.8 });

  const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.75, 10), hairMat);
  legs.position.y = 0.38;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.82, 12), coatMat);
  torso.position.y = 1.1;
  torso.castShadow = true;
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.055, 8, 20), scarfMat);
  scarf.rotation.x = Math.PI / 2;
  scarf.position.y = 1.48;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 16, 14), skinMat);
  head.position.y = 1.72;
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.58), hairMat);
  hair.position.y = 1.75;
  group.add(legs, torso, scarf, head, hair);

  if (hasGuitarCase) {
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.6 });
    const gCase = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.88, 0.16), caseMat);
    gCase.position.set(0.06, 1.18, -0.26);
    gCase.rotation.z = -0.18;
    group.add(gCase);
  }
  if (hasHarp) {
    const harpMat = new THREE.MeshStandardMaterial({ color: 0x9c6b30, roughness: 0.45 });
    const harp = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 18, Math.PI * 1.45), harpMat);
    harp.position.set(0.32, 1.18, 0.16);
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.06, 0),
      new THREE.MeshStandardMaterial({ color: 0x5cc8ff, emissive: 0x38bdf8 })
    );
    gem.position.set(0.32, 1.0, 0.22);
    group.add(harp, gem);
  }
  if (portraitKey && PORTRAIT_ART_MAP[portraitKey]) {
    const pTex = loadStageArtTexture(0, label, PORTRAIT_ART_MAP[portraitKey]);
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(0.42, 24),
      new THREE.MeshBasicMaterial({ map: pTex, side: THREE.DoubleSide })
    );
    disc.position.set(0, 3.35, 0);
    const rim = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.47, 24),
      new THREE.MeshBasicMaterial({ color: scarfHex, side: THREE.DoubleSide })
    );
    rim.position.set(0, 3.35, 0.01);
    group.add(disc, rim);
  }
  if (label) {
    const sprite = makeLabelSprite(label, roleSub, '#7dd3fc');
    sprite.position.set(0, 2.45, 0);
    group.add(sprite);
  }
  return group;
}

const NODE_STYLES = {
  well: { color: 0x38bdf8, hex: '#38bdf8', sub: 'Well of Living Water · Rest & Scroll' },
  stand: { color: 0xf97316, hex: '#fb923c', sub: 'Stand · 2d6 + Courage (Transparent)' },
  treasure: { color: 0xfacc15, hex: '#facc15', sub: 'Treasure Choice · Give (+1) or Keep (+0)' },
  wisdom: { color: 0xa7f3d0, hex: '#6ee7b7', sub: 'Wisdom Page · Read KJV Scripture' },
  relic: { color: 0x60a5fa, hex: '#93c5fd', sub: 'Relic Pedestal · 3D Turntable' },
  portal: { color: 0xc084fc, hex: '#d8b4fe', sub: 'Stage Passage · Step Forward' },
  gatehouse_finale: { color: 0xfbbf24, hex: '#fde047', sub: 'Treasure Gate & NW1 Save Code' }
};

export function createNodeMonument(node, isCompleted = false) {
  const style = NODE_STYLES[node.type] || NODE_STYLES.wisdom;
  const group = new THREE.Group();
  group.position.set(node.pos[0], node.pos[1] || 0, node.pos[2]);
  group.userData.node = node;

  const ringMat = new THREE.MeshBasicMaterial({
    color: isCompleted ? 0x34d399 : style.color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.72
  });
  const baseRing = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.32, 36), ringMat);
  baseRing.rotation.x = -Math.PI / 2;
  baseRing.position.y = 0.04;
  group.add(baseRing);
  group.userData.haloRing = baseRing;

  if (node.type === 'relic') {
    const ped = createWorldRelicPedestal(node.relicId || node.refId);
    group.add(ped);
    group.userData.floatingMesh = ped.userData.spinTarget;
  } else if (node.type === 'well') {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.55 });
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      roughness: 0.15
    });
    const curb = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, 0.72, 20), stoneMat);
    curb.position.y = 0.36;
    const pool = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.66, 20), waterMat);
    pool.position.y = 0.39;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), waterMat);
    gem.position.y = 1.35;
    group.add(curb, pool, gem);
    group.userData.floatingMesh = gem;
  } else if (node.type === 'stand') {
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x27171c, roughness: 0.5 });
    const coreMat = new THREE.MeshStandardMaterial({
      color: isCompleted ? 0x34d399 : 0xf97316,
      emissive: isCompleted ? 0x059669 : 0xc2410c,
      emissiveIntensity: 0.75,
      roughness: 0.25
    });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.85, 0.7, 8), pillarMat);
    base.position.y = 0.35;
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), coreMat);
    crystal.position.y = 1.45;
    group.add(base, crystal);
    group.userData.floatingMesh = crystal;
  } else if (node.type === 'treasure') {
    const pedMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xb45309,
      emissiveIntensity: 0.65,
      roughness: 0.25,
      metalness: 0.6
    });
    const ped = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.85), pedMat);
    ped.position.y = 0.425;
    const crown = new THREE.Mesh(new THREE.TorusKnotGeometry(0.28, 0.08, 48, 12), goldMat);
    crown.position.y = 1.42;
    group.add(ped, crown);
    group.userData.floatingMesh = crown;
  } else {
    const standMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const scrollMat = new THREE.MeshStandardMaterial({
      color: style.color,
      emissive: style.color,
      emissiveIntensity: 0.35,
      roughness: 0.3
    });
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.45, 1.0, 12), standMat);
    pillar.position.y = 0.5;
    const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.82, 0.12), scrollMat);
    tablet.position.y = 1.45;
    tablet.rotation.x = -0.22;
    group.add(pillar, tablet);
    group.userData.floatingMesh = tablet;
  }

  const label = makeLabelSprite(
    isCompleted ? `✓ ${node.label}` : node.label,
    style.sub,
    isCompleted ? '#34d399' : style.hex
  );
  label.position.set(0, 2.55, 0);
  group.add(label);
  return group;
}

function populateStageScenery(stageId, envGroup) {
  const wallMat = new THREE.MeshStandardMaterial({
    map: createPainterlyTexture('#182030', '#243046', '#0e1420', 48),
    roughness: 0.78
  });
  const warmMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.65
  });
  const neonBlueMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.8
  });

  if (stageId === 'seoul_corridor' || stageId === 'alley_to_glass') {
    for (let i = -3; i <= 3; i++) {
      const bL = new THREE.Mesh(new THREE.BoxGeometry(4.5, 9 + Math.abs(i) * 1.5, 4.5), wallMat);
      bL.position.set(-8.8, 4.5, i * 6.2);
      const bR = new THREE.Mesh(new THREE.BoxGeometry(4.5, 8.5 + (i % 2) * 2, 4.5), wallMat);
      bR.position.set(8.8, 4.2, i * 6.2);
      const sign = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.4, 2.2), i % 2 === 0 ? neonBlueMat : warmMat);
      sign.position.set(i % 2 === 0 ? -6.4 : 6.4, 3.8, i * 6.2);
      envGroup.add(bL, bR, sign);
    }
    if (stageId === 'alley_to_glass') {
      const david = createCharacterFigure({
        coatHex: 0x0369a1,
        scarfHex: 0x7dd3fc,
        hasHarp: true,
        portraitKey: 'david',
        label: 'David the King',
        roleSub: 'Mentor · Spirit of Might (Crownless)'
      });
      david.position.set(5.6, 0, -9.2);
      david.rotation.y = -0.5;
      envGroup.add(david);
    }
  } else if (stageId === 'mapo_hannam') {
    for (let i = -2; i <= 2; i++) {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(5.2, 12, 4.8), wallMat);
      tower.position.set(i * 6.5, 6, -15.5);
      const glassWindow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 8.5), neonBlueMat);
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
      new THREE.CylinderGeometry(0.08, 0.11, 0.42, 12),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.2, transparent: true, opacity: 0.85 })
    );
    bottle.position.set(4.5, 1.26, -3.5);
    envGroup.add(counter, bottle);
  } else if (stageId === 'sea_of_glass_climax') {
    const witnesses = [
      { name: 'David the King', role: 'Light Blue · Might · Psalm 51:17', x: -5.2, z: -3.5, coat: 0x0284c7, harp: true, portrait: 'david' },
      { name: 'Daniel the Prophet', role: 'Green · Counsel · Daniel 6:10', x: 5.2, z: -3.5, coat: 0x15803d, harp: false, portrait: 'daniel' },
      { name: 'Paul the Apostle', role: 'Dark Blue · Knowledge · 2 Cor 12:9', x: -6.4, z: -9.5, coat: 0x1d4ed8, harp: false, portrait: 'paul' },
      { name: 'Queen Esther', role: 'Red · Spirit of the Lord · Esther 4:14', x: 6.4, z: -9.5, coat: 0xb91c1c, harp: false, portrait: 'esther' },
      { name: 'Adaeze & Matthias & Talia', role: 'Fellow-Soldiers · Humming the 4 Notes', x: -3.8, z: 3.5, coat: 0x4f46e5, harp: false, portrait: 'adaeze' }
    ];
    for (const w of witnesses) {
      const fig = createCharacterFigure({
        coatHex: w.coat,
        scarfHex: 0xfde047,
        hasHarp: w.harp,
        portraitKey: w.portrait,
        label: w.name,
        roleSub: w.role
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
    this.eliasCompanion = createCharacterFigure({
      coatHex: 0x1e293b,
      scarfHex: 0x38bdf8,
      hasGuitarCase: true,
      portraitKey: 'elias',
      label: 'Elias Cho',
      roleSub: 'Companion · Walk Beside Him (Never Controlled)'
    });
    this.scene.add(this.eliasCompanion);
  }

  buildStage(stage, isNodeDoneFn, ecoMode = false) {
    while (this.stageGroup.children.length > 0) {
      this.stageGroup.remove(this.stageGroup.children[0]);
    }
    this.nodeGroups = [];
    const pal = stage.palette || {};
    this.scene.fog = new THREE.FogExp2(pal.fog || '#0b101d', 0.022);

    const sky = createSkyDome(
      pal.skyTop || '#070b14',
      pal.skyHorizon || '#162238'
    );
    this.stageGroup.add(sky);

    const amb = new THREE.AmbientLight(0xdbeafe, 0.95);
    const dir = new THREE.DirectionalLight(pal.aquamarine || '#5cc8ff', 1.85);
    dir.position.set(8, 18, 10);
    this.stageGroup.add(amb, dir);

    const theme = stage.theme || stage.id;
    const isGlassStage = theme === 'alley_to_glass' || theme === 'sea_of_glass_climax';
    if (isGlassStage) {
      this.seaMaterial = createSeaOfGlassMaterial();
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 48, 24, 24), this.seaMaterial);
      floor.rotation.x = -Math.PI / 2;
      this.stageGroup.add(floor);
    } else {
      this.seaMaterial = null;
      const gHex = pal.ground || '#141a26';
      const floorMat = new THREE.MeshStandardMaterial({
        map: createPainterlyTexture(gHex, '#233046', '#0b0f18', 72),
        roughness: 0.72,
        metalness: 0.18
      });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 48), floorMat);
      floor.rotation.x = -Math.PI / 2;
      this.stageGroup.add(floor);
    }

    const pathMat = new THREE.MeshStandardMaterial({
      color: pal.accent || '#38bdf8',
      emissive: pal.accent || '#38bdf8',
      emissiveIntensity: 0.22,
      roughness: 0.4,
      transparent: true,
      opacity: 0.42
    });
    const pathMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 34), pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(0, 0.02, -12);
    this.stageGroup.add(pathMesh);

    populateStageScenery(theme, this.stageGroup);

    // 3D Stage Art Mural Frame (loads stage's linked PNG from assets/art/*.png first,
    // falls back to procedural canvas with FLAG: DEC-07 badge only when absent)
    const artTex = loadStageArtTexture(stage.idx ?? 0, stage.title);
    const frameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(8.4, 5.2, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35, metalness: 0.65 })
    );
    frameMesh.position.set(0, 4.4, -29.2);
    const canvasPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(7.9, 4.75),
      new THREE.MeshBasicMaterial({ map: artTex })
    );
    canvasPlane.position.set(0, 4.4, -29.06);
    this.stageGroup.add(frameMesh, canvasPlane);
    this.currentStageArtTexture = artTex;

    const count = ecoMode ? 90 : 220;
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
      opacity: 0.7
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.stageGroup.add(this.particles);

    for (const node of stage.nodes) {
      const done = isNodeDoneFn ? isNodeDoneFn(node) : false;
      const mon = createNodeMonument(node, done);
      this.stageGroup.add(mon);
      this.nodeGroups.push(mon);
    }
  }

  update(dt, elapsed, playerPos) {
    if (this.seaMaterial && this.seaMaterial.uniforms) {
      this.seaMaterial.uniforms.uTime.value = elapsed;
    }
    if (this.particles) {
      this.particles.rotation.y = elapsed * 0.03;
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
    }
    const targetX = playerPos.x - 1.35;
    const targetZ = playerPos.z - 0.85;
    this.eliasCompanion.position.x += (targetX - this.eliasCompanion.position.x) * Math.min(1, dt * 4.5);
    this.eliasCompanion.position.z += (targetZ - this.eliasCompanion.position.z) * Math.min(1, dt * 4.5);
    this.eliasCompanion.position.y = Math.abs(Math.sin(elapsed * 3.2)) * 0.04;
  }

  getNearestNode(playerPos, maxDist = 3.2) {
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
