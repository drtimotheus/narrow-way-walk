# Fix Pass 3 — The Narrow Way Walk (Zone I: Elias Cho & The Unseen Chord)

**Date:** November 4, 2026  
**Workspace:** `/Users/Timotheus/Desktop/Narrow Way Walk`  
**Backup Branch:** `backup-pre-pass3-2026-11-04` (at commit `4e25d2b`)  
**Status:** Tested & Verified Locally at `1280×800` — **Waiting for Approval Before Deploying or Pushing**

---

## 1. Stage Gating & Ending Progress Enforcement (Top Priority)

- **Stage Chips (`#stage-tabs`) & `"Walk Forward"` Portals (`node.type === 'portal'`):**
  - Advancing to Stage `N` now requires every Stand in Stages `1 .. N-1` to be cleared (`isStageUnlocked(idx)` and `isStageCleared(idx)` in [`src/main.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/main.js)).
  - Completed stages show a `✓` badge (`✓ 1. The 2,000-Seat Venue & Loading Bay Rain`) and remain freely replayable at any time.
  - Locked stage chips display a lock icon (`🔒`) and a tooltip (`title` + `data-tooltip` + `.tooltip-active` popup + `#gating-toast` status banner) stating the exact Stand(s) remaining (e.g., `"Locked — Clear Stand 1 · The Applause Echo in Stage 1 first"` or `"Locked — Clear Stand 4 · The Back-Room Boast at Hannam-dong in Stage 3 first"`).
- **Stage `"Completed"` Card (`#stage-complete-modal`):**
  - `openStageCompleteModal()` now checks `isStageCleared(state.currentStageIdx)` and appears **only** when all required Stands in the current stage are cleared.
- **Treasure Gate / Ending (`node.type === 'gatehouse_finale'`, `triggerEndingSequence()`, `openFinaleModal()`):**
  - Requires all 8 canonical Stands (`stand_1` through `stand_8`) to be cleared (`areAllRequiredStandsCleared()`).
  - Once all 8 Stands are cleared, Treasure count selects the canonical *Book 1: The Unseen Chord* ending per Sections `298 / 299 / 300`:
    - **`0–3 Treasure`** → **Section 299 · The Good Ending — The Honest Recovery Road** (`ENDINGS.good_ending`, `sea-01-panel-96.png`).
    - **`4–8 Treasure`** → **Section 300 · The True Ending — The Unseen Chord** (`ENDINGS.true_ending`, `sea-01-panel-100.png`).
- **Old Saves That Skipped Stages (`sanitizeProgressGating()`):**
  - On `loadState()` and `restoreFromNW1Code()`, any save whose `currentStageIdx` or `zone1Completed` flag is ahead of its cleared Stands is automatically clamped to `getHighestUnlockedStageIdx()` and uncleared stages are re-locked cleanly without crashing.

---

## 2. Leftover Dev Text Removal & Dedicated Painted Panels

- **Zero Dev Text:**
  - Removed `"Illustrated Scene Study · Painted Panel Listed in assets.md"` and all fallback dev captions from [`src/painterly.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/painterly.js) and [`index.html`](file:///Users/Timotheus/Desktop/Narrow Way Walk/index.html).
  - Full-build grep across `index.html`, `src/`, `assets/models/relics-manifest.json`, and `scripts/` for `assets.md`, `Scene Study`, `Listed in`, `FLAG`, `DEC-`, `OPEN-`, `placeholder`, `TODO` returns **0 matches**.
- **Dedicated Painted Art for Every Stage, Stand, Well, Treasure, Wisdom Page & Ending (Zero Reuse Within Any Stage):**
  - Linked 38 canonical painted panels from *Book 1: The Unseen Chord* into `assets/art/` via [`scripts/link-approved-art.sh`](file:///Users/Timotheus/Desktop/Narrow Way Walk/scripts/link-approved-art.sh) and wired them in [`src/painterly.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/painterly.js) and [`assets.md`](file:///Users/Timotheus/Desktop/Narrow Way Walk/assets.md):
    - **Stand 1 (`The Applause Echo`):** `assets/art/sea-01-panel-53.png` (Backstage lighted dressing-room mirror with guitar)
    - **Stand 2 (`The Patient Whisper`):** `assets/art/sea-01-panel-08.png` (Alley dumpsters thinning into the Sea of Glass — no longer reuses Mr. Park's alley image `sea-01-panel-06.png`)
    - **Stand 3 (`The Comparison Lens`):** `assets/art/sea-01-panel-30.png` (Elias staring at viral clips & chart numbers in the practice room)
    - **Stand 4 (`The Back-Room Boast at Hannam-dong`):** `assets/art/sea-01-panel-38.png` (Elias stopping outside Tae-yang's back-room door in Hannam-dong)
    - **Stand 5 (`The Curated Sorrow`):** `assets/art/sea-01-panel-52.png` (Weeping openly beside Yuna at Hall C)
    - **Stand 6 (`The Iron Collar of Burnout`):** `assets/art/sea-01-panel-43.png` (The heavy shadow of exhaustion before Chuseok)
    - **Stand 7 (`The Mirror-Guard of Pride`):** `assets/art/sea-01-panel-66.png` (Lowering the PR script at the youth room microphone)
    - **Stand 8 (`The Obsidian Crown of Pride & The Fig-Leaf Door of Shame`):** `assets/art/sea-01-panel-81.png` (Shattering stronghold on the Sea of Glass — no longer reuses Stage V's `sea-01-panel-74.png`)
- **Gatehouse Banner Fix (`#gatehouse-modal`):**
  - Fixed `loadArtIntoImage()` in [`src/painterly.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/painterly.js) so `onload` attaches directly to each `<img>` element instead of overwriting `probe.onload` on a shared preload cache entry, and set the Gatehouse top banner to `assets/art/sea-01-panel-98.png` (wide painting of David, Daniel, Paul, and Esther on the Sea of Glass) alongside the Book 1 cover thumbnail (`assets/art/sea-01-cover-preview.jpg`).

---

## 3. Real Title Screen (`#title-modal`)

- Added `#title-modal` in [`index.html`](file:///Users/Timotheus/Desktop/Narrow Way Walk/index.html) and `openTitleModal()` in [`src/main.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/main.js) before the intro/stats modal (`#welcome-modal`):
  - Displays the game title (**The Narrow Way Walk**), subtitle (**Zone I · Book 1: The Unseen Chord**), and full Book 1 cover art (`assets/art/sea-01-cover-preview.jpg`).
  - **Fresh Save:** Shows **Start Walk →** (which opens the intro/stats modal).
  - **When a Save Exists:** Shows saved progress summary (`Saved Walk Found: Stage X of 6 · Stands Cleared: Y/8 · Treasure: Z`), **Continue Walk (Stage X of 6) →**, **Start / Roll Stats →**, and **Reset Walk** with an explicit confirmation prompt (`"Reset your saved walk and start fresh from Stage I?"` → **Yes, Reset Walk** / **Cancel**).

---

## 4. Stand 3 + Stand Text, `"Applied ✓"` State, Scroll Labels & `"Claim Victory ✓"`

- **Stand 3 Step 1 Courage & Strength Display:**
  - Matches *Book 1* Section 95 (`draft.md`): Step 1 lowers The Comparison Lens's **Courage from `8` to `7`** and **Strength from `8` to `6`**.
  - Updated `#stand-enemy-courage` and `#stand-enemy-strength` to show explicit before/after deltas in emerald green (`Courage: 7/8 (8→7) | Strength: 6/8 (8→6)`) so both reductions are immediately visible.
- **`"Applied ✓"` Button State:**
  - Clicking `#btn-stand-victory-law` or `#btn-stand-scroll` updates the button text to **`"Step 1: Victory Law — Applied ✓"`** / **`"Speak KJV Scroll (...) — Applied ✓"`** and applies `.btn-applied` (emerald green border and text instead of dull grey).
- **Canonical Scroll Labels Audit Across All 8 Stands:**
  - Audited `resonantScrolls` in [`src/zone1-data.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/zone1-data.js) against *Book 1* `outline.md` §2 and `draft.md`:
    - Stand 1: `Proverbs 16:18 (KJV)` (`scroll_1`)
    - Stand 2: `1 Corinthians 6:12 (KJV)` (`scroll_5`)
    - Stand 3: **`Proverbs 27:2 (KJV)` (`scroll_3`)**
    - Stand 4: `1 Corinthians 6:12 (KJV)` (`scroll_5`)
    - Stand 5: `Isaiah 53:4 (KJV)` (`scroll_4`)
    - Stand 6: `Psalm 51:17 (KJV)` (`scroll_2`)
    - Stand 7: `Proverbs 16:18 (KJV)` (`scroll_1`)
    - Stand 8: `Proverbs 16:18 (KJV)` (`scroll_1`)
- **Sequential Numbering Across All 6 Stages (`1, 2, 3…` With Zero Jumps):**
  - Reordered Stage V (`STAGES[4]`) nodes in [`src/zone1-data.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/zone1-data.js) so `Stand 7` → `Wisdom 6` → `Treasure 5 (Soo-jin, Sec. 189)` → `Treasure 6 (Hoon, Sec. 218)` → `Well 5 (Sec. 245)` → `Wisdom 5` are encountered in strict canonical sequence (`Stands 1..8`, `Treasures 1..8`, `Wells 1..5` with zero jumps).
- **Winning Roll Victory Banner & `"Claim Victory ✓"` Button:**
  - On Stand 2 and **all 8 Stands** (including Stand 4's wisdom walk-away), winning a Stand never closes the modal on its own: it displays `st.victoryText` in `#stand-victory-banner` and turns `#btn-stand-roll` into **`"Claim Victory ✓"`**. Clicking **`"Claim Victory ✓"`** closes the modal.

---

## 5. Sea of Glass Ending Payoff Moment

- When the player interacts with the **Treasure Gate** in Stage VI after clearing all 8 Stands, `triggerEndingSequence()` fades/transitions the 3D scene into a **4.2-second** (**2.4-second in Eco mode**) **Sea of Glass Finale Moment** (`worldManager.updateFinaleMoment()`):
  - Camera rises smoothly above the crystalline shore as golden-aquamarine dawn light brightens and Elias stands beside the Fellow-Traveler before the four Mentors (David, Daniel, Paul, and Esther).
  - Includes a visible **`"Skip →"`** button (`#btn-skip-payoff`) so the moment is immediately skippable at any time before `#finale-modal` opens.

---

## 6. Performance Profiling & Optimization Report

| Metric (at `1280×800`) | Before Fix Pass 3 | After Fix Pass 3 | Improvement |
| :--- | :--- | :--- | :--- |
| **Pixel Ratio Cap** | `2.0` (`2560×1600` = `4,096,000` px) | **`1.5`** (`1920×1200` = `2,304,000` px; `1.0` in Eco mode) | **-43.8% shaded pixels per frame** |
| **Real-Time `PointLight` Count / Stage** | `4` per stage (`addWarmStreetLamps`) | **`1`** central warm light (`0` in Eco mode) + emissive lamp halos | **-75% per-fragment PointLight evaluations** |
| **Shadow Maps** | Default | Explicitly disabled (`renderer.shadowMap.enabled = false`) | **0 shadow-map passes** |
| **Particle Count & Geometry Segments** | `220` (`90` Eco) / `32×24` sky / `24×24` sea | **`140`** (`60` Eco) / `24×16` sky / `16×16` sea (`4,546` tris total) | **-36% particles & lower vertex count** |
| **3D Rendering While Any Modal Is Open** | `60–120 FPS` continuous WebGL render loop behind modals | **Paused (`0` WebGL draws/sec while modal open; `renderPausedByModal: true`)** | **~100% GPU savings while reading/rolling in modals** |
| **Measured World Frame Rate & Update Cost** | ~45–55 FPS on mid-range GPU under 4 PointLights @ 2x DPI | **`120 FPS` (`60 FPS` on 60Hz displays), `0.008 ms` CPU `update()`** | **Locked at display refresh rate** |

---

## 7. Verification Screenshots (`screenshots/`)

1. **Title Screen (Fresh Save — Start Walk only):** [`screenshots/pass3-title-screen-fresh.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-title-screen-fresh.png)
2. **Title Screen (With Saved Walk — Continue, Start, and Reset Confirmation):** [`screenshots/pass3-title-screen.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-title-screen.png)
3. **Locked Stage Chip & Tooltip (`🔒 2. The Neon Back Alley...`):** [`screenshots/pass3-locked-stage-chip.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-locked-stage-chip.png)
4. **Stand 1 Art (`The Applause Echo` — `sea-01-panel-53.png` + `Applied ✓`):** [`screenshots/pass3-stand1-art.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-stand1-art.png)
5. **Stand 2 Art & Winning Roll (`The Patient Whisper` — `sea-01-panel-08.png` + `Claim Victory ✓`):** [`screenshots/pass3-stand2-art-victory.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-stand2-art-victory.png)
6. **Stand 3 Art, `Applied ✓` State, `Courage 8→7` & `Strength 8→6`, and `Proverbs 27:2 (KJV)`:** [`screenshots/pass3-stand3-art-applied.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-stand3-art-applied.png)
7. **Stand 4 Art & Victory State (`The Back-Room Boast at Hannam-dong` — `sea-01-panel-38.png` + `Claim Victory ✓`):** [`screenshots/pass3-stand4-art.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-stand4-art.png)
8. **Stand 8 Art (`The Obsidian Crown of Pride & The Fig-Leaf Door of Shame` — `sea-01-panel-81.png`):** [`screenshots/pass3-stand8-art.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-stand8-art.png)
9. **Sea of Glass Finale Moment (Rising Camera, Golden Dawn & `Skip →` Button):** [`screenshots/pass3-sea-of-glass-moment.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-sea-of-glass-moment.png)
10. **Good Ending (`Section 299 · The Honest Recovery Road`, `0–3` Treasure):** [`screenshots/pass3-good-ending-299.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-good-ending-299.png)
11. **True Ending (`Section 300 · The Unseen Chord`, `4–8` Treasure):** [`screenshots/pass3-true-ending-300.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-true-ending-300.png)
12. **Gatehouse Banner & Book 1 Edition Card (`sea-01-panel-98.png` + `sea-01-cover-preview.jpg`):** [`screenshots/pass3-gatehouse-banner.png`](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass3-gatehouse-banner.png)
