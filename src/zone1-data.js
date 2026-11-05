// ============================================================================
// THE NARROW WAY — Zone 1 Canonical Data (Book 1: The Unseen Chord)
// Companion Hero: Elias Cho (Modern Seoul, South Korea)
// Guiding Mentor: David the King (Light Blue • Spirit of Might • Aquamarine)
// Player Role: The Fellow-Traveler (Companion POV — Four Standing Rules)
// All Scripture quotations are verbatim King James Version (KJV).
// Traces 100% to gamebooks/book-01/draft.md,
// outline.md, how-to-play-and-sheet.md, mechanics-sheet.md, and novels/Vol1/.
// ============================================================================

export const WORLD_CONFIG = {
  worldTitle: 'The Narrow Way Walk',
  worldSubtitle: 'Zone I Pilot · Book 1: The Unseen Chord (Elias Cho · Seoul)',
  saveKey: 'narrow_way_walk_save_v1',
  codePrefix: 'NW1',
  gatehouseBook1Url: '',
  gatehouseBook1Status: 'Edition Details Available in the Gatehouse'
};

// All 5 Verbatim KJV Scrolls in Book 1 (draft.md Scroll Index, lines 3609-3620)
export const SCROLLS = {
  scroll_1: {
    id: 'scroll_1',
    num: 1,
    ref: 'Proverbs 16:18 (KJV)',
    text: 'Pride goeth before destruction, and an haughty spirit before a fall.',
    learnedAt: 'Section 48 (Well 1 — King David on the Sea of Glass)',
    resonatesAgainst: ['#15 Pride', '#27 Jealousy', '#19 Infirmity', '#17 Shame']
  },
  scroll_2: {
    id: 'scroll_2',
    num: 2,
    ref: 'Psalm 51:17 (KJV)',
    text: 'The sacrifices of God are a broken spirit: a broken and a contrite heart, O God, thou wilt not despise.',
    learnedAt: 'Section 133 (Columbarium Hall C Plaque) & Section 210 (Well 4 — Pastor Ji’s Office)',
    resonatesAgainst: ['#15 Pride', '#28 Grief', '#19 Infirmity', '#17 Shame']
  },
  scroll_3: {
    id: 'scroll_3',
    num: 3,
    ref: 'Proverbs 27:2 (KJV)',
    text: 'Let another man praise thee, and not thine own mouth; a stranger, and not thine own lips.',
    learnedAt: 'Section 110 (Well 2 — Apartment Window at Dawn)',
    resonatesAgainst: ['#27 Jealousy', '#15 Pride']
  },
  scroll_4: {
    id: 'scroll_4',
    num: 4,
    ref: 'Isaiah 53:4 (KJV)',
    text: 'Surely he hath borne our griefs, and carried our sorrows: yet we did esteem him stricken, smitten of God, and afflicted.',
    learnedAt: 'Section 175 (Well 3 — Columbarium Bench & Sea of Glass)',
    resonatesAgainst: ['#28 Grief', '#19 Infirmity', '#17 Shame']
  },
  scroll_5: {
    id: 'scroll_5',
    num: 5,
    ref: '1 Corinthians 6:12 (KJV)',
    text: 'All things are lawful unto me, but all things are not expedient: all things are lawful for me, but I will not be brought under the power of any.',
    learnedAt: 'Section 158 (Reward for Walking Away in Wisdom from Rigged Stand 4)',
    resonatesAgainst: ['#23 Addictions', '#19 Infirmity', '#15 Pride']
  }
};

// Mentor's Token (how-to-play-and-sheet.md & draft.md Section 48)
export const MENTOR_TOKEN = {
  id: 'aquamarine-tuning-stone',
  name: 'The Aquamarine Tuning-Stone',
  mentor: 'David the King (Light Blue • Spirit of Might • Aquamarine)',
  sectionRef: 'Section 48 (Well 1 — The Curb on the Sea of Glass)',
  description:
    "A smooth, translucent sky-blue Aquamarine stone cut from the cypress frame of King David's own harp. Single use (once per book): (1) Treat your 2d6 roll in one Stand round as an automatic 10 (giving 10 + Courage), OR (2) Pass one Favor Test automatically as Blessed without losing 1 Favor, OR (3) Hear a quiet harmonic chord before a Stand revealing which learned Scroll resonates. Restored if spent in a Stand where you Fall and return to a Well."
};

// All 7 Verbatim KJV Wisdom Pages in Book 1 (draft.md Sections 48, 110, 175, 210, 189, 245, 280)
export const WISDOM_PAGES = {
  wisdom_1: {
    id: 'wisdom_1',
    spreadNum: 1,
    sectionRef: 'Section 48 (Well 1)',
    title: 'Wisdom at the Well · Spread 1: The Mask Is the Cliff',
    verses: [
      {
        ref: 'Proverbs 16:18–19 (KJV)',
        text: 'Pride goeth before destruction, and an haughty spirit before a fall. Better it is to be of an humble spirit with the lowly, than to divide the spoil with the proud.'
      },
      {
        ref: 'James 2:19 (KJV)',
        text: 'Thou believest that there is one God; thou doest well: the devils also believe, and tremble.'
      }
    ],
    counselSpeaker: 'David the King (sitting crownless on the curb beside you and Elias)',
    counselText:
      '“Look at my hands, Elias. Look at yours, Fellow-Traveler. I wrote songs the whole nation sang in the tabernacle, and I also sat on the palace roof when I should have been in the field until my pride and my secret appetite nearly wrecked my house. Pride tells you that if you take off the stage mask, you will fall. The truth is the other way around: the mask is the cliff. Sitting down on the curb and saying ‘I need help’ isn’t the fall, friend. It’s the ground.”',
    questions: [
      'Why does Pride try to convince us that asking for help will ruin our reputation?',
      'What does Proverbs 16:19 mean by saying it is better to be “of an humble spirit with the lowly” than to stand in the spotlight with the proud?'
    ],
    grantsScroll: 'scroll_1'
  },
  wisdom_2: {
    id: 'wisdom_2',
    spreadNum: 2,
    sectionRef: 'Section 110 (Well 2)',
    title: 'Wisdom at the Well · Spread 2: Walking Out of the Trap',
    verses: [
      {
        ref: 'Proverbs 27:2 (KJV)',
        text: 'Let another man praise thee, and not thine own mouth; a stranger, and not thine own lips.'
      },
      {
        ref: 'Proverbs 11:2 (KJV)',
        text: 'When pride cometh, then cometh shame: but with the lowly is wisdom.'
      }
    ],
    counselSpeaker: 'Elias Cho & David the King (at the Apartment Window at Dawn)',
    counselText:
      '“I used to think the hardest test was when somebody attacked you,” Elias says quietly, looking out over the waking city. “Last night in that hallway in Hannam-dong, nobody attacked us. Tae-yang smiled, called me an old friend, and dared my pride to prove I could sit in the back room without falling. Walking out looked weak to the people inside that party—and it saved my life.”',
    questions: [
      'Why does Pride love to dare us with the words, “Go ahead—you’re strong enough to handle this”?',
      'What is the difference between courage that stands firm for what is right and pride that walks into a trap just to prove a point?'
    ],
    grantsScroll: 'scroll_3'
  },

  wisdom_3: {
    id: 'wisdom_3',
    spreadNum: 3,
    sectionRef: 'Section 175 (Well 3)',
    title: 'Wisdom at the Well · Spread 3: Both Halves of Might',
    verses: [
      {
        ref: 'Isaiah 53:4 (KJV)',
        text: 'Surely he hath borne our griefs, and carried our sorrows: yet we did esteem him stricken, smitten of God, and afflicted.'
      },
      {
        ref: '2 Samuel 18:33 (KJV)',
        text: 'And the king was much moved, and went up to the chamber over the gate, and wept: and as he went, thus he said, O my son Absalom, my son, my son Absalom! would God I had died for thee, O Absalom, my son, my son!'
      },
      {
        ref: 'John 11:35 (KJV)',
        text: 'Jesus wept.'
      }
    ],
    counselSpeaker: 'David the King (beside the Columbarium Stone Basin)',
    counselText:
      '“Joab thought a king should never let the soldiers see him weep,” David says quietly beside the stone basin. “He thought tears at the gatehouse would make the kingdom look weak. Look at the Son of David instead: when He stood outside Lazarus’s tomb in Bethany—knowing full well He was three sentences away from raising the dead—Jesus wept (John 11:35 KJV). Never let Pride tell you that grief is a lack of faith. Bringing your sorrow into the light is how the Man of Sorrows carries it with you.”',
    questions: [
      'What is the difference between “grieving sideways” (hiding pain in busyness, anger, or habits) and grieving honestly before God and people who love us?',
      'Why did King David say that the Spirit of Might includes “both halves”—weeping honestly when it is time to weep, and standing back up when it is time to eat bread?'
    ],
    grantsScroll: 'scroll_4'
  },
  wisdom_4: {
    id: 'wisdom_4',
    spreadNum: 4,
    sectionRef: 'Section 210 (Well 4)',
    title: 'Wisdom at the Well · Spread 4: The Voice That Tells the Truth',
    verses: [
      {
        ref: 'Psalm 51:17 (KJV)',
        text: 'The sacrifices of God are a broken spirit: a broken and a contrite heart, O God, thou wilt not despise.'
      },
      {
        ref: 'Proverbs 28:13 (KJV)',
        text: 'He that covereth his sins shall not prosper: but whoso confesseth and forsaketh them shall have mercy.'
      }
    ],
    counselSpeaker: 'Pastor Ji (in the Church-Basement Recovery Office)',
    counselText:
      '“Let me ask you one question, Elias,” Pastor Ji says quietly. “Did that voice on the glass ever once tell you what your pride wanted to hear? Did it tell you that you were a great star, or that you didn’t need a sponsor, or that one more drink wouldn’t hurt?” “No,” Elias admits. “It told me to stop performing, tell Yuna the truth, and sit on the curb.” “When a drowning man’s own mind invents a daydream,” Pastor Ji says, “it manufactures an excuse or a flatterer. Only the Spirit of God loves you enough to tell you the truth that costs your pride and saves your soul.”',
    questions: [
      'How can we tell the difference between a comforting lie our own pride invents and the loving conviction of God’s Spirit?',
      'Why does God delight in “a broken and a contrite heart” (Psalm 51:17) more than a polished performance?'
    ],
    grantsScroll: 'scroll_2'
  },
  wisdom_5: {
    id: 'wisdom_5',
    spreadNum: 5,
    sectionRef: 'Section 245 (Well 5)',
    title: 'Wisdom at the Well · Spread 5: Grace Unto the Humble',
    verses: [
      {
        ref: 'Proverbs 16:18 (KJV)',
        text: 'Pride goeth before destruction, and an haughty spirit before a fall.'
      },
      {
        ref: 'James 4:6 (KJV)',
        text: 'But he giveth more grace. Wherefore he saith, God resisteth the proud, but giveth grace unto the humble.'
      }
    ],
    counselSpeaker: 'David the King (across the Fire-Veined Crystal of the Threshold)',
    counselText:
      '“Do not bring a speech onto the glass tonight, my brothers. When five fortresses rise at once, the man who tries to stand on his own record is swept away. Kneel where you are weak, reach for the hand next to you, and speak the plain truth. God has never once despised a contrite heart.”',
    questions: [
      'Why does James 4:6 say that “God resisteth the proud, but giveth grace unto the humble”?',
      'Before the biggest test in this book begins, which quiet deed of love that you practiced along the way meant the most to you?'
    ],
    grantsScroll: null
  },
  wisdom_6: {
    id: 'wisdom_6',
    spreadNum: 6,
    sectionRef: 'Section 189 (Youth Q&A Basement)',
    title: 'Wisdom on the Path · Spread 6: Strength Made Perfect in Weakness',
    verses: [
      {
        ref: 'Proverbs 12:19 (KJV)',
        text: 'The lip of truth shall be established for ever: but a lying tongue is but for a moment.'
      },
      {
        ref: '2 Corinthians 12:9 (KJV)',
        text: 'And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.'
      }
    ],
    counselSpeaker: 'Words in the Forty-Chair Church Basement (Section 189)',
    counselText:
      'Nobody in the forty folding chairs reaches for their phone to film a clip. Around the room, shoulders that were braced in imitation of a celebrity worship star suddenly drop two inches. By tearing down his own pedestal in front of them, Elias has just given forty young believers permission to come into the light before they drown.',
    questions: [
      'Why did Elias say that “the pretending” was even more dangerous than the struggle itself?',
      'In 2 Corinthians 12:9, why does Paul say he will gladly be honest about his weakness rather than pretending to be strong?'
    ],
    grantsScroll: null
  },
  wisdom_7: {
    id: 'wisdom_7',
    spreadNum: 7,
    sectionRef: 'Section 280 (Sunlit Sea of Glass)',
    title: 'Wisdom on the Sea of Glass · Spread 7: The Floor Was the Throne-Room',
    verses: [
      {
        ref: 'Proverbs 3:3–4 (KJV)',
        text: 'Let not mercy and truth forsake thee: bind them about thy neck; write them upon the table of thine heart: So shalt thou find favour and good understanding in the sight of God and man.'
      },
      {
        ref: 'Matthew 22:37–39 (KJV)',
        text: 'Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment. And the second is like unto it, Thou shalt love thy neighbour as thyself.'
      }
    ],
    counselSpeaker: 'David the King & Daniel the Prophet (on the Sunlit Sea of Glass)',
    counselText:
      '“Look around this circle, Fellow-Traveler,” King David says, looking from Adaeze’s mud-stained hem to Matthias’s ink-stained fingers, Talia’s open hands, and Elias’s tear-washed face. “No one here won a pile of gold tonight. What you won is each other—and a clean heart before God. Pride promises you a throne where you sit alone at the top. Love sits down on the floor with its brothers and sisters, and finds out the floor was the throne-room all along.”',
    questions: [
      'Why did the four Mentors (David, Daniel, Paul, and Esther) wait until after the heroes confessed and joined hands before stepping down through the sky?',
      'What did Queen Esther and Talia mean when they told the Strongholds, “You are not the wall—you are only what waits inside it, hoping no one remembers the wall can come down”?'
    ],
    grantsScroll: null
  }
};

// All 5 Canonical Wells in Book 1 (draft.md Sections 48, 110, 175, 210, 245)
export const WELLS = {
  well_1: {
    id: 'well_1',
    num: 1,
    sectionNum: 48,
    stageIdx: 1,
    title: 'Well 1 · The Curb on the Sea of Glass (Section 48)',
    subtitle: 'Where the wet Seoul alley thins into warm crystal beside King David',
    body:
      'On the warm, translucent crystal of the Sea of Glass (Revelation 4:6 KJV), King David sits right down on the curb beside you and Elias—no crown on his brow, his ten-stringed cypress harp slung across his back with one snapped string, and a sky-blue Aquamarine stone gleaming in its frame. “I didn’t come to give you a lecture, Elias,” the shepherd-king says softly. “I came to sit.” He places a smooth sky-blue stone cut from his harp frame into your palm—The Aquamarine Tuning-Stone—and Elias pulls out his phone and sends the twelve-word cutoff text: “Not tonight. Actually. Don’t come back around anymore. I mean it this time.”',
    grantsScroll: 'scroll_1',
    grantsToken: true,
    wisdomId: 'wisdom_1',
    gracePassage: {
      sectionRef: 'Section 60 (Act I Grace Restoration)',
      exposed: 'Trying to fight temptation in secrecy or defend a spotless image drains the strength meant for honest dependence.',
      text: 'Your strength gives out on the cold stone, and the noise of the crowd and the alley rushes together. There is no mocking voice here, and no “Game Over.” Beneath you, the wet floor warms into clear, golden-veined glass. David the King kneels in the dust beside you and lifts a wooden cup of cool water to your lips: “Do not be ashamed of falling, Fellow-Traveler. Leave the mask on the floor where it fell. The Father’s house has plenty of bread, and the road is still open.”'
    }
  },
  well_2: {
    id: 'well_2',
    num: 2,
    sectionNum: 110,
    stageIdx: 2,
    title: 'Well 2 · The Apartment Window at Dawn (Section 110)',
    subtitle: 'Early morning sunlight over Mapo-gu after turning away from Hannam-dong',
    body:
      'Early morning sunlight pours through the fourth-floor window, warming the scarred wooden table where two fresh mugs of barley tea are steaming. Elias sits with his hands wrapped around his mug, looking down at the phone where Pastor Ji’s number is saved on the screen. For the first time since the concert, his shoulders rest at their natural height.',
    grantsScroll: 'scroll_3',
    grantsToken: false,
    wisdomId: 'wisdom_2',
    gracePassage: {
      sectionRef: 'Section 119 (Act II Grace Restoration)',
      exposed: 'Fighting a rigged battle of ego or comparison drains the strength meant for walking in freedom.',
      text: 'In the quiet between one heartbeat and the next, the floor beneath you turns to warm crystal. David the King sits on a low stone step beside you, his cypress harp resting across his knees, holding out a cup of clear water: “Do not let shame keep you on the floor, Fellow-Traveler. Walking into a furnace God never sent you into—just to prove you will not burn—is Pride wearing the coat of courage. Drink, rest, and take the wiser road.”'
    }
  },
  well_3: {
    id: 'well_3',
    num: 3,
    sectionNum: 175,
    stageIdx: 3,
    title: 'Well 3 · The Columbarium Bench & Sea of Glass (Section 175)',
    subtitle: 'Under the red-gold pine and maple trees outside Hall C with Yuna',
    body:
      'Under the red-gold pine and maple trees outside Hall C, a stone basin trickles clear mountain water through a bamboo spout. You, Elias, and Yuna sit side by side on the sun-warmed wooden bench. Elias’s eyes are red from weeping openly in front of their mother’s brass plate, yet the grey, hollowed-out look he has carried since Section 1 is gone.',
    grantsScroll: 'scroll_4',
    grantsToken: false,
    wisdomId: 'wisdom_3',
    gracePassage: {
      sectionRef: 'Section 179 (Act III Grace Restoration)',
      exposed: 'Trying to out-work grief or carry exhaustion without rest turns a heavy day into a snare.',
      text: 'David the King sits down beside you—no crown on his brow, his scarred shepherd’s hands steady—and places a piece of honeycomb and a cup of water in your palm: “Even Elijah lay down under a juniper tree after the fire on Mount Carmel (1 Kings 19:4–6 KJV). And the Lord did not scold him—He sent an angel to bake him bread on the coals and let him sleep twice. Rest at the Well, and rise when your breath returns.”'
    }
  },
  well_4: {
    id: 'well_4',
    num: 4,
    sectionNum: 210,
    stageIdx: 3,
    title: 'Well 4 · Pastor Ji’s Church-Basement Recovery Office (Section 210)',
    subtitle: 'Twelve metal folding chairs, hot barley tea, and unvarnished counsel',
    body:
      'The basement office of Grace Community Church in Mapo-gu has no stage lights, no soundboard, and no green room—just twelve metal folding chairs in a circle and a battered electric kettle. Pastor Ji pours three paper cups of steaming barley tea and reminds Elias that only the Spirit of God loves a man enough to tell him the truth that costs his pride and saves his soul.',
    grantsScroll: 'scroll_2',
    grantsToken: false,
    wisdomId: 'wisdom_4',
    gracePassage: {
      sectionRef: 'Section 204 (Act IV Grace Restoration)',
      exposed: 'Fighting to win an argument in pride—or facing the mirror without confession—drains the strength meant for service.',
      text: 'On the translucent floor of the Sea of Glass beneath your feet, David the King sits down on the step beside you, his crownless head bowed, and hands you a cup of cool water: “I know the taste of a fight I started for my own honor, friend. A man cannot sing the Lord’s song while he is defending his own monument. Come back to the table and wash your face.”'
    }
  },
  well_5: {
    id: 'well_5',
    num: 5,
    sectionNum: 245,
    stageIdx: 4,
    title: 'Well 5 · The Kitchen Floor & Threshold of the Sea (Section 245)',
    subtitle: 'Beside the factory-capped, untouched bottle before the Five-Stronghold Storm',
    // Strict no-theophany guardrail: unseen Throne represented only by warm sanctuary light & KJV citations
    body:
      'Right there on the kitchen floor, with the green bottle still factory-capped and untouched on the counter above you, the linoleum tilts open into warm, fire-veined crystal. A steady golden-white sanctuary light shines across the Sea of Glass (Revelation 4:6; 15:2 KJV)—reminding you that Christ’s victory on the Cross is already accomplished and total (“It is finished,” John 19:30; “the devils also believe, and tremble,” James 2:19 KJV).',
    grantsScroll: null,
    grantsToken: false,
    wisdomId: 'wisdom_5',
    gracePassage: {
      sectionRef: 'Section 275 (Act V Climax Grace Restoration)',
      exposed: 'Even in the final storm, no believer stands alone; calling on the fellowship and spending the scrolls of truth is the path through.',
      text: 'Even here at the height of the siege, the outcome of the war is never in doubt. Across the warm crystal of the Sea of Glass (Revelation 15:2 KJV), all five towering Strongholds tremble and shrink back (“the devils also believe, and tremble,” James 2:19 KJV). David the King steps to your side, his hand warm on your shoulder: “The battle belongs to the Lord, Fellow-Traveler. Catch your breath at the threshold, and step back into the circle.”'
    }
  }
};

// All 8 Canonical Stands in Book 1 (draft.md Sections 33, 29, 95, 145, 152, 164, 114, 260)
// Uses exact Courage/Strength/Crack/Demolish numbers from gamebooks/book-01/draft.md
export const STANDS = {
  stand_1: {
    id: 'stand_1',
    num: 1,
    sectionNum: 33,
    stageIdx: 0,
    title: 'Stand 1 · The Applause Echo',
    strongholdName: 'Pride (#15)',
    scriptureRoot: 'Ezekiel 28:17; Isaiah 14:13–14; Proverbs 16:18 (KJV)',
    baseCourage: 7,
    rollBonus: 1,
    baseStrength: 9,
    crackTarget: 3, // Crack at <= 3, Demolish at 0
    isRiggedBait: false,
    resonantScrolls: ['scroll_1'],
    whisper:
      '“Look at these executives waiting to put your brother on every screen in the country. Don’t mention how tired he is. Smile, take the credit, and tell them how effortlessly he carries the anointing.”',
    victoryLawPrompt:
      'Step 1 (The Victory Law): Refuse the flattery and give the glory to God alone before Round 1.',
    victoryLawEffect: { courageDelta: -1, strengthDelta: 0, note: 'Humility lowers The Applause Echo’s COURAGE from 7 to 6 (rolls 2d6+7)!' },
    scrollLawEffect: { courageDelta: -1, strengthDelta: -2, note: 'Speaking Proverbs 16:18 cracks the gilded mirror (-1 Courage, -2 Strength)!' },
    victoryText:
      'Elias sets down the porcelain espresso cup and looks the producer in the eye: “The song isn’t a brand, sir. Anything good in that room tonight belonged to the Lord, and I need some air.” The gilded reflection in the lounge mirror fractures and fades.',
    withdrawText:
      'You excuse yourselves from the circle of cameras (-2 Strength from the suffocating flattery) and slip out the side door toward the back alley.'
  },
  stand_2: {
    id: 'stand_2',
    num: 2,
    sectionNum: 29,
    stageIdx: 1,
    title: 'Stand 2 · The Patient Whisper',
    strongholdName: 'Addictions (#23)',
    scriptureRoot: 'Proverbs 23:29–35; 1 Corinthians 6:12 (KJV)',
    baseCourage: 7,
    rollBonus: 1,
    baseStrength: 9,
    crackTarget: 3,
    isRiggedBait: false,
    resonantScrolls: ['scroll_5', 'scroll_1'],
    whisper:
      '“You gave two thousand people everything you had tonight, Elias. Nobody at church knows how loud the hospital machines still sound in your head. You don’t have to quit forever—just get through tonight. Usual spot, twenty minutes.”',
    victoryLawPrompt:
      'Step 1 (The Victory Law): Step beside Elias by the dumpsters and ask him to read the dealer’s text message out loud into the light instead of hiding it.',
    victoryLawEffect: { courageDelta: -1, strengthDelta: -1, note: 'Bringing the secret into the light lowers Addictions’ COURAGE to 6 (rolls 2d6+7) and STRENGTH from 9 to 8!' },
    scrollLawEffect: { courageDelta: -1, strengthDelta: -1, note: 'Speaking KJV Scripture aloud with honest confession lowers COURAGE to 6 and STRENGTH to 8!' },
    victoryText:
      'As you stand shoulder-to-shoulder with Elias in the neon drizzle and refuse to let the secret stay in the dark, the low, humming coil above the dumpsters cracks and recoils—and beneath your sneakers, the wet asphalt warms into translucent crystal.',
    withdrawText:
      'Shaken by the pull of the alley (-2 Strength), you and Elias step back toward the curb as the wet ground beneath your feet begins to shimmer into warm crystal.'
  },
  stand_3: {
    id: 'stand_3',
    num: 3,
    sectionNum: 95,
    stageIdx: 2,
    title: 'Stand 3 · The Comparison Lens',
    strongholdName: 'Jealousy (#27)',
    scriptureRoot: 'Numbers 5:14; 1 Samuel 18:6–10; Proverbs 27:2 (KJV)',
    baseCourage: 8,
    rollBonus: 1,
    baseStrength: 10,
    crackTarget: 4,
    isRiggedBait: false,
    resonantScrolls: ['scroll_3', 'scroll_1'],
    whisper:
      '“Look how easily the doors open for that younger singer in Busan while you bleed for every note. If you let your streaming numbers slip this month, everyone will forget your name. Watch them. Measure yourself against them.”',
    victoryLawPrompt:
      'Step 1 (The Victory Law): Pray aloud with Elias for the younger worship leader in Busan to be blessed, or speak Proverbs 27:2 (KJV).',
    victoryLawEffect: { courageDelta: -1, strengthDelta: -1, note: 'Jealousy cannot breathe where another’s good is celebrated! Courage drops from 8 to 7 (rolls 2d6+8), Strength from 10 to 9.' },
    scrollLawEffect: { courageDelta: -1, strengthDelta: -1, note: 'Speaking Proverbs 27:2 (KJV) cracks the jaundiced lens (-1 Courage, -1 Strength)!' },
    victoryText:
      '“Lord, bless that brother’s songs in Busan,” Elias says out loud, his voice rough at first and then genuinely warm. “If kids are meeting You there, what does it matter whose name is on the poster?” The jaundiced green-gold lens cracks across the middle and dissolves like smoke in sunlight.',
    withdrawText:
      'You snap the laptop lid shut with a sharp click (-2 Strength). Your temples ache from the sting of comparison, yet the screen is dark and the room is yours again.'
  },
  stand_4: {
    id: 'stand_4',
    num: 4,
    sectionNum: 145,
    stageIdx: 2,
    title: 'Stand 4 · The Back-Room Boast at Hannam-dong',
    strongholdName: 'Pride (#15) + Addictions (#23)',
    scriptureRoot: '1 Corinthians 6:12; Proverbs 16:18; Proverbs 22:3 (KJV)',
    baseCourage: 9,
    rollBonus: 1,
    baseStrength: 12,
    crackTarget: 0,
    isRiggedBait: true, // Walking away is the canonical Victory, or fighting at 2d6+10 is possible but risky!
    wisdomLine: 'Wisdom: Sometimes the bravest stand is walking away (Proverbs 22:3).',
    wisdomKjvText: '“A prudent man foreseeth the evil, and hideth himself: but the simple pass on, and are punished.” — Proverbs 22:3 (KJV)',
    resonantScrolls: ['scroll_5', 'scroll_1'],
    whisper:
      '“What’s the matter? Are you two afraid of a room? Step inside Tae-yang’s green room for ten minutes and prove how strong your recovery is. If you walk away now, everyone at the party will say you’re still weak.”',
    victoryLawPrompt:
      'Step 1 (The Victory Law — Section 145): Some battles are snares of ego that are won by refusing them! Walk out into the night with Elias right now (Section 158, Cost: 1 Favor or 1 Strength), or risk fighting the snare head-on (Stronghold rolls 2d6+10).',
    victoryLawEffect: { courageDelta: 0, strengthDelta: 0, note: 'Refusing the rigged fight in wisdom costs 1 Favor or 1 Strength and teaches Scroll 5!' },
    scrollLawEffect: { courageDelta: 0, strengthDelta: 0, note: 'Refusing the rigged fight in wisdom is the true victory!' },
    victoryText:
      '“No, Tae-yang,” Elias says in the hallway—neither loud nor defensive. “I’m not coming in. And it isn’t you I don’t trust.” You and Elias turn around together and walk out into the clean midnight air of Hannam-dong. Behind the velvet rope, the rigged snare shatters silently into nothing! (Learned Scroll 5: 1 Corinthians 6:12 KJV).',
    withdrawText:
      'Waking up to the trap in the smoke-filled doorway, you and Elias turn your backs on Tae-yang’s party and step out into the clean Hannam-dong night.'
  },

  stand_5: {
    id: 'stand_5',
    num: 5,
    sectionNum: 152,
    stageIdx: 3,
    title: 'Stand 5 · The Curated Sorrow',
    strongholdName: 'Grief (#28 — Loss + Refused Comfort)',
    scriptureRoot: 'Genesis 37:34–35; Isaiah 53:4; 2 Samuel 18:33 (KJV)',
    baseCourage: 8,
    rollBonus: 1,
    baseStrength: 10,
    crackTarget: 0, // Demolish target 0
    isRiggedBait: false,
    resonantScrolls: ['scroll_4', 'scroll_2'],
    whisper:
      '“Keep your chin up before the brass plate. Bow for ten seconds, say something spiritual, and walk out to the car before your sister Yuna sees you cry. If you let the dam break, you will never stop.”',
    victoryLawPrompt:
      'Step 1 (The Victory Law): Speak Psalm 51:17 or Isaiah 53:4 aloud, or tell Elias gently, “You don’t have to hold it together here, brother; Yuna and I are right beside you.”',
    victoryLawEffect: { courageDelta: 0, strengthDelta: -2, note: 'Honest lament lowers The Curated Sorrow’s STRENGTH from 10 to 8!' },
    scrollLawEffect: { courageDelta: -1, strengthDelta: -2, note: 'Speaking Isaiah 53:4 / Psalm 51:17 shatters the shell of refused comfort (-1 Courage, -2 Strength)!' },
    victoryText:
      'The cold stone shell of refused comfort shatters into nothing. Standing before the small brass plate of Grace Mi-ran Cho, with Yuna’s hand on his left arm and you standing on his right, Elias weeps for his mother in the daylight—and after ten unhurried minutes, wipes his eyes and stands back up without pretending he didn’t cry.',
    withdrawText:
      'Your chest tightens from holding back the tears (-2 Strength), and you step out through the glass doors of Hall C with Elias and Yuna toward the pine bench at Well 3.'
  },
  stand_6: {
    id: 'stand_6',
    num: 6,
    sectionNum: 164,
    stageIdx: 3,
    title: 'Stand 6 · The Iron Collar of Burnout',
    strongholdName: 'Infirmity (#19)',
    scriptureRoot: 'Luke 13:11–16; 2 Corinthians 12:9 (KJV)',
    baseCourage: 8,
    rollBonus: 1,
    baseStrength: 11,
    crackTarget: 4,
    isRiggedBait: false,
    resonantScrolls: ['scroll_2', 'scroll_1', 'scroll_4', 'scroll_5'],
    whisper:
      '“Your body is spent and your nerves are frayed. Stay in the windowless rehearsal booth. Cancel on Yuna. Tell her you have vocal fatigue. Bind yourself where nobody can ask anything of you.”',
    victoryLawPrompt:
      'Step 1 (The Victory Law): Refuse the isolation, lift Elias’s heavy guitar case onto your own shoulder, and pray for the Lord to loose the exhaustion (Luke 13:12 KJV).',
    victoryLawEffect: { courageDelta: -1, strengthDelta: -1, note: 'Bearing your brother’s burden lowers The Iron Collar’s COURAGE to 7 (rolls 2d6+8) and STRENGTH from 11 to 10!' },
    scrollLawEffect: { courageDelta: -1, strengthDelta: -1, note: 'Speaking KJV Scripture aloud looses the iron yoke (-1 Courage, -1 Strength)!' },
    victoryText:
      'As you lift the guitar case off Elias’s bent shoulder and pray aloud in the booth, the unseen iron yoke cracks with the sound of snapping rust. Elias straightens his spine, inhaling a full lungful of air, and you find Auntie Park’s clay vial of olive oil (+1 Flask of Oil)!',
    withdrawText:
      'Leaving the guitar behind in the booth (-2 Strength), you pull Elias out of the windowless basement into the crisp autumn sunlight.'
  },
  stand_7: {
    id: 'stand_7',
    num: 7,
    sectionNum: 114,
    stageIdx: 4,
    title: 'Stand 7 · The Mirror-Guard of Pride',
    strongholdName: 'Pride (#15)',
    scriptureRoot: 'Proverbs 16:18; Psalm 51:17; 2 Corinthians 12:9 (KJV)',
    baseCourage: 9,
    rollBonus: 1,
    baseStrength: 10,
    crackTarget: 0, // Demolish at 0
    isRiggedBait: false,
    resonantScrolls: ['scroll_1', 'scroll_2', 'scroll_3'],
    whisper:
      '“Why tell those forty nineteen-year-olds in the basement that you have been drowning since your mother died? Give them the polished version. Protect the ministry. Protect your name. If they see you weak, they will stop listening.”',
    victoryLawPrompt:
      'Step 1 (The Victory Law): Speak Scroll 1 (Proverbs 16:18) or Scroll 2 (Psalm 51:17) aloud while refusing to give the youth group a fake testimony.',
    victoryLawEffect: { courageDelta: -1, strengthDelta: 0, note: 'Costly honesty (“We aren’t going in there to look strong”) lowers COURAGE from 9 to 8 (rolls 2d6+9)!' },
    scrollLawEffect: { courageDelta: 0, strengthDelta: -1, note: 'Speaking Proverbs 16:18 / Psalm 51:17 splits the obsidian mirror (-1 Strength to 9)!' },
    victoryText:
      'The obsidian glass shatters into harmless gray dust on the linoleum floor, leaving only an ordinary hallway mirror and a quiet door. Inside the basement, when 19-year-old Soo-jin asks for the real answer, Elias lowers the microphone to his knee and tells the unvarnished truth.',
    withdrawText:
      'Stepping back up the basement stairs to catch your breath (-2 Strength), you bow your heads by the courtyard window and ask the Lord for plain words before entering the youth room.'
  },
  stand_8: {
    id: 'stand_8',
    num: 8,
    sectionNum: 260,
    stageIdx: 5,
    title: 'Stand 8 · The Obsidian Crown of Pride & The Fig-Leaf Door of Shame',
    strongholdName: 'Pride (#15) + Shame (#17) [with Jealousy #27, Abandonment #21, Occult #29]',
    scriptureRoot: 'Proverbs 16:18; Psalm 51:17; Genesis 3:7; Revelation 15:2 (KJV)',
    baseCourage: 9,
    rollBonus: 1,
    baseStrength: 13,
    crackTarget: 0, // Demolish at 0
    isRiggedBait: false,
    isClimax: true,
    resonantScrolls: ['scroll_1', 'scroll_2', 'scroll_3', 'scroll_4', 'scroll_5'],
    whisper:
      'Shame opens a false doorway to a dim hallway and whispers: “Look at these strangers counting on you, Elias. Are you really going to stand here—or are you only going to fail them, the way you failed your mother?” While Pride whispers to you: “Let him go. Why go down with a man who almost relapsed?”',
    victoryLawPrompt:
      'Step 1 (The Victory Law + Fellowship Synergy, Sec. 260–263): Refuse to abandon Elias, speak Proverbs 16:18 & Psalm 51:17 as Elias cries out “I’m not okay. And I’m still here,” and lock hands in an unbroken circle with Adaeze, Brother Matthias, and Talia!',
    victoryLawEffect: { courageDelta: -2, strengthDelta: -3, note: 'Confession + Locking Four Hands across the Sea of Glass drops COURAGE from 9 to 7 (rolls 2d6+8) and STRENGTH from 13 to 10!' },
    scrollLawEffect: { courageDelta: -2, strengthDelta: -3, note: 'Spoken KJV Scrolls + Unbroken Fellowship Circle drops COURAGE to 7 (rolls 2d6+8) and STRENGTH to 10!' },
    victoryText:
      'As the final shard of Pride’s obsidian mirror and Shame’s fig-leaf door cracks to 0, the bruise-colored sky above the Sea of Glass tears open like dawn! Because you, Elias, Adaeze, Matthias, and Talia confessed and joined hands first, four biblical Mentors drop through the sky onto the crystal floor behind you: King David (Light Blue • Aquamarine), Daniel (Green • Emerald), Paul (Dark Blue • Sapphire), and Queen Esther (Red • Ruby)! Then, when Heaviness (#20) rises like wet ash at the threshold, all five of you sit down on the warm glass floor and hum the four unpolished notes from the broken cassette-player night—dissolving the ash into sunrise.',
    withdrawText:
      'Even when your knees tremble in the storm, Adaeze Okonkwo and Brother Matthias brace your arms in intercession (+3 Strength, Sec. 272) so the circle never breaks!'
  }
};

// All 8 Canonical Treasure Opportunities in Book 1 (draft.md Sections 14, 56, 88/90, 131, 189, 218, 252, 288)
// HARD RULE (§3): Giving raises Treasure (+1) and costs 2 Strength OR 1 Favor. Keeping/taking/passing by NEVER raises Treasure (+0).
export const TREASURES = {
  treasure_1: {
    id: 'treasure_1',
    num: 1,
    sectionNum: 14,
    stageIdx: 0,
    person: 'Mr. Park (68-year-old Venue Janitor in a Knee Brace)',
    title: 'The Corridor Junction: The Loading Bay Rain vs. The VIP Sponsor Lounge',
    prompt:
      'At the backstage corridor junction (Section 14), two doors stand open. To the LEFT, out in the cold loading-bay rain, 68-year-old janitor Mr. Park has dropped a heavy oak crate of wet XLR sound cables across his broom; his bad knee is locked in its brace and no one from the stage crew has stopped. To the RIGHT, through warm glass doors, manager Daniel waves you and Elias toward the VIP Sponsor Lounge where television producers and espresso cups are waiting.',
    giveChoice: {
      label: '✦ GIVE (Section 73): Turn away from the VIP lounge, kneel in the loading-bay rain with Elias to lift Mr. Park’s cable crate, and share 1 Loaf of Bread',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 1,
      deedRecord: 'Section 14/73 — Helped Mr. Park coil the wet cables in the loading-bay rain & shared bread instead of entering the VIP lounge.',
      outcomeText:
        'You turn your back on the glowing glass doors of the VIP lounge and walk with Elias into the cold rain. Mr. Park looks up in astonishment as the headline singer and his companion drop to both knees in the puddle beside him, coil the wet XLR cables, and share a Loaf of Bread on upturned milk crates. “Most men on that poster don’t know the loading bay exists,” Mr. Park says softly. “The Lord bless your hands, young brothers.” (+1 TREASURE!)'
    },
    keepChoice: {
      label: 'Keep Comfort & Spotlight (Section 102): Walk past the loading bay into the warm VIP Sponsor Lounge with Manager Daniel',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 0,
      triggersStand: 'stand_1',
      outcomeText:
        'You push open the warm glass doors of the VIP sponsor lounge. Out in the cold loading bay, old Mr. Park is left alone in the rain with the spilled cable crate—while inside the lounge, the gilded wall mirror darkens into Stand 1: The Applause Echo (Pride #15). (+0 Treasure)'
    }
  },
  treasure_2: {
    id: 'treasure_2',
    num: 2,
    sectionNum: 56,
    stageIdx: 2,
    person: 'Min-jun (17-year-old Fill-In Youth Bassist)',
    title: 'Midnight in the Rehearsal Basement (Section 56)',
    prompt:
      'It is past midnight after the weekend set. The rest of the band has gone out for barbecue. Sitting alone on a folding chair is 17-year-old fill-in bassist Min-jun, his eyes red after the drummer snapped at him for missing the F-sharp minor bridge modulation. Nobody from the label is here to see whether you stay or leave.',
    giveChoice: {
      label: '✦ GIVE (Section 82): Set down your coats with Elias, brew hot barley tea, and spend an unhurried hour walking Min-jun through the bridge—taking zero credit',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 1,
      deedRecord: 'Section 56/82 — Stayed past midnight in secret to encourage and tutor 17-year-old bassist Min-jun.',
      outcomeText:
        'Elias shows Min-jun how his own thumb used to cramp on the F-sharp minor transition at sixteen, and you brew three paper cups of hot barley tea. By the third run-through, Min-jun nails the bridge cleanly. Serving a younger brother in secret leaves your spirit lighter (+1 TREASURE)!'
    },
    keepChoice: {
      label: 'Keep Your Rest (Section 58): Pat Min-jun on the shoulder with a quick “practice it before Tuesday” and head straight home',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 0,
      outcomeText:
        'You step out into the cool midnight wind while behind the heavy door, 17-year-old Min-jun plucks the same four bass notes alone. (+0 Treasure)'
    }
  },
  treasure_3: {
    id: 'treasure_3',
    num: 3,
    sectionNum: 88,
    stageIdx: 2,
    person: 'Stranded Teenaged Delivery Rider (Mapo-gu Overpass)',
    title: 'The Stalled Scooter in the Pouring Rain (Sections 88 / 90 / 104)',
    prompt:
      'After Elias confesses the truth about his drinking and grief to his sister Yuna over coffee by the apartment window (Section 89), you walk her down to the avenue in the cold drizzle. Under the concrete ribs of the Mapo-gu overpass, a 19-year-old delivery rider crouches soaked and shivering beside a stalled motor-scooter, trying to keep someone else’s food box dry.',
    giveChoice: {
      label: '✦ GIVE (Section 104): Drape your dry coat over the shivering rider, press 1 Loaf of Bread (or 1 Strength) into his hands, and push his scooter to shelter',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 1,
      deedRecord: 'Section 88/104 — Gave dry coat and Bread to the stranded teenaged delivery rider under the Mapo-gu overpass.',
      outcomeText:
        '“Nobody even looks at us when the bike dies in the rain,” the boy says, blinking rain from his eyelashes. Shivering in your shirt-sleeves, you and Elias climb the apartment stairs with a quiet joy no spotlight ever gave (+1 TREASURE)!'
    },
    keepChoice: {
      label: 'Keep Your Dry Coat & Bread (Section 91): Wave Yuna onto her bus and hurry straight back up to the warm apartment',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 0,
      outcomeText:
        'You hurry back upstairs out of the rain, keeping your coat and bread to yourself. (+0 Treasure)'
    }
  },
  treasure_4: {
    id: 'treasure_4',
    num: 4,
    sectionNum: 131,
    stageIdx: 3,
    person: 'Mrs. Kang (80-year-old Widow in Faded Silk Hanbok)',
    title: 'The Columbarium Stone Staircase on Chuseok Morning (Section 131)',
    prompt:
      'Halfway up the wide granite stairs toward the columbarium halls, 80-year-old widow Mrs. Kang has stopped by the handrail, gasping for breath as she tries to carry two heavy ceramic pots of yellow chrysanthemums alone. Crowds stream past her. It is 9:48 a.m., and Yuna is waiting on the third terrace.',
    giveChoice: {
      label: '✦ GIVE (Section 150): Take both heavy flowerpots from Mrs. Kang and walk slowly at her pace up all three flights of stairs without mentioning your hurry',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 1,
      deedRecord: 'Section 131/150 — Carried 80-year-old widow Mrs. Kang’s heavy chrysanthemum pots up the columbarium stairs at her pace.',
      outcomeText:
        'Step by slow step, you listen as Mrs. Kang tells you about her late carpenter husband. At her husband’s niche in Hall C, she presses two warm honey-rice cakes into your hands: “You were not in too much of a hurry for an old woman.” Across the aisle, Yuna watches with shining eyes (+1 TREASURE)!'
    },
    keepChoice: {
      label: 'Keep Your Schedule (Section 132): Offer Mrs. Kang a polite nod and sprint up the steps two at a time so you aren’t late',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 0,
      outcomeText:
        'You arrive on the third terrace on time with burning lungs, looking back down to see Mrs. Kang still resting alone beside her heavy pots. (+0 Treasure)'
    }
  },

  treasure_5: {
    id: 'treasure_5',
    num: 5,
    sectionNum: 189,
    stageIdx: 4,
    person: 'Soo-jin (19-year-old Worship Violinist at the Basement Q&A)',
    title: 'The Concrete Steps After the Forty-Person Q&A (Section 189 / 196)',
    prompt:
      'After Elias lowers the microphone and tells the forty young worship leaders the unvarnished truth about his grief and recovery (Section 189), Manager Daniel is out in the parking lot waving urgently for you to get in the van for sponsor damage control. Meanwhile, 19-year-old Soo-jin is sitting alone on the concrete steps by the coat rack, wiping her eyes.',
    giveChoice: {
      label: '✦ GIVE (Section 196): Let Daniel’s van wait and stay on the concrete steps with Elias for 20 unhurried minutes to listen to Soo-jin and connect her with a church counselor',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 1,
      deedRecord: 'Section 189/196 — Let the manager’s van wait to sit on the basement steps with 19-year-old Soo-jin and connect her with Pastor Ji’s care.',
      outcomeText:
        'Soo-jin tells you her younger brother has been in the hospital since August and she felt like a fraud leading worship. Elias writes Pastor Ji’s chaplaincy number on her chord chart and you introduce her to the women’s ministry counselor. “Thank you for not rushing to the van,” she whispers (+1 TREASURE)!'
    },
    keepChoice: {
      label: 'Keep the Tour Schedule (Section 198): Hurry straight out to Manager Daniel’s van to deal with the sponsor fallout',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 0,
      outcomeText:
        'You hurry out to the passenger van while Soo-jin stays sitting alone on the basement steps. (+0 Treasure)'
    }
  },
  treasure_6: {
    id: 'treasure_6',
    num: 6,
    sectionNum: 218,
    stageIdx: 4,
    person: 'Hoon (20-year-old Junior Studio Sound Intern)',
    title: 'The Overwritten Master Stem in the Control Booth (Section 218 / 226)',
    prompt:
      'Twenty-year-old intern Hoon accidentally saved over the programmed orchestral backing stem. The senior tour promoter roars: “Hoon, if that was your finger on the keyboard, pack your bag right now—you’re fired and blacklisted!” Hoon supports his younger sister on this stipend. Elias had already talked about playing the bridge stripped-down anyway.',
    giveChoice: {
      label: '✦ GIVE (Section 226): Step forward with Elias immediately, take responsibility for clearing the orchestral track on your own voucher, and spare Hoon’s job and name',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 1,
      deedRecord: 'Section 218/226 — Stepped forward with Elias to take the blame and studio charge so 20-year-old intern Hoon kept his job.',
      outcomeText:
        '“Don’t fire him,” Elias tells the promoter evenly while you stand at his shoulder. “We told Hoon we didn’t want the canned orchestral swell anymore. Put the charge on our sheet.” Hoon bows ninety degrees in gratitude, and Elias plays the bridge bare—just wood, wire, and an honest voice (+1 TREASURE)!'
    },
    keepChoice: {
      label: 'Keep Your Budget Clean (Section 219): Stay silent in the corner and let Hoon take the blame for his own mistake',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 0,
      outcomeText:
        'You say nothing. Hoon packs his notebook in shame and walks out without a job. The silence in the booth feels cold and heavy (+0 Treasure).'
    }
  },
  treasure_7: {
    id: 'treasure_7',
    num: 7,
    sectionNum: 252,
    stageIdx: 5,
    person: 'Talia Reyes (Anchored on the Sea of Glass)',
    title: 'The Freezing Gale of Abandonment (Section 252 / 268)',
    prompt:
      'On the Sea of Glass before the Climax Stand, Stronghold Abandonment (#21) opens a freezing desert mirage behind Talia Reyes (“Leave before they leave you”). Adaeze lunges toward her, but a jagged blast of freezing sand sweeps between them.',
    giveChoice: {
      label: '✦ GIVE (Section 268): Throw yourself into the freezing gale to shield Adaeze and clasp Talia’s icy hand so she is not left behind',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 1,
      deedRecord: 'Section 252/268 — Braved the freezing gale beside Adaeze to clasp Talia Reyes’s hand and break Abandonment’s lie.',
      outcomeText:
        '“Look at us, Talia!” Adaeze cries out as your hands lock around Talia’s wrist. “We are the ones who stayed!” The desert watchtower of Abandonment shudders as its lie is broken by living proof (+1 TREASURE)!'
    },
    keepChoice: {
      label: 'Keep Your Guard Up (Section 253): Stay back at Elias’s side and shout encouragement across the wind while Adaeze reaches alone',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 0,
      outcomeText:
        'Adaeze catches Talia’s wrist by the fingertips while the wind’s backlash buffets your position (+0 Treasure).'
    }
  },
  treasure_8: {
    id: 'treasure_8',
    num: 8,
    sectionNum: 288,
    stageIdx: 5,
    person: 'Pastor Ji’s 12-Person Thursday Basement Recovery Circle',
    title: 'The Autumn Tour Contract Table (Section 288 / 294)',
    prompt:
      'After waking beside the untouched green bottle, confessing to Yuna, and calling Pastor Ji, Manager Daniel lays the autumn contract on the table: two lucrative arena dates with a glossy “Healed and Thriving” press release, OR trading the two arena dates for small unrecorded rooms, printing an honest line about ongoing recovery, and sitting in Chair #7 every Thursday night in Pastor Ji’s twelve-person basement recovery group at Grace Community Church.',
    giveChoice: {
      label: '✦ GIVE (Section 294): Give up the arena payday and spotlight for the honest recovery line, small unrecorded rooms, and Chair #7 in Pastor Ji’s Thursday basement circle',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 1,
      deedRecord: 'Section 288/294 — Traded the lucrative arena dates and spotlight for Chair #7 in Pastor Ji’s Thursday night church-basement recovery circle.',
      outcomeText:
        '“Take the arena dates off the sheet, Daniel,” Elias says peacefully. That Thursday night in the basement of Grace Community Church, twelve ordinary people sit on metal folding chairs. Elias sits in the seventh chair beside you, sets his chord chart on the floor, and says plainly: “My name is Elias, and I’m in recovery.” Then he plays a quiet lament from Psalm 13 (+1 TREASURE)!'
    },
    keepChoice: {
      label: 'Keep the Arena Payday (Section 289): Keep the honest press line about recovery, but hold onto the big arena dates for the income',
      breadCost: 0,
      strengthDelta: 0,
      treasureDelta: 0,
      outcomeText:
        'Daniel nods in relief as the arena dates stay on the calendar, though he prints Elias’s honest line about ongoing recovery (+0 Treasure).'
    }
  }
};

// The Treasure Gate & Canonical Book 1 Endings (draft.md Sections 298, 299, 300)
export const ENDINGS = {
  good_ending: {
    id: 'good_ending',
    sectionNum: 299,
    minTreasure: 0,
    maxTreasure: 3,
    title: 'Section 299 · THE GOOD ENDING — The Honest Recovery Road',
    epigraphRef: 'Matthew 6:21 (KJV)',
    epigraphText: 'For where your treasure is, there will your heart be also.',
    body: [
      'Standing before his mother’s brass plate in the late-afternoon sunlight of Hall C, Elias says her name out loud and hums the stripped-down bridge from his new arrangement—no audience, no set list, just a son standing in front of his mother’s memory.',
      'You have stood beside your brother through the dark alley, the comparison snares, the grief of Chuseok, and the five-Stronghold storm on the Sea of Glass. Pride (#15) and Shame (#17) have been driven back from his platform; the bottle on the kitchen counter remained untouched; and Elias is walking in honest recovery with Yuna and Pastor Ji.',
      'Yet as you touch the smooth Aquamarine Tuning-Stone in your coat pocket, you remember a few hurried corridors along the way where a janitor in the rain, a seventeen-year-old bassist at midnight, an elderly widow on the columbarium steps, or a crying girl after the Q&A was passed by in the rush.',
      'On the translucent Sea of Glass beneath your shoes, David the King smiles warmly and inclines his crownless head to you: “You stood fast in the truth, Fellow-Traveler, and brought your brother home alive. Whenever you are ready, walk this road once more—and keep your eyes open for the quiet corners where no one is clapping. That is where the deepest Treasure is waiting.”'
    ]
  },
  true_ending: {
    id: 'true_ending',
    sectionNum: 300,
    minTreasure: 4,
    maxTreasure: 8,
    title: 'Section 300 · THE TRUE ENDING — The Unseen Chord',
    epigraphRef: 'Matthew 22:37–39 & Proverbs 3:3–4 (KJV)',
    epigraphText: 'Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment. And the second is like unto it, Thou shalt love thy neighbour as thyself.',
    body: [
      'Late-afternoon sunlight pours through the west window of Hall C, warming the small brass plate of Grace Mi-ran Cho. You are not standing at the columbarium wall alone with Elias and Yuna today. Because you stopped along the narrow way whenever love asked for your time, your bread, and your pride, the quiet ripple of those unnoticed deeds has followed you all the way to the end of the book:',
      '• In your pocket rests the clean dry shop towel from Mr. Park, who now sits in the front row of Pastor Ji’s Thursday night basement fellowship with his knee brace resting on a footstool.\n• Down in the rehearsal hall, 17-year-old Min-jun and 20-year-old intern Hoon are setting up chairs for the first small, unrecorded worship night—no longer afraid of being thrown away for a mistake.\n• Across town, 19-year-old Soo-jin is meeting with her church counselor, holding the chord chart where Elias wrote Pastor Ji’s number on the concrete steps.\n• And on the third tier of Hall C, old Mrs. Kang’s yellow chrysanthemums bloom bright and unbroken beside your mother’s niche.',
      'On the train ride home across the Han River, Elias texts Yuna across the aisle: “Went to the wall. Sang to her instead of performing at her for once. Might be the first honest set I’ve ever done.” Yuna smiles at both of you and texts back: “That’s not a set. That’s just you. Keep going.”',
      'Beneath the humming steel floor of the Seoul train car, for one clear heartbeat, you see the Sea of Glass shining like gold mingled with fire (Revelation 15:2 KJV). David the King—the shepherd of Bethlehem, the psalmist of the broken heart—lifts his Aquamarine harp in a silent salute of pure joy. You have found the treasure the whole series is hunting: The love of God and the love of people is the treasure of life—found not by taking, but by giving.'
    ]
  }
};

// 6 Connected 3D Walkable Stages of Zone 1 (Story Path)
// Every stage traces directly to Book 1 Acts I–V and Vol 1 Novel Elias chapters
export const STAGES = [
  {
    idx: 0,
    id: 'stage_1_corridor',
    actLabel: 'Act I · Sections 1–17, 33, 73',
    title: 'Stage I · The 2,000-Seat Venue & Loading Bay Rain',
    subtitle: 'Seoul Auditorium Service Corridor — Where Applause Fades and the First Choice Waits',
    theme: 'seoul_corridor',
    palette: {
      skyTop: '#0d1322',
      skyHorizon: '#23324d',
      ground: '#1d222b',
      accent: '#f2c166',
      aquamarine: '#5cd6ff',
      fog: '#151c28'
    },
    eliasIntro:
      'Elias Cho steps off the 2,000-seat Seoul stage with his worn acoustic guitar case, wiping the spotlight sweat from his brow. “Two thousand people singing ‘He is able,’” he murmurs quietly beside you, “and my chest feels like an empty elevator shaft.” Ahead at the corridor junction, old Mr. Park’s cable crate spills into the loading-bay rain on the left, while Manager Daniel waves from the warm VIP Sponsor Lounge on the right.',
    nodes: [
      {
        id: 'node_t1_mr_park',
        type: 'treasure',
        treasureId: 'treasure_1',
        pos: [-3.8, 0, -9.5],
        label: '✦ Treasure Choice #1: Mr. Park in the Loading-Bay Rain vs. VIP Lounge (Sec. 14)',
        color: '#ffd166'
      },
      {
        id: 'node_stand1_pride',
        type: 'stand',
        standId: 'stand_1',
        pos: [3.8, 0, -14.5],
        label: '⚔ Stand 1: The Applause Echo — Stronghold Pride #15 (VIP Lounge Mirror, Sec. 33)',
        color: '#d97757'
      },
      {
        id: 'node_relic_cassette',
        type: 'relic',
        relicId: 'mothers-cassette-player',
        pos: [-3.2, 0, -19.0],
        label: '🗿 Inspect Relic #3: Mother’s Taped Cassette Player & 4-Note Slip (Sec. 18)',
        color: '#8ecae6'
      },
      {
        id: 'node_portal_1',
        type: 'portal',
        targetStageIdx: 1,
        pos: [0, 0, -25.0],
        label: '⛩ Step Out the Heavy Metal Door into the Neon Back Alley (Stage II →)',
        color: '#5cd6ff'
      }
    ]
  },
  {
    idx: 1,
    id: 'stage_2_alley_glass',
    actLabel: 'Act I · Sections 18–32, 41–48',
    title: 'Stage II · The Neon Back Alley & Well 1 on the Sea of Glass',
    subtitle: 'Where the Wet Asphalt Thins Into Warm Crystal and King David Sits on the Curb',
    theme: 'alley_to_glass',
    palette: {
      skyTop: '#0e1b2e',
      skyHorizon: '#386890',
      ground: '#1f3042',
      accent: '#7ce8ff',
      aquamarine: '#48cae4',
      fog: '#1b2d40'
    },
    eliasIntro:
      'In the narrow Seoul alley behind the venue, cold neon buzzes above blue dumpsters. Without remembering deciding to do it, Elias’s thumb sends a text to an old contact—and the screen glows back: “usual spot, twenty min.” Above the dumpsters coils the patient, humming shadow of Addictions (#23). Yet just beyond it, the wet asphalt is already warming into the translucent crystal of the Sea of Glass.',
    nodes: [
      {
        id: 'node_stand2_addictions',
        type: 'stand',
        standId: 'stand_2',
        pos: [-2.8, 0, -9.0],
        label: '⚔ Stand 2: The Patient Whisper — Stronghold Addictions #23 (Sec. 29)',
        color: '#e76f51'
      },
      {
        id: 'node_well1_david',
        type: 'well',
        wellId: 'well_1',
        pos: [0, 0, -16.5],
        label: '💧 Well 1: King David on the Curb of the Sea of Glass (Sec. 48 · Rest & Token)',
        color: '#48cae4'
      },
      {
        id: 'node_token_aquamarine',
        type: 'relic',
        relicId: 'aquamarine-tuning-stone',
        pos: [3.4, 0, -18.5],
        label: '💎 Mentor’s Token: David’s Aquamarine Tuning-Stone (3D Relic Pedestal · Sec. 48)',
        color: '#7ce8ff'
      },
      {
        id: 'node_wisdom1',
        type: 'wisdom',
        wisdomId: 'wisdom_1',
        pos: [-3.4, 0, -20.5],
        label: '📜 Read KJV Wisdom Page 1: Proverbs 16:18–19 & James 2:19 (Learn Scroll 1)',
        color: '#f9c74f'
      },
      {
        id: 'node_portal_2',
        type: 'portal',
        targetStageIdx: 2,
        pos: [0, 0, -26.0],
        label: '⛩ Walk Forward into Act II: Midnight Rehearsal & Hannam-dong (Stage III →)',
        color: '#5cd6ff'
      }
    ]
  },
  {
    idx: 2,
    id: 'stage_3_hannamdong',
    actLabel: 'Act II · Sections 56, 88–110, 145, 158',
    title: 'Stage III · Rehearsal Hall, Apartment Window & Hannam-dong',
    subtitle: 'Min-jun’s Bass Bridge, Yuna’s Coffee, and the Rigged Bait in Tae-yang’s Hallway',
    theme: 'mapo_hannam',
    palette: {
      skyTop: '#1a2436',
      skyHorizon: '#6b5344',
      ground: '#2b2623',
      accent: '#f4a261',
      aquamarine: '#5cd6ff',
      fog: '#262220'
    },
    eliasIntro:
      'Three days after the alley, a fan-shot clip of Elias’s voice catching on stage passes 400,000 views—and the industry tries to package his grief into a “vulnerable brand.” Walk beside Elias through the midnight rehearsal room with 17-year-old Min-jun, Thursday coffee with his sister Yuna, the rainy Mapo-gu overpass, and the rigged doorway of Tae-yang’s Hannam-dong party.',
    nodes: [
      {
        id: 'node_t2_minjun',
        type: 'treasure',
        treasureId: 'treasure_2',
        pos: [-3.6, 0, -7.5],
        label: '✦ Treasure Choice #2: 17-Year-Old Bassist Min-jun at Midnight (Sec. 56)',
        color: '#ffd166'
      },
      {
        id: 'node_stand3_jealousy',
        type: 'stand',
        standId: 'stand_3',
        pos: [3.6, 0, -11.5],
        label: '⚔ Stand 3: The Comparison Lens — Stronghold Jealousy #27 (Sec. 95)',
        color: '#e76f51'
      },
      {
        id: 'node_t3_rider',
        type: 'treasure',
        treasureId: 'treasure_3',
        pos: [-3.6, 0, -15.5],
        label: '✦ Treasure Choice #3: Stranded Delivery Rider in the Overpass Rain (Sec. 88/104)',
        color: '#ffd166'
      },
      {
        id: 'node_stand4_rigged',
        type: 'stand',
        standId: 'stand_4',
        pos: [3.6, 0, -19.5],
        label: '⚔ Stand 4: The Back-Room Boast at Hannam-dong (Sec. 145 -> 158)',
        color: '#ff9f1c'
      },
      {
        id: 'node_well2_dawn',
        type: 'well',
        wellId: 'well_2',
        pos: [-2.8, 0, -23.0],
        label: '💧 Well 2: The Apartment Window at Dawn (Sec. 110 · Learn Scroll 3)',
        color: '#48cae4'
      },
      {
        id: 'node_wisdom2',
        type: 'wisdom',
        wisdomId: 'wisdom_2',
        pos: [2.8, 0, -23.0],
        label: '📜 Read KJV Wisdom Page 2: Proverbs 27:2 & Proverbs 11:2 (Sec. 110)',
        color: '#f9c74f'
      },
      {
        id: 'node_portal_3',
        type: 'portal',
        targetStageIdx: 3,
        pos: [0, 0, -27.0],
        label: '⛩ Climb the Chuseok Hill to the Seoul Columbarium (Stage IV →)',
        color: '#5cd6ff'
      }
    ]
  },
  {
    idx: 3,
    id: 'stage_4_columbarium',
    actLabel: 'Act III · Sections 125–175, 192, 210',
    title: 'Stage IV · Seoul Columbarium Steps, Hall C & Pastor Ji’s Office',
    subtitle: 'Mrs. Kang’s Chrysanthemums, Grace Mi-ran Cho’s Brass Plate, and Honest Lament',
    theme: 'columbarium_autumn',
    palette: {
      skyTop: '#2b4560',
      skyHorizon: '#d9a066',
      ground: '#5c5346',
      accent: '#f6bd60',
      aquamarine: '#5cd6ff',
      fog: '#4a4238'
    },
    eliasIntro:
      'Autumn sunlight warms the red maples and granite stairs of the Seoul columbarium on Chuseok morning. Halfway up the stairs, 80-year-old Mrs. Kang struggles with her heavy chrysanthemum pots; inside Hall C, Yuna stands before their mother’s brass plate; and in Mapo-gu, Pastor Ji’s basement kettle is steaming.',
    nodes: [
      {
        id: 'node_t4_mrskang',
        type: 'treasure',
        treasureId: 'treasure_4',
        pos: [-3.6, 0, -7.5],
        label: '✦ Treasure Choice #4: Widow Mrs. Kang on the Columbarium Stairs (Sec. 131)',
        color: '#ffd166'
      },
      {
        id: 'node_stand5_grief',
        type: 'stand',
        standId: 'stand_5',
        pos: [0, 0, -12.5],
        label: '⚔ Stand 5: The Curated Sorrow — Stronghold Grief #28 (Hall C Brass Plate, Sec. 152)',
        color: '#e76f51'
      },
      {
        id: 'node_stand6_infirmity',
        type: 'stand',
        standId: 'stand_6',
        pos: [3.8, 0, -15.5],
        label: '⚔ Stand 6: The Iron Collar of Burnout — Stronghold Infirmity #19 (Sec. 164)',
        color: '#e76f51'
      },
      {
        id: 'node_well3_bench',
        type: 'well',
        wellId: 'well_3',
        pos: [-3.4, 0, -19.0],
        label: '💧 Well 3: The Columbarium Bench & Stone Basin (Sec. 175 · Learn Scroll 4)',
        color: '#48cae4'
      },
      {
        id: 'node_bread_stage4',
        type: 'bread',
        breadId: 'bread_stage4',
        pos: [-1.4, 0, -17.8],
        label: '🍞 Juniper Tree Bread Pickup: Take +1 Loaf of Bread by Well 3 (1 Kings 19:6 KJV)',
        color: '#fbbf24'
      },
      {
        id: 'node_wisdom3',
        type: 'wisdom',
        wisdomId: 'wisdom_3',
        pos: [3.4, 0, -19.0],
        label: '📜 Read KJV Wisdom Page 3: Isaiah 53:4, 2 Samuel 18:33 & John 11:35',
        color: '#f9c74f'
      },
      {
        id: 'node_well4_pastorji',
        type: 'well',
        wellId: 'well_4',
        pos: [-3.0, 0, -23.0],
        label: '💧 Well 4: Pastor Ji’s Church-Basement Recovery Office (Sec. 210 · Learn Scroll 2)',
        color: '#48cae4'
      },
      {
        id: 'node_wisdom4',
        type: 'wisdom',
        wisdomId: 'wisdom_4',
        pos: [3.0, 0, -23.0],
        label: '📜 Read KJV Wisdom Page 4: Psalm 51:17 & Proverbs 28:13 (Sec. 210)',
        color: '#f9c74f'
      },
      {
        id: 'node_portal_4',
        type: 'portal',
        targetStageIdx: 4,
        pos: [0, 0, -27.0],
        label: '⛩ Enter Act IV: Studio Control Booth & Youth Basement Q&A (Stage V →)',
        color: '#5cd6ff'
      }
    ]
  },
  {
    idx: 4,
    id: 'stage_5_basement_qa',
    actLabel: 'Act IV–V · Sections 218, 114, 189, 196, 228–245',
    title: 'Stage V · Studio Booth, 40-Person Youth Q&A & The Kitchen Floor',
    subtitle: 'Sparing Intern Hoon, Shattering the Mirror-Guard, Listening to Soo-jin, and Well 5',
    theme: 'basement_kitchen',
    palette: {
      skyTop: '#161d29',
      skyHorizon: '#3c495c',
      ground: '#262b33',
      accent: '#e9c46a',
      aquamarine: '#5cd6ff',
      fog: '#1d222b'
    },
    eliasIntro:
      'In the studio control booth, 20-year-old intern Hoon faces termination over a wiped backing track. Across town, a brass-framed mirror outside the 40-person youth Q&A tempts Elias to give a polished, fake testimony—and three days after he tells the truth, two church conferences cancel his bookings, leading to the midnight kitchen floor beside an untouched green bottle.',
    nodes: [
      {
        id: 'node_stand7_mirror',
        type: 'stand',
        standId: 'stand_7',
        pos: [0, 0, -7.5],
        label: '⚔ Stand 7: The Mirror-Guard of Pride — Stronghold Pride #15 (Basement Door, Sec. 114)',
        color: '#e76f51'
      },
      {
        id: 'node_wisdom6',
        type: 'wisdom',
        wisdomId: 'wisdom_6',
        pos: [3.6, 0, -11.5],
        label: '📜 Read KJV Wisdom Page 6: Proverbs 12:19 & 2 Corinthians 12:9 (Sec. 189)',
        color: '#f9c74f'
      },
      {
        id: 'node_t5_soojin',
        type: 'treasure',
        treasureId: 'treasure_5',
        pos: [-3.6, 0, -14.5],
        label: '✦ Treasure Choice #5: 19-Year-Old Violinist Soo-jin on the Concrete Steps (Sec. 189)',
        color: '#ffd166'
      },
      {
        id: 'node_t6_hoon',
        type: 'treasure',
        treasureId: 'treasure_6',
        pos: [3.6, 0, -18.5],
        label: '✦ Treasure Choice #6: Studio Intern Hoon & the Erased Master Stem (Sec. 218)',
        color: '#ffd166'
      },
      {
        id: 'node_well5_kitchen',
        type: 'well',
        wellId: 'well_5',
        pos: [-2.8, 0, -23.0],
        label: '💧 Well 5: Kitchen Floor Beside the Untouched Capped Bottle (Sec. 245)',
        color: '#48cae4'
      },
      {
        id: 'node_wisdom5',
        type: 'wisdom',
        wisdomId: 'wisdom_5',
        pos: [2.8, 0, -23.0],
        label: '📜 Read KJV Wisdom Page 5: Proverbs 16:18 & James 4:6 (Sec. 245)',
        color: '#f9c74f'
      },
      {
        id: 'node_portal_5',
        type: 'portal',
        targetStageIdx: 5,
        pos: [0, 0, -27.0],
        label: '⛩ Step Onto the Sea of Glass Climax & Thursday Recovery Circle (Stage VI →)',
        color: '#5cd6ff'
      }
    ]
  },
  {
    idx: 5,
    id: 'stage_6_climax_gatehouse',
    actLabel: 'Act V · Sections 246–300 (Climax, Thursday Circle & Gatehouse)',
    title: 'Stage VI · The Sea of Glass Climax, Thursday Basement & Gatehouse',
    subtitle: 'Four Heroes Join Hands, Four Mentors Descend, and the Treasure Gate Opens',
    theme: 'sea_of_glass_climax',
    palette: {
      skyTop: '#18344f',
      skyHorizon: '#f2c97d',
      ground: '#2b5876',
      accent: '#ffe699',
      aquamarine: '#7ce8ff',
      fog: '#294861'
    },
    eliasIntro:
      'You and Elias stand on the fire-veined crystal of the Sea of Glass (Revelation 15:2 KJV) alongside Adaeze Okonkwo, Brother Matthias, and Talia Reyes as five Strongholds tower around the circle. Anchor Talia against Abandonment, lock hands to demolish Pride (#15) and Shame (#17) in Climax Stand 8, choose Chair #7 in Pastor Ji’s Thursday basement circle, and step through the Treasure Gate!',
    nodes: [
      {
        id: 'node_t7_talia',
        type: 'treasure',
        treasureId: 'treasure_7',
        pos: [-3.6, 0, -7.5],
        label: '✦ Treasure Choice #7: Shield Adaeze & Clasp Talia Reyes’s Hand (Sec. 252)',
        color: '#ffd166'
      },
      {
        id: 'node_stand8_climax',
        type: 'stand',
        standId: 'stand_8',
        pos: [0, 0, -13.0],
        label: '⚔ Stand 8: The Obsidian Crown of Pride (#15) & Fig-Leaf Door of Shame (#17) (Sec. 260)',
        color: '#ff6b6b'
      },
      {
        id: 'node_relic_kinnor',
        type: 'relic',
        relicId: 'davids-cypress-kinnor',
        pos: [3.8, 0, -16.5],
        label: '🗿 Inspect Relic #2: David’s Crownless Cypress Harp / Kinnor (Sec. 277)',
        color: '#8ecae6'
      },
      {
        id: 'node_wisdom7',
        type: 'wisdom',
        wisdomId: 'wisdom_7',
        pos: [-3.6, 0, -18.5],
        label: '📜 Read KJV Wisdom Page 7: Proverbs 3:3–4 & Matthew 22:37–39 (Sec. 280)',
        color: '#f9c74f'
      },
      {
        id: 'node_t8_thursday',
        type: 'treasure',
        treasureId: 'treasure_8',
        pos: [3.4, 0, -21.5],
        label: '✦ Treasure Choice #8: Chair #7 in Pastor Ji’s Thursday Basement Circle (Sec. 288/294)',
        color: '#ffd166'
      },
      {
        id: 'node_treasure_gate',
        type: 'gatehouse_finale',
        pos: [0, 0, -26.0],
        label: '👑 THE TREASURE GATE (Sec. 298–300) · Complete Zone 1, Export NW1 Code & Open Gatehouse',
        color: '#ffd166'
      }
    ]
  }
];
