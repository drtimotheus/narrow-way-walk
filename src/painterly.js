// ============================================================================
// THE NARROW WAY — Painterly & Sea of Glass Shader Engine (Zone 1)
// FLAG: DEC-01 / DEC-07 — Adapts Pilgrim Walk's painterly oil-on-linen &
// crystal water shaders for Elias Cho's Seoul and the Sea of Glass (Rev 4:6; 15:2).
// Includes flagged procedural canvas art matching sea-01-art-prompts.md palettes
// when scripts/link-approved-art.sh has not yet been run.
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

  // Generates a painterly scene illustration on a 2D canvas (used on Wisdom & Gatehouse cards
  // and 3D scene frames; marked with FLAG: DEC-07 until scripts/link-approved-art.sh is run)
  createFlaggedSceneDataUrl(stageIdx = 0, title = 'The Unseen Chord') {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const palettes = [
      ['#0d1526', '#243b5c', '#f2c166', '#5cd6ff'],
      ['#0b192c', '#205072', '#48cae4', '#ffd166'],
      ['#1a2233', '#5c4738', '#f4a261', '#7ce8ff'],
      ['#273c54', '#b57c4a', '#f6bd60', '#8ecae6'],
      ['#151c28', '#334155', '#e9c46a', '#5cd6ff'],
      ['#16324f', '#d4a359', '#ffe699', '#7ce8ff']
    ];
    const pal = palettes[stageIdx % palettes.length];

    const grad = ctx.createLinearGradient(0, 0, 0, 400);
    grad.addColorStop(0, pal[0]);
    grad.addColorStop(0.55, pal[1]);
    grad.addColorStop(1, '#101824');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 400);

    // Sea of Glass golden-white & Aquamarine horizon glow
    const rad = ctx.createRadialGradient(320, 210, 12, 320, 210, 240);
    rad.addColorStop(0, 'rgba(255, 244, 214, 0.85)');
    rad.addColorStop(0.45, 'rgba(92, 214, 255, 0.35)');
    rad.addColorStop(1, 'rgba(16, 24, 36, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 640, 400);

    // Cloud of Witnesses warm amber points along the horizon (Rev 4:6; Heb 12:1)
    for (let i = 0; i < 36; i++) {
      const x = 30 + (i / 35) * 580;
      const y = 185 + Math.sin(i * 1.7) * 14;
      ctx.fillStyle = 'rgba(255, 222, 148, 0.72)';
      ctx.beginPath();
      ctx.arc(x, y, 2.5 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }

    // Crystal reflection lines on the Sea of Glass floor
    ctx.strokeStyle = 'rgba(124, 232, 255, 0.38)';
    ctx.lineWidth = 1.5;
    for (let r = 0; r < 8; r++) {
      const y = 235 + r * 20;
      ctx.beginPath();
      ctx.moveTo(60 + r * 12, y);
      ctx.lineTo(580 - r * 12, y);
      ctx.stroke();
    }

    // Caption banner at bottom marking the placeholder status transparently
    ctx.fillStyle = 'rgba(12, 18, 28, 0.78)';
    ctx.fillRect(0, 344, 640, 56);
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillText(title, 18, 368);
    ctx.fillStyle = '#9ec5ab';
    ctx.font = '12px ui-monospace, monospace';
    ctx.fillText('FLAG: DEC-07 · Painterly Canvas Preview (run scripts/link-approved-art.sh for sea-01 PNGs)', 18, 388);

    return canvas.toDataURL('image/png');
  }
}

export function createPainterlySkyDome(THREE, radius = 180) {
  const geo = new THREE.SphereGeometry(radius, 32, 24);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTopColor: { value: new THREE.Color('#0d1322') },
      uHorizonColor: { value: new THREE.Color('#2c4c6e') },
      uGroundColor: { value: new THREE.Color('#141c28') },
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
export function createSeaOfGlassMaterial(THREE = THREE_NS, deepHex = '#14334f', crystalHex = '#62d8ff', goldHex = '#ffe299') {
  const T = THREE && THREE.ShaderMaterial ? THREE : THREE_NS;
  return new T.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new T.Color(deepHex) },
      uCrystalColor: { value: new T.Color(crystalHex) },
      uGoldColor: { value: new T.Color(goldHex) },
      uGlassBlend: { value: 0.65 }
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
        vec3 base = mix(uDeepColor, uCrystalColor, uGlassBlend * 0.55);
        vec3 col = mix(base, uGoldColor, veins * 0.38);
        gl_FragColor = vec4(col, 0.88);
      }
    `
  });
}

const defaultPainterly = new PainterlyEngine(THREE_NS);

export function createPainterlyTexture(baseHex = '#2a3442', accentHex = '#5cd6ff') {
  return defaultPainterly.createBrushTexture(baseHex, accentHex, 'stone');
}

export function createSkyDome(topHex = '#0d1322', horizonHex = '#2c4c6e') {
  const mesh = createPainterlySkyDome(THREE_NS, 140);
  mesh.material.uniforms.uTopColor.value.set(topHex);
  mesh.material.uniforms.uHorizonColor.value.set(horizonHex);
  return mesh;
}

export function createPainterlyArtDataURL({ title = 'The Unseen Chord', subtitle = '' } = {}) {
  return defaultPainterly.createFlaggedSceneDataUrl(0, subtitle ? `${title} · ${subtitle}` : title);
}
