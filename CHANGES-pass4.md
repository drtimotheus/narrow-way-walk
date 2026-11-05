# Fix Pass 4 — The Narrow Way Walk (Zone I: Elias Cho · Seoul)

- **Workspace:** `/Users/Timotheus/Desktop/Narrow Way Walk`
- **Backup Branch:** `backup-pre-pass4` (created at Pass 3 commit `7823006`)
- **Preserved from Pass 3 (`7823006`):** Stage gating, lock tooltips, painted art mappings, sequential Stand/Treasure/Well numbering, and `Applied ✓` state badges.
- **Unchanged per Guardrails:** Story prose, KJV scripture quotes, enemy/player stats, and 2d6 combat math.

---

## 1. Stand Modal Layout (`index.html`, `src/main.js`)

1. **Two-Line Victory Law Button Layout (`#btn-stand-victory-law`):**
   - Replaced the single-line inline flex layout with `.stand-step-grid` (`grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr)` on desktop, single-column stack at `<= 780px`) and a structured two-line button inside `#btn-stand-victory-law` (`.step-btn-title` + `.step-btn-sub`).
   - Verified across all 8 Stands (`stand_1`..`stand_8`) at `1280×800` and `390×844` that long Step 1 descriptions (including **Stand 4** `"Confess & turn away from the back-room table (Courage 9→7, Strength 10→6)"` and **Stand 6** `"Cancel the debt & pray blessing (Courage 9→7, Strength 10→6)"`) wrap cleanly inside the button and never overflow or collide with the Scroll button.
2. **Single Scroll Area in Stand Modal (`#stand-combat-log`):**
   - Removed the nested `overflow-y: auto` from `#stand-narrative` and consolidated the victory text card (`#stand-victory-banner` / `.stand-log-victory-card`) directly inside `#stand-combat-log` so the Stand modal has **one single scroll container** with zero double scrollbars and no clipped text.
3. **Scroll Button Label Format (`#btn-stand-scroll`):**
   - Updated every Stand's scroll button to read **`Speak <Reference> (KJV)`** before applying and **`Speak <Reference> (KJV) — Applied ✓`** after applying (removing the redundant `"KJV Scroll (...)"` wrapper):
     - Stand 1: `Speak Galatians 1:10 (KJV)` → `Speak Galatians 1:10 (KJV) — Applied ✓`
     - Stand 2: `Speak Romans 8:1 (KJV)` → `Speak Romans 8:1 (KJV) — Applied ✓`
     - Stand 3: `Speak Proverbs 27:2 (KJV)` → `Speak Proverbs 27:2 (KJV) — Applied ✓`
     - Stand 4: `Speak Proverbs 16:18 (KJV)` → `Speak Proverbs 16:18 (KJV) — Applied ✓`
     - Stand 5: `Speak Philippians 4:6–7 (KJV)` → `Speak Philippians 4:6–7 (KJV) — Applied ✓`
     - Stand 6: `Speak Ephesians 4:31–32 (KJV)` → `Speak Ephesians 4:31–32 (KJV) — Applied ✓`
     - Stand 7: `Speak Psalm 34:18 (KJV)` → `Speak Psalm 34:18 (KJV) — Applied ✓`
     - Stand 8: `Speak Proverbs 16:18 (KJV)` → `Speak Proverbs 16:18 (KJV) — Applied ✓`

---

## 2. Stat Text (`src/main.js`)

1. **Treasure Stat Labels (`formatTreasureChoiceStatText`):**
   - Audited all 8 Treasures (`treasure_1`..`treasure_8`). Positive Strength outcomes now show **`Gain: +N Strength`** while `Cost:` is reserved strictly for losses (`breadCost > 0` or `strengthDelta < 0`):
     - **Treasure 1 (Mr. Park):** `Cost: 1 Bread · Gain: +1 Treasure`
     - **Treasure 2 (Min-jun):** `Gain: +2 Strength, +1 Treasure` *(previously `"Cost: +2 Strength"`)*
     - **Treasure 3 (Hoon):** `Cost: 1 Bread · Gain: +1 Strength, +1 Treasure` *(previously `"Cost: 1 Bread, +1 Strength"`)*
     - **Treasure 4 (Mrs. Kang):** `Cost: -1 Strength · Gain: +1 Treasure`
     - **Treasure 5 (Jae-won):** `Cost: -1 Strength · Gain: +1 Treasure`
     - **Treasure 6 (Soo-jin):** `Gain: +1 Treasure`
     - **Treasure 7 (Dae-hyun):** `Cost: 1 Bread or -2 Strength · Gain: +1 Treasure`
     - **Treasure 8 (Joon):** `Cost: -1 Strength · Gain: +1 Treasure`
2. **Well & Healing Cap Text (`openWellModal`, `#btn-well-eat-bread`, `#btn-stand-oil`):**
   - Audited all 5 Wells (`well_1`..`well_5`), Bread eating at Wells, and Oil usage in Stands:
     - When Strength is already at its cap (`20/20`), Wells display **`Strength already full (20/20).`** instead of `"Strength +4 (now 20/20)"`.
     - When partially capped (e.g., `19/20` with a `+4` Well restore), Wells display the actual amount gained: **`Strength +1 (now 20/20).`**.
     - Favor restoration at Wells similarly reports **`Favor already full (9/9).`** when capped, or the exact points gained when partially capped.

---

## 3. Cleared Stands, Treasures & Wells Read-Only Reopen (`index.html`, `src/main.js`)

- Added `#stand-cleared-badge` (`Cleared ✓`) to `#stand-modal` header.
- Reopening any cleared Stand (`state.standsCleared.includes(standId)`) now opens in **read-only cleared mode**:
  - Displays the **`Cleared ✓`** badge in the modal header and `0/N (Cleared ✓)` enemy Strength.
  - Shows the Stand's victory text inside `#stand-combat-log` (`✓ Stand Cleared — ...`).
  - Hides Step 1, Scroll, and auxiliary combat buttons so no dice rolls can be triggered and no rewards/Favor/scrolls can be granted twice.
  - Sets `#btn-stand-roll` to **`Close (Cleared ✓)`**, which simply closes the modal.
- Verified across all Stands, Treasures (`Chosen: Gave (+1 Treasure) ✓`), and Wells (`Restored at this Well on your current walk`), and confirmed persistence across `localStorage` save and browser reload (`window.location.reload()`).

---

## 4. Visuals (`src/painterly.js`, `src/world.js`, `index.html`, `src/main.js`)

1. **Stage 4 3D World (`columbarium_autumn` in `src/world.js`):**
   - Replaced the 21 flat yellow boxes with a rosewood-trimmed marble columbarium memorial wall featuring **7 distinct painted panels from `assets/art/`** (`sea-01-panel-52.png`, `sea-01-panel-49.png`, `sea-01-panel-45.png`, `sea-01-panel-47.png`, `sea-01-panel-62.png`, `sea-01-panel-64.png`, `sea-01-panel-42.png`) framed in varied brass, rosewood, jade-slate, and amber-bronze niches, white/rose floral tributes on the ledges, and crimson/gold Chuseok maple trees flanking the courtyard.
   - **Performance:** Maintained **120 FPS** (`avgFps: 120`, `pixelRatio: 1.5`, `pointLightsInStage: 1`).
2. **Stage-Complete & Modal Banner Focal-Point Positioning (`ART_FOCAL_POINT_MAP` in `src/painterly.js`):**
   - Mapped focal-point `object-position` coordinates for all painted panels in `assets/art/` and applied them automatically in `loadArtIntoImage()` and `openStageCompleteModal()`.
   - Fixed the **Stage I Complete** banner (`sea-01-panel-05.png` at `50% 22%`) so the three Mentors on the Sea of Glass are framed cleanly instead of cropping to a dark lower strip, and audited all 6 stage-complete banners (`Stage I`–`Stage VI`).
3. **Proactive Next-Stage Image Preloading & Smooth Fade-In (`src/painterly.js`, `src/main.js`, `index.html`):**
   - Added `preloadStageArt(stageIdx)` (using `img.decode()`) and `checkAndPreloadNextStage()`, which preloads the next stage's banner, Stand, Well, Treasure, and 3D wall textures as soon as the current stage is `>= 50%` cleared (and on stage entry).
   - Added smooth CSS opacity fade-in (`transition: opacity 0.26s ease-out`) on `.modal-art-img` and `#stage-art-thumb` so images fade in cleanly instead of popping.
4. **3D Nameplate Screen-Size Clamping & Near-Camera Hide (`_applyNameplateScreenClamp` in `src/world.js`):**
   - Clamped projected screen width of 3D nameplates (`Elias` and proximity node label) between `76px` and `124px` (`max-height: 28px`) and hid/faded any nameplate within `~2` units of the camera (`camDist <= 1.95` hidden, `< 2.55` smooth opacity fade) so labels never scale huge or overlap when teleporting to a portal or node.

---

## 5. Click Targets (`index.html`)

- Styled `.stage-tab`, `.node-chip`, and all HUD buttons (`button`) with `min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box;` so clicks anywhere inside the chip or its border register reliably.
- Verified in Chrome DevTools (`getBoundingClientRect()`) that all 6 stage chips (including **Stage 5** at `359×44 px`) and all 10 top HUD buttons meet or exceed `44×44 px`.

---

## 6. Title Screen & Save / Gatehouse (`src/main.js`, `index.html`)

- Verified that **`Continue Walk (Stage X of 6) →`** and **`Reset Walk`** appear on the Title Screen whenever a saved walk exists (`state.firstSightCompleted || state.standsCleared.length > 0`).
- Verified that clicking **`Reset Walk`** opens the inline confirmation prompt (`#title-reset-confirm`) and confirming resets `localStorage` to a fresh Stage I state and hides `Continue` and `Reset`.
- Verified that the **Save / Gatehouse** panel (`#gatehouse-modal`) displays `assets/art/sea-01-panel-98.png` (`1200×655`, `complete: true`) with zero blank banner boxes and zero dev tags.
- Ran `grep -rnE "assets\.md|Scene Study|Listed in|FLAG|DEC-|OPEN-|placeholder|TODO" index.html src/` → **0 matches**.

---

## 7. Verification Screenshots (`screenshots/`)

| Check | Screenshot |
| :--- | :--- |
| **Stand 4 Modal Layout (`1280×800`)** | [`screenshots/pass4-stand4-layout-1280x800.png`](./screenshots/pass4-stand4-layout-1280x800.png) |
| **Stand 4 Modal Layout (`390×844` Phone)** | [`screenshots/pass4-stand4-layout-390x844.png`](./screenshots/pass4-stand4-layout-390x844.png) |
| **Stand 6 Modal Layout (`1280×800`)** | [`screenshots/pass4-stand6-layout-1280x800.png`](./screenshots/pass4-stand6-layout-1280x800.png) |
| **Stand 6 Modal Layout (`390×844` Phone)** | [`screenshots/pass4-stand6-layout-390x844.png`](./screenshots/pass4-stand6-layout-390x844.png) |
| **Stand 8 Modal Layout (`1280×800`)** | [`screenshots/pass4-stand8-layout-1280x800.png`](./screenshots/pass4-stand8-layout-1280x800.png) |
| **Treasure 2 (`Gain: +2 Strength, +1 Treasure`)** | [`screenshots/pass4-treasure-gain-label.png`](./screenshots/pass4-treasure-gain-label.png) |
| **Well 2 Capped (`Strength already full (20/20)`)** | [`screenshots/pass4-well-capped.png`](./screenshots/pass4-well-capped.png) |
| **Cleared Stand 5 Reopened Read-Only (`Cleared ✓`)** | [`screenshots/pass4-cleared-stand-reopen.png`](./screenshots/pass4-cleared-stand-reopen.png) |
| **Stage 4 3D World (Painted Niches & Autumn Maples)** | [`screenshots/pass4-stage4-world.png`](./screenshots/pass4-stage4-world.png) |
| **Stage I Completed Banner (Focal Point `50% 22%`)** | [`screenshots/pass4-stage1-banner.png`](./screenshots/pass4-stage1-banner.png) |
| **Title Screen (`Continue Walk` + `Reset Walk`)** | [`screenshots/pass4-title-continue-reset.png`](./screenshots/pass4-title-continue-reset.png) |
| **Save / Gatehouse Panel (`sea-01-panel-98.png`)** | [`screenshots/pass4-gatehouse-panel.png`](./screenshots/pass4-gatehouse-panel.png) |
| **Sea of Glass Finale Moment (Skippable `< 10s`)** | [`screenshots/pass4-sea-of-glass-moment.png`](./screenshots/pass4-sea-of-glass-moment.png) |
| **Section 299 — The Good Ending (`Treasure: 3`)** | [`screenshots/pass4-good-ending-299.png`](./screenshots/pass4-good-ending-299.png) |
| **Section 300 — The True Ending (`Treasure: 4`)** | [`screenshots/pass4-true-ending-300.png`](./screenshots/pass4-true-ending-300.png) |
