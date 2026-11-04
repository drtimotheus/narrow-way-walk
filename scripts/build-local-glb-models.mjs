#!/usr/bin/env node
// ============================================================================
// THE NARROW WAY — Zone 1 Local Binary glTF 2.0 (.glb) Relic Builder
// FLAG: DEC-06 — Generates valid, compact binary .glb 3D models for Zone 1's
// Mentor's Token ("David's Aquamarine Tuning-Stone", Sec. 48) and companion
// Zone 1 relics so GLTFLoader + MeshoptDecoder and the 3D Relic Workshop
// Turntable Inspector work 100% offline with zero external network calls.
// For HuggingFace TRELLIS image-to-3D generation from Timothy's art/sea-01/
// paintings outside the sandbox, see scripts/generate-zone1-trellis.mjs.
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MODELS_DIR = path.join(ROOT_DIR, 'assets', 'models');

fs.mkdirSync(MODELS_DIR, { recursive: true });

// Helper: build an indexed triangle mesh part with vertex colors and normals
function createMeshBuilder() {
  const positions = [];
  const normals = [];
  const colors = [];
  const indices = [];

  function addVertex(x, y, z, nx, ny, nz, r, g, b) {
    const idx = positions.length / 3;
    positions.push(x, y, z);
    const len = Math.hypot(nx, ny, nz) || 1;
    normals.push(nx / len, ny / len, nz / len);
    colors.push(r, g, b);
    return idx;
  }

  function addTri(i0, i1, i2) {
    indices.push(i0, i1, i2);
  }

  function addQuad(i0, i1, i2, i3) {
    indices.push(i0, i1, i2, i0, i2, i3);
  }

  // Add a faceted bipyramid / crystal prism
  function addCrystalGem(cx, cy, cz, rx, ry, rz, sides, colTop, colMid, colBot) {
    const topIdx = addVertex(cx, cy + ry, cz, 0, 1, 0, ...colTop);
    const botIdx = addVertex(cx, cy - ry, cz, 0, -1, 0, ...colBot);
    const upperRing = [];
    const lowerRing = [];
    for (let s = 0; s < sides; s++) {
      const a = (s / sides) * Math.PI * 2;
      const nx = Math.cos(a);
      const nz = Math.sin(a);
      upperRing.push(
        addVertex(
          cx + nx * rx,
          cy + ry * 0.28,
          cz + nz * rz,
          nx,
          0.35,
          nz,
          ...colMid
        )
      );
      lowerRing.push(
        addVertex(
          cx + nx * rx * 0.92,
          cy - ry * 0.28,
          cz + nz * rz * 0.92,
          nx,
          -0.35,
          nz,
          ...colMid
        )
      );
    }
    for (let s = 0; s < sides; s++) {
      const next = (s + 1) % sides;
      addTri(topIdx, upperRing[next], upperRing[s]);
      addQuad(upperRing[s], upperRing[next], lowerRing[next], lowerRing[s]);
      addTri(botIdx, lowerRing[s], lowerRing[next]);
    }
  }

  // Add a cylinder / ring segment
  function addCylinder(cx, cy, cz, rTop, rBot, height, segs, col) {
    const half = height * 0.5;
    const topCenter = addVertex(cx, cy + half, cz, 0, 1, 0, ...col);
    const botCenter = addVertex(cx, cy - half, cz, 0, -1, 0, ...col);
    const topRing = [];
    const botRing = [];
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const nx = Math.cos(a);
      const nz = Math.sin(a);
      topRing.push(addVertex(cx + nx * rTop, cy + half, cz + nz * rTop, nx, 0.15, nz, ...col));
      botRing.push(addVertex(cx + nx * rBot, cy - half, cz + nz * rBot, nx, -0.15, nz, ...col));
    }
    for (let i = 0; i < segs; i++) {
      const next = (i + 1) % segs;
      addTri(topCenter, topRing[next], topRing[i]);
      addQuad(topRing[i], topRing[next], botRing[next], botRing[i]);
      addTri(botCenter, botRing[i], botRing[next]);
    }
  }

  // Add a box with vertex normals & color
  function addBox(cx, cy, cz, sx, sy, sz, col) {
    const hx = sx * 0.5;
    const hy = sy * 0.5;
    const hz = sz * 0.5;
    const faces = [
      { n: [0, 0, 1], v: [[-hx, -hy, hz], [hx, -hy, hz], [hx, hy, hz], [-hx, hy, hz]] },
      { n: [0, 0, -1], v: [[hx, -hy, -hz], [-hx, -hy, -hz], [-hx, hy, -hz], [hx, hy, -hz]] },
      { n: [0, 1, 0], v: [[-hx, hy, hz], [hx, hy, hz], [hx, hy, -hz], [-hx, hy, -hz]] },
      { n: [0, -1, 0], v: [[-hx, -hy, -hz], [hx, -hy, -hz], [hx, -hy, hz], [-hx, -hy, hz]] },
      { n: [1, 0, 0], v: [[hx, -hy, hz], [hx, -hy, -hz], [hx, hy, -hz], [hx, hy, hz]] },
      { n: [-1, 0, 0], v: [[-hx, -hy, -hz], [-hx, -hy, hz], [-hx, hy, hz], [-hx, hy, -hz]] }
    ];
    for (const f of faces) {
      const i0 = addVertex(cx + f.v[0][0], cy + f.v[0][1], cz + f.v[0][2], ...f.n, ...col);
      const i1 = addVertex(cx + f.v[1][0], cy + f.v[1][1], cz + f.v[1][2], ...f.n, ...col);
      const i2 = addVertex(cx + f.v[2][0], cy + f.v[2][1], cz + f.v[2][2], ...f.n, ...col);
      const i3 = addVertex(cx + f.v[3][0], cy + f.v[3][1], cz + f.v[3][2], ...f.n, ...col);
      addQuad(i0, i1, i2, i3);
    }
  }

  function toGlbBuffer(materialConfig = {}) {
    const posArr = new Float32Array(positions);
    const normArr = new Float32Array(normals);
    const colArr = new Float32Array(colors);
    const idxArr = new Uint16Array(indices);

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < posArr.length; i += 3) {
      const x = posArr[i], y = posArr[i + 1], z = posArr[i + 2];
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }

    const posBuf = Buffer.from(posArr.buffer);
    const normBuf = Buffer.from(normArr.buffer);
    const colBuf = Buffer.from(colArr.buffer);
    let idxBuf = Buffer.from(idxArr.buffer);
    if (idxBuf.length % 4 !== 0) {
      idxBuf = Buffer.concat([idxBuf, Buffer.alloc(4 - (idxBuf.length % 4))]);
    }

    const binChunkData = Buffer.concat([posBuf, normBuf, colBuf, idxBuf]);
    const oPos = 0;
    const oNorm = posBuf.length;
    const oCol = oNorm + normBuf.length;
    const oIdx = oCol + colBuf.length;

    const vCount = posArr.length / 3;
    const gltf = {
      asset: { version: '2.0', generator: 'NarrowWayWalk-RelicBuilder-1.0' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ name: materialConfig.name || 'RelicNode', mesh: 0 }],
      materials: [
        {
          name: materialConfig.matName || 'RelicPainterlyMaterial',
          pbrMetallicRoughness: {
            baseColorFactor: materialConfig.baseColorFactor || [1, 1, 1, 1],
            metallicFactor: materialConfig.metallicFactor ?? 0.18,
            roughnessFactor: materialConfig.roughnessFactor ?? 0.35
          },
          emissiveFactor: materialConfig.emissiveFactor || [0.06, 0.14, 0.22]
        }
      ],
      meshes: [
        {
          name: materialConfig.name || 'RelicMesh',
          primitives: [
            {
              attributes: { POSITION: 0, NORMAL: 1, COLOR_0: 2 },
              indices: 3,
              material: 0
            }
          ]
        }
      ],
      buffers: [{ byteLength: binChunkData.length }],
      bufferViews: [
        { buffer: 0, byteOffset: oPos, byteLength: posBuf.length, target: 34962 },
        { buffer: 0, byteOffset: oNorm, byteLength: normBuf.length, target: 34962 },
        { buffer: 0, byteOffset: oCol, byteLength: colBuf.length, target: 34962 },
        { buffer: 0, byteOffset: oIdx, byteLength: idxArr.byteLength, target: 34963 }
      ],
      accessors: [
        {
          bufferView: 0,
          componentType: 5126,
          count: vCount,
          type: 'VEC3',
          min: [Number(minX.toFixed(5)), Number(minY.toFixed(5)), Number(minZ.toFixed(5))],
          max: [Number(maxX.toFixed(5)), Number(maxY.toFixed(5)), Number(maxZ.toFixed(5))]
        },
        { bufferView: 1, componentType: 5126, count: vCount, type: 'VEC3' },
        { bufferView: 2, componentType: 5126, count: vCount, type: 'VEC3' },
        { bufferView: 3, componentType: 5123, count: idxArr.length, type: 'SCALAR' }
      ]
    };

    let jsonBuf = Buffer.from(JSON.stringify(gltf), 'utf8');
    if (jsonBuf.length % 4 !== 0) {
      jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc(4 - (jsonBuf.length % 4), 0x20)]);
    }

    const totalLength = 12 + 8 + jsonBuf.length + 8 + binChunkData.length;
    const header = Buffer.alloc(12);
    header.writeUInt32LE(0x46546C67, 0); // 'glTF'
    header.writeUInt32LE(2, 4);          // version 2
    header.writeUInt32LE(totalLength, 8);

    const jsonHeader = Buffer.alloc(8);
    jsonHeader.writeUInt32LE(jsonBuf.length, 0);
    jsonHeader.writeUInt32LE(0x4E4F534A, 4); // 'JSON'

    const binHeader = Buffer.alloc(8);
    binHeader.writeUInt32LE(binChunkData.length, 0);
    binHeader.writeUInt32LE(0x004E4942, 4); // 'BIN\0'

    return Buffer.concat([header, jsonHeader, jsonBuf, binHeader, binChunkData]);
  }

  return { addCrystalGem, addCylinder, addBox, toGlbBuffer };
}

// 1. Build Relic #1 (Mentor's Token): David's Aquamarine Tuning-Stone (Sec. 48)
function buildAquamarineTuningStone() {
  const b = createMeshBuilder();
  const cypressWood = [0.46, 0.31, 0.19];
  const goldTrim = [0.88, 0.72, 0.36];
  const aquaTop = [0.68, 0.94, 1.0];
  const aquaMid = [0.28, 0.78, 0.96];
  const aquaDeep = [0.12, 0.48, 0.75];

  // Carved cypress-wood harp-frame cradle base
  b.addCylinder(0, -0.42, 0, 0.56, 0.64, 0.18, 24, cypressWood);
  b.addCylinder(0, -0.28, 0, 0.46, 0.52, 0.10, 24, goldTrim);

  // Two curved cypress yoke arms embracing the stone
  for (const side of [-1, 1]) {
    b.addCylinder(side * 0.44, 0.02, 0, 0.06, 0.08, 0.58, 12, cypressWood);
    b.addCylinder(side * 0.40, 0.32, 0, 0.07, 0.06, 0.12, 12, goldTrim);
  }
  // Golden tuning crossbar above the stone
  b.addCylinder(0, 0.38, 0, 0.04, 0.04, 0.06, 12, goldTrim);
  b.addBox(0, 0.38, 0, 0.88, 0.065, 0.065, goldTrim);

  // Translucent sky-blue Aquamarine Tuning-Stone centerpiece (faceted 12-sided gem)
  b.addCrystalGem(0, 0.04, 0, 0.34, 0.44, 0.24, 12, aquaTop, aquaMid, aquaDeep);
  // Inner glowing core facet
  b.addCrystalGem(0, 0.04, 0, 0.18, 0.26, 0.14, 8, [0.88, 0.98, 1.0], aquaTop, aquaMid);

  return b.toGlbBuffer({
    name: 'AquamarineTuningStone',
    matName: 'AquamarineStoneMat',
    metallicFactor: 0.22,
    roughnessFactor: 0.24,
    emissiveFactor: [0.10, 0.26, 0.38]
  });
}

// 2. Build Relic #2: David's Crownless Cypress Harp / Kinnor with One Snapped String (Sec. 43-48, Entry #16)
function buildDavidsCypressKinnor() {
  const b = createMeshBuilder();
  const cypress = [0.48, 0.32, 0.18];
  const darkWood = [0.34, 0.22, 0.12];
  const gold = [0.86, 0.69, 0.34];
  const aqua = [0.32, 0.84, 0.98];
  const stringGold = [0.95, 0.86, 0.58];

  // Soundbox at bottom
  b.addBox(0, -0.44, 0, 0.76, 0.32, 0.20, cypress);
  b.addBox(0, -0.26, 0, 0.80, 0.06, 0.22, darkWood);

  // Inlaid sky-blue Aquamarine gemstone in the center of the soundbox
  b.addCrystalGem(0, -0.42, 0.11, 0.12, 0.15, 0.07, 10, [0.75, 0.96, 1.0], aqua, [0.14, 0.52, 0.78]);

  // Left & Right cypress arms rising to the yoke
  b.addCylinder(-0.34, 0.12, 0, 0.055, 0.07, 0.82, 14, cypress);
  b.addCylinder(0.34, 0.12, 0, 0.055, 0.07, 0.82, 14, cypress);

  // Top cypress yoke bar
  b.addBox(0, 0.52, 0, 0.86, 0.08, 0.09, darkWood);

  // 9 intact golden strings + 1 snapped string (Canon Entry #16 & Sec. 48)
  for (let i = 0; i < 10; i++) {
    const x = -0.25 + (i / 9) * 0.50;
    if (i === 7) {
      // Snapped 8th string (broken lower half curled near soundbox)
      b.addCylinder(x, -0.12, 0, 0.009, 0.009, 0.28, 6, [0.75, 0.62, 0.42]);
    } else {
      b.addCylinder(x, 0.13, 0, 0.008, 0.008, 0.76, 6, stringGold);
    }
  }

  return b.toGlbBuffer({
    name: 'DavidsCypressKinnor',
    matName: 'KinnorPainterlyMat',
    metallicFactor: 0.18,
    roughnessFactor: 0.38,
    emissiveFactor: [0.06, 0.16, 0.24]
  });
}

// 3. Build Relic #3: Mother's Taped Portable Cassette Player & Four-Note Slip (Sec. 18, 93, 282)
function buildMothersCassettePlayer() {
  const b = createMeshBuilder();
  const charcoal = [0.22, 0.24, 0.28];
  const silver = [0.74, 0.76, 0.80];
  const tapeAmber = [0.84, 0.68, 0.38];
  const paperCream = [0.95, 0.91, 0.82];

  // Pedestal base
  b.addCylinder(0, -0.45, 0, 0.54, 0.60, 0.12, 24, [0.36, 0.29, 0.22]);
  // Portable cassette body
  b.addBox(0, -0.04, 0, 0.74, 0.52, 0.22, charcoal);
  // Cassette window & two spindles
  b.addBox(0, -0.02, 0.115, 0.46, 0.26, 0.02, silver);
  b.addCylinder(-0.12, -0.02, 0.13, 0.055, 0.055, 0.03, 12, charcoal);
  b.addCylinder(0.12, -0.02, 0.13, 0.055, 0.055, 0.03, 12, charcoal);
  // Masking-tape strip holding the broken door shut (Sec. 93)
  b.addBox(0.16, 0.06, 0.125, 0.28, 0.06, 0.015, tapeAmber);
  // Top buttons (Play / Stop / Rewind)
  for (let i = 0; i < 4; i++) {
    b.addBox(-0.22 + i * 0.11, 0.26, 0, 0.08, 0.07, 0.12, silver);
  }
  // Folded slip of paper with the 4 unfinished notes resting beside it
  b.addBox(0.08, -0.36, 0.24, 0.42, 0.02, 0.28, paperCream);

  return b.toGlbBuffer({
    name: 'MothersCassettePlayer',
    matName: 'CassettePainterlyMat',
    metallicFactor: 0.15,
    roughnessFactor: 0.45,
    emissiveFactor: [0.08, 0.07, 0.05]
  });
}

const relics = [
  {
    id: 'aquamarine-tuning-stone',
    slot: 1,
    isMentorToken: true,
    title: "David's Aquamarine Tuning-Stone (Mentor's Token)",
    zone: 'Zone I · Book 1: The Unseen Chord',
    sectionRef: 'Section 48 (Well 1 — The Curb on the Sea of Glass)',
    kjvRef: 'Proverbs 16:18–19; Isaiah 11:2 (KJV)',
    file: 'assets/models/aquamarine-tuning-stone.glb',
    pipelineBadge: 'FLAG: DEC-06 · Local Procedural GLB (TRELLIS script ready in scripts/)',
    description:
      "A smooth, translucent sky-blue Aquamarine stone cut from the cypress frame of King David's own harp (Light Blue — Spirit of Might, Isaiah 11:2). Given at Well 1 (Sec. 48). Once per book: treat your 2d6 Stand roll as an automatic 10, OR pass one Favor Test as Blessed without losing Favor, OR hear which learned KJV Scroll resonates against a Stronghold.",
    buf: buildAquamarineTuningStone()
  },
  {
    id: 'davids-cypress-kinnor',
    slot: 2,
    isMentorToken: false,
    title: "David's Crownless Cypress Harp (Kinnor)",
    zone: 'Zone I · Book 1: The Unseen Chord',
    sectionRef: 'Sections 43–48 & 277 (The Sea of Glass)',
    kjvRef: 'Psalm 51:17; 2 Samuel 12:20 (KJV)',
    file: 'assets/models/davids-cypress-kinnor.glb',
    pipelineBadge: 'FLAG: DEC-06 · Local Procedural GLB (TRELLIS script ready in scripts/)',
    description:
      "The weathered ten-stringed Bethlehem cypress kinnor inlaid with an Aquamarine stone and carrying one snapped string from the day David shielded his brother in the dust and left his royal circlet on the ground. 'The sacrifices of God are a broken spirit: a broken and a contrite heart, O God, thou wilt not despise.' (Psalm 51:17 KJV)",
    buf: buildDavidsCypressKinnor()
  },
  {
    id: 'mothers-cassette-player',
    slot: 3,
    isMentorToken: false,
    title: "Mother's Taped Portable Cassette Player & Four-Note Slip",
    zone: 'Zone I · Book 1: The Unseen Chord',
    sectionRef: 'Sections 18, 77, 93, 129, 282 & 300',
    kjvRef: 'Isaiah 53:4; Isaiah 61:3 (KJV)',
    file: 'assets/models/mothers-cassette-player.glb',
    pipelineBadge: 'FLAG: DEC-06 · Local Procedural GLB (TRELLIS script ready in scripts/)',
    description:
      "Grace Mi-ran Cho's old portable tape player, its plastic door taped shut since the month before she entered the hospital two years ago, alongside the crumpled paper bearing the four unpolished, unproduced notes that Elias, Adaeze, Brother Matthias, Talia, and the Fellow-Traveler hum on the floor of the Sea of Glass to dissolve Heaviness (#20).",
    buf: buildMothersCassettePlayer()
  }
];

let totalBytes = 0;
const manifestModels = [];
for (const r of relics) {
  const outPath = path.join(ROOT_DIR, r.file);
  fs.writeFileSync(outPath, r.buf);
  totalBytes += r.buf.length;
  const { buf, ...meta } = r;
  manifestModels.push({ ...meta, bytes: buf.length });
  console.log(`Wrote ${r.file} (${(buf.length / 1024).toFixed(1)} KB)`);
}

const manifestPath = path.join(MODELS_DIR, 'relics-manifest.json');
fs.writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      version: 1,
      world: 'The Narrow Way — Zone 1 Pilot',
      generatedAt: new Date().toISOString(),
      totalBytes,
      models: manifestModels
    },
    null,
    2
  )
);
console.log(`Wrote ${manifestPath} (Total GLB weight: ${(totalBytes / 1024).toFixed(1)} KB)`);
