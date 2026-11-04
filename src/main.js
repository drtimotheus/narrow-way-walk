// ============================================================================
// THE NARROW WAY — ZONE 1 (ELIAS / BOOK 1): MAIN APPLICATION CONTROLLER
// ============================================================================
// FLAG: DEC-01..DEC-07 — Implements Companion-POV agency, transparent 2d6
// Stand checks, Treasure choices (Give +1 / Keep +0), Grace Rule at Wells,
// David's Aquamarine Tuning-Stone Relic Workshop, and NW1 progress codes.

import * as THREE from 'three';
import {
  WORLD_CONFIG,
  SCROLLS,
  MENTOR_TOKEN,
  WISDOM_PAGES,
  WELLS,
  STANDS,
  TREASURES,
  ENDINGS,
  STAGES
} from './zone1-data.js';
import { audio } from './audio.js';
import { createPainterlyArtDataURL } from './painterly.js';
import { loadRelicsManifest, RelicTurntableInspector } from './relics.js';
import { WorldStageManager } from './world.js';

// FLAG: DEC-05 — Dedicated localStorage key (never collides with Pilgrim Walk)
const STORAGE_KEY = 'narrow_way_walk_save_v1';

function createDefaultState() {
  return {
    version: 1,
    zoneId: 'zone-01-elias-seoul',
    firstSightCompleted: false,
    startingStats: { courage: 10, strength: 20, favor: 9 },
    stats: { courage: 10, strength: 20, favor: 9, treasure: 0 },
    oil: 1,
    bread: 2,
    scrollsLearned: [],
    tokenEarned: false,
    tokenUsed: false,
    tokenSpentInCurrentStand: false,
    lastWellId: 'well_1',
    lastWellStageIdx: 1,
    wellsVisited: [],
    standsCleared: [],
    treasuresChosen: {},
    treasureLog: [],
    wisdomRead: [],
    relicsInspected: [],
    currentStageIdx: 0,
    zone1Completed: false,
    endingReached: null,
    reflectionNote: '',
    settings: {
      ecoMode: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || ''),
      largeText: false,
      reducedMotion: false
    }
  };
}

let state = loadState();
let activeStandSession = null;
let turntable = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    return { ...createDefaultState(), ...parsed, stats: { ...createDefaultState().stats, ...(parsed.stats || {}) } };
  } catch {
    return createDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in private browsing
  }
  updateHUD();
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function computeChecksum(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffff;
  }
  return hash.toString(16).toUpperCase().padStart(4, '0');
}

// FLAG: DEC-05 — NW1 Progress Code Export & Import
export function generateNW1Code() {
  const payload = {
    v: 1,
    z: 1,
    s: [state.stats.courage, state.stats.strength, state.stats.favor, state.stats.treasure],
    sm: [state.startingStats.courage, state.startingStats.strength, state.startingStats.favor],
    inv: [state.oil, state.bread, state.tokenEarned ? 1 : 0, state.tokenUsed ? 1 : 0],
    sc: state.scrollsLearned,
    st: state.standsCleared,
    tr: state.treasuresChosen,
    tl: state.treasureLog,
    wl: state.wellsVisited,
    wr: state.wisdomRead,
    stg: state.currentStageIdx,
    end: state.endingReached,
    done: state.zone1Completed ? 1 : 0
  };
  const json = JSON.stringify(payload);
  const b64 = btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const chk = computeChecksum(b64);
  return `NW1-Z1-${b64}-${chk}`;
}

export function restoreFromNW1Code(codeStr) {
  const clean = (codeStr || '').trim();
  const match = clean.match(/^NW1-Z1-([A-Za-z0-9_-]+)-([0-9A-Fa-f]{4})$/);
  if (!match) {
    return { ok: false, error: 'Invalid NW1 code format. Expected NW1-Z1-<payload>-<checksum>.' };
  }
  const [, b64, chk] = match;
  if (computeChecksum(b64) !== chk.toUpperCase()) {
    return { ok: false, error: 'Checksum mismatch — please verify the full NW1 code was copied.' };
  }
  try {
    const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(padded)));
    const p = JSON.parse(json);
    state.stats = {
      courage: Number(p.s?.[0] ?? 10),
      strength: Number(p.s?.[1] ?? 20),
      favor: Number(p.s?.[2] ?? 9),
      treasure: Number(p.s?.[3] ?? 0)
    };
    state.startingStats = {
      courage: Number(p.sm?.[0] ?? 10),
      strength: Number(p.sm?.[1] ?? 20),
      favor: Number(p.sm?.[2] ?? 9)
    };
    state.oil = Number(p.inv?.[0] ?? 1);
    state.bread = Number(p.inv?.[1] ?? 2);
    state.tokenEarned = Boolean(p.inv?.[2]);
    state.tokenUsed = Boolean(p.inv?.[3]);
    state.scrollsLearned = Array.isArray(p.sc) ? p.sc : [];
    state.standsCleared = Array.isArray(p.st) ? p.st : [];
    state.treasuresChosen = p.tr && typeof p.tr === 'object' ? p.tr : {};
    state.treasureLog = Array.isArray(p.tl) ? p.tl : [];
    state.wellsVisited = Array.isArray(p.wl) ? p.wl : [];
    state.wisdomRead = Array.isArray(p.wr) ? p.wr : [];
    state.currentStageIdx = Number(p.stg ?? 0);
    state.endingReached = p.end || null;
    state.zone1Completed = Boolean(p.done);
    state.firstSightCompleted = true;
    saveState();
    loadStage(state.currentStageIdx);
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not decode NW1 payload.' };
  }
}

let renderer, scene, camera, worldManager;
const playerPos = new THREE.Vector3(0, 0, 12);
let cameraYaw = 0;
const keys = {};
const joyDelta = { x: 0, y: 0 };

function isNodeDone(node) {
  if (!node) return false;
  if (node.type === 'well') return state.wellsVisited.includes(node.wellId);
  if (node.type === 'stand') return state.standsCleared.includes(node.standId);
  if (node.type === 'treasure') return Boolean(state.treasuresChosen[node.treasureId]);
  if (node.type === 'wisdom') return state.wisdomRead.includes(node.wisdomId);
  if (node.type === 'relic') return state.relicsInspected.includes(node.relicId);
  if (node.type === 'gatehouse_finale') return state.zone1Completed;
  return false;
}

export function loadStage(idx, customZ = 12) {
  const safeIdx = Math.max(0, Math.min(STAGES.length - 1, idx));
  state.currentStageIdx = safeIdx;
  const stage = STAGES[safeIdx];
  playerPos.set(0, 0, customZ);
  cameraYaw = 0;
  if (worldManager) {
    worldManager.buildStage(stage, isNodeDone, state.settings.ecoMode);
  }
  saveState();
  renderStageBar();
  renderQuickNodeBar();
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(val);
}

export function updateHUD() {
  setText('hud-courage', state.stats.courage);
  setText('hud-strength', `${state.stats.strength}/${state.startingStats.strength}`);
  setText('hud-favor', `${state.stats.favor}/${state.startingStats.favor}`);
  setText('hud-treasure', state.stats.treasure);
  setText('hud-oil', `${state.oil}/2`);
  setText('hud-bread', `${state.bread}/3`);
  setText('hud-scrolls', `${state.scrollsLearned.length}/5`);
  const tokenEl = document.getElementById('hud-token');
  if (tokenEl) {
    if (!state.tokenEarned) {
      tokenEl.textContent = 'Unfound (Well 1)';
      tokenEl.className = 'hud-pill-val muted';
    } else if (state.tokenUsed) {
      tokenEl.textContent = 'Aquamarine Stone (Spent)';
      tokenEl.className = 'hud-pill-val spent';
    } else {
      tokenEl.textContent = 'Aquamarine Stone (Ready)';
      tokenEl.className = 'hud-pill-val ready';
    }
  }
  const stage = STAGES[state.currentStageIdx] || STAGES[0];
  setText('stage-title', stage.title);
  setText('stage-subtitle', `${stage.actLabel} · ${stage.subtitle}`);
  setText('stage-narration', stage.eliasIntro);

  document.body.classList.toggle('large-text', Boolean(state.settings.largeText));
  document.body.classList.toggle('reduced-motion', Boolean(state.settings.reducedMotion));
  const ecoBtn = document.getElementById('btn-eco-toggle');
  if (ecoBtn) {
    ecoBtn.textContent = state.settings.ecoMode ? 'Eco: ON' : 'Eco: OFF';
  }
}

function renderStageBar() {
  const wrap = document.getElementById('stage-tabs');
  if (!wrap) return;
  wrap.innerHTML = '';
  STAGES.forEach((stg, idx) => {
    const btn = document.createElement('button');
    btn.className = `stage-tab ${idx === state.currentStageIdx ? 'active' : ''}`;
    btn.textContent = `${idx + 1}. ${stg.title.replace(/^Stage [IVX]+ — /, '')}`;
    btn.addEventListener('click', () => {
      audio.playChime('step');
      loadStage(idx);
    });
    wrap.appendChild(btn);
  });
}

function renderQuickNodeBar() {
  const wrap = document.getElementById('quick-node-bar');
  if (!wrap) return;
  wrap.innerHTML = '';
  const stage = STAGES[state.currentStageIdx] || STAGES[0];
  stage.nodes.forEach((node) => {
    const btn = document.createElement('button');
    const done = isNodeDone(node);
    btn.className = `node-chip type-${node.type} ${done ? 'done' : ''}`;
    btn.textContent = `${done ? '✓ ' : ''}${node.label}`;
    btn.addEventListener('click', () => {
      playerPos.set(node.pos[0], 0, node.pos[2] + 1.8);
      openNodeInteraction(node);
    });
    wrap.appendChild(btn);
  });
}

export function openNodeInteraction(node) {
  if (!node) return;
  audio.init();
  audio.playChime('step');
  if (node.type === 'well') {
    openWellModal(node.wellId);
  } else if (node.type === 'stand') {
    openStandModal(node.standId);
  } else if (node.type === 'treasure') {
    openTreasureModal(node.treasureId);
  } else if (node.type === 'wisdom') {
    openWisdomModal(node.wisdomId);
  } else if (node.type === 'relic') {
    openRelicModal(node.relicId);
  } else if (node.type === 'portal') {
    loadStage(node.targetStageIdx ?? state.currentStageIdx + 1);
  } else if (node.type === 'gatehouse_finale') {
    openFinaleModal();
  }
}

function showModal(id) {
  document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.add('hidden'));
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

export function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.add('hidden'));
  if (turntable) turntable.stop();
  if (worldManager) {
    worldManager.buildStage(STAGES[state.currentStageIdx], isNodeDone, state.settings.ecoMode);
  }
  renderQuickNodeBar();
  updateHUD();
}

export function openWelcomeModal() {
  showModal('welcome-modal');
  const rollInfo = document.getElementById('welcome-roll-preview');
  const updatePreview = () => {
    if (rollInfo) {
      rollInfo.textContent = `Current Starting Stats — Courage: ${state.startingStats.courage} | Strength: ${state.startingStats.strength} | Favor: ${state.startingStats.favor} | Treasure: ${state.stats.treasure}`;
    }
  };
  updatePreview();

  const btnRoll = document.getElementById('btn-roll-stats');
  if (btnRoll) {
    btnRoll.onclick = () => {
      audio.init();
      audio.playChime('step');
      const c = rollDie() + 6;
      const s = rollDie() + rollDie() + 12;
      const f = rollDie() + 6;
      state.startingStats = { courage: c, strength: s, favor: f };
      state.stats.courage = c;
      state.stats.strength = s;
      state.stats.favor = f;
      updatePreview();
      saveState();
    };
  }

  const btnBegin = document.getElementById('btn-begin-walk');
  if (btnBegin) {
    btnBegin.onclick = () => {
      audio.init();
      audio.playKinnorChord();
      state.firstSightCompleted = true;
      saveState();
      closeAllModals();
    };
  }
}

export function openWisdomModal(wisdomId) {
  const page = WISDOM_PAGES[wisdomId] || Object.values(WISDOM_PAGES)[0];
  if (!state.wisdomRead.includes(page.id)) {
    state.wisdomRead.push(page.id);
  }
  if (page.grantsScroll && !state.scrollsLearned.includes(page.grantsScroll)) {
    state.scrollsLearned.push(page.grantsScroll);
  }
  saveState();

  setText('wisdom-title', page.title);
  setText('wisdom-meta', `${page.sectionRef} · Spoken by ${page.counselSpeaker}`);
  const kjvJoined = (page.verses || []).map((v) => `"${v.text}" (${v.ref})`).join('  •  ');
  setText('wisdom-kjv-text', kjvJoined);
  setText('wisdom-kjv-ref', (page.verses || []).map((v) => v.ref).join(' · '));
  setText('wisdom-context', page.counselText);
  setText('wisdom-question', (page.questions || []).join('  |  '));
  const artEl = document.getElementById('wisdom-art-img');
  if (artEl) {
    artEl.src = createPainterlyArtDataURL({
      title: page.title,
      subtitle: page.sectionRef,
      palette: 'glass'
    });
  }
  showModal('wisdom-modal');
}

export function openWellModal(wellId) {
  const well = WELLS[wellId] || Object.values(WELLS)[0];
  state.lastWellId = well.id;
  state.lastWellStageIdx = well.stageIdx ?? state.currentStageIdx;

  const firstVisit = !state.wellsVisited.includes(well.id);
  if (firstVisit) {
    state.wellsVisited.push(well.id);
  }
  state.stats.favor = state.startingStats.favor;
  state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 4);

  let rewardNotice = `Favor restored to ${state.startingStats.favor}. Strength +4 (now ${state.stats.strength}/${state.startingStats.strength}).`;
  if (well.grantsScroll && !state.scrollsLearned.includes(well.grantsScroll)) {
    state.scrollsLearned.push(well.grantsScroll);
    const sc = SCROLLS[well.grantsScroll];
    if (sc) rewardNotice += ` Learned Scroll #${sc.num}: ${sc.ref}!`;
  }
  if (well.grantsToken && !state.tokenEarned) {
    state.tokenEarned = true;
    rewardNotice += ` Received Mentor's Token: ${MENTOR_TOKEN.name}!`;
  }
  audio.playKinnorChord();
  saveState();

  const linkedWisdom = WISDOM_PAGES[well.wisdomId] || Object.values(WISDOM_PAGES)[0];
  const firstVerse = linkedWisdom?.verses?.[0];
  setText('well-title', well.title);
  setText('well-meta', `Section ${well.sectionNum} · ${well.subtitle}`);
  setText('well-narrative', well.body);
  setText('well-kjv-text', firstVerse ? `"${firstVerse.text}" — ${firstVerse.ref}` : '');
  setText('well-reward-banner', rewardNotice);
  setText('well-question', linkedWisdom?.questions?.[0] || 'Where has Pride asked you to wear a mask instead of resting in grace?');

  const breadBtn = document.getElementById('btn-well-eat-bread');
  if (breadBtn) {
    breadBtn.disabled = state.bread <= 0 || state.stats.strength >= state.startingStats.strength;
    breadBtn.textContent = `Eat 1 Bread (+2 Strength · ${state.bread} left)`;
    breadBtn.onclick = () => {
      if (state.bread > 0 && state.stats.strength < state.startingStats.strength) {
        state.bread -= 1;
        state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 2);
        saveState();
        openWellModal(well.id);
      }
    };
  }
  showModal('well-modal');
}

export function openTreasureModal(treasureId) {
  const tr = TREASURES[treasureId] || Object.values(TREASURES)[0];
  const prevChoice = state.treasuresChosen[tr.id];
  setText('treasure-title', tr.title);
  setText('treasure-meta', `Section ${tr.sectionNum} · ${tr.person} · Companion-POV Agency`);
  setText('treasure-narrative', tr.prompt);
  setText('treasure-give-label', tr.giveChoice.label);
  const giveCostParts = [];
  if (tr.giveChoice.breadCost) giveCostParts.push(`${tr.giveChoice.breadCost} Bread`);
  if (tr.giveChoice.strengthDelta) giveCostParts.push(`${tr.giveChoice.strengthDelta} Strength`);
  setText('treasure-give-cost', `Cost: ${giveCostParts.length ? giveCostParts.join(', ') : 'Your unhurried time & humility'} -> +1 Treasure`);
  setText('treasure-keep-label', tr.keepChoice.label);
  setText('treasure-keep-cost', 'Raises Treasure by +0');

  const outcomeBox = document.getElementById('treasure-outcome-box');
  const btnGive = document.getElementById('btn-treasure-give');
  const btnKeep = document.getElementById('btn-treasure-keep');

  if (prevChoice) {
    if (outcomeBox) {
      outcomeBox.classList.remove('hidden');
      const chosenObj = prevChoice === 'give' ? tr.giveChoice : tr.keepChoice;
      outcomeBox.textContent = `${chosenObj.outcomeText} (Recorded: ${prevChoice.toUpperCase()})`;
    }
    if (btnGive) btnGive.disabled = true;
    if (btnKeep) btnKeep.disabled = true;
  } else {
    if (outcomeBox) outcomeBox.classList.add('hidden');
    if (btnGive) {
      btnGive.disabled = false;
      btnGive.onclick = () => {
        if (tr.giveChoice.breadCost) {
          state.bread = Math.max(0, state.bread - tr.giveChoice.breadCost);
        }
        if (tr.giveChoice.strengthDelta) {
          state.stats.strength = Math.max(2, state.stats.strength + tr.giveChoice.strengthDelta);
        }
        state.stats.treasure += tr.giveChoice.treasureDelta;
        state.treasuresChosen[tr.id] = 'give';
        state.treasureLog.push(tr.giveChoice.deedRecord);
        audio.playChime('treasure');
        saveState();
        openTreasureModal(tr.id);
      };
    }
    if (btnKeep) {
      btnKeep.disabled = false;
      btnKeep.onclick = () => {
        state.treasuresChosen[tr.id] = 'keep';
        audio.playChime('step');
        saveState();
        openTreasureModal(tr.id);
      };
    }
  }
  showModal('treasure-modal');
}

export function openStandModal(standId) {
  const st = STANDS[standId] || Object.values(STANDS)[0];
  state.tokenSpentInCurrentStand = false;
  activeStandSession = {
    stand: st,
    enemyStrength: st.baseStrength,
    maxEnemyStrength: st.baseStrength,
    enemyCourage: st.baseCourage,
    round: 0,
    victoryLawApplied: false,
    scrollApplied: false,
    tokenAuto10Next: false,
    lastRoundLost: false,
    log: [
      `Stand entered: ${st.title} (${st.strongholdName} · Courage ${st.baseCourage}, Strength ${st.baseStrength}).`,
      `Scripture Root: ${st.scriptureRoot}`,
      `Step 1 Prompt: ${st.victoryLawPrompt}`
    ]
  };
  renderStandSession();
  bindStandAuxButtons();
  showModal('stand-modal');
}

function renderStandSession() {
  if (!activeStandSession) return;
  const s = activeStandSession;
  const st = s.stand;

  setText('stand-title', st.title);
  setText('stand-meta', `Section ${st.sectionNum} · ${st.strongholdName} · ${st.scriptureRoot}`);
  setText('stand-narrative', st.whisper);
  setText('stand-enemy-name', st.strongholdName);
  setText('stand-enemy-courage', s.enemyCourage);
  setText('stand-enemy-strength', `${s.enemyStrength}/${s.maxEnemyStrength}`);
  setText('stand-player-courage', state.stats.courage);
  setText('stand-player-strength', `${state.stats.strength}/${state.startingStats.strength}`);
  setText('stand-player-favor', `${state.stats.favor}/${state.startingStats.favor}`);

  const logEl = document.getElementById('stand-combat-log');
  if (logEl) {
    logEl.innerHTML = s.log.map((line) => `<div class="stand-log-line">${line}</div>`).join('');
    logEl.scrollTop = logEl.scrollHeight;
  }

  const btnLaw = document.getElementById('btn-stand-victory-law');
  if (btnLaw) {
    btnLaw.disabled = s.victoryLawApplied || s.round > 0 || st.isRiggedBait;
    btnLaw.textContent = s.victoryLawApplied
      ? `✓ Victory Law Applied`
      : `Step 1: Apply Victory Law (${st.victoryLawEffect?.note || 'Humility before Round 1'})`;
    btnLaw.onclick = () => {
      s.victoryLawApplied = true;
      s.enemyCourage = Math.max(4, s.enemyCourage + (st.victoryLawEffect?.courageDelta || 0));
      s.enemyStrength = Math.max(1, s.enemyStrength + (st.victoryLawEffect?.strengthDelta || 0));
      s.log.push(`Victory Law chosen before Round 1! ${st.victoryLawEffect?.note || ''}`);
      audio.playChime('stand_win');
      renderStandSession();
    };
  }

  const btnScroll = document.getElementById('btn-stand-scroll');
  if (btnScroll) {
    const resIds = st.resonantScrolls || [];
    const learnedId = resIds.find((id) => state.scrollsLearned.includes(id));
    const firstId = learnedId || resIds[0];
    const scObj = firstId ? SCROLLS[firstId] : null;
    btnScroll.disabled = !learnedId || s.scrollApplied || s.round > 0 || st.isRiggedBait;
    btnScroll.textContent = s.scrollApplied
      ? `✓ Resonant Scroll Spoken`
      : scObj
        ? `Speak KJV Scroll: ${scObj.ref} (${learnedId ? 'Learned' : 'Find at Well first'})`
        : `No Specific Scroll Required`;
    btnScroll.onclick = () => {
      if (!learnedId || !scObj) return;
      s.scrollApplied = true;
      s.enemyCourage = Math.max(4, s.enemyCourage + (st.scrollLawEffect?.courageDelta || 0));
      s.enemyStrength = Math.max(1, s.enemyStrength + (st.scrollLawEffect?.strengthDelta || 0));
      s.log.push(`Spoke KJV Scroll verbatim: "${scObj.text}" (${scObj.ref}) -> ${st.scrollLawEffect?.note || ''}`);
      audio.playKinnorChord();
      renderStandSession();
    };
  }

  const btnRoll = document.getElementById('btn-stand-roll');
  if (btnRoll) {
    if (st.isRiggedBait) {
      btnRoll.textContent = 'Walk Out of the Rigged Trap in Wisdom (Sec. 145 -> Sec. 158 · Learn Scroll 5)';
    } else if (s.enemyStrength <= 0) {
      btnRoll.textContent = '✓ Stand Cleared — Claim Victory & Continue';
    } else {
      btnRoll.textContent = s.tokenAuto10Next
        ? `Roll Round ${s.round + 1} (Aquamarine Stone Auto-10 + Courage ${state.stats.courage})`
        : `Roll Round ${s.round + 1}: 2d6 + Courage (${state.stats.courage}) vs 2d6 + ${s.enemyCourage}`;
    }
    btnRoll.onclick = () => handleStandRollRound();
  }
}

function handleStandRollRound() {
  if (!activeStandSession) return;
  const s = activeStandSession;
  const st = s.stand;

  if (st.isRiggedBait) {
    if (!state.standsCleared.includes(st.id)) state.standsCleared.push(st.id);
    if (!state.scrollsLearned.includes('scroll_5')) state.scrollsLearned.push('scroll_5');
    state.stats.courage += 1;
    state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 1);
    saveState();
    closeAllModals();
    return;
  }

  if (s.enemyStrength <= 0) {
    if (!state.standsCleared.includes(st.id)) state.standsCleared.push(st.id);
    saveState();
    closeAllModals();
    return;
  }

  s.round += 1;
  s.lastRoundLost = false;
  const pD1 = s.tokenAuto10Next ? 5 : rollDie();
  const pD2 = s.tokenAuto10Next ? 5 : rollDie();
  const usedAuto10 = s.tokenAuto10Next;
  s.tokenAuto10Next = false;

  const eD1 = rollDie();
  const eD2 = rollDie();
  const pTotal = pD1 + pD2 + state.stats.courage;
  const eTotal = eD1 + eD2 + s.enemyCourage;

  if (pTotal > eTotal) {
    s.enemyStrength = Math.max(0, s.enemyStrength - 2);
    s.log.push(
      `Round ${s.round}: You rolled [${pD1}+${pD2}${usedAuto10 ? ' Token=10' : ''}] + ${state.stats.courage} = ${pTotal} vs Stronghold [${eD1}+${eD2}] + ${s.enemyCourage} = ${eTotal} -> WIN! Stronghold -2 Strength (${s.enemyStrength} left).`
    );
    audio.playChime('stand_win');
    if (s.enemyStrength <= 0) {
      s.log.push(`VICTORY: ${st.victoryText}`);
      if (!state.standsCleared.includes(st.id)) state.standsCleared.push(st.id);
      saveState();
    }
  } else if (eTotal > pTotal) {
    state.stats.strength = Math.max(0, state.stats.strength - 2);
    s.lastRoundLost = true;
    s.log.push(
      `Round ${s.round}: You rolled [${pD1}+${pD2}] + ${state.stats.courage} = ${pTotal} vs Stronghold [${eD1}+${eD2}] + ${s.enemyCourage} = ${eTotal} -> HIT (-2 Strength, now ${state.stats.strength}). You may Test Favor to halve loss!`
    );
    audio.playChime('grace');
    saveState();
    if (state.stats.strength <= 0) {
      triggerGraceFall(st);
      return;
    }
  } else {
    s.log.push(
      `Round ${s.round}: Tie (${pTotal} vs ${eTotal}) — the chord holds steady in the rain. Neither side loses Strength.`
    );
  }
  renderStandSession();
  bindStandAuxButtons();
}

function bindStandAuxButtons() {
  if (!activeStandSession) return;
  const s = activeStandSession;
  const st = s.stand;

  const btnFavor = document.getElementById('btn-stand-favor');
  if (btnFavor) {
    btnFavor.disabled = state.stats.favor <= 0 || s.enemyStrength <= 0;
    btnFavor.textContent = `Test Favor (2d6 <= ${state.stats.favor} · Costs 1 Favor)`;
    btnFavor.onclick = () => {
      if (state.stats.favor <= 0) return;
      const d1 = rollDie();
      const d2 = rollDie();
      const sum = d1 + d2;
      const blessed = sum <= state.stats.favor;
      state.stats.favor = Math.max(0, state.stats.favor - 1);
      if (blessed) {
        if (s.lastRoundLost) {
          state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 1);
          s.lastRoundLost = false;
          s.log.push(`Favor Test [${d1}+${d2}=${sum} <= Favor]: BLESSED! Last round loss halved (+1 Strength restored).`);
        } else {
          s.enemyStrength = Math.max(0, s.enemyStrength - 1);
          s.log.push(`Favor Test [${d1}+${d2}=${sum} <= Favor]: BLESSED! Extra +1 damage to ${st.strongholdName} (${s.enemyStrength} left).`);
          if (s.enemyStrength <= 0 && !state.standsCleared.includes(st.id)) {
            state.standsCleared.push(st.id);
            s.log.push(`VICTORY: ${st.victoryText}`);
          }
        }
        audio.playChime('stand_win');
      } else {
        s.log.push(`Favor Test [${d1}+${d2}=${sum} > Favor]: Unblessed this round (-1 Favor).`);
      }
      saveState();
      renderStandSession();
      bindStandAuxButtons();
    };
  }

  const btnOil = document.getElementById('btn-stand-oil');
  if (btnOil) {
    btnOil.disabled = state.oil <= 0 || state.stats.strength >= state.startingStats.strength;
    btnOil.textContent = `Use Oil (+4 Strength · ${state.oil} left)`;
    btnOil.onclick = () => {
      if (state.oil <= 0) return;
      state.oil -= 1;
      state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 4);
      s.log.push(`Anointed with Oil: +4 Strength restored (now ${state.stats.strength}/${state.startingStats.strength}).`);
      audio.playKinnorChord();
      saveState();
      renderStandSession();
      bindStandAuxButtons();
    };
  }

  const btnToken = document.getElementById('btn-stand-token');
  if (btnToken) {
    btnToken.disabled = !state.tokenEarned || state.tokenUsed || s.tokenAuto10Next;
    btnToken.textContent = !state.tokenEarned
      ? 'Aquamarine Stone (Find at Well 1)'
      : state.tokenUsed
        ? 'Aquamarine Stone (Used This Walk)'
        : 'Use Aquamarine Stone (Auto-10 Next Roll)';
    btnToken.onclick = () => {
      if (!state.tokenEarned || state.tokenUsed) return;
      state.tokenUsed = true;
      state.tokenSpentInCurrentStand = true;
      s.tokenAuto10Next = true;
      s.log.push(`David's Aquamarine Tuning-Stone hums with Light-Blue warmth! Next Stand roll is an automatic 10.`);
      audio.playKinnorChord();
      saveState();
      renderStandSession();
      bindStandAuxButtons();
    };
  }

  const btnWithdraw = document.getElementById('btn-stand-withdraw');
  if (btnWithdraw) {
    btnWithdraw.onclick = () => {
      state.stats.strength = Math.max(0, state.stats.strength - 2);
      saveState();
      if (state.stats.strength <= 0) {
        triggerGraceFall(st);
      } else {
        closeAllModals();
      }
    };
  }
}

export function triggerGraceFall(standObj) {
  // Grace Rule (Book 1 How-To-Play §3): No dead ends. Keep all Scrolls & Treasure.
  // If Mentor's Token was spent in the Stand you fell in, restore it.
  if (state.tokenSpentInCurrentStand) {
    state.tokenUsed = false;
    state.tokenSpentInCurrentStand = false;
  }
  const well = WELLS[state.lastWellId] || WELLS.well_1;
  const gp = well.gracePassage || WELLS.well_1.gracePassage;

  setText('grace-title', `Grace Restoration · ${gp.sectionRef}`);
  setText('grace-kjv', gp.exposed);
  setText('grace-narrative', gp.text);

  const btnRestore = document.getElementById('btn-grace-restore-str');
  if (btnRestore) {
    const newStr = Math.max(10, state.startingStats.strength - 2);
    btnRestore.textContent = `Return to ${well.title} (Restore Strength to ${newStr}, Keep All Scrolls & Treasure)`;
    btnRestore.onclick = () => {
      state.stats.strength = newStr;
      state.stats.favor = state.startingStats.favor;
      saveState();
      loadStage(state.lastWellStageIdx || 1);
      closeAllModals();
    };
  }

  const btnSupply = document.getElementById('btn-grace-restore-supply');
  if (btnSupply) {
    const hasSupply = state.bread > 0 || state.oil > 0;
    btnSupply.disabled = !hasSupply;
    btnSupply.textContent = hasSupply
      ? `Spend 1 Bread/Oil -> Return at Full Starting Strength (${state.startingStats.strength})`
      : `Spend 1 Bread/Oil (None Remaining)`;
    btnSupply.onclick = () => {
      if (state.bread > 0) state.bread -= 1;
      else if (state.oil > 0) state.oil -= 1;
      state.stats.strength = state.startingStats.strength;
      state.stats.favor = state.startingStats.favor;
      saveState();
      loadStage(state.lastWellStageIdx || 1);
      closeAllModals();
    };
  }

  audio.playKinnorChord();
  showModal('grace-modal');
}

export function openInventoryModal() {
  const scrollWrap = document.getElementById('inv-scrolls-list');
  if (scrollWrap) {
    scrollWrap.innerHTML = Object.values(SCROLLS).map((sc) => {
      const learned = state.scrollsLearned.includes(sc.id);
      return `<div class="inv-card ${learned ? 'learned' : 'locked'}">
        <div class="inv-card-head">Scroll #${sc.num}: ${sc.ref} ${learned ? '✓ Learned' : `(Found at ${sc.learnedAt})`}</div>
        <div class="inv-card-body">${learned ? `"${sc.text}"` : 'Visit the Well of Living Water to inscribe this KJV Scripture.'}</div>
      </div>`;
    }).join('');
  }

  const trWrap = document.getElementById('inv-treasure-list');
  if (trWrap) {
    if (state.treasureLog.length === 0) {
      trWrap.innerHTML = `<div class="inv-empty">No unseen gifts recorded yet. Look for gold Treasure pedestals along the walk (Give = +1 Treasure; Keep = +0).</div>`;
    } else {
      trWrap.innerHTML = state.treasureLog.map((d) => `<div class="inv-deed-item">★ ${d}</div>`).join('');
    }
  }

  const tokenBox = document.getElementById('inv-token-box');
  if (tokenBox) {
    tokenBox.textContent = state.tokenEarned
      ? `${MENTOR_TOKEN.name} (${state.tokenUsed ? 'Spent' : 'Ready'}): ${MENTOR_TOKEN.description}`
      : `Mentor's Token not yet received — rest beside David at Well 1 (Section 48, Stage II).`;
  }
  showModal('inventory-modal');
}

export async function openRelicModal(defaultRelicId = 'aquamarine-tuning-stone') {
  const manifest = await loadRelicsManifest();
  const models = manifest.models || [];
  if (!state.relicsInspected.includes(defaultRelicId)) {
    state.relicsInspected.push(defaultRelicId);
    saveState();
  }
  showModal('relic-modal');

  const canvas = document.getElementById('relic-turntable-canvas');
  if (!turntable && canvas) {
    turntable = new RelicTurntableInspector(canvas);
  }

  const selectRelic = (modelObj) => {
    if (!modelObj) return;
    if (!state.relicsInspected.includes(modelObj.id)) {
      state.relicsInspected.push(modelObj.id);
      saveState();
    }
    setText('relic-title', modelObj.title);
    setText('relic-meta', `${modelObj.sectionRef} · ${modelObj.kjvRef}`);
    setText('relic-badge', `${modelObj.pipelineBadge} · ${(modelObj.bytes / 1024).toFixed(1)} KB GLB`);
    setText('relic-desc', modelObj.description);
    if (turntable) {
      turntable.showRelic(modelObj.id, `./${modelObj.file}`);
    }
    document.querySelectorAll('.relic-tab-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.relicId === modelObj.id);
    });
  };

  const tabsWrap = document.getElementById('relic-tabs');
  if (tabsWrap) {
    tabsWrap.innerHTML = '';
    models.forEach((m) => {
      const btn = document.createElement('button');
      btn.className = 'relic-tab-btn';
      btn.dataset.relicId = m.id;
      btn.textContent = m.title.replace(/ \(.*\)/, '');
      btn.onclick = () => selectRelic(m);
      tabsWrap.appendChild(btn);
    });
  }

  const initial = models.find((m) => m.id === defaultRelicId) || models[0];
  selectRelic(initial);
}

export function openFinaleModal() {
  const isTrue = state.stats.treasure >= 4;
  const ending = isTrue ? ENDINGS.true_ending : ENDINGS.good_ending;
  state.zone1Completed = true;
  state.endingReached = ending.id;
  saveState();

  setText('finale-title', ending.title);
  setText('finale-subtitle', `Section ${ending.sectionNum} · Your Treasure: ${state.stats.treasure}`);
  setText('finale-narrative', (ending.body || []).join('\n\n'));
  setText('finale-kjv', `"${ending.epigraphText}" — ${ending.epigraphRef}`);
  setText('finale-Benediction', 'The love of God and the love of people is the treasure of life—found not by taking, but by giving.');
  const codeBox = document.getElementById('finale-nw1-code');
  if (codeBox) codeBox.value = generateNW1Code();

  audio.playKinnorChord();
  showModal('finale-modal');
}

export function openGatehouseModal() {
  const codeInput = document.getElementById('gatehouse-nw1-export');
  if (codeInput) codeInput.value = generateNW1Code();
  const statusEl = document.getElementById('gatehouse-import-status');
  if (statusEl) statusEl.textContent = '';
  showModal('gatehouse-modal');
}

function initThreeWorld() {
  const container = document.getElementById('viewport-container');
  renderer = new THREE.WebGLRenderer({ antialias: !state.settings.ecoMode, powerPreference: 'high-performance' });
  renderer.setPixelRatio(state.settings.ecoMode ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (container) container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 160);
  worldManager = new WorldStageManager(scene);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyE' || e.code === 'Enter') {
      const near = worldManager.getNearestNode(playerPos, 3.8);
      if (near) openNodeInteraction(near);
    }
  });
  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  let dragging = false;
  let lastX = 0;
  renderer.domElement.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    audio.init();
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    cameraYaw -= dx * 0.0045;
  });
  window.addEventListener('pointerup', () => {
    dragging = false;
  });

  // Virtual touch joystick for mobile / tablet browsers
  const joyZone = document.getElementById('joystick-zone');
  const joyKnob = document.getElementById('joystick-knob');
  if (joyZone && joyKnob) {
    let joyActive = false;
    let cx = 0;
    let cy = 0;
    joyZone.addEventListener('pointerdown', (e) => {
      joyActive = true;
      const rect = joyZone.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
    });
    window.addEventListener('pointermove', (e) => {
      if (!joyActive) return;
      const dx = Math.max(-36, Math.min(36, e.clientX - cx));
      const dy = Math.max(-36, Math.min(36, e.clientY - cy));
      joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
      joyDelta.x = dx / 36;
      joyDelta.y = dy / 36;
    });
    window.addEventListener('pointerup', () => {
      joyActive = false;
      joyKnob.style.transform = 'translate(0px, 0px)';
      joyDelta.x = 0;
      joyDelta.y = 0;
    });
  }
}

function bindUIButtons() {
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeAllModals());
  });

  const bindClick = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  };

  bindClick('btn-nav-zone-start', () => loadStage(0));
  bindClick('btn-nav-inventory', () => openInventoryModal());
  bindClick('btn-nav-relics', () => openRelicModal('aquamarine-tuning-stone'));
  bindClick('btn-nav-gatehouse', () => openGatehouseModal());
  bindClick('btn-nav-help', () => openWelcomeModal());

  bindClick('btn-eco-toggle', () => {
    state.settings.ecoMode = !state.settings.ecoMode;
    if (renderer) renderer.setPixelRatio(state.settings.ecoMode ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    saveState();
    loadStage(state.currentStageIdx, playerPos.z);
  });

  bindClick('btn-text-toggle', () => {
    state.settings.largeText = !state.settings.largeText;
    saveState();
  });

  bindClick('btn-audio-toggle', () => {
    audio.init();
    const muted = audio.toggleMute();
    setText('btn-audio-toggle', muted ? 'Audio: Muted' : 'Audio: On');
  });

  bindClick('btn-copy-nw1', () => {
    const code = generateNW1Code();
    navigator.clipboard?.writeText(code);
    setText('gatehouse-import-status', 'Copied NW1 progress code to clipboard!');
  });

  bindClick('btn-restore-nw1', () => {
    const inp = document.getElementById('gatehouse-nw1-import');
    const res = restoreFromNW1Code(inp ? inp.value : '');
    setText(
      'gatehouse-import-status',
      res.ok ? '✓ Restored Zone 1 progress from NW1 code!' : `⚠ ${res.error}`
    );
  });

  bindClick('btn-reset-save', () => {
    state = createDefaultState();
    saveState();
    loadStage(0);
    openWelcomeModal();
  });
}

let lastTime = performance.now();
function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;
  const elapsed = now / 1000;

  let moveForward = 0;
  let moveRight = 0;
  if (keys.KeyW || keys.ArrowUp) moveForward += 1;
  if (keys.KeyS || keys.ArrowDown) moveForward -= 1;
  if (keys.KeyD || keys.ArrowRight) moveRight += 1;
  if (keys.KeyA || keys.ArrowLeft) moveRight -= 1;
  moveForward -= joyDelta.y;
  moveRight += joyDelta.x;

  if (moveForward !== 0 || moveRight !== 0) {
    const speed = 6.2 * dt;
    const sin = Math.sin(cameraYaw);
    const cos = Math.cos(cameraYaw);
    playerPos.x += (moveRight * cos - moveForward * sin) * speed;
    playerPos.z += (-moveForward * cos - moveRight * sin) * speed;
    playerPos.x = Math.max(-6.5, Math.min(6.5, playerPos.x));
    playerPos.z = Math.max(-16.5, Math.min(14.5, playerPos.z));
  }

  if (camera) {
    camera.position.set(
      playerPos.x + Math.sin(cameraYaw) * 4.5,
      2.35,
      playerPos.z + Math.cos(cameraYaw) * 4.5
    );
    camera.lookAt(
      playerPos.x - Math.sin(cameraYaw) * 4,
      1.35,
      playerPos.z - Math.cos(cameraYaw) * 4
    );
  }

  if (worldManager) {
    worldManager.update(dt, elapsed, playerPos);
    const near = worldManager.getNearestNode(playerPos, 3.6);
    const promptBar = document.getElementById('proximity-prompt-bar');
    const promptBtn = document.getElementById('btn-proximity-interact');
    if (promptBar && promptBtn) {
      if (near) {
        promptBar.classList.remove('hidden');
        promptBtn.textContent = `Interact [E / Tap]: ${near.label}`;
        promptBtn.onclick = () => openNodeInteraction(near);
      } else {
        promptBar.classList.add('hidden');
      }
    }
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initThreeWorld();
  bindUIButtons();
  loadStage(state.currentStageIdx);
  updateHUD();
  if (!state.firstSightCompleted) {
    openWelcomeModal();
  }
  requestAnimationFrame(animate);
});

window.narrowWayApp = {
  getState: () => state,
  loadStage,
  openStandModal,
  openTreasureModal,
  openWellModal,
  openWisdomModal,
  openRelicModal,
  openFinaleModal,
  openGatehouseModal,
  generateNW1Code,
  restoreFromNW1Code,
  closeAllModals
};
