# Fix Pass 5 — Changelog & Verification Report (`The Narrow Way Walk — Zone I`)

- **Backup Branch:** `backup-pre-pass5` (created at commit `3b510b0` before any Pass 5 edits)
- **Guardrails Preserved:** No changes to story text, scripture (KJV), stats, dice math, stage gating, art assignments, or save/NW1 code format.

---

## 1. Ending Screen Cleanup
- **State & CSS Cleanup (`index.html`, `src/main.js`, `src/world.js`):**
  - Added `endingCleanupActive` state and `setEndingCleanupMode(active)` in [`src/main.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/main.js#L517-L590) along with `worldManager.setLabelsHidden(hidden)` in [`src/world.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/world.js#L155-L176).
  - When either ending modal opens (**Section 299 — The Good Ending** or **Section 300 — The True Ending**) and afterward when viewing the **Sea of Glass**:
    - Hides the `#proximity-prompt-bar` (Interact button), `#hud-stage-progress` (`"Stage 6 of 6"`), `.top-hud-wrap`, `.bottom-hud-wrap`, and all 3D in-world nameplate/checkmark sprites (`Elias`, `✓ Stand 8`, `Treasure Gate`, etc.).
    - Shows only `#ending-sea-hud` in the Sea of Glass view containing a small **`↺ Return to Title`** button (`#btn-ending-return-title`) and the read-only **`NW1 Code`** (`#ending-sea-nw1-code`).
  - Restores the full HUD and in-world labels automatically when starting a new walk (`#btn-begin-walk`, `#btn-title-reset-yes`, `#btn-gatehouse-reset-yes`) or loading any stage (`loadStage()`).

---

## 2. Interact Timing After Teleports & Chip Jumps
- **Immediate Recompute + 260 ms Confirmation Lock (`src/main.js`):**
  - Added `getDetailedInteractLabel(node, isLocked)` in [`src/main.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/main.js#L430-L463) so `#btn-proximity-interact` is always labeled with the actual target (`"Interact: Stand 5 · The Curated Sorrow"`, `"Interact: Well 3 · The Columbarium Bench & Sea of Glass (Section 175)"`, etc.).
  - Updated `refreshProximityInteract(isTeleport)` in [`src/main.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/main.js#L517-L567):
    - Immediately recomputes `worldManager.getNearestNode(playerPos, 4.2)` after any stage-chip jump, node-chip jump, portal transition, or 3D tap.
    - Disables `#btn-proximity-interact` for `260 ms` (~250 ms) until a confirmation timer verifies the target at the new position.
    - On click, queries `worldManager.getNearestNode(playerPos, 4.2)` live so a stale closure can never open a previous Stand.

---

## 3. Camera After Jumps & Scenery Collision Pushback
- **Defined Safe Spawn Points (`src/main.js`):**
  - Added `getSafeNodeSpawn(node)` and `getDefinedStageSpawn(stageIdx)` in [`src/main.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/main.js#L465-L486) plus `syncCameraAndWorldImmediate()` so every stage-chip jump, node-chip jump, and modal close places the player in the clear central walkway in front of the target (`z = node.z + 1.85`) with the camera at a safe offset (`cameraDistance = 4.6`, `cameraYaw = 0`).
- **Columbarium & Scenery Clearance + Camera Pushback (`src/world.js`):**
  - Rebuilt Stage IV (`columbarium_autumn`) in [`src/world.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/world.js#L492-L579) from a cross-corridor wall at `z = -14.6` (which previously sat directly behind `Well 3` at `z = -19.0`) into four angled flanking memorial niche wings (`x = ±8.2`, `z = -13.5` and `-22.2`) with all 7 painted panels from `assets/art/` visible around the courtyard and a 100% clear central walkway (`x ∈ [-5.8, +5.8]`).
  - Added `sceneryObstacleBoxes`, `resolveCameraPosition(playerPos, desiredCamPos)`, and `isCameraColliding(camPos)` in [`src/world.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/world.js#L178-L246) so the camera is pushed out of any obstacle bounding box and never sits inside geometry.

---

## 4. First-Run Quality of Life
- **Read-Aloud Scroll Toggle (`index.html`, `src/main.js`):**
  - Added `state.settings.readAloudScroll: false` (**OFF by default**) and `#btn-tts-toggle` (`Read-Aloud: OFF` / `Read-Aloud: ON`) in the top settings bar, plus `speakKjvScroll(text, ref)` and `stopKjvSpeech()` in [`src/main.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/main.js#L261-L296) using `window.speechSynthesis` for KJV scrolls in Stands, Wells, and Wisdom Pages.
- **End-Screen Stat Summary (`index.html`, `src/main.js`):**
  - Added `#finale-stat-summary` (`Pilgrim Walk Summary`) inside `#finale-modal` displaying:
    - **Stands Cleared** (`8 / 8`)
    - **Treasure (Give vs Keep)** (`N Given · M Kept`)
    - **Scrolls Learned** (`N / 5`)
    - **Wells Used** (`N / 5`)
    - **Ending Hint** (`#finale-ending-hint`): `"Give more Treasure to find the True Ending (4+ Treasure unlocks Section 300: The Unseen Chord)."` on §299 vs `"You found the True Ending (Section 300: The Unseen Chord · 4+ Treasure given)."` on §300.
- **Mobile `390×844` Button Height (`>= 44 px`) & Overflow Check (`index.html`):**
  - Updated `.stand-bottom-actions` and `.modal-card button` rules in [`index.html`](file:///Users/Timotheus/Desktop/Narrow Way Walk/index.html#L390-L516) so every modal button is at least `44 px` tall and wraps cleanly with zero horizontal overflow at `390×844`.

---

## 5. Verification Summary

### A. Fresh Save Playthrough to Both Endings (§299 and §300)
| Check | Section 299 (Good Ending · `2 Given · 2 Kept`) | Section 300 (True Ending · `4 Given · 0 Kept`) | Sea of Glass Post-Ending View | New Walk After Reset |
| :--- | :--- | :--- | :--- | :--- |
| **Interact Button (`#proximity-prompt-bar`)** | Hidden (`display: none`) | Hidden (`display: none`) | Hidden (`display: none`) | Restored |
| **Stage Label (`Stage 6 of 6`)** | Hidden (`display: none`) | Hidden (`display: none`) | Hidden (`display: none`) | Restored (`Stage 1 of 6`) |
| **3D Nameplates / Checkmarks** | Hidden (`0` visible) | Hidden (`0` visible) | Hidden (`0` visible) | Restored |
| **Stat Summary** | `8/8` Stands · `2 Given · 2 Kept` · `4/5` Scrolls · `3/5` Wells | `8/8` Stands · `4 Given · 0 Kept` · `5/5` Scrolls · `5/5` Wells | `↺ Return to Title` + `NW1 Code` only | Fresh default state |
| **Ending Hint Line** | *"Give more Treasure to find the True Ending..."* | *"You found the True Ending..."* | N/A | N/A |

### B. 10 Chip Jumps in a Row (Interact Timing & Camera Collision Audit)
| Jump # | Chip Jump Action | Confirmed Target Node | Immediate Lock (`~250 ms`) | Button Label After Confirmation | Player Pos `(x, y, z)` | Camera Pos `(x, y, z)` | Camera Colliding? |
| :---: | :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| **1** | Stage 2 Chip (Mapo Bridge) | `node_stand2_addictions` | `disabled` (`260 ms`) | `Interact: Stand 2 · The Patient Whisper` | `(-1.90, 0, -7.15)` | `(-1.90, 2.46, -2.55)` | `false` |
| **2** | Node Chip: Token (Mapo) | `node_token_aquamarine` | `disabled` (`260 ms`) | `Interact: Token · David's Aquamarine Tuning-Stone` | `(2.31, 0, -16.65)` | `(2.31, 2.46, -12.05)` | `false` |
| **3** | Stage 3 Chip (Hannam-dong) | `node_t2_minjun` | `disabled` (`259 ms`) | `Interact: Midnight in the Rehearsal Basement (Section 56)` | `(-2.45, 0, -5.65)` | `(-2.45, 2.46, -1.05)` | `false` |
| **4** | Node Chip: Stand 3 | `node_stand3_jealousy` | `disabled` (`260 ms`) | `Interact: Stand 3 · The Comparison Lens` | `(2.45, 0, -9.65)` | `(2.45, 2.46, -5.05)` | `false` |
| **5** | Stage 4 Chip (Columbarium) | `node_t4_mrskang` | `disabled` (`260 ms`) | `Interact: The Columbarium Stone Staircase on Chuseok Morning (Section 131)` | `(-2.45, 0, -5.65)` | `(-2.45, 2.46, -1.05)` | `false` |
| **6** | Node Chip: Well 3 + Close Modal | `node_well3_bench` | `disabled` (`260 ms`) | `Interact: Well 3 · The Columbarium Bench & Sea of Glass (Section 175)` | `(-2.31, 0, -17.15)` | `(-2.31, 2.46, -12.55)` | `false` |
| **7** | Node Chip: Stand 5 + Close Modal | `node_stand5_grief` | `disabled` (`260 ms`) | `Interact: Stand 5 · The Curated Sorrow` | `(0.00, 0, -10.65)` | `(0.00, 2.46, -6.05)` | `false` |
| **8** | Node Chip: Stand 6 + Close Modal | `node_stand6_infirmity` | `disabled` (`260 ms`) | `Interact: Stand 6 · The Iron Collar of Burnout` | `(2.58, 0, -13.65)` | `(2.58, 2.46, -9.05)` | `false` |
| **9** | Stage 5 Chip (Basement Kitchen) | `node_stand7_mirror` | `disabled` (`259 ms`) | `Interact: Stand 7 · The Mirror-Guard of Pride` | `(0.00, 0, -5.65)` | `(0.00, 2.46, -1.05)` | `false` |
| **10** | Stage 6 Chip (Sea of Glass) | `node_t7_talia` | `disabled` (`260 ms`) | `Interact: The Freezing Gale of Abandonment (Section 252 / 268)` | `(-2.45, 0, -5.65)` | `(-2.45, 2.46, -1.05)` | `false` |

### C. `390×844` Mobile Pass (Button Height `>= 44 px` & Overflow Audit)
| Modal | Viewport | Card Width | Visible Buttons | Min Button Height | All Buttons `>= 44 px`? | Any Horizontal Overflow? |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Title Modal** | `390×844` | `362 px` | `3` | `44.0 px` | `true` | `false` |
| **Welcome / Stats Modal** | `390×844` | `362 px` | `5` | `44.0 px` | `true` | `false` |
| **How to Play Guide Modal** | `390×844` | `362 px` | `3` | `44.0 px` | `true` | `false` |
| **Well Modal (Well 1)** | `390×844` | `362 px` | `3` | `44.0 px` | `true` | `false` |
| **Treasure Modal (Treasure 1)** | `390×844` | `362 px` | `4` | `44.0 px` | `true` | `false` |
| **Wisdom Modal (Wisdom 1)** | `390×844` | `362 px` | `2` | `44.0 px` | `true` | `false` |
| **Stand Modal (Active Combat — Stand 4)** | `390×844` | `362 px` | `8` | `44.0 px` | `true` | `false` |
| **Stand Modal (Cleared Read-Only — Stand 5)** | `390×844` | `362 px` | `2` | `44.0 px` | `true` | `false` |
| **Gatehouse / Save Modal** | `390×844` | `362 px` | `4` | `44.0 px` | `true` | `false` |
| **Finale / Ending Modal (§300)** | `390×844` | `362 px` | `3` | `44.0 px` | `true` | `false` |

### D. Verification Screenshots
- [pass5-ending-299-modal.png](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass5-ending-299-modal.png) — Section 299 (The Good Ending) modal with stat summary, hint line, and hidden HUD.
- [pass5-ending-sea-of-glass-clean.png](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass5-ending-sea-of-glass-clean.png) — Clean Sea of Glass post-ending view showing only `↺ Return to Title` and the `NW1 Code`.
- [pass5-ending-300-modal.png](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass5-ending-300-modal.png) — Section 300 (The True Ending) modal top view.
- [pass5-ending-300-summary.png](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass5-ending-300-summary.png) — Section 300 stat summary (`8/8` Stands, `4 Given · 0 Kept`, `"You found the True Ending..."`).
- [pass5-well3-camera-clear.png](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass5-well3-camera-clear.png) — Unobstructed camera view after jumping to `Well 3` and closing the modal (`Interact: Well 3 · The Columbarium Bench & Sea of Glass (Section 175)`).
- [pass5-mobile-390x844-stand.png](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass5-mobile-390x844-stand.png) — `390×844` mobile pass on Stand 4 with all 8 buttons `>= 44 px` tall and zero overflow.
- [pass5-mobile-390x844-finale.png](file:///Users/Timotheus/Desktop/Narrow Way Walk/screenshots/pass5-mobile-390x844-finale.png) — `390×844` mobile pass on the Section 300 Ending Modal & Pilgrim Walk Summary.
