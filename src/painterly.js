// ============================================================================
// THE NARROW WAY — Painterly & Sea of Glass Shader Engine (Zone 1)
// Adapts Pilgrim Walk's painterly oil-on-linen & crystal water shaders for
// Elias Cho's Seoul and the Sea of Glass (Rev 4:6; 15:2).
// Preloads approved paintings at startup and provides distinct scene art
// mappings for every Stage, Stand, Well, Treasure, and Wisdom Page.
// ============================================================================

import * as THREE_NS from 'three';

export class PainterlyEngine {
  constructor(THREE = THREE_NS) {
    this.THREE = THREE;
    this._texCache = new Map();
  }

  createBrushTexture(baseHex = '#2a3442', accentHex = '#5cd6ff', variant = 'stone') {
    const key = `${baseHex}|${accentHex}|${variant}`;
    if (this._texCache.has(key)) return this._texCache.get(key);

    const THREE = this.THREE;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    const cBase = new THREE.Color(baseHex);
    const cAcc = new THREE.Color(accentHex);
    const tmp = new THREE.Color();

    for (let i = 0; i < 420; i++) {
      const t = (i % 17) / 17;
      tmp.copy(cBase).lerp(cAcc, t * 0.45);
      tmp.offsetHSL(0, 0, ((i % 7) - 3) * 0.018);
      ctx.fillStyle = `#${tmp.getHexString()}`;
      const x = (i * 53) % 256;
      const y = (i * 97) % 256;
      const w = variant === 'crystal' ? 28 : 18;
      const h = variant === 'crystal' ? 6 : 10;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(((i % 11) - 5) * 0.08);
      ctx.fillRect(-w * 0.5, -h * 0.5, w, h);
      ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    this._texCache.set(key, tex);
    return tex;
  }

  // Generates a bespoke painterly scene illustration on a 2D canvas when a
  // specific scene has no separate file yet (listed in assets.md)
  createSceneCanvasDataUrl(stageIdx = 0, title = 'The Unseen Chord', motif = 'mirror') {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const palettes = [
      ['#0f1a2e', '#284369', '#f2c166', '#5cd6ff'],
      ['#0c1e35', '#24587e', '#48cae4', '#ffd166'],
      ['#1e273a', '#68503f', '#f4a261', '#7ce8ff'],
      ['#2b425c', '#c28550', '#f6bd60', '#8ecae6'],
      ['#182130', '#3b4f66', '#e9c46a', '#5cd6ff'],
      ['#1b3b5c', '#dca95e', '#ffe699', '#7ce8ff']
    ];
    const pal = palettes[stageIdx % palettes.length];

    const grad = ctx.createLinearGradient(0, 0, 0, 400);
    grad.addColorStop(0, pal[0]);
    grad.addColorStop(0.58, pal[1]);
    grad.addColorStop(1, '#111a28');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 400);

    // Warm horizon glow
    const rad = ctx.createRadialGradient(320, 195, 16, 320, 195, 250);
    rad.addColorStop(0, 'rgba(255, 244, 214, 0.88)');
    rad.addColorStop(0.48, 'rgba(92, 214, 255, 0.35)');
    rad.addColorStop(1, 'rgba(16, 24, 36, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 640, 400);

    if (motif === 'mirror') {
      // Gilded VIP lounge mirror with fracture lines (Stand 1: The Applause Echo)
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 5;
      ctx.strokeRect(210, 52, 220, 246);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.fillRect(216, 58, 208, 234);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.78)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(320, 60);
      ctx.lineTo(285, 165);
      ctx.lineTo(355, 225);
      ctx.lineTo(310, 290);
      ctx.moveTo(285, 165);
      ctx.lineTo(222, 195);
      ctx.moveTo(355, 225);
      ctx.lineTo(418, 190);
      ctx.stroke();
    } else if (motif === 'dawn_window') {
      // Apartment window at dawn with two steaming mugs of barley tea (Well 2)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.strokeRect(180, 44, 280, 190);
      ctx.beginPath();
      ctx.moveTo(320, 44);
      ctx.lineTo(320, 234);
      ctx.moveTo(180, 139);
      ctx.lineTo(460, 139);
      ctx.stroke();
      ctx.fillStyle = '#78350f';
      ctx.fillRect(140, 250, 360, 24);
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(255, 218, 34, 32);
      ctx.fillRect(350, 218, 34, 32);
    } else if (motif === 'comparison_lens') {
      // Jaundiced green-gold lens cracking in sunlight (Stand 3: The Comparison Lens)
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(320, 175, 92, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(132, 204, 22, 0.22)';
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(240, 135);
      ctx.lineTo(320, 175);
      ctx.lineTo(402, 210);
      ctx.moveTo(320, 175);
      ctx.lineTo(295, 260);
      ctx.stroke();
    } else if (motif === 'hannam_door') {
      // Velvet rope doorway opening into clean midnight street air (Stand 4)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(235, 58, 170, 240);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(235, 58, 170, 240);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(235, 195);
      ctx.quadraticCurveTo(320, 225, 405, 195);
      ctx.stroke();
    } else if (motif === 'columbarium_bench') {
      // Red-gold autumn maples & bamboo water basin outside Hall C (Well 3)
      ctx.fillStyle = 'rgba(217, 119, 6, 0.55)';
      for (let i = 0; i < 18; i++) {
        ctx.beginPath();
        ctx.arc(120 + i * 24, 95 + (i % 3) * 18, 26, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#475569';
      ctx.fillRect(250, 215, 140, 55);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(264, 224, 112, 24);
    } else if (motif === 'iron_collar') {
      // Snapping iron collar & acoustic guitar case in rehearsal booth (Stand 6)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(275, 175, 55, 0.3, Math.PI * 1.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(365, 175, 55, Math.PI * 1.65, Math.PI * 0.7);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(320, 175, 14, 0, Math.PI * 2);
      ctx.fill();
    } else if (motif === 'pastor_office') {
      // Twelve folding chairs & steaming kettle in Pastor Ji's basement office (Well 4)
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x = 320 + Math.cos(a) * 110;
        const y = 195 + Math.sin(a) * 52;
        ctx.strokeRect(x - 12, y - 12, 24, 24);
      }
    } else {
      // Cloud of Witnesses warm amber points along the horizon (Rev 4:6; Heb 12:1)
      for (let i = 0; i < 36; i++) {
        const x = 30 + (i / 35) * 580;
        const y = 185 + Math.sin(i * 1.7) * 14;
        ctx.fillStyle = 'rgba(255, 222, 148, 0.72)';
        ctx.beginPath();
        ctx.arc(x, y, 2.5 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Crystal reflection lines on the Sea of Glass floor
    ctx.strokeStyle = 'rgba(124, 232, 255, 0.38)';
    ctx.lineWidth = 1.5;
    for (let r = 0; r < 6; r++) {
      const y = 260 + r * 14;
      ctx.beginPath();
      ctx.moveTo(60 + r * 12, y);
      ctx.lineTo(580 - r * 12, y);
      ctx.stroke();
    }

    // Clean title caption bar at bottom
    ctx.fillStyle = 'rgba(10, 16, 28, 0.84)';
    ctx.fillRect(0, 344, 640, 56);
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 16px Georgia, serif';
    ctx.fillText(title, 20, 370);
    ctx.fillStyle = '#93c5fd';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('The Narrow Way Walk · Zone I Scene Study', 20, 390);

    return canvas.toDataURL('image/png');
  }
}

export function createPainterlySkyDome(THREE, radius = 180) {
  const geo = new THREE.SphereGeometry(radius, 32, 24);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTopColor: { value: new THREE.Color('#132038') },
      uHorizonColor: { value: new THREE.Color('#3b628b') },
      uGroundColor: { value: new THREE.Color('#1a2434') },
      uTime: { value: 0 }
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTopColor;
      uniform vec3 uHorizonColor;
      uniform vec3 uGroundColor;
      uniform float uTime;
      varying vec3 vWorldPos;
      void main() {
        vec3 dir = normalize(vWorldPos);
        float h = dir.y;
        vec3 col = mix(uHorizonColor, uTopColor, smoothstep(0.0, 0.65, max(0.0, h)));
        col = mix(col, uGroundColor, smoothstep(0.0, -0.35, min(0.0, h)));
        float shimmer = 0.03 * sin(dir.x * 12.0 + uTime * 0.4) * cos(dir.z * 12.0 - uTime * 0.3);
        gl_FragColor = vec4(col + shimmer, 1.0);
      }
    `
  });
  return new THREE.Mesh(geo, mat);
}

// Sea of Glass & Rain-Slicked Asphalt Animated Shader Material
export function createSeaOfGlassMaterial(THREE = THREE_NS, deepHex = '#1a3f60', crystalHex = '#72e0ff', goldHex = '#ffe6a3') {
  const T = THREE && THREE.ShaderMaterial ? THREE : THREE_NS;
  return new T.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new T.Color(deepHex) },
      uCrystalColor: { value: new T.Color(crystalHex) },
      uGoldColor: { value: new T.Color(goldHex) },
      uGlassBlend: { value: 0.72 }
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uDeepColor;
      uniform vec3 uCrystalColor;
      uniform vec3 uGoldColor;
      uniform float uGlassBlend;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      void main() {
        float ripple1 = sin(vWorldPos.x * 1.4 + uTime * 1.1) * cos(vWorldPos.z * 1.2 - uTime * 0.9);
        float ripple2 = sin((vWorldPos.x + vWorldPos.z) * 2.3 - uTime * 1.5);
        float veins = smoothstep(0.45, 0.95, 0.5 + 0.5 * (ripple1 * 0.6 + ripple2 * 0.4));
        vec3 base = mix(uDeepColor, uCrystalColor, uGlassBlend * 0.58);
        vec3 col = mix(base, uGoldColor, veins * 0.42);
        gl_FragColor = vec4(col, 0.9);
      }
    `
  });
}

const defaultPainterly = new PainterlyEngine(THREE_NS);

// Canonical mapping of the 15 approved assets/art/ files
export const STAGE_ART_MAP = {
  0: './assets/art/sea-01-panel-06.png', // Stage I: 2,000-Seat Venue & Loading Bay Rain
  1: './assets/art/sea-01-panel-11.png', // Stage II: Neon Alley & Sea of Glass
  2: './assets/art/sea-01-panel-14.png', // Stage III: Rehearsal, Apartment & Hannam-dong
  3: './assets/art/sea-01-panel-35.png', // Stage IV: Seoul Columbarium Steps & Hall C
  4: './assets/art/sea-01-panel-74.png', // Stage V: Studio, Basement Youth Q&A & Kitchen Floor
  5: './assets/art/sea-01-panel-92.png'  // Stage VI: Sea of Glass Climax & Thursday Circle
};

export const PORTRAIT_ART_MAP = {
  elias: './assets/art/elias.png',
  david: './assets/art/david.png',
  daniel: './assets/art/daniel.png',
  paul: './assets/art/paul.png',
  esther: './assets/art/esther.png',
  adaeze: './assets/art/adaeze.png',
  cover: './assets/art/sea-01-cover-art.png',
  coverPreview: './assets/art/sea-01-cover-preview.jpg',
  panel04: './assets/art/sea-01-panel-04.png'
};

// Dedicated art mapping for each of the 8 Stands (never reuses Mr. Park's alley image for Stand 1)
export const STAND_ART_MAP = {
  stand_1: { url: null, motif: 'mirror', stageIdx: 0 }, // Stand 1: The Applause Echo (VIP Lounge Gilded Mirror)
  stand_2: { url: './assets/art/sea-01-panel-06.png', motif: 'alley', stageIdx: 1 }, // Stand 2: The Patient Whisper (Back Alley)
  stand_3: { url: null, motif: 'comparison_lens', stageIdx: 2 }, // Stand 3: The Comparison Lens
  stand_4: { url: null, motif: 'hannam_door', stageIdx: 2 }, // Stand 4: The Back-Room Boast at Hannam-dong
  stand_5: { url: './assets/art/sea-01-panel-11.png', motif: 'grief', stageIdx: 3 }, // Stand 5: The Curated Sorrow
  stand_6: { url: null, motif: 'iron_collar', stageIdx: 3 }, // Stand 6: The Iron Collar of Burnout
  stand_7: { url: './assets/art/sea-01-panel-92.png', motif: 'mirror', stageIdx: 4 }, // Stand 7: The Mirror-Guard of Pride
  stand_8: { url: './assets/art/sea-01-panel-74.png', motif: 'climax', stageIdx: 5 }  // Stand 8: The Obsidian Crown & Fig-Leaf Door
};

// Dedicated art mapping for each of the 5 Wells (Well 1 uses David on the Sea of Glass panel-04)
export const WELL_ART_MAP = {
  well_1: { url: './assets/art/sea-01-panel-04.png', motif: 'sea_of_glass', stageIdx: 1 },
  well_2: { url: null, motif: 'dawn_window', stageIdx: 2 },
  well_3: { url: null, motif: 'columbarium_bench', stageIdx: 3 },
  well_4: { url: null, motif: 'pastor_office', stageIdx: 3 },
  well_5: { url: './assets/art/sea-01-panel-35.png', motif: 'sea_of_glass', stageIdx: 4 }
};

// Dedicated art mapping for each of the 8 Treasures
export const TREASURE_ART_MAP = {
  treasure_1: './assets/art/sea-01-panel-06.png', // Mr. Park in the Loading-Bay Rain
  treasure_2: './assets/art/elias.png',           // Elias coaching Min-jun on acoustic guitar
  treasure_3: './assets/art/sea-01-cover-art.png',// Pouring Rain under the Mapo-gu Overpass
  treasure_4: './assets/art/sea-01-panel-35.png', // Columbarium Stone Staircase
  treasure_5: './assets/art/sea-01-panel-92.png', // Listening on the Floor with Soo-jin
  treasure_6: './assets/art/sea-01-panel-14.png', // Standing up for Intern Hoon
  treasure_7: './assets/art/adaeze.png',          // Shielding Adaeze & Clasping Talia's Hand
  treasure_8: './assets/art/sea-01-panel-11.png'  // Chair #7 in Pastor Ji's Thursday Basement Circle
};

export const WISDOM_ART_MAP = {
  wisdom_1: './assets/art/sea-01-panel-04.png',
  wisdom_2: './assets/art/sea-01-panel-14.png',
  wisdom_3: './assets/art/sea-01-panel-11.png',
  wisdom_4: './assets/art/david.png',
  wisdom_5: './assets/art/sea-01-panel-74.png',
  wisdom_6: './assets/art/sea-01-panel-92.png',
  wisdom_7: './assets/art/sea-01-panel-35.png'
};

// Image preloader cache so modal paintings display without flicker
const preloadedImageCache = new Map();

export function preloadAllZone1Art() {
  const allUrls = new Set([
    ...Object.values(STAGE_ART_MAP),
    ...Object.values(PORTRAIT_ART_MAP),
    ...Object.values(TREASURE_ART_MAP),
    ...Object.values(WISDOM_ART_MAP),
    ...Object.values(STAND_ART_MAP).map((x) => x.url).filter(Boolean),
    ...Object.values(WELL_ART_MAP).map((x) => x.url).filter(Boolean)
  ]);
  for (const url of allUrls) {
    if (!preloadedImageCache.has(url)) {
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      preloadedImageCache.set(url, img);
    }
  }
  return allUrls.size;
}

export function createPainterlyTexture(baseHex = '#2a3442', accentHex = '#5cd6ff') {
  return defaultPainterly.createBrushTexture(baseHex, accentHex, 'stone');
}

export function createSkyDome(topHex = '#132038', horizonHex = '#3b628b') {
  const mesh = createPainterlySkyDome(THREE_NS, 140);
  mesh.material.uniforms.uTopColor.value.set(topHex);
  mesh.material.uniforms.uHorizonColor.value.set(horizonHex);
  return mesh;
}

export function createPainterlyArtDataURL({ stageIdx = 0, title = 'The Unseen Chord', subtitle = '', motif = 'mirror' } = {}) {
  return defaultPainterly.createSceneCanvasDataUrl(stageIdx, subtitle ? `${title} · ${subtitle}` : title, motif);
}

// Loads a linked PNG or bespoke scene study into a modal <img> with a styled
// loading state (soft gradient + spinner) so broken-image icons never appear.
export function loadArtIntoImage(imgEl, badgeEl, { stageIdx = 0, pngUrl, title = 'The Unseen Chord', subtitle = '', motif = 'mirror' } = {}) {
  if (!imgEl) return;
  const wrap = imgEl.closest('.modal-art-frame');
  if (wrap) wrap.classList.add('is-loading');

  if (!pngUrl) {
    imgEl.src = createPainterlyArtDataURL({ stageIdx, title, subtitle, motif });
    imgEl.dataset.artSource = 'scene-study';
    imgEl.dataset.loadedUrl = `scene-study:${motif}`;
    if (wrap) wrap.classList.remove('is-loading');
    if (badgeEl) {
      badgeEl.textContent = 'Illustrated Scene Study · Painted Panel Listed in assets.md';
      badgeEl.classList.remove('hidden');
    }
    return;
  }

  const applySuccess = () => {
    imgEl.src = pngUrl;
    imgEl.dataset.artSource = 'linked-png';
    imgEl.dataset.loadedUrl = pngUrl;
    if (wrap) wrap.classList.remove('is-loading');
    if (badgeEl) {
      badgeEl.textContent = '';
      badgeEl.classList.add('hidden');
    }
  };

  const cached = preloadedImageCache.get(pngUrl);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    applySuccess();
    return;
  }

  const probe = cached || new Image();
  probe.onload = () => applySuccess();
  probe.onerror = () => {
    imgEl.src = createPainterlyArtDataURL({ stageIdx, title, subtitle, motif });
    imgEl.dataset.artSource = 'scene-study';
    imgEl.dataset.loadedUrl = `scene-study:${motif}`;
    if (wrap) wrap.classList.remove('is-loading');
    if (badgeEl) {
      badgeEl.textContent = 'Illustrated Scene Study · Painted Panel Listed in assets.md';
      badgeEl.classList.remove('hidden');
    }
  };
  if (!cached) {
    probe.src = pngUrl;
    preloadedImageCache.set(pngUrl, probe);
  }
}

// Loads a stage or portrait PNG into a Three.js Texture first; falls back to
// the painterly canvas study if absent.
export function loadStageArtTexture(stageIdx = 0, title = 'The Unseen Chord', customUrl = null) {
  const targetUrl = customUrl || STAGE_ART_MAP[stageIdx] || STAGE_ART_MAP[0];
  const initCanvas = document.createElement('canvas');
  initCanvas.width = 640;
  initCanvas.height = 400;
  const tex = new THREE_NS.Texture(initCanvas);
  tex.colorSpace = THREE_NS.SRGBColorSpace;
  tex.userData = { artSource: 'loading', url: targetUrl };

  const probe = new Image();
  probe.onload = () => {
    tex.image = probe;
    tex.userData.artSource = 'linked-png';
    tex.userData.url = targetUrl;
    tex.needsUpdate = true;
  };
  probe.onerror = () => {
    const fbImg = new Image();
    fbImg.onload = () => {
      tex.image = fbImg;
      tex.userData.artSource = 'scene-study';
      tex.userData.url = 'scene-study';
      tex.needsUpdate = true;
    };
    fbImg.src = createPainterlyArtDataURL({ stageIdx, title });
  };
  probe.src = targetUrl;
  return tex;
}
