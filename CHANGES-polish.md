# Polish Pass — The Narrow Way Walk (Zone I)

**Date:** November 4, 2026  
**Backup Branch:** `backup-pre-polish-2026-11-04` (at commit `de3579a`)  
**Scope:** UI, presentation, and onboarding only. Zero changes to story text, KJV Scripture, stats, dice math, stage order, or the `NW1` save format (`narrow_way_walk_save_v1`).

---

## 1. Summary of Changes by Category

### 1.1 3D Labels (Top Priority)
- **Elias Companion Tag (`src/world.js`):** Removed the large permanent two-line `"Elias Cho / Companion · Walk Beside Him…"` billboard. Replaced it with a small, single-line pill name tag (`"Elias"`) above his head (`256×68` canvas, scale `1.65 × 0.44`), and offset Elias's follow position (`x - 1.75, z - 1.15`) so his tag never overlaps or covers the player avatar.
- **Proximity-Only Object Labels (`src/world.js`):** Replaced verbose 3D billboards on Stands, Wells, Treasures, Wisdom Pages, Relics, and Gateways with compact single-line labels via `getShortNodeLabel(node)` (`"Stand 1"`, `"Stand 2"`, `"Well 1"`, `"Treasure 1"`, `"Wisdom 1"`, `"Token"`, `"Relic 2"`, `"Relic 3"`, `"Stage 2 →"`, `"Treasure Gate"`).
- **One Label at a Time (Nearest Wins):** All object labels default to `visible = false`. In `WorldStageManager.update()`, only the single nearest node within interact range (`4.2m`) displays its label (`mon.userData.labelSprite.visible = (mon === nearestMon)`).

### 1.2 Controls & Onboarding
- **Dismissible Controls Hint Card (`index.html`, `src/main.js`):** Added `#controls-hint-card` on first load:
  - Desktop (`1280×800`): `"WASD / arrows to walk · drag to look · scroll to zoom · E or tap to interact"`
  - Phone (`390×844`): `"joystick to walk · tap to interact"`
  - Includes a `"Got it"` dismiss button (`#btn-dismiss-controls-hint`) that persists dismissal in `localStorage`.
- **How to Play Modal (`#guide-modal` via `?` button `#btn-nav-help`):** Clicking `?` in the top navigation opens a structured How to Play guide covering:
  1. **Movement & Camera** (WASD/arrows, drag-to-orbit, scroll-to-zoom `3m–9m`, `E` or tap to interact)
  2. **Stands & Dice** (2d6 + Favor + bonuses vs. Stronghold target, Victory Law floor)
  3. **Courage, Strength & Favor** (what each stat does and how Favor Tests halve losses)
  4. **Oil, Bread & Scrolls** (lamp illumination, +2 Strength restoration, +1 permanently to all rolls per Wisdom Page)
  5. **Treasure (Give vs. Keep)** (Give for +1 Favor & +2 Courage; Keep for +1 die bonus on the next Stand)
  6. **Wells of Grace** (once-per-stage restoration of Courage, Strength, and Oil)
- **First-Time Stronghold Definition (`#stand-stronghold-def`):** Displayed the first time a Stand opens:  
  *"Stronghold: A Stronghold is a spiritual lie or habit you stand against with God's Word."*
- **Stand 1 Pre-Roll 3-Step Coach Tip (`#stand-coach-tip`):** Displayed before Stand 1's first roll:
  1. **Read the Lie & KJV Anchor** above to see the target number (`7+`).
  2. **Optional Prep:** Use a Scroll or Bread if needed, or click **Roll 2d6 — Stand Firm**.
  3. **Victory Law:** Even on a miss, your Resistance rises by `+1`—hold fast until the Stronghold breaks!

### 1.3 Leftover Dev Text Removed
- **Stand 4 Title (`src/zone1-data.js`):** Renamed `"Stand 4 · The Back-Room Boast at Hannam-dong (RIGGED BAIT)"` to `"Stand 4 · The Back-Room Boast at Hannam-dong"`, and cleaned `"WISDOM NOTICE:"` to `"Discernment Note:"`.
- **Zero Dev Tags Across Codebase:** Stripped all occurrences of `FLAG`, `DEC-`, `OPEN-`, `placeholder`, and `TODO` across `index.html`, `src/*.js`, `assets/models/relics-manifest.json`, and `scripts/*`.
- **Gatehouse Shop Link (`index.html`, `src/zone1-data.js`, `src/main.js`):** Hid `#gatehouse-book-link` cleanly when `WORLD_CONFIG.gatehouseBook1Url` is empty so no dead `#gatehouse-book-01-placeholder` link appears.

### 1.4 Images & Preloading (`src/painterly.js`, `assets.md`)
- **Startup Preloader (`preloadAllZone1Art()`):** Preloads all 15 approved artwork files at startup into an in-memory `IMAGE_CACHE`.
- **Reserved 16:9 Aspect Ratio & Soft Loading State (`.modal-art-frame`):** Every modal artwork container reserves a fixed `16:9` aspect ratio (`aspect-ratio: 16 / 9`) with a soft gradient and CSS spinner (`.is-loading`) until the image resolves—never showing a broken-image icon or causing layout jumps.
- **Distinct Art per Stand & Well:**
  - **Well 1 (`well_1`)** now displays `assets/art/sea-01-panel-04.png` (King David on the Sea of Glass with his Aquamarine harp)—it no longer reuses Mr. Park's alley image (`sea-01-panel-06.png`).
  - **Stand 1 (`stand_1`, Pride #15 — The Applause Echo)** now displays a dedicated gilded VIP lounge fractured-mirror scene study (`motif: 'mirror'`)—it no longer reuses Mr. Park's alley image (`sea-01-panel-06.png`).
  - **Stand 2 (`stand_2`, Fear of Man #29 — Mr. Park's Ultimatum)** exclusively uses `assets/art/sea-01-panel-06.png`.
  - Every image, Stand, Well, Treasure, Wisdom Page, and 3D Relic is cataloged in [`assets.md`](file:///Users/Timotheus/Desktop/Narrow%20Way%20Walk/assets.md).

### 1.5 Stand Modal Layout (`index.html`, `src/main.js`)
- **Fixed Modal Height & Anchored Roll Button (`.stand-card-fixed`, `.stand-bottom-actions`):**
  - `#stand-combat-log` scrolls inside a fixed-height box (`height: 120px; min-height: 120px; max-height: 120px; overflow-y: auto`).
  - `.stand-bottom-actions` uses a fixed 4-column CSS Grid where `#btn-stand-roll` spans the top row at a locked height, keeping the Roll button at the exact same pixel coordinates before rolling and across Rounds 1, 2, and 3 on both desktop (`1280×800`: `{top: 679, left: 283}`) and phone (`390×844`: `{top: 717, left: 37}`).

### 1.6 Camera & World (`src/world.js`, `src/main.js`)
- **Camera Zoom Clamp:** Added mouse-wheel zoom clamping `cameraDistance` between **`3.0m` minimum** and **`9.0m` maximum** (default **`4.6m`**), preventing the camera from clipping closer than `3m` to Elias/the player.
- **Brightened Painterly Lighting Pass:** Added `HemisphereLight(0xe0f2fe, 0x3b2f26, 1.55)`, warm `AmbientLight(0xfffbeb, 0.9)`, golden key `DirectionalLight(0xffe8b3, 2.25)`, aquamarine rim light, lighter exponential fog (`0.0115`), warm street lamps (`addWarmStreetLamps()`) with glowing lanterns and point lights, and Seoul neon accents while preserving the Eco Mode fallback.
- **Zero `ReadPixels` GPU Stall:** All 3D picking uses event-driven `THREE.Raycaster` on `pointerup` only—zero per-frame `gl.readPixels` calls and zero WebGL console warnings.

### 1.7 Nice-to-Have Additions Implemented
- **Title Screen with Start / Continue (`#welcome-modal`):** Shows **Continue Walk (Stage X)** when a saved walk exists alongside **Start Walk**.
- **Stage Progress Indicator (`#hud-stage-progress`):** Displays `"Stage 1 of 6"` through `"Stage 6 of 6"` in the top HUD bar.
- **End-of-Stage Card (`#stage-complete-modal`):** Appears upon completing a stage with a summary, a button to open Book 1 / Gatehouse details, and a button to proceed to the next stage.

---

## 2. Verification Results

### 2.1 Automated Canon & DOM Verifier
Ran `node scripts/verify-zone1.mjs`:
- **Result:** `ALL ZONE 1 VERIFICATION CHECKS PASSED (100%).` (`148` DOM bindings verified, all 6 stages, 8 Stands, 8 Treasures, 7 Wisdom Pages, 5 Wells, and NW1 save/load round-trip intact).

### 2.2 Zero Dev Tags Grep Check
Ran:
```bash
grep -rnE "FLAG|DEC-|OPEN-|placeholder|TODO|RIGGED BAIT|WISDOM NOTICE" index.html src/ assets/models/relics-manifest.json scripts/
```
- **Result:** `0` matches.

### 2.3 Roll Button Pixel Stability Across 3 Consecutive Rolls
Measured `#btn-stand-roll.getBoundingClientRect()` before rolling (`r0`) and after 3 consecutive rolls (`r1`, `r2`, `r3`):
- **Desktop (`1280×800`):**
  - `r0`: `{ top: 679, left: 283, width: 574, height: 39 }`
  - `r1`: `{ top: 679, left: 283, width: 574, height: 39 }`
  - `r2`: `{ top: 679, left: 283, width: 574, height: 39 }`
  - `r3`: `{ top: 679, left: 283, width: 574, height: 39 }`
- **Phone (`390×844`):**
  - `r0`: `{ top: 717, left: 37, width: 316, height: 39 }`
  - `r1`: `{ top: 717, left: 37, width: 316, height: 39 }`
  - `r2`: `{ top: 717, left: 37, width: 316, height: 39 }`
  - `r3`: `{ top: 717, left: 37, width: 316, height: 39 }`

---

## 3. Before & After Screenshots

All screenshots are saved in [`screenshots/`](file:///Users/Timotheus/Desktop/Narrow%20Way%20Walk/screenshots/).

### 3.1 Title Screen (`1280×800`)
| Before | After (with Start / Continue & Preloaded Cover Art) |
| --- | --- |
| ![Before Welcome](screenshots/before-welcome-1280x800.png) | ![After Title Screen](screenshots/after-title-screen-1280x800.png) |

### 3.2 First View, `"Elias"` Tag, Brightened World & Controls Hint Card (`1280×800` & `390×844`)
| Before (`1280×800`) | After (`1280×800`) | After Phone (`390×844`) |
| --- | --- | --- |
| ![Before First View](screenshots/before-first-view-1280x800.png) | ![After First View & Hint](screenshots/after-first-view-hint-1280x800.png) | ![After Phone First View](screenshots/after-phone-first-view-390x844.png) |

### 3.3 Proximity Object Labels Near Well 1 (`1280×800` & `390×844`)
| Before (Cluttered Multi-Line Billboards) | After (`1280×800` — Nearest Short Label `"Well 1"` Only) | After Phone (`390×844`) |
| --- | --- | --- |
| ![Before Labels Well 1](screenshots/before-labels-well1-1280x800.png) | ![After Labels Well 1](screenshots/after-labels-well1-1280x800.png) | ![After Phone Labels Well 1](screenshots/after-phone-labels-well1-390x844.png) |

### 3.4 Stand 1 Modal — Distinct VIP Mirror Art, Coach Tip & Fixed Roll Button Across 3 Rolls
| Before Stand 1 (Reused Alley Image + Unanchored Roll Button) | After Stand 1 (First Open: Stronghold Def + 3-Step Coach Tip) | After 3 Rolls (`1280×800` — Roll Button Locked at `y=679`) | After 3 Rolls Phone (`390×844` — Roll Button Locked at `y=717`) |
| --- | --- | --- | --- |
| ![Before Stand 1](screenshots/before-stand1-1280x800.png) | ![After Stand 1 Coach](screenshots/after-stand1-coach-1280x800.png) | ![After Stand 3 Rolls](screenshots/after-stand-3rolls-1280x800.png) | ![After Phone Stand 3 Rolls](screenshots/after-phone-stand-3rolls-390x844.png) |

### 3.5 Well 1 Modal — Distinct Sea of Glass Artwork (`sea-01-panel-04.png`)
| Before Well 1 (Reused Mr. Park Alley Image) | After Well 1 (`1280×800` — Sea of Glass Harp Art) | After Well 1 Phone (`390×844`) |
| --- | --- | --- |
| ![Before Well 1 Modal](screenshots/before-well1-modal-1280x800.png) | ![After Well 1 Modal](screenshots/after-well1-modal-1280x800.png) | ![After Phone Well 1 Modal](screenshots/after-phone-well1-modal-390x844.png) |

### 3.6 How to Play Modal (`?` Button), Stand 4 Clean Title & End-of-Stage Card
| How to Play Modal (`#guide-modal`) | Stand 4 Clean Player Title (No `(RIGGED BAIT)`) | End-of-Stage Card (`#stage-complete-modal`) |
| --- | --- | --- |
| ![How to Play](screenshots/after-how-to-play-1280x800.png) | ![Stand 4 Clean Title](screenshots/after-stand4-title-1280x800.png) | ![Stage Complete Card](screenshots/after-stage-complete-1280x800.png) |
