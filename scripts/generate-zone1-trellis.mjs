#!/usr/bin/env node
// ============================================================================
// THE NARROW WAY — Zone 1 TRELLIS Image-to-3D Relic Generator (Push-Free)
// Adapted from Pilgrim Walk's scripts/generate-trellis-3d.mjs
// with ALL git add/commit/push operations stripped out and output directed
// strictly into /Users/Timotheus/Desktop/Narrow Way Walk/assets/models/.
// Run in the morning (with internet access) after running scripts/link-approved-art.sh:
//   node scripts/generate-zone1-trellis.mjs
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MODELS_DIR = path.join(ROOT_DIR, 'assets', 'models');
const SPACE_ID = 'trellis-community/TRELLIS';

const ZONE1_TARGETS = [
  {
    id: 'aquamarine-tuning-stone',
    refImage: 'assets/art/sea-01-panel-04.png',
    outGlb: 'assets/models/aquamarine-tuning-stone.glb'
  },
  {
    id: 'davids-cypress-kinnor',
    refImage: 'assets/art/david.png',
    outGlb: 'assets/models/davids-cypress-kinnor.glb'
  },
  {
    id: 'mothers-cassette-player',
    refImage: 'assets/art/sea-01-panel-11.png',
    outGlb: 'assets/models/mothers-cassette-player.glb'
  }
];

async function main() {
  console.log('=== The Narrow Way (Zone 1) — TRELLIS 3D Relic Builder (No-Push Safe Mode) ===');
  let Client, handle_file;
  try {
    ({ Client, handle_file } = await import('@gradio/client'));
  } catch (err) {
    console.log('Note: @gradio/client not installed locally; offline procedural GLBs remain active.');
    return;
  }
  const app = await Client.connect(SPACE_ID);
  try {
    await app.predict('/start_session', []);
  } catch (_) {}

  for (const t of ZONE1_TARGETS) {
    const imgPath = path.join(ROOT_DIR, t.refImage);
    if (!fs.existsSync(imgPath)) {
      console.log(`Skipping ${t.id} (reference image ${t.refImage} not yet copied; run scripts/link-approved-art.sh first)`);
      continue;
    }
    console.log(`Generating 3D GLB for ${t.id} from ${t.refImage}...`);
    const buf = fs.readFileSync(imgPath);
    const blob = new Blob([buf], { type: 'image/png' });
    const pre = await app.predict('/preprocess_image', [handle_file(blob)]);
    const seedRes = await app.predict('/get_seed', [false, 42]);
    const seed = typeof seedRes?.data?.[0] === 'number' ? seedRes.data[0] : 42;
    await app.predict('/image_to_3d', [pre.data[0], [], seed, 7.5, 12, 3.0, 12, false, 'stochastic']);
    const glbRes = await app.predict('/extract_glb', [0.95, 1024]);
    const glbEntry = glbRes?.data?.[0] || glbRes?.data?.[1];
    const glbUrl = typeof glbEntry === 'string' ? glbEntry : glbEntry?.url;
    if (glbUrl) {
      const resp = await fetch(glbUrl);
      const outBuf = Buffer.from(await resp.arrayBuffer());
      fs.writeFileSync(path.join(ROOT_DIR, t.outGlb), outBuf);
      console.log(`Saved ${t.outGlb} (${(outBuf.length / 1024).toFixed(1)} KB)`);
    }
  }
  console.log('Done. Zero git pushes executed.');
}

main().catch((err) => {
  console.error('TRELLIS script note:', err.message);
});
