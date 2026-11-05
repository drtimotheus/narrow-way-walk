# Watchman Balance — Changes & Simulation Report (`CHANGES-watchman.md`)

## Overview
Implemented **Watchman Balance** for **The Narrow Way Walk — Zone I** (starting from commit `66450f9`, backed up on branch `backup-pre-watchman`). No difficulty selector was added; all story text, KJV scripture, art, stage gating, and save compatibility remain intact.

---

## 1. Old vs. New Numbers

### A. Player Starting Stats & Resources (`src/main.js`, `src/zone1-data.js`)
| Stat / Resource | Old Value | New Watchman Value | Notes |
| :--- | :--- | :--- | :--- |
| **Starting Courage** | `10` (Max `12`) | **`9`** (Max `12`) | Median of `1d6 + 6` (`9.5` rounded down); keeps Stronghold clashes meaningful after Step 1 / Scrolls |
| **Starting Strength** | `20` (Max `20`) | **`20`** (Max `20`) | Unchanged max; all passive/free Strength gains on Treasures and walk-outs removed |
| **Starting Favor** | `9` (Max `9`) | **`9`** (Max `9`) | Used for `Test Favor` (`4 Str` vs `1 Str`), Stand 4 walk-out (`1 Favor`), or Treasure Give (`1 Favor`) |
| **Flask of Oil** | `1` start + `1` at Stand 6 (`+4 Str`) | **`1` start + `1` at Stand 6 (`+4 Str`)** | Usable mid-fight in `#stand-modal` |
| **Loaves of Bread** | `2` start (`+2 Str` at Wells only) | **`2` start (`+2 Str` mid-fight or at Wells)** | Now usable directly mid-fight in `#stand-modal` (`#btn-stand-bread`) as well as at Wells |
| **Wells of Living Water (1–4)** | `+4 Strength`, `+1` to `+2 Favor`, repeatable | **`+2 Strength`, `+1 Favor`, single-use (`1/1`)** | Half healing; each Well can be used only once per walk |

### B. Strongholds (`STANDS` in `src/zone1-data.js`)
Every Stronghold receives **`+1` to its roll (`rollBonus: 1`)** and **`+2` Strength** (`Stand 8` boss receives **`+1` roll and `+3` Strength**).
- **Ties (`pTotal === eTotal`):** Player now **loses `1 Strength`** instead of nothing happening.
- **Stand 4 Victory Law Walk-Out:** Still available before Round 1 (`Proverbs 27:2` / `Matthew 6:3–4`), but now **costs `1 Favor` (if `Favor >= 1`) or `1 Strength`** and grants no free stat bonus (`+0 Courage, +0 Strength`).

| Stand | Stronghold | Old Roll (`2d6+C`) | New Watchman Roll (`2d6+C+1`) | Roll After Step 1 / Scroll | Old Strength | New Watchman Strength |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Stand 1** | Pride (#15) · *The Applause Echo* | `2d6+7` | **`2d6+8`** | `2d6+7` (`6` Str after Scroll) | `6` | **`8`** (`+2`) |
| **Stand 2** | Fear (#2) · *The Contract Clause* | `2d6+7` | **`2d6+8`** | `2d6+7` (`6` Str after Scroll) | `6` | **`8`** (`+2`) |
| **Stand 3** | Jealousy (#9) · *The Green Room Monitor* | `2d6+8` | **`2d6+9`** | `2d6+8` (`8` Str after Step 1) | `8` | **`10`** (`+2`) |
| **Stand 4** | Pride (#15) · *The Back-Room Boast* | `2d6+11` | **`2d6+12`** | Walk-out costs `1 Favor` or `1 Strength` (`2d6+10` if fought with Scroll) | `12` | **`14`** (`+2`) |
| **Stand 5** | Bitterness (#5) · *The Broken Bridge* | `2d6+8` | **`2d6+9`** | `2d6+8` (`8` Str after Step 1) | `8` | **`10`** (`+2`) |
| **Stand 6** | Fear (#2) · *The Studio Ultimatum* | `2d6+8` | **`2d6+9`** | `2d6+8` (`8` Str after Step 1) | `8` | **`10`** (`+2`) |
| **Stand 7** | Shame (#3) · *The Open Mic Question* | `2d6+9` | **`2d6+10`** | `2d6+9` after Step 1; `2d6+8` (`8` Str) after Scroll | `8` | **`10`** (`+2`) |
| **Stand 8 (Boss)** | Despair (#1) · *The Whisper in the Rain* | `2d6+10` | **`2d6+11`** | `2d6+9` (`11` Str after Step 1 / Scroll) | `12` | **`15`** (`+3`) |

### C. Cost of Failure — "Fallen, but not forsaken" (`triggerGraceFall` in `src/main.js`)
When player Strength reaches `0` during a Stand:
- Opens `#grace-modal` (**"Fallen, but not forsaken"**) with **Micah 7:8 (KJV)**:
  > *"Rejoice not against me, O mine enemy: when I fall, I shall arise; when I sit in darkness, the LORD shall be a light unto me."* — Micah 7:8 (KJV)
- Restores **Strength to `50%` (`10 / 20`)**.
- Deducts **`1 Treasure`** if `Treasure > 0` (`Math.max(0, treasure - 1)`).
- Leaves that Stand **un-cleared** and returns the player to the **start of the current stage** (no full walk restart).

### D. True Ending as Sacrifice (`TREASURES` in `src/zone1-data.js`, `openTreasureModal` / `resolveTreasure` in `src/main.js`)
- Every **Give** choice across Treasures 1–8 now requires a real sacrifice chosen by the player:
  - **`Give (Cost: 2 Strength · Gain: +1 Treasure)`** (requires `Strength > 2` so you cannot self-KO on a Treasure), OR
  - **`Give (Cost: 1 Favor · Gain: +1 Treasure)`** (requires `Favor >= 1`).
- Displays **`Cost: 2 Strength or 1 Favor · Gain: +1 Treasure`** in `#treasure-modal`.
- Removes previous free `+1 Strength` / `+2 Strength` gains from Treasures 2, 3, 5, and 7.
- Keeps the threshold of **`4+ Treasure`** for **Section 300 (The True Ending)**.

### E. UI & Onboarding Updates (`index.html`, `src/main.js`)
- **Title Screen (`#title-modal`):** Added `"Watchman difficulty — stand firm."` above `#btn-title-start`.
- **Stand Modal (`#stand-enemy-roll`, `#btn-stand-roll`):** Shows the Stronghold's active roll bonus (`"Stronghold rolls 2d6+9"`, updating live when Step 1 or a KJV Scroll lowers Stronghold Courage) and adds the mid-fight `#btn-stand-bread` button alongside `#btn-stand-oil`.
- **How to Play (`#welcome-modal`, `#guide-modal`) & Coach Tip (`#stand-coach-tip`):** Updated to explain Stronghold roll bonuses, tie damage (`-1 Strength`), mid-fight Oil & Bread recovery, single-use Wells (`+2 Strength, +1 Favor`), Treasure sacrifice (`2 Strength` or `1 Favor`), and the `"Fallen, but not forsaken"` grace rule.

---

## 2. Headless Simulation Results (`1,000` Runs per Strategy)

Executed via headless Node simulator (`sim-watchman.mjs`) importing the live `STANDS`, `WELLS`, `TREASURES`, and `SCROLLS` data and combat math from `src/zone1-data.js`:

| Strategy (`N = 1,000` runs each) | Avg Stands Lost / Run | Target (`1–3` for Careful) | True Ending Rate (`>= 4` Treasure, §300) | Avg Final Treasure (Given / Lost on Falls) | Avg Ending Strength | Unwinnable Runs |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Careful Player** *(Gives when healthy, saves Oil/Bread/Favor for Stand clashes)* | **`1.40`** | ✅ **`1–3` Stands** | `39.0%` (`61.0%` §299) | `2.83` (`3.81` Given, `0.98` lost) | `12.8 / 20` | **`0 / 1,000` (`0.0%`)** |
| **All-Give Player** *(Gives on every affordable Treasure using Favor/Strength, uses Oil/Bread wisely)* | **`1.81`** | ✅ **`1–3` Stands** | ✅ **`84.7%`** (Target `>= 50%`) | `5.93` (`7.62` Given, `1.69` lost) | `12.6 / 20` | **`0 / 1,000` (`0.0%`)** |
| **All-Keep Player** *(Never sacrifices at Treasures; preserves all Strength/Favor for Stands)* | **`0.91`** | — | `0.0%` (`100.0%` §299) | `0.00` (`0.00` Given, `0.00` lost) | `14.1 / 20` | **`0 / 1,000` (`0.0%`)** |

---

## 3. Manual & Mobile Verification Summary
1. **Fresh Save → Good Ending (§299):** Played from Title Screen through Stages 1–6 to the Sea of Glass with `< 4` Treasure; verified Section 299 modal, single-use Wells (`+2 Strength, +1 Favor`, read-only `Used 1/1` on revisit), Stand 4 walk-out cost (`1 Favor` or `1 Strength`), and tie damage (`-1 Strength`).
2. **Intentional Stand Loss ("Fallen, but not forsaken"):** Verified losing a Stand at `0` Strength opens `#grace-modal` with `Micah 7:8 (KJV)`, restores Strength to `10/20` (`50%`), deducts `1 Treasure` (`1 -> 0`), leaves the Stand un-cleared, and teleports the player back to the start of the current stage.
3. **Fresh Save → True Ending (§300):** Played from Title Screen through Stages 1–6 sacrificing `2 Strength` or `1 Favor` across Treasures 1–8 and using mid-fight Oil/Bread; reached the Sea of Glass with `>= 4` Treasure (`7` Treasure after 1 Stand fall) and verified Section 300 modal.
4. **Mobile Layout (`390×844`):** Verified via Chrome DevTools device emulation (`390×844`) that `#title-modal`, `#stand-modal` (including the 5-button bottom action row), `#treasure-modal`, and `#grace-modal` all have `>= 44px` button heights and zero horizontal overflow.
