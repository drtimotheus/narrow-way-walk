# CHANGES — Watchman Tuning 2 (Zone I Small Polish Pass)

- **Base Commit:** `5c599d8`
- **Backup Branch:** `backup-pre-tuning2` (created at `5c599d8` before any edits)

---

## 1. Before vs. After Numbers & Behavior

| Area | Before (`5c599d8`) | After (Watchman Tuning 2) |
| :--- | :--- | :--- |
| **1. Stage 6 Recovery Before Stand 8** | No recovery node in Stage 6 (`well_5` was in Stage 5 before Treasure 6 & Treasure 7, so an all-Give player often entered Stand 8 at `4` Strength). | Added **`well_6` (`Well 6 · The Fellowship Basin on the Sea of Glass`, `+3 Strength`, `+1 Favor`, single use)** in Stage 6 (`[3.2, 0, -9.8]`) right before Stand 8 (`[0, 0, -13.0]`). Careful all-Give players now reach Stand 8 at **`9.4` average Strength** (`100%` reach Stand 8 at `>= 7` Strength). |
| **2. Stand 4 Softening & Proverbs 22:3 Benefit** | `2d6+10`, Strength `12`; Proverbs 22:3 banner was informational only (`~13–14` rounds when fought). | Kept **`2d6+10`**, lowered base Strength from `12` to **`10`** (`10.4` avg rounds raw), AND added an interactive **`Heed Proverbs 22:3 (-1 Roll, -2 Str)`** action inside the Stand 4 Proverbs 22:3 wisdom banner (`2d6+10 → 2d6+9`, Strength `10 → 8`), bringing average win length to **`8.0` rounds** (`75.4%` win rate when fought) while keeping the `1 Favor` / `1 Strength` walk-out options. |
| **3. Enemy Health Display Clarity** | After Victory Law reduced Stand 8 Strength from `13` to `10`, `maxEnemyStrength` stayed `13`, so taking `2` damage read `8/13 (13→8)`. | `s.maxEnemyStrength` updates to match the reduced value (`10`), displaying **`10/10 (was 13→10)`** immediately after Victory Law and **`8/10 (was 13→10)`** after `1` hit. |
| **4. One-Use Scroll Button State** | Showed `Speak <Ref> — Applied ✓` when disabled after use. | Shows **`Speak <Ref> — Used this fight ✓`** (e.g. `Speak Isaiah 53:4 (KJV) — Used this fight ✓` / `Speak Psalm 51:17 (KJV) — Used this fight ✓`) once spoken in the current Stand. |
| **5. Modal Click Robustness** | Rapid clicks on Give/Keep Treasure or clicks landing right as a modal closed could race with 3D canvas raycasting or `interactCooldownUntil`. | Added `treasureChoiceInFlight` lock + immediate button disable inside `openTreasureModal` (zero double-spends), `180ms` post-modal-close guard on 3D canvas pointerup picking, and kept `#btn-proximity-interact` responsive on modal close. |
| **6. Multi-Tab Save Detection** | Opening the game in two tabs could silently overwrite `localStorage`. | Added a `window.addEventListener('storage', ...)` listener for `narrow_way_walk_save_v1` that pauses local overwrites and displays the top alert banner: **`⚠ Game open in another tab — reload to sync`** with a **`Reload to Sync`** button. |

---

## 2. Headless Simulation Results (`1,000` Runs per Strategy)

Simulated via `/Users/Timotheus/.gemini/antigravity/brain/471a1e15-79b2-45ff-a80e-d08423f8f2d2/scratch/sim-tuning2.mjs` importing the live `STANDS`, `WELLS`, and `TREASURES` data from `src/zone1-data.js`:

| Metric / Target | `careful_all_give` (1,000 runs) | `careful_all_keep` (1,000 runs) | `careless` (1,000 runs) | Tuning 2 Target |
| :--- | :--- | :--- | :--- | :--- |
| **True Ending (§300) Reached** | **`69.3%`** (`59.5%` with `<= 1` fall) | `0.0%` (`100%` Good Ending §299) | `1.2%` | **`60–70%` of careful all-Give runs** ✓ |
| **Stand 8 Entry Strength** | **`9.4` avg** (`100% >= 7` Str) | **`12.1` avg** (`100% >= 7` Str) | `7.0` avg (`47.3% >= 7` Str) | **Reach Stand 8 at `~7–10` Strength** ✓ |
| **Stand 8 First-Try Win (NO Token, no prior fall)** | **`73.8%`** (`75.6%` in full run) | **`86.3%`** (`92.5%` in full run) | `14.3%` | **`>= 50%` without Token or falling first** ✓ |
| **Lowest Per-Stand Win Rate (Careful)** | **`65.8%`** (Stand 7) / **`44.6%`** (Stand 4 raw) / **`75.4%`** (Stand 4 w/ Wisdom) | **`76.3%`** (Stand 7) | `8.9%` | **Every Stand `>= 40%` win chance** ✓ |
| **Stand 4 Avg Rounds to Win (Careful)** | **`8.0` rounds** (with Proverbs 22:3 Wisdom) / **`10.4` rounds** (raw `10` Str) | **`8.0` rounds** | `11.2` rounds | **`~8–10` rounds (down from `14`)** ✓ |
| **Avg Stands Lost per Run** | **`1.52`** | **`0.79`** | `14.70` | **`1–2` Stands lost on average** ✓ |

---

## 3. Browser & Mobile (`390×844`) Verification

- **Stand 4 Proverbs 22:3 Line & Benefit:** Confirmed `#stand-wisdom-banner` is visible on Stand 4 with KJV text and the **`Heed Proverbs 22:3 (-1 Roll, -2 Str)`** button, reducing Stand 4 to `8/8 (was 10→8)` and `Stronghold rolls 2d6+9 (was 2d6+10)`.
- **Enemy Health Clarity:** Confirmed Stand 8 displays `13/13` initially, `10/10 (was 13→10)` after Victory Law, and `8/10 (was 13→10)` after taking `2` damage.
- **Scroll Button Label:** Confirmed speaking a scroll updates `#btn-stand-scroll` to `Speak <Ref> — Used this fight ✓`.
- **Mobile `390×844` Nameplates & HUD Clearance:**
  - Top HUD bottom edge: `136px`; Bottom HUD top edge: `730px`.
  - `"Treasure 1"` nameplate: `left: 12px, right: 136px, top: 320px, bottom: 353px` (on-screen, zero HUD overlap).
  - `"Well 6"` nameplate: `left: 254px, right: 378px, top: 320px, bottom: 353px` (on-screen, zero HUD overlap).
- **`Escape` Key:** Confirmed `Escape` closes all modals including `#relic-modal`.
