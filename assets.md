# The Narrow Way Walk — Zone I Asset Inventory

All visual and 3D assets in Zone I (`Book 1: The Unseen Chord`) are preloaded at startup via `preloadAllZone1Art()` in [`src/painterly.js`](file:///Users/Timotheus/Desktop/Narrow Way Walk/src/painterly.js) so modals open with zero layout shift and every Stage, Stand, Well, Treasure, Wisdom Page, and Ending displays its own distinct painted panel with zero image reuse within any stage.

---

## 1. Cover, Title Screen & Gatehouse Art (`assets/art/`)

| Asset File | Used In | Description |
| :--- | :--- | :--- |
| `assets/art/sea-01-cover-preview.jpg` | Title Screen (`#title-cover-img`), Gatehouse Book 1 Card | *Book 1: The Unseen Chord* full portrait cover illustration |
| `assets/art/sea-01-cover-art.png` | Portrait Map (`PORTRAIT_ART_MAP.cover`) | High-resolution cover painting of Elias & David on the Sea of Glass |
| `assets/art/sea-01-panel-98.png` | Title Screen Backdrop & Gatehouse Banner (`#gatehouse-art-img`) | Wide horizontal painting of David, Daniel, Paul, and Esther on the Sea of Glass |

---

## 2. Character & Mentor Portraits (`assets/art/`)

| Asset File | Character | Role in Zone I |
| :--- | :--- | :--- |
| `assets/art/elias.png` | Elias Cho | 24-year-old Korean session guitarist; 3D companion walking beside the Fellow-Traveler |
| `assets/art/david.png` | David the King | Primary Mentor of Book 1 (Light Blue — Might; `2 Samuel 22:1–51`) |
| `assets/art/daniel.png` | Daniel the Prophet | Witness on the Sea of Glass in Stage VI (Green — Wisdom) |
| `assets/art/paul.png` | Paul the Apostle | Witness on the Sea of Glass in Stage VI (Deep Blue — Understanding) |
| `assets/art/esther.png` | Queen Esther | Witness on the Sea of Glass in Stage VI (Red — Counsel) |
| `assets/art/adaeze.png` | Adaeze Okafor | Nigerian triage nurse at the Convergence on the Sea of Glass (Stage VI) |

---

## 3. Stage Banner Paintings (`STAGE_ART_MAP`)

| Stage | Asset File | Canonical Scene |
| :--- | :--- | :--- |
| **Stage I** (`0`) | `assets/art/sea-01-panel-05.png` | 2,000-Seat Venue Stage Lights & VIP Exit (Act I · Sections 1–20) |
| **Stage II** (`1`) | `assets/art/sea-01-panel-11.png` | Neon Alley & Threshold of the Sea of Glass (Act I · Sections 21–60) |
| **Stage III** (`2`) | `assets/art/sea-01-panel-35.png` | Mapo-gu Rehearsal, Overpass Rain & Hannam-dong (Act II · Sections 61–124) |
| **Stage IV** (`3`) | `assets/art/sea-01-panel-42.png` | Seoul Columbarium Steps & Hall C Brass Plate (Act III · Sections 125–210) |
| **Stage V** (`4`) | `assets/art/sea-01-panel-65.png` | 40-Person Church Basement Youth Q&A & Studio Booth (Act IV–V · Sections 114–245) |
| **Stage VI** (`5`) | `assets/art/sea-01-panel-85.png` | Dawn Over the Sea of Glass & Four Mentors Descending (Act V · Sections 246–300) |

---

## 4. Stand Encounter Paintings (`STAND_ART_MAP` — 8 Unique Panels)

| Stand ID | Stage | Asset File | Scene & Stronghold | Primary KJV Scroll |
| :--- | :--- | :--- | :--- | :--- |
| `stand_1` | Stage I | `assets/art/sea-01-panel-53.png` | **Stand 1 · The Applause Echo** — Backstage lighted mirror (`Pride #15`, Sec. 33) | `Proverbs 16:18 (KJV)` |
| `stand_2` | Stage II | `assets/art/sea-01-panel-08.png` | **Stand 2 · The Patient Whisper** — Alley walls thinning into glass (`Addictions #23`, Sec. 29) | `1 Corinthians 6:12 (KJV)` |
| `stand_3` | Stage III | `assets/art/sea-01-panel-30.png` | **Stand 3 · The Comparison Lens** — Viral clips & chart numbers (`Jealousy #27`, Sec. 95) | `Proverbs 27:2 (KJV)` |
| `stand_4` | Stage III | `assets/art/sea-01-panel-38.png` | **Stand 4 · The Back-Room Boast at Hannam-dong** — Stopping outside Tae-yang's green-room door (`Pride #15 + Addictions #23`, Sec. 145 -> 158) | `1 Corinthians 6:12 (KJV)` |
| `stand_5` | Stage IV | `assets/art/sea-01-panel-52.png` | **Stand 5 · The Curated Sorrow** — Weeping beside Yuna at Hall C (`Grief #28`, Sec. 152) | `Isaiah 53:4 (KJV)` |
| `stand_6` | Stage IV | `assets/art/sea-01-panel-43.png` | **Stand 6 · The Iron Collar of Burnout** — Heavy shadow of exhaustion (`Infirmity #19`, Sec. 164) | `Psalm 51:17 (KJV)` |
| `stand_7` | Stage V | `assets/art/sea-01-panel-66.png` | **Stand 7 · The Mirror-Guard of Pride** — Lowering the PR script at the youth room microphone (`Pride #15`, Sec. 114) | `Proverbs 16:18 (KJV)` |
| `stand_8` | Stage VI | `assets/art/sea-01-panel-81.png` | **Stand 8 · The Obsidian Crown of Pride & The Fig-Leaf Door of Shame** — Turning away from Shame's false door on the Sea of Glass (`Pride #15 + Shame #17`, Sec. 260) | `Proverbs 16:18 (KJV)` |

---

## 5. Well of Living Water Paintings (`WELL_ART_MAP` — 5 Unique Panels)

| Well ID | Stage | Asset File | Canonical Well Scene | Grants |
| :--- | :--- | :--- | :--- | :--- |
| `well_1` | Stage II | `assets/art/sea-01-panel-04.png` | **Well 1 · Curb on the Sea of Glass** — King David with his cypress kinnor (Sec. 48) | `Scroll 1` (`Proverbs 16:18`) + Aquamarine Tuning-Stone |
| `well_2` | Stage III | `assets/art/sea-01-panel-39.png` | **Well 2 · The Apartment Window at Dawn** — Clean night air & calling Yuna (Sec. 110) | `Scroll 3` (`Proverbs 27:2`) |
| `well_3` | Stage IV | `assets/art/sea-01-panel-49.png` | **Well 3 · The Columbarium Bench & Stone Basin** — David teaching both halves of Might (Sec. 175) | `Scroll 4` (`Isaiah 53:4`) |
| `well_4` | Stage IV | `assets/art/sea-01-panel-62.png` | **Well 4 · Pastor Ji's Church-Basement Recovery Office** — Twelve folding chairs & steaming kettle (Sec. 210) | `Scroll 2` (`Psalm 51:17`) |
| `well_5` | Stage V | `assets/art/sea-01-panel-74.png` | **Well 5 · The Kitchen Floor & Threshold of the Sea** — Kitchen floor opening onto the Sea of Glass (Sec. 245) | Full Favor + Strength Restoration |

---

## 6. Treasure Choice Paintings (`TREASURE_ART_MAP` — 8 Unique Panels)

| Treasure ID | Stage | Asset File | Canonical Encounter |
| :--- | :--- | :--- | :--- |
| `treasure_1` | Stage I | `assets/art/sea-01-panel-06.png` | **Treasure 1:** Janitor Mr. Park in the Loading-Bay Rain (Sec. 14) |
| `treasure_2` | Stage III | `assets/art/sea-01-panel-28.png` | **Treasure 2:** Teenage Guitarist Min-jun at Midnight Rehearsal (Sec. 72) |
| `treasure_3` | Stage III | `assets/art/sea-01-panel-31.png` | **Treasure 3:** Stranded Delivery Rider in the Mapo-gu Overpass Rain (Sec. 88/104) |
| `treasure_4` | Stage IV | `assets/art/sea-01-panel-45.png` | **Treasure 4:** 80-Year-Old Widow Mrs. Kang on the Columbarium Stairs (Sec. 131) |
| `treasure_5` | Stage V | `assets/art/sea-01-panel-69.png` | **Treasure 5:** 19-Year-Old Violinist Soo-jin After the Youth Q&A (Sec. 189/196) |
| `treasure_6` | Stage V | `assets/art/sea-01-panel-95.png` | **Treasure 6:** 20-Year-Old Studio Intern Hoon & the Erased Master Stem (Sec. 218) |
| `treasure_7` | Stage VI | `assets/art/sea-01-panel-76.png` | **Treasure 7:** Shielding Adaeze & Clasping Talia's Hand on the Sea of Glass (Sec. 262) |
| `treasure_8` | Stage VI | `assets/art/sea-01-panel-94.png` | **Treasure 8:** Honest Recovery Clause & Chair #7 in Pastor Ji's Thursday Circle (Sec. 283) |

---

## 7. Wisdom Page & Ending Paintings (`WISDOM_ART_MAP` & `ENDING_ART_MAP`)

| ID | Stage | Asset File | Scene |
| :--- | :--- | :--- | :--- |
| `wisdom_1` | Stage II | `assets/art/sea-01-panel-14.png` | `2 Samuel 22:28` & `Psalm 34:18` — David on the Sea of Glass |
| `wisdom_2` | Stage III | `assets/art/sea-01-panel-41.png` | `Proverbs 27:2` & `Proverbs 11:2` — Walking home from Hannam-dong |
| `wisdom_3` | Stage IV | `assets/art/sea-01-panel-47.png` | `Isaiah 53:4`, `2 Samuel 18:33` & `John 11:35` — Gatehouse at Mahanaim |
| `wisdom_4` | Stage IV | `assets/art/sea-01-panel-64.png` | `Psalm 51:17` & `Proverbs 28:13` — Quiet evening after Pastor Ji's office |
| `wisdom_5` | Stage V | `assets/art/sea-01-panel-89.png` | `Proverbs 16:18` & `James 4:6` — Beside the untouched green bottle |
| `wisdom_6` | Stage V | `assets/art/sea-01-panel-67.png` | `Proverbs 12:19` & `2 Corinthians 12:9` — 40-chair basement youth room |
| `wisdom_7` | Stage VI | `assets/art/sea-01-panel-86.png` | `Revelation 15:2` & `Ecclesiastes 4:9–10` — Four Mentors behind the Four Champions |
| `good_ending` | Stage VI | `assets/art/sea-01-panel-96.png` | **Section 299 · The Good Ending — The Honest Recovery Road** (`0–3` Treasure) |
| `true_ending` | Stage VI | `assets/art/sea-01-panel-100.png` | **Section 300 · The True Ending — The Unseen Chord** (`4–8` Treasure) |

---

## 8. 3D GLB Relics (`assets/models/`)

| Asset File | Relic Title | Size |
| :--- | :--- | :--- |
| `assets/models/aquamarine-tuning-stone.glb` | David's Aquamarine Tuning-Stone (Mentor's Token) | `12.6 KB` |
| `assets/models/davids-cypress-kinnor.glb` | King David's Ten-Stringed Cypress Kinnor | `16.4 KB` |
| `assets/models/mothers-cassette-player.glb` | Grace Mi-ran Cho's Worn Cassette Player & Hymnal Tape | `12.7 KB` |
