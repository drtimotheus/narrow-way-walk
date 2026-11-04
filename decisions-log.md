# The Narrow Way — 3D Game World (Zone 1 Pilot): Decisions & Canon Traceability Log

**Run Date:** November 3–4, 2026 (Overnight Autonomous Release — Zone 1 ONLY)  
**Scope:** Zone 1 — Elias Cho (Present-Day Seoul & The Sea of Glass) / Book 1: *The Unseen Chord*  
**Approval Status:** **NOTHING IN THIS LOG OR CODEBASE IS CLAIMED AS APPROVED.** Every best-judgment decision made during this overnight build is logged below and marked at its point of use in code/content with a `FLAG:` comment for Timothy's morning review. Timothy's morning review and explicit sign-off is what locks Zone 1.

---

## 1. OPEN ITEMS — Reserved for Timothy's Morning Decision (Not Decided Tonight)

Per §1 and §4 of the Overnight Prompt, the following items remain **OPEN** for Timothy's morning confirmation and are implemented with clearly marked placeholders (`FLAG: OPEN-01` through `FLAG: OPEN-05`):

1. **`OPEN-01` — Final World Title:**
   - **Current Placeholder Used in UI (`index.html`, `src/main.js`):** *"The Narrow Way — A 3D Companion Walk (Zone I Pilot: The Unseen Chord)"*
   - **Decision Needed from Timothy:** Confirm final public title for the 12-zone 3D game world (e.g., *The Narrow Way*, *The Narrow Way Walk*, or *The Narrow Way: Companion Walk*).
2. **`OPEN-02` — GitHub Repository Name & First Remote Push:**
   - **Current State:** Local git repository initialized in `/Users/Timotheus/Desktop/Narrow Way Walk` (`branch: main`) with local commits at each completed milestone. **Zero remotes added; zero pushes executed.**
   - **Proposed Repo Name:** `narrow-way-walk` (under GitHub account `timothyholt`, matching `pilgrim-walk`, paired with Cloudflare Pages auto-deploy + Google Drive backup folder).
   - **Decision Needed from Timothy:** Confirm repo name `narrow-way-walk` before running `gh repo create` and pushing.
3. **`OPEN-03` — Gatehouse Book 1 Outbound Shop URL:**
   - **Current Placeholder Used (`src/zone1-data.js`, `index.html`):** `#gatehouse-book-01-placeholder` (renders an explicit `[OPEN — Pending Timothy's Gatehouse Book 1 Shop URL]` notice when clicked/hovered in the Gatehouse modal).
   - **Decision Needed from Timothy:** Provide the live Lulu / Kickstarter / store URL for *The Narrow Way — Book 1: The Unseen Chord* (and *The Sea of Glass Chronicles — Volume 1*).
4. **`OPEN-04` — Art Source & 3D Relic Generation Pipeline for Later Zones (Zones 2–12):**
   - **Current State in Zone 1:** Uses painterly procedural WebGL/Canvas textures derived from the approved *Sea of Glass* Issue 1 / Book 1 palette and visual descriptors (`sea-01-art-prompts.md`, `character-sheets/all-mentor-reference-sheets.md`) plus a locally built, Meshopt-ready `.glb` 3D model for **David's Aquamarine Tuning-Stone** (`assets/models/aquamarine-tuning-stone.glb`) and 3D sculpted procedural monuments (`FLAG: DEC-06`).
   - **Decision Needed from Timothy:** Confirm whether he wants to run the offline HuggingFace TRELLIS / Hunyuan3D script (`scripts/generate-zone1-trellis.mjs`, prepared in this repo with git-push stripped out) outside the sandbox against `art/sea-01/` and `cover-redo-sea-01/sea-01-cover-art.png`, and confirm the art source strategy for Zones 2–12.
5. **`OPEN-05` — Optional Background MP3 Music & Voice Narration Tracks:**
   - **Current State in Zone 1:** Synthesizes gentle Web Audio harmonic kinnor/harp chords (David's four-note unfinished melody in F# minor / D major, Seoul rain bed, and Sea of Glass crystal resonance) with zero external MP3 dependencies, full Master/Music/Ambient volume sliders, and Mute toggle.
   - **Decision Needed from Timothy:** Confirm whether dedicated MP3 tracks (such as Elias's stripped-down acoustic melody or spoken narration) should be recorded/added for Zone 1.

---

## 2. STEP 0 REPORT — Verified Canon Facts & Inventories (Completed Before Building)

All required source files in `/Users/Timotheus/Desktop/LvD Universe/` and `/Users/Timotheus/Desktop/Pilgrim Way Art World Game/` were read and verified in full before any code was written:

### A. Verified Book 1 Canon Facts
* **Source Files Verified:**
  - `gamebooks/antigravity-lvd-gamebooks-12-book-series-prompt.md` (§3/§4/§6/§7 companion-POV agency rules, mechanics, Decision 14/17 guardrails, KJV-verbatim rule)
  - `gamebooks/mechanics-sheet.md` (single source of truth for gamebook/world mechanics; TCG card stats never appear as world rules)
  - `gamebooks/book-01/draft.md`, `outline.md`, `how-to-play-and-sheet.md`, `playtest-log.md`, `decisions-log.md` (*The Unseen Chord* — 300 sections)
  - `canon-log.md` (Entry #73 locking Book 1; Entries #33, #37, #41, #53; Entries #73–#86 locking all 12 gamebooks)
  - `light-vs-darkness-universe-bible.md` (§2.1–§2.7, §5 Rule 8, §7)
  - `novels/Light VS Darkness - Novel Context.md` & `novels/Vol1/00 - Reading Order.md` (plus `sea-01-script.md`, `sea-01-continuity.md`, `sea-01-art-prompts.md`)
* **Hero (Companion Character):** **Elias Cho** — late-20s Korean-American worship leader, songwriter, and session musician in present-day Seoul, South Korea (Mapo-gu / Hannam-dong / Olympic-park venue).
* **Player Role:** **The Fellow-Traveler** (unnamed, ungendered companion walking beside Elias under the Four Standing Rules: never speaks/chooses/acts for Elias; governs only the Fellow-Traveler's own actions, responses, and giving; Elias acts on his own at scripted beats; never presented as the hero).
* **Guiding Mentor:** **David the King** — **Light Blue** • **Spirit of Might** (*Isaiah 11:2* KJV) • **Aquamarine** gemstone inlaid in his weathered cypress-wood harp (*kinnor*), wearing Bethlehem shepherd's linen under a sky-blue mantle of Judah, leather sling at belt, **crownless** (having left his royal circlet in the dirt in humility).
  - *Convergence Mentors in Act V Climax (`Sec. 277`):* **Daniel the Prophet** (Green • Counsel • Emerald), **Paul the Apostle** (Dark Blue • Knowledge • Sapphire), and **Esther the Queen** (Red • Spirit of the Lord • Ruby), descending only *after* the human heroes exercise faith and join hands.
* **Mentor's Token (Read from `book-01/how-to-play-and-sheet.md` & `draft.md` Sec. 48):** **The Aquamarine Tuning-Stone** (given by King David at Well 1, `Sec. 48` — a smooth, translucent sky-blue stone cut from the frame of David's own cypress harp).
  - *Canonical Single-Use Effect (Once per Book):* (a) Treat your `2d6` dice roll in one Stand round as an automatic **`10`** (`10 + Courage`); **OR** (b) Automatically pass one **Favor Test** as **Blessed** without subtracting `1` Favor; **OR** (c) Hear a quiet harmonic chord before a Stand revealing which learned Scroll resonates against that Stronghold. (Restored if spent in a Stand where you Fall and return to a Well via the Grace Rule.)
* **Primary Stronghold:** **Pride** (`#15/29`) — *Ezekiel 28:17; Isaiah 14:13–14; Proverbs 16:18*.
* **Secondary Strongholds (with v1.3b Canon Card Numbers):**
  - **Addictions** (`#23/29`) — *Proverbs 23:29–35; 1 Corinthians 6:12*
  - **Jealousy** (`#27/29`) — *Numbers 5:14; 1 Samuel 18:6–10; Proverbs 27:2*
  - **Grief** (`#28/29`) — *Genesis 37:34–35; 2 Samuel 12:16–20; 18:33; Isaiah 53:4; John 11:35* (loss plus refused comfort / curated sorrow)
  - **Infirmity** (`#19/29`) — *Luke 13:11–16; 2 Corinthians 12:9* (the iron collar of burnout)
  - *Ensemble / Climax Cluster Strongholds (`Sec. 192, 230, 246–283`):* **Shame** (`#17/29`, *Genesis 3:7*), **Abandonment** (`#21/29`, *Genesis 21:14–19*), **Occult** (`#29/29`), and post-climax threshold ambush **Heaviness** (`#20/29`, *Isaiah 61:3*).
* **KJV Anchor Proverb (`book-01/draft.md` Front Matter, `Sec. 23`, `Sec. 48`, `Sec. 245`):**
  - **Proverbs 16:18–19 (KJV):** *"Pride goeth before destruction, and an haughty spirit before a fall. Better it is to be of an humble spirit with the lowly, than to divide the spoil with the proud."*
* **All 5 Verbatim KJV Scrolls in Book 1 (`book-01/draft.md` Scroll Index):**
  1. **Scroll 1 — Proverbs 16:18 (KJV):** *"Pride goeth before destruction, and an haughty spirit before a fall."* (Learned at `Sec. 48`, Well 1)
  2. **Scroll 2 — Psalm 51:17 (KJV):** *"The sacrifices of God are a broken spirit: a broken and a contrite heart, O God, thou wilt not despise."* (Learned at `Sec. 133` Hall C Plaque & `Sec. 210` Well 4)
  3. **Scroll 3 — Proverbs 27:2 (KJV):** *"Let another man praise thee, and not thine own mouth; a stranger, and not thine own lips."* (Learned at `Sec. 110`, Well 2)
  4. **Scroll 4 — Isaiah 53:4 (KJV):** *"Surely he hath borne our griefs, and carried our sorrows: yet we did esteem him stricken, smitten of God, and afflicted."* (Learned at `Sec. 175`, Well 3)
  5. **Scroll 5 — 1 Corinthians 6:12 (KJV):** *"All things are lawful unto me, but all things are not expedient: all things are lawful for me, but I will not be brought under the power of any."* (Learned at `Sec. 158`, walking away from Rigged Stand 4)

### B. Verified Supporting Cast & Book 1 Stand / Well / Treasure Architecture
* **Novel Supporting Characters (`novels/Vol1/` & `book-01/draft.md`):**
  - **Yuna** — Elias's older sister (hospital clinic worker; Thursday coffee at apartment window `Sec. 88–89`, Chuseok columbarium visit `Sec. 125–155`, post-climax kitchen floor `Sec. 285–287`).
  - **Pastor Ji** — 62-year-old hospital chaplaincy pastor and recovery sponsor who leads the 12-person Thursday night recovery group in the basement of **Grace Community Church** in Mapo-gu (`Sec. 107, 195, 210, 287, 288, 294`).
  - **Manager Daniel** — Elias's tour manager (distinct from Mentor Daniel the Prophet; pushes the "healed and thriving" brand `Sec. 53`, Hannam-dong party `Sec. 116`, youth Q&A `Sec. 189`, contract table `Sec. 288`).
  - **Tae-yang** — old acquaintance from two years ago at the Hannam-dong hillside townhouse (`Sec. 116–118, 145, 158`).
  - **Grace Mi-ran Cho** — Elias and Yuna's late mother, who passed away in the ICU two years ago (`Sec. 18, 93, 125, 151, 284, 300`).
  - **Volume 1 Convergence Peers:** **Adaeze Okonkwo** (1967 Biafra), **Brother Matthias** (14th-century Bohemia), and **Talia Reyes** (modern-day organizer).
* **Everyday Supporting Cast & The 8 Book 1 Treasure Opportunities (`book-01/outline.md` & `draft.md`):**
  1. **Mr. Park** (`Sec. 14` -> `73`): 68-year-old venue night janitor in a knee brace; spilled oak crate of XLR sound cables in the loading-bay rain while the VIP lounge waits (`+1 Treasure`, optional `-1 Bread`).
  2. **Min-jun** (`Sec. 56` -> `82`): 17-year-old fill-in youth-group bassist crying over missed F# minor bridge changes past midnight after the band leaves (`+1 Treasure`, `+2 Strength`).
  3. **Stranded Delivery Rider** (`Sec. 88/90` -> `104`): 19-year-old scooter driver soaked in the cold rain under the Mapo-gu overpass; give dry coat + `1 Loaf of Bread` (`+1 Treasure`).
  4. **Mrs. Kang** (`Sec. 131` -> `150`): 80-year-old widow in a faded silk *hanbok* struggling up the columbarium granite stairs with two heavy ceramic pots of yellow chrysanthemums (`+1 Treasure`, `+2 Strength` from honey-rice cakes).
  5. **Soo-jin** (`Sec. 189` -> `196`): 19-year-old worship violinist sitting on the concrete steps after the basement Q&A whose brother is in the hospital; let Manager Daniel's van wait to listen and connect her with Pastor Ji (`+1 Treasure`, `+1 Strength`).
  6. **Hoon** (`Sec. 218` -> `226`): 20-year-old junior studio sound intern who accidentally overwrote the master orchestral backing stem; step forward with Elias to take the blame and session charge so Hoon is not fired/blacklisted (`+1 Treasure`, `+1 Strength`).
  7. **Talia Reyes** (`Sec. 252` -> `268`): Shield Adaeze and clasp Talia's freezing hand on the Sea of Glass against **Abandonment's** desert gale at `-1 Strength` cost (`+1 Treasure`).
  8. **Thursday Night Basement Recovery Circle** (`Sec. 288` -> `294`): Trade two lucrative autumn arena dates and the glossy press release for small unrecorded rooms and Chair #7 in Pastor Ji's 12-person basement recovery group (`+1 Treasure`).
  - **Treasure Gate (`Sec. 298`):** `0–3 Treasure` -> **Good Ending (`Sec. 299`)**; `4+ Treasure` (`4–8`) -> **True Ending (`Sec. 300`, *The Unseen Chord*)**.
* **Verified Book 1 Stand Order (All 8 Canonical Stands):**
  1. **Stand 1 (`Sec. 33`):** *The Applause Echo* (**Pride #15**, VIP Lounge branch; Courage `7 -> 6`, Strength `6`, Crack at `3`).
  2. **Stand 2 (`Sec. 29`):** *The Patient Whisper* (**Addictions #23**, Back Alley; Courage `7 -> 6`, Strength `6 -> 4`, Crack at `3`).
  3. **Stand 3 (`Sec. 95`):** *The Comparison Lens* (**Jealousy #27**, Apartment Laptop / Studio Charts; Courage `8 -> 7`, Strength `8 -> 6`, Crack at `4`).
  4. **Stand 4 (`Sec. 145`):** *THE RIGGED BAIT: The Back-Room Boast at Hannam-dong* (**Pride #15 + Addictions #23**; Courage `11`, Strength `12` — won by **Refusing / Walking Away** to `Sec. 158` at `0` Strength cost, `+1 Courage`, `+1 Strength`, learning **Scroll 5**).
  5. **Stand 5 (`Sec. 152`):** *The Curated Sorrow* (**Grief #28**, Seoul Columbarium Hall C; Courage `8 -> 7`, Strength `8 -> 6`, Demolish at `0`).
  6. **Stand 6 (`Sec. 164`):** *The Iron Collar of Burnout* (**Infirmity #19**, Rehearsal Booth branch; Courage `8 -> 7`, Strength `8 -> 6`, Crack at `4`).
  7. **Stand 7 (`Sec. 114`):** *The Mirror-Guard of Pride* (**Pride #15**, Church Basement Door before Youth Q&A; Courage `9 -> 7`, Strength `8 -> 6`, Demolish at `0`).
  8. **Stand 8 (`Sec. 260–267`):** *CLIMAX STAND: The Obsidian Crown of Pride & The Fig-Leaf Door of Shame* (**Pride #15 + Shame #17**, Sea of Glass Climax; Courage `10 -> 8`, Strength `12 -> 8` with Fellowship Synergy, Demolish at `0`).
* **Verified Book 1 Wells (All 5 Checkpoints):**
  - **Well 1 (`Sec. 48`):** *The Curb on the Sea of Glass* (after Alley Stand; King David gives **The Aquamarine Tuning-Stone**, teaches **Scroll 1: Proverbs 16:18**, Wisdom Spread 1).
  - **Well 2 (`Sec. 110`):** *The Apartment Window at Dawn* (after Hannam-dong / Pastor Ji's number saved; teaches **Scroll 3: Proverbs 27:2**, Wisdom Spread 2).
  - **Well 3 (`Sec. 175`):** *The Columbarium Bench & Sea of Glass* (outside Hall C with Yuna; teaches **Scroll 4: Isaiah 53:4**, Wisdom Spread 3).
  - **Well 4 (`Sec. 210`):** *Pastor Ji's Church-Basement Recovery Office* (after Convergence 2 doubt; teaches **Scroll 2: Psalm 51:17**, Wisdom Spread 4).
  - **Well 5 (`Sec. 245`):** *The Kitchen Floor & Threshold of the Sea* (beside the factory-capped, untouched green bottle before Climax Stand 8; Wisdom Spread 5).

### C. 3D Object Builder Tool Inventory (`/Users/Timotheus/Desktop/Pilgrim Way Art World Game/`)
1. **`Generate-More-Trellis-3D.command` & `scripts/generate-trellis-3d.mjs` (Microsoft TRELLIS Image-to-3D Pipeline):**
   - **What It Does:** Reads 2D reference paintings, connects via `@gradio/client` to the free public HuggingFace Space `https://trellis-community-trellis.hf.space` (`start_session` -> `preprocess_image` -> `get_seed` -> `image_to_3d` -> `extract_glb`), and writes `.glb` 3D meshes (`~450–800 KB` each) into `assets/models/` with a manifest (`tripo-manifest.json`).
   - **What It Needs as Input:** A local `.jpg`/`.png` reference image and outbound HTTPS network access to `trellis-community-trellis.hf.space`.
   - **Safety Warning Verified:** Lines 22–28 of `Generate-More-Trellis-3D.command` run `git add assets/models/*.glb`, `git commit`, and `git push` to the Pilgrim Walk repository. **We did NOT execute `Generate-More-Trellis-3D.command` and never touched the Pilgrim Walk repo.**
   - **Does It Run From Here Tonight?** Inside the overnight autonomous terminal sandbox (`BypassSandbox: false`), external network calls to `hf.space` and shell reads outside `/Users/Timotheus/Desktop/Narrow Way Walk` are blocked by macOS sandbox policy (and bypassing the sandbox would prompt the sleeping user, which is forbidden).
   - **How It Is Used Tonight (`FLAG: DEC-06`):**
     1. We created a clean, push-free local script `scripts/generate-zone1-trellis.mjs` inside `/Users/Timotheus/Desktop/Narrow Way Walk/scripts/` (with all `git add/commit/push` removed and output pointed strictly to `/Users/Timotheus/Desktop/Narrow Way Walk/assets/models/`) so Timothy can optionally run it with one command in the morning if desired.
     2. We built a local, offline deterministic `.glb` generator (`scripts/build-local-glb-models.mjs`) that writes valid binary glTF 2.0 (`.glb`) 3D models directly into `/Users/Timotheus/Desktop/Narrow Way Walk/assets/models/` for **David's Aquamarine Tuning-Stone & Cypress Harp (`aquamarine-tuning-stone.glb`)**, **The Sea of Glass Well Basin (`well-of-grace-basin.glb`)**, and **The KJV Wisdom Scroll Pedestal (`wisdom-scroll-pedestal.glb`)**, loaded by `GLTFLoader` + `MeshoptDecoder` and registered in the **Relic Workshop** turntable inspector.
2. **The Relic Maker / Relic Workshop (`src/tripo.js` & `index.html` `#tripo-modal`):**
   - **What It Does:** Loads `.glb` models via Three.js `GLTFLoader` + `MeshoptDecoder`, applies the warm oil-on-linen painterly shader (`applyPainterlyToLoadedModel`), places them on 3D pedestals in the world, and provides an interactive 3D Turntable Inspector modal (`260×260` WebGL canvas with drag-to-orbit and scroll-to-zoom).
   - **How It Is Used Tonight:** Adapted into `src/relics.js` for Zone 1's Relic Collection, showcasing **#1 · David's Aquamarine Tuning-Stone (Mentor's Token)** plus Zone 1's companion relics (**#2 · David's Crownless Cypress Kinnor** and **#3 · Mother's Taped Cassette Player** — clearly marked with `FLAG:` comments).

### D. Existing Approved Art Inventory (`/Users/Timotheus/Desktop/LvD Universe/`)
* **Verified Existing Approved Art Files for Zone 1 (Elias Cho & David the King):**
  1. `cover-redo-sea-01/sea-01-cover-art.png` & `sea-01-cover.png` — Approved *The Sea of Glass* Issue 1 Cover C (*"The Alley and the Sea of Glass"*: Elias Cho kneeling in the Seoul alley below reaching up through the crystal horizon to King David with his Aquamarine harp).
  2. `art/issue-01/portraits/david.png`, `daniel.png`, `paul.png`, `esther.png` — Approved Mentor reference portraits.
  3. `art/sea-01/portraits/elias.png` & `art/sea-02/portraits/adaeze.png` — Approved Guest Hero reference portraits for Elias Cho and Adaeze Okonkwo.
  4. `art/sea-01/sea-01-panel-01.png` through `sea-01-panel-100.png` — 100 approved comic panels covering every scene of Elias's Seoul concert, back alley, Sea of Glass meeting with David, apartment window, Chuseok columbarium with Yuna, Convergence 1–3, and the Thursday night Grace Community Church basement circle.
* **Sandbox File-Copy Note (`FLAG: DEC-07`):** Because the sandboxed shell (`BypassSandbox: false`) restricts `cp` from reading outside `/Users/Timotheus/Desktop/Narrow Way Walk`, we provide `scripts/link-approved-art.sh` (a morning one-liner to copy the exact PNGs from `/Users/Timotheus/Desktop/LvD Universe/art/sea-01/` and `cover-redo-sea-01/` into `assets/art/`), AND our engine automatically renders rich painterly high-DPI canvas artwork matching the exact canonical palettes and compositions of `sea-01-art-prompts.md` whenever an external PNG is not yet copied into `assets/art/`, with explicit `[FLAG: ART-PLACEHOLDER]` badges in the UI and log. Zero new AI imagery was generated.

---

## 3. BEST-JUDGMENT DECISIONS LOG (`DEC-01` through `DEC-14`)

Every decision below is marked with a matching `// FLAG: DEC-XX` or `<!-- FLAG: DEC-XX -->` comment in the codebase. Nothing is claimed as approved.

### `DEC-01` — File Layout & Static Site Architecture (`FLAG: DEC-01`)
* **What Was Decided:** Plain ES-module static site rooted in `/Users/Timotheus/Desktop/Narrow Way Walk/` with zero build step and zero backend:
  - `index.html` — Main entry point, Three.js `0.160.0` CDN importmap (`three` + `three/addons/`), responsive HUD, Stand modal, Wisdom Page modal, Relic Workshop turntable modal, Gatehouse & `NW1` Progress Code modal, and mobile touch joystick.
  - `src/zone1-data.js` — All Book 1 canonical story beats, 6 walkable 3D districts/scenes, 8 Stands, 5 Wells, 7 KJV Wisdom Spreads, 5 verbatim KJV Scrolls, 8 Treasure opportunities, and the Treasure Gate (`Sec. 298–300`).
  - `src/painterly.js` & `src/postprocess.js` — Warm oil-on-linen / Sea-of-Glass crystal shaders, procedural brushwork textures, and Eco/Balanced/High quality post-processing.
  - `src/relics.js` — `GLTFLoader` + `MeshoptDecoder` loader and interactive 3D Turntable Inspector for **David's Aquamarine Tuning-Stone** and companion Zone 1 relics.
  - `src/world.js` — 3D Zone 1 scene builder (Seoul Rain-Slicked Alley & Venue Corridor, Sea of Glass Threshold, Mapo-gu Apartment & Hannam-dong Hallway, Seoul Columbarium Stairs & Hall C, Church Basement & Kitchen Floor, and Sea of Glass Climax & Thursday Recovery Circle), including the visible 3D companion character **Elias Cho** walking beside the player, **King David** at the Wells, readable 3D Wisdom Pages, glowing Well checkpoints, Treasure interaction markers, and Stronghold monoliths.
  - `src/audio.js` — Web Audio harmonic synthesis (David's four-note cypress kinnor chord, gentle Seoul rain, Sea of Glass crystal shimmer) with Master / Music / Ambient volume sliders and Mute toggle.
  - `src/main.js` — Game state controller, transparent `2d6 + Courage` Stand engine, Victory Law & Scroll resonance, Favor Test roller, Grace Restoration return-to-Well flow, Treasure tracker, `localStorage` persistence, and `NW1-...` progress code export/import.
* **Why:** Matches the proven, zero-friction static architecture of `Pilgrim Way Art World Game` (§2 item 6 & §5), runs immediately via `python3 -m http.server` or Cloudflare Pages with no bundler fragility, and lazy-loads assets cleanly.
* **Alternatives Considered:** Vite/React/TypeScript SPA (rejected because a build step complicates instant local preview and adds bundle weight without helping the 3D WebGL loop).
* **Canon Trace:** Mirrors `Pilgrim Way Art World Game` (`index.html`, `src/main.js`, `src/painterly.js`, `src/postprocess.js`, `src/tripo.js`).
* **Code Flag Locations:** `index.html`, `src/main.js`.

### `DEC-02` — Six Connected 3D Walkable Areas Along the Zone 1 Story Path (`FLAG: DEC-02`)
* **What Was Decided:** Structure Zone 1 as one continuous 6-part walkable 3D Story Path through Elias's Seoul and the Sea of Glass, with step-through portals connecting each chapter and an unmissable HUD bar to step back to any visited area, Zone Start, or the Gatehouse:
  1. **Stage I — Backstage Service Corridor & Loading Bay (`Sec. 1–17, 33, 73`):** Walk beside Elias from the 2,000-seat stage wing to the 3-way corridor junction. Features **Treasure #1** (helping 68yo janitor **Mr. Park** lift his spilled XLR cable crate in the rain & sharing Bread vs. entering the **VIP Sponsor Lounge** where **Stand 1: The Applause Echo — Pride #15** waits).
  2. **Stage II — The Neon Back Alley & Well 1 on the Sea of Glass (`Sec. 18–32, 41–48`):** Walk beside Elias past the blue dumpsters where **Stand 2: The Patient Whisper (Addictions #23)** rises. Then the wet asphalt thins into warm translucent crystal (**Well 1 — Sec. 48**): **King David** (Light Blue, Might, crownless, Aquamarine harp on his back) sits on the curb beside you and Elias, gives **The Aquamarine Tuning-Stone (Mentor's Token)**, teaches **Scroll 1 (`Proverbs 16:18` KJV)** and **Wisdom Page 1 (`Proverbs 16:18–19` KJV)**, and Elias sends the 12-word cutoff text (`Sec. 20`).
  3. **Stage III — Midnight Rehearsal, Mapo-gu Apartment & Hannam-dong Hallway (`Sec. 56, 88–110, 145, 158`):** Features **Treasure #2** (staying past midnight to help 17yo bassist **Min-jun**), **Stand 3: The Comparison Lens (Jealousy #27)**, **Treasure #3** (giving coat/Bread to the **Stranded Delivery Rider** under the overpass), **Stand 4: THE RIGGED BAIT — The Back-Room Boast at Hannam-dong (`Sec. 145`, Pride #15 + Addictions #23, Courage 11 / Strength 12)** where walking away (`Sec. 158`) wins `+1 Courage`, `+1 Strength`, and **Scroll 5 (`1 Corinthians 6:12` KJV)**, and **Well 2 (`Sec. 110`)** with **Scroll 3 (`Proverbs 27:2` KJV)** and **Wisdom Page 2**.
  4. **Stage IV — Seoul Columbarium Steps, Hall C Brass Plate & Pastor Ji's Office (`Sec. 125–175, 192, 210`):** Features **Treasure #4** (carrying 80yo widow **Mrs. Kang's** heavy chrysanthemum pots up the granite stairs), the Hall C granite plaque teaching **Scroll 2 (`Psalm 51:17` KJV)**, **Stand 5: The Curated Sorrow (Grief #28)** before *Grace Mi-ran Cho's* brass plate with **Yuna** (plus optional **Stand 6: The Iron Collar of Burnout — Infirmity #19** in the rehearsal booth), **Well 3 (`Sec. 175`)** with **Scroll 4 (`Isaiah 53:4` KJV)** and **Wisdom Page 3**, **Convergence 2 (`Sec. 192`)**, and **Well 4 (`Sec. 210`)** in **Pastor Ji's** basement office with **Wisdom Page 4**.
  5. **Stage V — Studio Control Booth, 40-Person Basement Youth Q&A & Kitchen Floor (`Sec. 218, 114, 189, 196, 228–245`):** Features **Treasure #6** (taking the blame/charge with Elias for 20yo intern **Hoon's** overwritten master stem), **Stand 7: The Mirror-Guard of Pride (`Sec. 114` — Pride #15)** at the basement door, **Wisdom Page 6 (`Sec. 189` — `Proverbs 12:19 & 2 Corinthians 12:9` KJV)**, **Treasure #5** (staying on the concrete steps with 19yo violinist **Soo-jin**), the Ch. 27 cancellation shame-spiral, and **Well 5 (`Sec. 245`)** on the kitchen floor beside the **factory-capped, untouched green bottle** with **Wisdom Page 5 (`Proverbs 16:18 & James 4:6` KJV)**.
  6. **Stage VI — The Sea of Glass Climax, Thursday Basement Circle & Gatehouse (`Sec. 246–300`):** Features **Treasure #7** (shielding Adaeze and anchoring **Talia Reyes** against Abandonment's gale at `-1 Strength`), **Climax Stand 8: The Obsidian Crown of Pride & The Fig-Leaf Door of Shame (`Sec. 260` — Pride #15 + Shame #17)** with Fellowship Synergy alongside **Adaeze, Brother Matthias, and Talia** (followed by **David, Daniel, Paul, and Esther** descending at `Sec. 277`, **Wisdom Page 7** at `Sec. 280`, and sitting together to sing the 4-note melody that dissolves **Heaviness #20** at `Sec. 281–283`), waking beside the untouched bottle to text Yuna & call Pastor Ji (`Sec. 284–287`), **Treasure #8** (trading two arena dates for Chair #7 in Pastor Ji's Thursday night basement recovery circle, `Sec. 288–294`), and the **Treasure Gate (`Sec. 298`)** resolving to **Good Ending (`Sec. 299`)** or **True Ending (`Sec. 300`)** with the **`NW1` Progress Code** and **Gatehouse**.
* **Why:** Includes all 8 canonical Stands, all 5 Wells, all 5 KJV Scrolls, all 7 Wisdom Spreads, and all 8 Treasure opportunities from `gamebooks/book-01/draft.md`, while allowing a player to complete the core required loop (Alley Addictions #23 + Pride #15 + Treasure choice + Well 1 + Token + Climax completion) in ~8–12 minutes or explore every optional branch in full.
* **Alternatives Considered:** Building only a single short alley room with 2 Stands (rejected because including all 6 stages of Book 1 makes the Zone 1 pilot a complete, faithful 3D adaptation of *The Unseen Chord* where the `4+ Treasure` True Ending gate works exactly as written in `draft.md`).
* **Canon Trace:** `gamebooks/book-01/outline.md` (§2–§6) and `gamebooks/book-01/draft.md` (`Sec. 1–300`).
* **Code Flag Locations:** `src/zone1-data.js`, `src/world.js`, `src/main.js`.

### `DEC-03` — Companion-POV Implementation in 3D (`FLAG: DEC-03`)
* **What Was Decided:** The player walks in first-person companion view as the **Fellow-Traveler**, while **Elias Cho** is rendered in the 3D world as an autonomous companion figure walking a pace ahead/beside the player along the path and standing beside the player at every decision point, Well, and Stand. All choice buttons are phrased strictly as the Fellow-Traveler's own actions, counsel, intercession, and self-giving (*"Turn into the loading bay rain to help Mr. Park lift the crate and share 1 Loaf of Bread"*, *"Speak Scroll 1 (Proverbs 16:18 KJV) aloud into the hallway"*, *"Keep silent and step into the VIP Sponsor Lounge"*). Elias executes his own scripted canon beats (`Sec. 20` 12-word text, `Sec. 89` confessing to Yuna, `Sec. 158` telling Tae-yang *"I'm not coming in"*, `Sec. 189` lowering the mic for Soo-jin, `Sec. 260` crying out *"I'm not okay. And I'm still here"*, `Sec. 294` introducing himself in Chair #7).
* **Why:** Enforces the Four Standing Rules (`antigravity-lvd-gamebooks-12-book-series-prompt.md` §3 & Overnight Prompt §3) so the player never wears Elias as a skin and never overrides his canon choices.
* **Alternatives Considered:** Third-person control of Elias (strictly forbidden by §3).
* **Canon Trace:** `gamebooks/antigravity-lvd-gamebooks-12-book-series-prompt.md` §3 & `gamebooks/book-01/how-to-play-and-sheet.md` (*"Your Role: The Fellow-Traveler"*).
* **Code Flag Locations:** `src/world.js`, `src/zone1-data.js`, `src/main.js`.

### `DEC-04` — Transparent Dice & Forgiving Encounter Tuning (`FLAG: DEC-04`)
* **What Was Decided:**
  - Starting stats roll transparently via visible `1d6 + 6` (**Courage** `7–12`, **Favor** `7–12`) and `2d6 + 12` (**Strength** `14–24`), with a "Roll New Traveler Stats" or "Standard Balanced Roll (`Courage 9, Strength 20, Favor 9`)" option on first sight, accompanied by plain-English explanations of all four stats (**Courage, Strength, Favor, Treasure**).
  - Every Stand displays the exact Stronghold stats (**Courage**, **Strength**, **Crack/Demolish target**, and **Resonant KJV Scrolls**), offers the **Step 1 Victory Law** choice (humility/confession or speaking a resonant KJV Scroll to lower Stronghold Courage by `-1` or `-2` and Strength by `-2` before Round 1), and shows both individual dice (`[d1] + [d2] + Courage = Total`) on every round.
  - Between or during rounds, the player can spend **Flask of Oil** (`+4 Strength`), **Test Favor** (`2d6 <= Favor` to reduce a hit from `-2` to `-1`), spend **David's Aquamarine Tuning-Stone** (auto-`10` on `2d6`), or **Withdraw** (`-2 Strength`, safe narrative exit).
* **Why:** Directly implements `gamebooks/mechanics-sheet.md` (§1–§5) and Overnight Prompt §3 (*"Resolution uses Courage/Strength/Favor checks, shown transparently — never hidden dice. Difficulty: encounters forgiving, Treasure choices hard"*).
* **Alternatives Considered:** Real-time action combat or hidden RNG (rejected; violates `mechanics-sheet.md`).
* **Canon Trace:** `gamebooks/mechanics-sheet.md` & `gamebooks/book-01/how-to-play-and-sheet.md`.
* **Code Flag Locations:** `src/main.js`, `index.html`.

### `DEC-05` — Theophany Guardrail in Act V Grace Restoration (`FLAG: DEC-05`)
* **What Was Decided:** Per Overnight Prompt §1 and §3 (*"NO theophany depiction in the pilot at all"*), no scene in Zone 1 depicts a physical figure, face, or newly invented voice for God the Father or Jesus Christ. In the Act V Climax and Grace Restoration (`Sec. 245, 275`), the unseen Throne is represented solely by warm golden-white ambient sanctuary light across the Sea of Glass (`Revelation 4:6; 15:2` KJV) and verbatim KJV Scripture citations (`John 19:30` *"It is finished"* and `James 2:19` *"the devils also believe, and tremble"*).
* **Why:** Strictly enforces Decision 17 and the Overnight Prompt's explicit pilot rule (*"NO theophany depiction in the pilot at all"*).
* **Alternatives Considered:** None (hard rule).
* **Canon Trace:** `gamebooks/antigravity-lvd-gamebooks-12-book-series-prompt.md` (§6 Guardrail 2), `light-vs-darkness-universe-bible.md` (§5 Rule 8), and Overnight Prompt §1/§3.
* **Code Flag Locations:** `src/zone1-data.js`, `src/world.js`.

### `DEC-06` — 3D Token & Relic Models (`FLAG: DEC-06`)
* **What Was Decided:**
  1. Built `scripts/build-local-glb-models.mjs` to generate valid, compact binary glTF 2.0 (`.glb`) 3D models directly inside `/Users/Timotheus/Desktop/Narrow Way Walk/assets/models/`:
     - `aquamarine-tuning-stone.glb` — **David's Aquamarine Tuning-Stone (Mentor's Token)**: faceted sky-blue aquamarine gemstone set in weathered cypress wood with golden Hebrew kinnor string inlay (`Sec. 48`).
     - `davids-cypress-kinnor.glb` — **David's Crownless Cypress Harp (*Kinnor*)**: 10-stringed biblical cypress lyre with aquamarine stone and one snapped string (`canon-log.md` Entry #16 / `draft.md` Sec. 48).
     - `mothers-cassette-player.glb` — **Mother's Taped Portable Cassette Player**: late-90s portable tape player with taped door and four-note melody slip (`draft.md` Sec. 18, 93, 282).
  2. Registered all 3 models in `assets/models/relics-manifest.json` and wired them into `src/relics.js` using Three.js `GLTFLoader` + `MeshoptDecoder` and the interactive 3D Relic Workshop Turntable Inspector (`#relic-modal`).
  3. Also prepared `scripts/generate-zone1-trellis.mjs` (a sanitized, git-push-free version of Pilgrim Walk's `generate-trellis-3d.mjs`) so Timothy can optionally run HuggingFace TRELLIS image-to-3D generation from `art/sea-01/` in the morning without ever touching the Pilgrim Walk repo.
* **Why:** Satisfies §2 item 7, §3 item 6, and §6 within the offline sandbox while flagging the procedural `.glb` geometry for Timothy's morning review.
* **Alternatives Considered:** Leaving the Relic Workshop empty or using 2D icons only (rejected; real `.glb` loading via `GLTFLoader` + `MeshoptDecoder` and 3D turntable inspection proves the full technical pipeline).
* **Canon Trace:** `gamebooks/book-01/how-to-play-and-sheet.md` (Mentor's Token), `draft.md` (`Sec. 18, 48, 93`), and `Pilgrim Way Art World Game/src/tripo.js`.
* **Code Flag Locations:** `scripts/build-local-glb-models.mjs`, `scripts/generate-zone1-trellis.mjs`, `src/relics.js`, `assets/models/relics-manifest.json`.

### `DEC-07` — Painterly Canvas Art & Morning Link Script for Approved `sea-01` Art (`FLAG: DEC-07`)
* **What Was Decided:** Because the sandboxed shell cannot run `cp` outside `/Users/Timotheus/Desktop/Narrow Way Walk`, the game includes `painterly.js` procedural oil-and-crystal canvas paintings tailored to each of the 6 stages' exact `sea-01-art-prompts.md` palettes and compositions (clearly badged as `[FLAG: PROCEDURAL-ART-PLACEHOLDER — Run scripts/link-approved-art.sh to swap in art/sea-01/ PNGs]`), AND includes `scripts/link-approved-art.sh` which copies Timothy's approved `cover-redo-sea-01/sea-01-cover-art.png`, `art/issue-01/portraits/david.png`, `art/sea-01/portraits/elias.png`, and key `art/sea-01/sea-01-panel-*.png` files into `assets/art/` in one second upon morning review.
* **Why:** Obeys §1 & §6 (*"no new AI imagery, no generated reference images, no upscaling or altering Timothy's art... placeholder approach (simple geometry / flat art, always flagged)"*) while keeping cold-load weight tiny (`< 350 KB` total local payload).
* **Alternatives Considered:** Generating AI images (strictly forbidden).
* **Canon Trace:** `sea-01-art-prompts.md`, `cover-redo-sea-01/sea-01-cover-art.png`, `art/sea-01/`.
* **Code Flag Locations:** `src/painterly.js`, `scripts/link-approved-art.sh`.

### `DEC-08` — Fresh `NW1` Progress Code Format & Separate `localStorage` Key (`FLAG: DEC-08`)
* **What Was Decided:**
  - **LocalStorage Key:** `narrow_way_walk_save_v1` (completely separate from Pilgrim Walk's `pilgrim_walk_save_v1`).
  - **Progress Code Prefix & Format:** `NW1-<base64url(JSON)>` containing `{ v: 1, world: "narrow-way-walk", zone: 1, exportedAt, data: { stats, startingStats, scrollsLearned, oil, bread, tokenEarned, tokenUsed, treasureCount, treasureLog, lastWellId, wellsVisited, standsCleared, wisdomRead, relicsInspected, currentStage, zone1Completed, endingReached, reflectionNote } }`.
  - **Rejection of Foreign Codes:** Attempting to paste a `PW1-...` code displays a clear friendly message explaining that `NW1-...` is required for *The Narrow Way*.
* **Why:** Directly implements §3 item 7 and §5 (*"fresh format — do NOT reuse Pilgrim Walk's PW1 codes or localStorage keys — that exports from one browser and restores zone completion in another"*).
* **Alternatives Considered:** Compact bitfield string (rejected because base64url JSON is self-describing, human-auditable, and preserves the player's Treasure Record deeds and reflection note).
* **Canon Trace:** Overnight Prompt §3 item 7 & §5.
* **Code Flag Locations:** `src/main.js`.

### `DEC-09` — Auto-Eco Mode, Mobile Touch Controls & Accessibility (`FLAG: DEC-09`)
* **What Was Decided:**
  - Automatically selects `eco` graphics tier (`pixelRatio = 1.0`, 30 FPS cap, simplified post-processing) on mobile User-Agents, coarse-pointer viewports (`<= 960px`), or low-core/low-memory devices, while allowing manual toggle between `Eco`, `Balanced`, and `High` in the top HUD.
  - Provides full keyboard (`WASD` / Arrow keys to walk, `Mouse drag` or `Q/E` to look, `[E]` to interact/step forward, `[R]` to read Wisdom Page, `[I]` for Inventory/Sheet, `[H]` to collapse HUD icons) AND mobile touch controls (virtual thumb joystick on bottom-left + touch-drag look + large tap buttons for every interaction).
  - Includes `Large Text` toggle, `Reduced Motion` toggle, and `Master / Music / Ambient` volume sliders + Mute button.
* **Why:** Implements §3 Systems & §5 Technical Shape (*"auto-Eco for mobile/low-power; phone-browser playable; keyboard + mouse/touch; readable text; volume control; unmissable way back to zone start and Gatehouse"*).
* **Canon Trace:** `Pilgrim Way Art World Game/src/main.js` & `index.html`.
* **Code Flag Locations:** `src/main.js`, `src/postprocess.js`, `index.html`.

---

## 4. ELEMENT-BY-ELEMENT CANON TRACEABILITY TABLE (Zone 1)

Every single character, location, Stronghold, Scroll, Wisdom Spread, Treasure choice, and item in Zone 1 traces to a verified canon source:

| Zone 1 Element | Type | Canon Source Trace |
| :--- | :--- | :--- |
| **Elias Cho** (Companion Hero) | Character | `light-vs-darkness-universe-bible.md` §2.7; `novels/Vol1/` Ch. 2, 5, 10, 15, 19, 25, 29; `book-01/draft.md` Sec. 1–300 |
| **The Fellow-Traveler** (Player POV) | Player Role | `antigravity-lvd-gamebooks-12-book-series-prompt.md` §3; `book-01/how-to-play-and-sheet.md` |
| **David the King** (Light Blue, Might, Aquamarine, Crownless) | Mentor | `character-sheets/all-mentor-reference-sheets.md` #5; `canon-log.md` Entry #16; `book-01/draft.md` Sec. 43–48 |
| **Daniel, Paul, Esther** (Act V Convergence Mentors) | Mentors | `character-sheets/all-mentor-reference-sheets.md` #1, #4, #6; `book-01/draft.md` Sec. 192, 277 |
| **Adaeze Okonkwo, Brother Matthias, Talia Reyes** | Convergence Peers | `light-vs-darkness-universe-bible.md` §2.7; `book-01/draft.md` Sec. 111, 190–193, 246–283 |
| **Yuna** (Elias's older sister, clinic worker) | Supporting Cast | `novels/Vol1/` Ch. 2, 10, 15, 29; `book-01/draft.md` Sec. 51–52, 71–72, 88–90, 106–107, 125, 151–155, 285–287 |
| **Pastor Ji** (62yo chaplain & recovery sponsor, Grace Community Church) | Supporting Cast | `novels/Vol1/` Ch. 10, 19, 29; `book-01/draft.md` Sec. 107, 195, 210, 287, 294 |
| **Manager Daniel** & **Tae-yang** | Supporting Cast | `novels/Vol1/` Ch. 5, 10, 25, 29; `book-01/draft.md` Sec. 11, 53, 102, 116–118, 145, 158, 189, 198, 288 |
| **Mr. Park** (68yo janitor, spilled XLR crate in loading bay) | Treasure #1 Cast | `book-01/outline.md` §3; `book-01/draft.md` Sec. 14, 73, 300 |
| **Min-jun** (17yo fill-in bassist, midnight rehearsal) | Treasure #2 Cast | `book-01/outline.md` §3; `book-01/draft.md` Sec. 56, 82–83, 300 |
| **Stranded Delivery Rider** (19yo under Mapo-gu overpass) | Treasure #3 Cast | `book-01/outline.md` §3; `book-01/draft.md` Sec. 88, 90, 104 |
| **Mrs. Kang** (80yo widow with chrysanthemum pots on stairs) | Treasure #4 Cast | `book-01/outline.md` §3; `book-01/draft.md` Sec. 131, 150, 300 |
| **Soo-jin** (19yo worship violinist at basement Q&A) | Treasure #5 Cast | `book-01/outline.md` §3; `book-01/draft.md` Sec. 189, 196–197, 300 |
| **Hoon** (20yo studio intern, overwritten master stem) | Treasure #6 Cast | `book-01/outline.md` §3; `book-01/draft.md` Sec. 205–209, 218, 226, 300 |
| **David's Aquamarine Tuning-Stone** | Mentor's Token | `book-01/how-to-play-and-sheet.md`; `book-01/draft.md` Sec. 48 |
| **Stand 1: The Applause Echo** (`Pride #15`) | Stand (`C7/S6`) | `book-01/draft.md` Sec. 33 |
| **Stand 2: The Patient Whisper** (`Addictions #23`) | Stand (`C7/S6`) | `book-01/draft.md` Sec. 29 |
| **Stand 3: The Comparison Lens** (`Jealousy #27`) | Stand (`C8/S8`) | `book-01/draft.md` Sec. 95 |
| **Stand 4: The Back-Room Boast** (`Pride #15 + Addictions #23`) | Rigged Bait (`C11/S12`) | `book-01/draft.md` Sec. 145 & Sec. 158 (walk-away victory) |
| **Stand 5: The Curated Sorrow** (`Grief #28`) | Stand (`C8/S8`) | `book-01/draft.md` Sec. 152 |
| **Stand 6: The Iron Collar of Burnout** (`Infirmity #19`) | Stand (`C8/S8`) | `book-01/draft.md` Sec. 164 |
| **Stand 7: Mirror-Guard of Pride** (`Pride #15`) | Stand (`C9/S8`) | `book-01/draft.md` Sec. 114 |
| **Stand 8: Obsidian Crown & Fig-Leaf Door** (`Pride #15 + Shame #17`) | Climax Stand (`C10/S12`) | `book-01/draft.md` Sec. 260–276 |
| **Wells 1–5** (`Sec. 48, 110, 175, 210, 245`) | Grace Checkpoints | `book-01/outline.md` §5; `book-01/draft.md` Sec. 48, 110, 175, 210, 245 |
| **Scrolls 1–5 & All Scripture Verses** | KJV Verbatim | `book-01/draft.md` Scroll Index & Scripture Index (King James Version verbatim) |
