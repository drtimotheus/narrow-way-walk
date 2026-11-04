# Zone I Art & 3D Asset Inventory (`The Narrow Way Walk`)

This document inventories every image and 3D model used in **Zone I (Elias Cho / Book 1: *The Unseen Chord*)**, how each asset is mapped across stages, Stands, Wells, Treasures, and Wisdom Pages, and where illustrated scene studies stand in until dedicated painted panels are linked.

---

## 1. Linked Approved Art Files in `assets/art/` (15 Files)

All 15 paintings below are preloaded at startup (`preloadAllZone1Art()` in [`src/painterly.js`](file:///Users/Timotheus/Desktop/Narrow%20Way%20Walk/src/painterly.js)) into an in-memory `Image` cache while modal frames reserve a `16:9` aspect-ratio container with a soft gradient and spinner so broken-image icons and layout jumps never occur.

| File Path | Subject / Composition | Where Used in Zone I |
| :--- | :--- | :--- |
| `assets/art/sea-01-cover-art.png` | **Cover Painting ("The Alley and the Sea of Glass"):** Elias kneeling in the rain-slicked Seoul alley below, reaching up through the translucent Sea of Glass horizon to crownless King David with his Aquamarine cypress harp. | Title Screen (`#welcome-modal`), Treasure 3 (*The Stalled Scooter in the Pouring Rain*, Sec. 88/104), Zone I Finale (`#finale-modal`), Gatehouse (`#gatehouse-modal`) |
| `assets/art/sea-01-cover-preview.jpg` | **Cover Edition Preview with Typography:** *Light vs Darkness — The Sea of Glass, Issue 1: What the Low Place Knows*. | Preloaded Reference Edition Cover |
| `assets/art/sea-01-panel-04.png` | **King David on the Sea of Glass:** Crownless King David kneeling on the golden-veined crystal floor holding his 10-stringed cypress harp inlaid with the sky-blue Aquamarine stone before the warm sanctuary light and Cloud of Witnesses. | **Well 1** (*The Curb on the Sea of Glass*, Sec. 48), **Wisdom Page 1** (*Spread 1: The Mask Is the Cliff*, Sec. 48) |
| `assets/art/sea-01-panel-06.png` | **Seoul Back Alley & Loading-Bay Rain:** Elias stepping out the heavy metal service door into the wet alley beside dumpsters and neon reflections. | **Stage I Mural & Banner** (*2,000-Seat Venue & Loading Bay Rain*), **Treasure 1** (*Mr. Park in the Loading-Bay Rain*, Sec. 14/73), **Stand 2** (*The Patient Whisper — Addictions #23*, Sec. 29) |
| `assets/art/sea-01-panel-11.png` | **Elias & King David Sitting on the Floor:** Elias with his acoustic guitar and his mother's portable cassette player sitting beside King David on the crystal floor while a dark hooded figure looms behind. | **Stage II Mural & Banner** (*The Neon Back Alley & Well 1*), **Stand 5** (*The Curated Sorrow — Grief #28*, Sec. 152), **Treasure 8** (*Chair #7 in Pastor Ji's Thursday Basement Circle*, Sec. 288/294), **Wisdom Page 3** (*Spread 3: Both Halves of Might*, Sec. 175) |
| `assets/art/sea-01-panel-14.png` | **King David Close-Up Counsel:** Weathered, crownless King David in his sky-blue mantle with his hand over his heart. | **Stage III Mural & Banner** (*Rehearsal Hall, Apartment Window & Hannam-dong*), **Treasure 6** (*Sparing Studio Intern Hoon*, Sec. 218/226), **Wisdom Page 2** (*Spread 2: Walking Out of the Trap*, Sec. 110) |
| `assets/art/sea-01-panel-35.png` | **Threshold of the Sea of Glass:** David and Esther looking toward the warm sanctuary light across the crystal waterfall while Elias and Talia stand below. | **Stage IV Mural & Banner** (*Seoul Columbarium Steps & Hall C*), **Well 5** (*Threshold of the Sea*, Sec. 245), **Treasure 4** (*Mrs. Kang on the Columbarium Stairs*, Sec. 131/150), **Wisdom Page 7** (*Spread 7: The Floor Was the Throne-Room*, Sec. 280) |
| `assets/art/sea-01-panel-74.png` | **Five-Stronghold Storm on the Kitchen Floor & Sea of Glass:** Elias holding the cassette player as the kitchen linoleum opens into golden-veined crystal, braced by fellow-travelers while five towering dark Strongholds rise in the storm clouds. | **Stage V Mural & Banner** (*Studio Booth, Youth Q&A & Kitchen Floor*), **Stand 8 (Climax)** (*The Obsidian Crown of Pride #15 & Fig-Leaf Door of Shame #17*, Sec. 260), **Wisdom Page 5** (*Spread 5: Grace Unto the Humble*, Sec. 245) |
| `assets/art/sea-01-panel-92.png` | **Sitting on the Floor in Honest Confession:** Elias sitting on the floor beside his acoustic guitar in honest conversation while a jagged stone-armored Stronghold looms in the mirror shadow behind. | **Stage VI Mural & Banner** (*Sea of Glass Climax & Thursday Basement*), **Stand 7** (*The Mirror-Guard of Pride #15*, Sec. 114), **Treasure 5** (*Sitting on the Concrete Steps with Violinist Soo-jin*, Sec. 189/196), **Wisdom Page 6** (*Spread 6: Strength Made Perfect in Weakness*, Sec. 189) |
| `assets/art/elias.png` | **Elias Cho Portrait:** Elias seated with his worn acoustic guitar in warm rim light. | **Treasure 2** (*Midnight in the Rehearsal Basement with 17-Year-Old Bassist Min-jun*, Sec. 56/82) |
| `assets/art/david.png` | **David the King Portrait:** Crownless shepherd-king holding his royal circlet lowered in his right hand and his glowing Aquamarine cypress harp in his left. | **3D Portrait Medallion (Stage II & VI)**, **Wisdom Page 4** (*Spread 4: The Voice That Tells the Truth*, Sec. 210) |
| `assets/art/daniel.png` | **Daniel the Prophet Portrait:** Elder statesman in green mantle praying with emerald ring. | **3D Portrait Medallion (Stage VI Convergence)** |
| `assets/art/paul.png` | **Paul the Apostle Portrait:** Scarred apostle in dark-blue cloak carrying epistle scrolls and sapphire satchel. | **3D Portrait Medallion (Stage VI Convergence)** |
| `assets/art/esther.png` | **Queen Esther Portrait:** Queen in crimson-and-gold royal robes with ruby diadem. | **3D Portrait Medallion (Stage VI Convergence)** |
| `assets/art/adaeze.png` | **Adaeze Okonkwo Portrait:** Adaeze by candlelight in woven headwrap. | **3D Portrait Medallion (Stage VI Convergence)**, **Treasure 7** (*Shielding Adaeze & Clasping Talia's Hand*, Sec. 252/268) |

---

## 2. Stand-by-Stand & Well-by-Well Art Assignment (No Duplicate Alley Reuse)

Per Polish Item #4, **Well 1** and **Stand 1 (The Applause Echo / Pride #15)** never reuse Mr. Park's loading-bay alley image (`sea-01-panel-06.png`). Where a scene does not yet have a dedicated painted file in `assets/art/`, the engine renders a bespoke **Illustrated Scene Study** canvas (`createSceneCanvasDataUrl` in [`src/painterly.js`](file:///Users/Timotheus/Desktop/Narrow%20Way%20Walk/src/painterly.js)) and lists it below for future art linking:

### All 8 Stands
| Stand ID | Title & Stronghold | Assigned Image / Scene Study | Status |
| :--- | :--- | :--- | :--- |
| `stand_1` | **Stand 1 · The Applause Echo** (`Pride #15`, Sec. 33) | Illustrated Scene Study (`motif: 'mirror'` — Gilded VIP Lounge Mirror Fracturing) | **Scene Study Placeholder** (awaiting dedicated VIP Lounge Mirror panel) |
| `stand_2` | **Stand 2 · The Patient Whisper** (`Addictions #23`, Sec. 29) | `assets/art/sea-01-panel-06.png` (Neon Back Alley & Dumpsters) | **Linked Approved Painting** |
| `stand_3` | **Stand 3 · The Comparison Lens** (`Jealousy #27`, Sec. 95) | Illustrated Scene Study (`motif: 'comparison_lens'` — Jaundiced Green-Gold Lens Cracking) | **Scene Study Placeholder** (awaiting dedicated Apartment Laptop / Comparison Lens panel) |
| `stand_4` | **Stand 4 · The Back-Room Boast at Hannam-dong** (`Pride #15 + Addictions #23`, Sec. 145) | Illustrated Scene Study (`motif: 'hannam_door'` — Velvet-Roped Doorway Opening to Clean Night Air) | **Scene Study Placeholder** (awaiting dedicated Hannam-dong Hallway panel) |
| `stand_5` | **Stand 5 · The Curated Sorrow** (`Grief #28`, Sec. 152) | `assets/art/sea-01-panel-11.png` (Elias & David with Looming Hooded Grief Figure) | **Linked Approved Painting** |
| `stand_6` | **Stand 6 · The Iron Collar of Burnout** (`Infirmity #19`, Sec. 164) | Illustrated Scene Study (`motif: 'iron_collar'` — Snapping Iron Yoke in Windowless Rehearsal Booth) | **Scene Study Placeholder** (awaiting dedicated Rehearsal Booth Iron Collar panel) |
| `stand_7` | **Stand 7 · The Mirror-Guard of Pride** (`Pride #15`, Sec. 114) | `assets/art/sea-01-panel-92.png` (Jagged Stone Mirror-Guard Behind Elias) | **Linked Approved Painting** |
| `stand_8` | **Stand 8 · The Obsidian Crown of Pride & The Fig-Leaf Door of Shame** (`Pride #15 + Shame #17`, Sec. 260) | `assets/art/sea-01-panel-74.png` (Five Towering Strongholds Over the Sea of Glass) | **Linked Approved Painting** |

### All 5 Wells of Living Water
| Well ID | Title & Section | Assigned Image / Scene Study | Status |
| :--- | :--- | :--- | :--- |
| `well_1` | **Well 1 · The Curb on the Sea of Glass** (Sec. 48) | `assets/art/sea-01-panel-04.png` (King David Kneeling on the Golden-Veined Sea of Glass with Aquamarine Harp) | **Linked Approved Painting** |
| `well_2` | **Well 2 · The Apartment Window at Dawn** (Sec. 110) | Illustrated Scene Study (`motif: 'dawn_window'` — Fourth-Floor Window at Dawn with Two Steaming Mugs of Barley Tea) | **Scene Study Placeholder** (awaiting dedicated Dawn Window Barley Tea panel) |
| `well_3` | **Well 3 · The Columbarium Bench & Sea of Glass** (Sec. 175) | Illustrated Scene Study (`motif: 'columbarium_bench'` — Red-Gold Autumn Maples & Stone Water Basin Outside Hall C) | **Scene Study Placeholder** (awaiting dedicated Columbarium Pine Bench panel) |
| `well_4` | **Well 4 · Pastor Ji's Church-Basement Recovery Office** (Sec. 210) | Illustrated Scene Study (`motif: 'pastor_office'` — Circle of Twelve Metal Folding Chairs & Steaming Kettle) | **Scene Study Placeholder** (awaiting dedicated Pastor Ji Basement Office panel) |
| `well_5` | **Well 5 · The Kitchen Floor & Threshold of the Sea** (Sec. 245) | `assets/art/sea-01-panel-35.png` (Golden-White Sanctuary Light Across the Crystal Threshold) | **Linked Approved Painting** |

---

## 3. 3D Binary glTF 2.0 (`.glb`) Relics in `assets/models/`

| File Path | Title | Canon Reference | Size |
| :--- | :--- | :--- | :--- |
| `assets/models/aquamarine-tuning-stone.glb` | **David's Aquamarine Tuning-Stone (Mentor's Token)** | Section 48 (Well 1 — *Proverbs 16:18–19; Isaiah 11:2 KJV*) | `14.6 KB` |
| `assets/models/davids-cypress-kinnor.glb` | **David's Crownless Cypress Harp (Kinnor)** | Sections 43–48 & 277 (*Psalm 51:17 KJV*) | `13.9 KB` |
| `assets/models/mothers-cassette-player.glb` | **Mother's Taped Portable Cassette Player & Four-Note Slip** | Sections 18, 77, 93, 129, 282 & 300 (*Isaiah 53:4; 61:3 KJV*) | `13.1 KB` |
