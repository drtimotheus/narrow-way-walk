// ============================================================================
// THE NARROW WAY — Painterly & Sea of Glass Shader Engine (Zone 1)
// Adapts Pilgrim Walk's painterly oil-on-linen & crystal water shaders for
// Elias Cho's Seoul and the Sea of Glass (Rev 4:6; 15:2).
// Preloads approved paintings at startup and provides distinct scene art
// mappings for every Stage, Stand, Well, Treasure, Wisdom Page, and Ending.
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

    const rad = ctx.createRadialGradient(320, 195, 16, 320, 195, 250);
    rad.addColorStop(0, 'rgba(255, 244, 214, 0.88)');
    rad.addColorStop(0.48, 'rgba(92, 214, 255, 0.35)');
    rad.addColorStop(1, 'rgba(16, 24, 36, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 640, 400);

    for (let i = 0; i < 36; i++) {
      const x = 30 + (i / 35) * 580;
      const y = 185 + Math.sin(i * 1.7) * 14;
      ctx.fillStyle = 'rgba(255, 222, 148, 0.72)';
      ctx.beginPath();
      ctx.arc(x, y, 2.5 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(124, 232, 255, 0.38)';
    ctx.lineWidth = 1.5;
    for (let r = 0; r < 6; r++) {
      const y = 260 + r * 14;
      ctx.beginPath();
      ctx.moveTo(60 + r * 12, y);
      ctx.lineTo(580 - r * 12, y);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(10, 16, 28, 0.84)';
    ctx.fillRect(0, 344, 640, 56);
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 16px Georgia, serif';
    ctx.fillText(title, 20, 375);

    return canvas.toDataURL('image/png');
  }
}

export function createPainterlySkyDome(THREE, radius = 180) {
  const geo = new THREE.SphereGeometry(radius, 24, 16);
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

// Canonical mapping of the 6 Stage banners (each unique to its Stage)
export const STAGE_ART_MAP = {
  0: './assets/art/sea-01-panel-05.png', // Stage I: 2,000-Seat Venue Stage Lights & VIP Exit
  1: './assets/art/sea-01-panel-11.png', // Stage II: Neon Alley & Sea of Glass Threshold
  2: './assets/art/sea-01-panel-35.png', // Stage III: Rehearsal, Apartment & Hannam-dong
  3: './assets/art/sea-01-panel-42.png', // Stage IV: Seoul Columbarium Steps & Hall C
  4: './assets/art/sea-01-panel-65.png', // Stage V: 40-Person Church Basement & Studio
  5: './assets/art/sea-01-panel-85.png'  // Stage VI: Dawn over the Sea of Glass & Four Mentors
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
  gatehouseBanner: './assets/art/sea-01-panel-98.png',
  panel04: './assets/art/sea-01-panel-04.png'
};

// Dedicated painted panel for each of the 8 Stands (every Stand has its own unique painted panel)
export const STAND_ART_MAP = {
  stand_1: { url: './assets/art/sea-01-panel-53.png', motif: 'mirror', stageIdx: 0 },          // Stand 1: The Applause Echo (Backstage Lighted Mirror)
  stand_2: { url: './assets/art/sea-01-panel-08.png', motif: 'alley', stageIdx: 1 },           // Stand 2: The Patient Whisper (Addictions #23 in Back Alley)
  stand_3: { url: './assets/art/sea-01-panel-30.png', motif: 'comparison_lens', stageIdx: 2 }, // Stand 3: The Comparison Lens (Jealousy #27 Viral Clips)
  stand_4: { url: './assets/art/sea-01-panel-38.png', motif: 'hannam_door', stageIdx: 2 },     // Stand 4: The Back-Room Boast at Hannam-dong
  stand_5: { url: './assets/art/sea-01-panel-52.png', motif: 'grief', stageIdx: 3 },           // Stand 5: The Curated Sorrow (Weeping at Hall C)
  stand_6: { url: './assets/art/sea-01-panel-43.png', motif: 'iron_collar', stageIdx: 3 },     // Stand 6: The Iron Collar of Burnout (Infirmity #19)
  stand_7: { url: './assets/art/sea-01-panel-66.png', motif: 'mirror', stageIdx: 4 },          // Stand 7: The Mirror-Guard of Pride (Youth Room Mic)
  stand_8: { url: './assets/art/sea-01-panel-81.png', motif: 'climax', stageIdx: 5 }           // Stand 8: The Obsidian Crown & Fig-Leaf Door (Climax Stand)
};

// Dedicated painted panel for each of the 5 Wells (every Well has its own unique painted panel)
export const WELL_ART_MAP = {
  well_1: { url: './assets/art/sea-01-panel-04.png', motif: 'sea_of_glass', stageIdx: 1 },      // Well 1: King David & Kinnor on the Sea of Glass
  well_2: { url: './assets/art/sea-01-panel-39.png', motif: 'dawn_window', stageIdx: 2 },       // Well 2: Clean Night Air & Dawn Window
  well_3: { url: './assets/art/sea-01-panel-49.png', motif: 'columbarium_bench', stageIdx: 3 }, // Well 3: Columbarium Bench with David
  well_4: { url: './assets/art/sea-01-panel-62.png', motif: 'pastor_office', stageIdx: 3 },     // Well 4: Pastor Ji's Basement Office
  well_5: { url: './assets/art/sea-01-panel-74.png', motif: 'sea_of_glass', stageIdx: 4 },      // Well 5: Kitchen Floor Tilting into the Sea of Glass
  well_6: { url: './assets/art/sea-01-panel-85.png', motif: 'sea_of_glass', stageIdx: 5 }       // Well 6: Fellowship Basin on the Sea of Glass
};

// Dedicated painted panel for each of the 8 Treasures (zero overlap within any stage)
export const TREASURE_ART_MAP = {
  treasure_1: './assets/art/sea-01-panel-06.png', // Stage I: Mr. Park in the Loading-Bay Rain
  treasure_2: './assets/art/sea-01-panel-28.png', // Stage III: Midnight Rehearsal Room with Min-jun
  treasure_3: './assets/art/sea-01-panel-31.png', // Stage III: Stepping Out from the Apartment into the Rainy Avenue
  treasure_4: './assets/art/sea-01-panel-45.png', // Stage IV: Columbarium Hill Steps
  treasure_5: './assets/art/sea-01-panel-69.png', // Stage V: Concrete Steps After the 40-Person Youth Q&A
  treasure_6: './assets/art/sea-01-panel-95.png', // Stage V: Studio Control Booth Mixing Board with Hoon
  treasure_7: './assets/art/sea-01-panel-76.png', // Stage VI: Shielding Adaeze & Clasping Talia's Hand on the Glass
  treasure_8: './assets/art/sea-01-panel-94.png'  // Stage VI: Honest Recovery Clause at the Contract Table
};

// Dedicated painted panel for each of the 7 Wisdom Pages (zero overlap within any stage)
export const WISDOM_ART_MAP = {
  wisdom_1: './assets/art/sea-01-panel-14.png', // Stage II: David's Unvarnished Honesty on the Sea of Glass
  wisdom_2: './assets/art/sea-01-panel-41.png', // Stage III: Unbranded Walk Home from Hannam-dong
  wisdom_3: './assets/art/sea-01-panel-47.png', // Stage IV: The Gatehouse at Mahanaim
  wisdom_4: './assets/art/sea-01-panel-64.png', // Stage IV: Quiet Evening After Pastor Ji's Office
  wisdom_5: './assets/art/sea-01-panel-89.png', // Stage V: Kitchen Floor Beside the Untouched Bottle
  wisdom_6: './assets/art/sea-01-panel-67.png', // Stage V: 40-Chair Youth Basement Relief
  wisdom_7: './assets/art/sea-01-panel-86.png'  // Stage VI: Four Mentors Behind the Four Champions
};

export const ENDING_ART_MAP = {
  good_ending: './assets/art/sea-01-panel-96.png', // Section 299: The Honest Recovery Road
  true_ending: './assets/art/sea-01-panel-100.png' // Section 300: The Unseen Chord
};

// Per-panel focal points (object-position) so wide modal banners always frame the painted subject and faces,
// never cropping to a dark ceiling or sky strip.
export const ART_FOCAL_POINT_MAP = {
  './assets/art/sea-01-panel-04.png': '50% 36%',
  './assets/art/sea-01-panel-05.png': '50% 22%',
  './assets/art/sea-01-panel-06.png': '50% 44%',
  './assets/art/sea-01-panel-08.png': '50% 38%',
  './assets/art/sea-01-panel-11.png': '50% 52%',
  './assets/art/sea-01-panel-14.png': '50% 42%',
  './assets/art/sea-01-panel-28.png': '50% 42%',
  './assets/art/sea-01-panel-30.png': '50% 38%',
  './assets/art/sea-01-panel-31.png': '50% 42%',
  './assets/art/sea-01-panel-35.png': '50% 32%',
  './assets/art/sea-01-panel-38.png': '50% 38%',
  './assets/art/sea-01-panel-39.png': '50% 42%',
  './assets/art/sea-01-panel-41.png': '50% 42%',
  './assets/art/sea-01-panel-42.png': '50% 36%',
  './assets/art/sea-01-panel-43.png': '50% 38%',
  './assets/art/sea-01-panel-45.png': '50% 34%',
  './assets/art/sea-01-panel-47.png': '50% 40%',
  './assets/art/sea-01-panel-49.png': '50% 42%',
  './assets/art/sea-01-panel-52.png': '50% 38%',
  './assets/art/sea-01-panel-53.png': '50% 36%',
  './assets/art/sea-01-panel-62.png': '50% 42%',
  './assets/art/sea-01-panel-64.png': '50% 42%',
  './assets/art/sea-01-panel-65.png': '50% 54%',
  './assets/art/sea-01-panel-66.png': '50% 38%',
  './assets/art/sea-01-panel-67.png': '50% 44%',
  './assets/art/sea-01-panel-69.png': '50% 42%',
  './assets/art/sea-01-panel-74.png': '50% 44%',
  './assets/art/sea-01-panel-76.png': '50% 42%',
  './assets/art/sea-01-panel-81.png': '50% 40%',
  './assets/art/sea-01-panel-85.png': '50% 42%',
  './assets/art/sea-01-panel-86.png': '50% 42%',
  './assets/art/sea-01-panel-89.png': '50% 44%',
  './assets/art/sea-01-panel-94.png': '50% 42%',
  './assets/art/sea-01-panel-95.png': '50% 42%',
  './assets/art/sea-01-panel-96.png': '50% 42%',
  './assets/art/sea-01-panel-98.png': '50% 56%',
  './assets/art/sea-01-panel-100.png': '50% 42%'
};

export function getArtFocalPoint(pngUrl) {
  if (!pngUrl) return '50% 38%';
  return ART_FOCAL_POINT_MAP[pngUrl] || '50% 38%';
}

// Image preloader cache so modal paintings display without flicker
const preloadedImageCache = new Map();
const preloadedStageSet = new Set();

function preloadAndDecodeUrl(url) {
  if (!url) return;
  let img = preloadedImageCache.get(url);
  if (!img) {
    img = new Image();
    img.decoding = 'async';
    img.src = url;
    preloadedImageCache.set(url, img);
  }
  if (typeof img.decode === 'function') {
    img.decode().catch(() => {});
  }
}

export function preloadStageArt(stageIdx) {
  const idx = Number(stageIdx);
  if (Number.isNaN(idx) || idx < 0 || idx > 5) return 0;
  const urls = new Set();
  if (STAGE_ART_MAP[idx]) urls.add(STAGE_ART_MAP[idx]);
  if (STAGE_ART_MAP[idx + 1]) urls.add(STAGE_ART_MAP[idx + 1]);
  for (const cfg of Object.values(STAND_ART_MAP)) {
    if (cfg.stageIdx === idx && cfg.url) urls.add(cfg.url);
  }
  for (const cfg of Object.values(WELL_ART_MAP)) {
    if (cfg.stageIdx === idx && cfg.url) urls.add(cfg.url);
  }
  if (idx === 3) {
    // Stage 4 world columbarium niche panels
    [
      './assets/art/sea-01-panel-42.png',
      './assets/art/sea-01-panel-45.png',
      './assets/art/sea-01-panel-47.png',
      './assets/art/sea-01-panel-49.png',
      './assets/art/sea-01-panel-52.png',
      './assets/art/sea-01-panel-62.png',
      './assets/art/sea-01-panel-64.png'
    ].forEach((u) => urls.add(u));
  }
  if (idx >= 4) {
    Object.values(ENDING_ART_MAP).forEach((u) => urls.add(u));
  }
  for (const u of urls) {
    preloadAndDecodeUrl(u);
  }
  preloadedStageSet.add(idx);
  return urls.size;
}

export function isStageArtPreloaded(stageIdx) {
  return preloadedStageSet.has(Number(stageIdx));
}

export function preloadAllZone1Art() {
  const allUrls = new Set([
    ...Object.values(STAGE_ART_MAP),
    ...Object.values(PORTRAIT_ART_MAP),
    ...Object.values(TREASURE_ART_MAP),
    ...Object.values(WISDOM_ART_MAP),
    ...Object.values(ENDING_ART_MAP),
    ...Object.values(STAND_ART_MAP).map((x) => x.url).filter(Boolean),
    ...Object.values(WELL_ART_MAP).map((x) => x.url).filter(Boolean)
  ]);
  for (const url of allUrls) {
    preloadAndDecodeUrl(url);
  }
  preloadStageArt(0);
  preloadStageArt(1);
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

// Loads a linked PNG into a modal <img> with a styled loading state (soft gradient + spinner)
// and smooth fade-in transition so broken-image icons or jarring pop-ins never appear.
export function loadArtIntoImage(imgEl, badgeEl, { stageIdx = 0, pngUrl, title = 'The Unseen Chord', subtitle = '', motif = 'mirror', focalPoint = null } = {}) {
  if (!imgEl) return;
  const wrap = imgEl.closest('.modal-art-frame');
  if (badgeEl) {
    badgeEl.textContent = '';
    badgeEl.classList.add('hidden');
  }

  const targetFocal = focalPoint || getArtFocalPoint(pngUrl);
  imgEl.style.objectPosition = targetFocal;

  if (!pngUrl) {
    imgEl.src = createPainterlyArtDataURL({ stageIdx, title, subtitle, motif });
    imgEl.dataset.artSource = 'canvas-art';
    imgEl.dataset.loadedUrl = `canvas:${motif}`;
    imgEl.dataset.focalPoint = targetFocal;
    imgEl.classList.add('is-loaded');
    if (wrap) wrap.classList.remove('is-loading');
    return;
  }

  const cached = preloadedImageCache.get(pngUrl);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    imgEl.onload = null;
    imgEl.onerror = null;
    if (imgEl.dataset.loadedUrl !== pngUrl) {
      imgEl.classList.remove('is-loaded');
      imgEl.src = pngUrl;
      requestAnimationFrame(() => {
        imgEl.classList.add('is-loaded');
      });
    } else {
      imgEl.src = pngUrl;
      imgEl.classList.add('is-loaded');
    }
    imgEl.dataset.artSource = 'linked-png';
    imgEl.dataset.loadedUrl = pngUrl;
    imgEl.dataset.focalPoint = targetFocal;
    if (wrap) wrap.classList.remove('is-loading');
    return;
  }

  imgEl.classList.remove('is-loaded');
  if (wrap) wrap.classList.add('is-loading');

  imgEl.onload = () => {
    imgEl.dataset.artSource = 'linked-png';
    imgEl.dataset.loadedUrl = pngUrl;
    imgEl.dataset.focalPoint = targetFocal;
    imgEl.classList.add('is-loaded');
    if (wrap) wrap.classList.remove('is-loading');
  };
  imgEl.onerror = () => {
    imgEl.onload = null;
    imgEl.src = createPainterlyArtDataURL({ stageIdx, title, subtitle, motif });
    imgEl.dataset.artSource = 'canvas-art';
    imgEl.dataset.loadedUrl = `canvas:${motif}`;
    imgEl.dataset.focalPoint = targetFocal;
    imgEl.classList.add('is-loaded');
    if (wrap) wrap.classList.remove('is-loading');
  };
  imgEl.src = pngUrl;

  if (!cached) {
    preloadAndDecodeUrl(pngUrl);
  }
}

// Loads a stage or portrait PNG into a Three.js Texture first; uses preloaded cache when ready.
export function loadStageArtTexture(stageIdx = 0, title = 'The Unseen Chord', customUrl = null) {
  const targetUrl = customUrl || STAGE_ART_MAP[stageIdx] || STAGE_ART_MAP[0];
  const cached = preloadedImageCache.get(targetUrl);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    const tex = new THREE_NS.Texture(cached);
    tex.colorSpace = THREE_NS.SRGBColorSpace;
    tex.userData = { artSource: 'linked-png', url: targetUrl };
    tex.needsUpdate = true;
    return tex;
  }

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
    preloadedImageCache.set(targetUrl, probe);
  };
  probe.onerror = () => {
    const fbImg = new Image();
    fbImg.onload = () => {
      tex.image = fbImg;
      tex.userData.artSource = 'canvas-art';
      tex.userData.url = 'canvas-art';
      tex.needsUpdate = true;
    };
    fbImg.src = createPainterlyArtDataURL({ stageIdx, title });
  };
  probe.src = targetUrl;
  return tex;
}
