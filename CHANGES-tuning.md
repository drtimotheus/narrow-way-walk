# CHANGES — Watchman Tuning (Zone I)

- **Base Commit:** `8d98daf`
- **Backup Branch:** `backup-pre-tuning` (created at `8d98daf` before any edits)
- **Guardrails Preserved:** Watchman remains the single game mode; all Watchman rules stay intact (`-1 Strength` on ties, single-use Wells, `2 Strength` or `1 Favor` Treasure sacrifice, Fallen grace recovery, `4+ Treasure` threshold for Section 300). No story text, KJV scripture, art, or save format changes beyond the items listed below.

---

## 1. Old vs. New Numbers (`src/zone1-data.js` & `src/main.js`)

### Strongholds (`STANDS` in `src/zone1-data.js`)

| Stand | Old Roll Bonus (Base → After Step 1 → After Scroll) | New Roll Bonus (Base → After Step 1 → After Scroll) | Old Strength (Base → Step 1 → Scroll) | New Strength (Base → Step 1 → Scroll) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Stand 1** (`stand_1` · Pride in the Booth) | `2d6+8` → `2d6+7` → `2d6+6` | `2d6+8` → `2d6+7` → `2d6+6` | `8` → `8` → `6` | **`9`** → **`9`** → **`7`** (`+1` Str) | Tuned `+1` Str within `±1` for target loss rate |
| **Stand 2** (`stand_2` · The Secret Ledger) | `2d6+8` → `2d6+7` → `2d6+6` | `2d6+8` → `2d6+7` → `2d6+6` | `8` → `7` → `6` | **`9`** → **`8`** → **`7`** (`+1` Str) | Tuned `+1` Str within `±1` for target loss rate |
| **Stand 3** (`stand_3` · Envy's Whisper) | `2d6+9` → `2d6+8` → `2d6+7` | `2d6+9` → `2d6+8` → `2d6+7` | `10` → `9` → `8` | `10` → `9` → `8` | Unchanged |
| **Stand 4** (`stand_4` · Back-Room Boast) | `2d6+12` (unwinnable if fought) | **`2d6+10`** (`~44.3%` win rate if fought) | `14` | **`12`** | Walk-out options (`1 Favor` or `1 Strength`) kept + Proverbs 22:3 wisdom banner added |
| **Stand 5** (`stand_5` · Bitter Silence) | `2d6+9` → `2d6+9` → `2d6+8` | `2d6+9` → `2d6+9` → `2d6+8` | `10` → `8` → `6` | `10` → `8` → `6` | Unchanged |
| **Stand 6** (`stand_6` · The Cynic's Chair) | `2d6+9` → `2d6+8` → `2d6+7` | `2d6+9` → `2d6+8` → `2d6+7` | `10` → `9` → `8` | **`11`** → **`10`** → **`9`** (`+1` Str) | Tuned `+1` Str within `±1` for target loss rate |
| **Stand 7** (`stand_7` · Fear of Man) | `2d6+10` → `2d6+9` → `2d6+9` | `2d6+10` → `2d6+9` → `2d6+9` | `10` → `10` → `9` | `10` → `10` → `9` | Unchanged |
| **Stand 8** (`stand_8` · The Unseen Chord Broken) | `2d6+11` → `2d6+9` (after Victory Law) | **`2d6+10` → `2d6+8`** (after Victory Law) | `15` → `13` (after Victory Law) | **`13` → `10`** (after Victory Law) | `~61.6%–80.4%` first-try win rate without Mentor's Token |

### Recovery & Resources

| Resource | Old Value (Watchman Balance) | New Value (Watchman Tuning) |
| :--- | :--- | :--- |
| **Well of Living Water Heal** | `+2 Strength`, `+1 Favor` (single use) | **`+3 Strength`**, **`+1 Favor`** (single use) |
| **Extra Late-Game Bread Pickup** | None (`2` starting Bread total) | **`+1 Bread` pickup in Stage 4** (`node_bread_stage4` near Well 3; also auto-awarded on visiting Well 3 if not yet claimed) |
| **Oil & Bread Mid-Fight Heal** | Oil `+4 Strength`, Bread `+2 Strength` | Unchanged (`+4 Strength` / `+2 Strength`), dynamic button labels showing exact heal right now |

---

## 2. Feature & UI Fixes Implemented

1. **Stand 4 (`stand_4` — Back-Room Boast):**
   - Lowered from `2d6+12` (Strength `14`) to **`2d6+10`** (Strength `12`) so fighting is possible (`44.3%` first-try win rate for a careful player) while remaining risky.
   - Kept both walk-out options (`1 Favor` or `1 Strength`).
   - Added `#stand-wisdom-banner` to `#stand-modal` displaying:
     `Wisdom: Sometimes the bravest stand is walking away (Proverbs 22:3). “A prudent man foreseeth the evil, and hideth himself: but the simple pass on, and are punished.” — Proverbs 22:3 (KJV)`
2. **Stand 8 (`stand_8` — Final Boss):**
   - Lowered from `2d6+11 → +9` (Strength `15 → 13`) to **`2d6+10 → +8`** after Victory Law, with starting **Strength `13` (`→ 10` after Victory Law)**.
3. **Late-Game Recovery:**
   - Updated `openWellModal` in `src/main.js` so each Well heals **`+3 Strength`** (`+1 Favor`, single use).
   - Added `node_bread_stage4` (`Bread +1`) near Well 3 in Stage 4 (`STAGES[3].nodes` in `src/zone1-data.js`), with `breadPickupClaimed` state persistence in `src/main.js` and `3D` loaf monument in `src/world.js`.
4. **Oil & Bread Button Labels:**
   - Updated `#btn-stand-oil`, `#btn-stand-bread`, and `#btn-well-eat-bread` to always show the exact amount restored right now: **`Use Oil · +X Strength`** and **`Use Bread · +X Strength`** (e.g., `Use Oil · +3 Strength` when at `17/20`, `Use Oil · +0 Strength (Full)` when at `20/20`, or `Use Oil · +0 Strength (0 left)` when empty).
5. **Small Fixes:**
   - **`Escape` Closes Every Modal:** Added `Escape` key handling in `initThreeWorld()` (`src/main.js`) that calls `closeAllModals()`, closing `#relic-modal` (and stopping its turntable), `#stand-modal`, `#well-modal`, `#treasure-modal`, `#grace-modal`, `#guide-modal`, etc.
   - **Immediate Roll Formula Update:** Applying Step 1 (Victory Law) or a KJV Scroll immediately updates `#btn-stand-roll` to show the live formula: **`Roll: 2d6 + Courage 9 vs 2d6 + 8`**.
   - **Fallen Screen Post-Recovery Stats:** Added `#grace-stats-summary` inside `#grace-modal` (`index.html` & `triggerGraceFall` in `src/main.js`) displaying post-recovery **Strength (`10/20`), Favor, Oil, Bread, and Treasure**.
   - **Mobile Nameplate Screen Clamping (`390×844`):** Updated `_applyNameplateScreenClamp` in `src/world.js` to project each nameplate's world position into camera NDC, clamp horizontal and vertical bounds so the full pixel width stays at least `12px` inside the viewport edges (`[12px, vw - 12px]`), and unproject back to world space. Verified at `390×844` that `"Treasure 1"` (`left: 12px, right: 136px`) and `"Elias"` (`left: 12px, right: 136px`) never clip off the left edge.

---

## 3. Headless Simulation Results (`1,000` Runs per Strategy)

Simulated via `/Users/Timotheus/.gemini/antigravity/brain/471a1e15-79b2-45ff-a80e-d08423f8f2d2/scratch/sim-tuning.mjs` importing the live `STANDS`, `WELLS`, and `TREASURES` data from `src/zone1-data.js`:

| Metric / Target | `careful_all_give` (1,000 runs) | `careful_all_keep` (1,000 runs) | `careless` (1,000 runs) | Tuning Target |
| :--- | :--- | :--- | :--- | :--- |
| **Avg Stands Lost (Falls) per Run** | **`1.44`** | **`0.88`** (Careful combined avg: **`1.16`**) | `20.49` | **`1–2` Stands lost on average** ✓ |
| **Reaches Stage 6 with `>= 8` Strength** | **`60.7%`** (avg `8.4` Str) | **`71.2%`** (avg `9.5` Str) | `12.8%` (avg `5.7` Str) | **Most runs (`>50%`) reach Stage 6 with `>= 8` Str** ✓ |
| **True Ending (§300) with `<= 1` Fall** | **`65.3%`** (`72.6%` True Ending total) | `0.0%` (`100%` Good Ending §299) | `0.3%` | **`55–70%` True Ending without falling `>1` time** ✓ |
| **Stand 8 First-Try Win Rate (NO Token)** | **`61.6%`** | **`80.4%`** | `10.1%` | **`60–70%` first-try win without Token** ✓ |
| **Lowest Per-Stand Win Rate (Stand 4 fought)** | **`44.3%`** | **`44.3%`** | `9.2%` | **No Stand `< 35%` win chance (Stand 4 included)** ✓ |

### Per-Stand First-Try Win Rates (Careful Player)

- **Stand 1 (`2d6+7`, Str `9`):** `81.8%`
- **Stand 2 (`2d6+6`, Str `7`):** `92.8%`
- **Stand 3 (`2d6+7`, Str `8`):** `79.6%`
- **Stand 4 (`2d6+10`, Str `12` — when fought instead of walked out):** **`44.3%`** (above the `35%` floor)
- **Stand 5 (`2d6+8`, Str `6`):** `85.2%`
- **Stand 6 (`2d6+7`, Str `9`):** `80.8%`
- **Stand 7 (`2d6+9`, Str `9`):** `64.0%` (or `~94%` when Mentor's Token is used here)
- **Stand 8 (`2d6+8`, Str `10` — fought without Mentor's Token):** **`61.6%`** (`careful_all_give`) / **`80.4%`** (`careful_all_keep`)

---

## 4. Manual Playthrough & Mobile Verification

- **Fresh Save Playthrough to True Ending (§300) Without Using Token on Stand 8:**
  - Walked Stages I–VI, claiming the Stage 4 Bread pickup (`bread: 3`), giving at Treasures (`treasure: 5`), and entering Stand 8 without the Mentor's Token.
  - Applied Step 1 (`Roll: 2d6 + Courage 9 vs 2d6 + 8`, Stronghold Strength `13 → 10`) and defeated Stand 8 **on the first try without using the Mentor's Token**, reaching **Section 300 · THE TRUE ENDING — The Unseen Chord**.
- **`390×844` Mobile Pass:**
  - Verified `"Treasure 1"` nameplate is clamped cleanly inside the left screen edge (`left: 12px`, `right: 136px` on a `390px` viewport).
  - Verified all `#stand-modal` buttons at `390×844` are `44px` tall with zero horizontal overflow.
