// ============================================================================
// THE NARROW WAY — ZONE 1 (ELIAS / BOOK 1): MAIN APPLICATION CONTROLLER
// ============================================================================
// Implements Companion-POV agency, transparent 2d6 Stand checks, Treasure
// choices (Give +1 / Keep +0), Grace Rule at Wells, David's Aquamarine
// Tuning-Stone Relic Workshop, Stage Gating, Sea of Glass Finale Payoff,
// and NW1 progress codes.

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
import {
  STAGE_ART_MAP,
  PORTRAIT_ART_MAP,
  STAND_ART_MAP,
  WELL_ART_MAP,
  TREASURE_ART_MAP,
  WISDOM_ART_MAP,
  ENDING_ART_MAP,
  ART_FOCAL_POINT_MAP,
  getArtFocalPoint,
  preloadAllZone1Art,
  preloadStageArt,
  isStageArtPreloaded,
  loadArtIntoImage
} from './painterly.js';
import { loadRelicsManifest, RelicTurntableInspector } from './relics.js';
import { WorldStageManager, getShortNodeLabel } from './world.js';

// Dedicated localStorage key (never collides with Pilgrim Walk)
const STORAGE_KEY = 'narrow_way_walk_save_v1';

function createDefaultState() {
  return {
    version: 1,
    zoneId: 'zone-01-elias-seoul',
    firstSightCompleted: false,
    hintDismissed: false,
    seenStrongholdDef: false,
    startingStats: { courage: 9, strength: 20, favor: 9 },
    stats: { courage: 9, strength: 20, favor: 9, treasure: 0 },
    oil: 1,
    bread: 2,
    breadPickupClaimed: false,
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
      reducedMotion: false,
      readAloudScroll: false
    }
  };
}

let state = createDefaultState();
let activeStandSession = null;
let turntable = null;
let needsOneWorldRender = true;
let gatingToastTimer = null;
let endingCleanupActive = false;
let currentInteractNode = null;
let interactCooldownUntil = 0;
let interactConfirmTimer = null;

export function stopKjvSpeech() {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // Ignore speechSynthesis errors on unsupported browsers
  }
}

export function speakKjvScroll(text, ref = '') {
  if (!state.settings.readAloudScroll || !text) return false;
  try {
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    ) {
      window.speechSynthesis.cancel();
      const spoken = ref ? `${text} — ${ref}` : String(text);
      const utter = new window.SpeechSynthesisUtterance(spoken);
      utter.rate = 0.95;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
      return true;
    }
  } catch {
    // Ignore speechSynthesis errors
  }
  return false;
}

// Finale Sea of Glass Payoff state
let finalePayoffState = {
  active: false,
  startTime: 0,
  durationMs: 4200
};

// ============================================================================
// STAGE GATING & PROGRESS VALIDATION
// ============================================================================

export function getRequiredStandsForStage(stageIdx) {
  const stg = STAGES[stageIdx];
  if (!stg || !Array.isArray(stg.nodes)) return [];
  return stg.nodes
    .filter((n) => n.type === 'stand' && n.standId)
    .map((n) => n.standId);
}

export function getUnclearedStandsForStage(stageIdx, standsClearedArr = state.standsCleared) {
  const req = getRequiredStandsForStage(stageIdx);
  const clearedSet = new Set(Array.isArray(standsClearedArr) ? standsClearedArr : []);
  return req
    .filter((id) => !clearedSet.has(id))
    .map((id) => STANDS[id])
    .filter(Boolean);
}

export function isStageCleared(stageIdx, standsClearedArr = state.standsCleared) {
  return getUnclearedStandsForStage(stageIdx, standsClearedArr).length === 0;
}

export function isStageUnlocked(stageIdx, standsClearedArr = state.standsCleared) {
  if (stageIdx <= 0) return true;
  for (let i = 0; i < stageIdx; i++) {
    if (!isStageCleared(i, standsClearedArr)) return false;
  }
  return true;
}

export function getHighestUnlockedStageIdx(standsClearedArr = state.standsCleared) {
  let highest = 0;
  for (let i = 0; i < STAGES.length; i++) {
    if (isStageUnlocked(i, standsClearedArr)) {
      highest = i;
    } else {
      break;
    }
  }
  return highest;
}

export function areAllRequiredStandsCleared(standsClearedArr = state.standsCleared) {
  for (let i = 0; i < STAGES.length; i++) {
    if (!isStageCleared(i, standsClearedArr)) return false;
  }
  return true;
}

export function getStageLockReason(targetStageIdx) {
  for (let i = 0; i < targetStageIdx; i++) {
    const missing = getUnclearedStandsForStage(i);
    if (missing.length > 0) {
      const names = missing.map((st) => st.title).join(' & ');
      return `Locked — Clear ${names} in Stage ${i + 1} first`;
    }
  }
  return '';
}

export function getAllMissingStandsReason() {
  const allMissing = [];
  for (let i = 0; i < STAGES.length; i++) {
    const missing = getUnclearedStandsForStage(i);
    for (const st of missing) {
      allMissing.push(st.title);
    }
  }
  if (allMissing.length === 0) return '';
  return `Locked — Clear ${allMissing.join(', ')} first to open the Treasure Gate`;
}

// Re-locks uncleared stages on old saves that skipped ahead without crashing
function sanitizeProgressGating(targetState) {
  if (!targetState || typeof targetState !== 'object') return;
  if (!Array.isArray(targetState.standsCleared)) targetState.standsCleared = [];
  if (!Array.isArray(targetState.scrollsLearned)) targetState.scrollsLearned = [];
  if (!Array.isArray(targetState.wellsVisited)) targetState.wellsVisited = [];
  if (!Array.isArray(targetState.wisdomRead)) targetState.wisdomRead = [];
  if (!Array.isArray(targetState.treasureLog)) targetState.treasureLog = [];
  if (!targetState.treasuresChosen || typeof targetState.treasuresChosen !== 'object') {
    targetState.treasuresChosen = {};
  }

  const maxUnlocked = getHighestUnlockedStageIdx(targetState.standsCleared);
  const rawIdx = Number(targetState.currentStageIdx) || 0;
  targetState.currentStageIdx = Math.max(0, Math.min(maxUnlocked, Math.min(STAGES.length - 1, rawIdx)));

  const rawWellStage = Number(targetState.lastWellStageIdx) || 0;
  targetState.lastWellStageIdx = Math.max(0, Math.min(maxUnlocked, rawWellStage));

  if (targetState.startingStats) {
    const rawStartStr = Number(targetState.startingStats.strength);
    targetState.startingStats.strength = Math.min(
      20,
      Math.max(10, Number.isFinite(rawStartStr) && rawStartStr > 0 ? rawStartStr : 20)
    );
  }
  if (targetState.stats && targetState.startingStats) {
    const maxS = Number(targetState.startingStats.strength) || 20;
    const curS = Number(targetState.stats.strength);
    targetState.stats.strength = Math.max(
      0,
      Math.min(maxS, Number.isFinite(curS) ? curS : maxS)
    );
  }
  if (!areAllRequiredStandsCleared(targetState.standsCleared)) {
    targetState.zone1Completed = false;
    targetState.endingReached = null;
  }
}

function showGatingToast(message) {
  const el = document.getElementById('gating-toast');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
  if (gatingToastTimer) clearTimeout(gatingToastTimer);
  gatingToastTimer = setTimeout(() => {
    el.classList.add('hidden');
  }, 4200);
}

function hasSavedWalk(s = state) {
  return Boolean(
    s.firstSightCompleted ||
    s.currentStageIdx > 0 ||
    (Array.isArray(s.standsCleared) && s.standsCleared.length > 0) ||
    (Array.isArray(s.wellsVisited) && s.wellsVisited.length > 0) ||
    (s.treasuresChosen && Object.keys(s.treasuresChosen).length > 0)
  );
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    const merged = {
      ...createDefaultState(),
      ...parsed,
      stats: { ...createDefaultState().stats, ...(parsed.stats || {}) },
      startingStats: { ...createDefaultState().startingStats, ...(parsed.startingStats || {}) },
      settings: { ...createDefaultState().settings, ...(parsed.settings || {}) }
    };
    sanitizeProgressGating(merged);
    return merged;
  } catch {
    return createDefaultState();
  }
}

state = loadState();

function saveState() {
  sanitizeProgressGating(state);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in private browsing
  }
  checkAndPreloadNextStage();
  updateHUD();
}

export function getStageCompletionRatio(stageIdx = state.currentStageIdx) {
  const stg = STAGES[stageIdx];
  if (!stg || !Array.isArray(stg.nodes)) return 0;
  const trackable = stg.nodes.filter(
    (n) => n.type === 'stand' || n.type === 'well' || n.type === 'treasure' || n.type === 'wisdom'
  );
  if (trackable.length === 0) return 1;
  let doneCount = 0;
  for (const n of trackable) {
    if (isNodeDone(n)) doneCount += 1;
  }
  const reqStands = getRequiredStandsForStage(stageIdx);
  const clearedStands = reqStands.filter((id) => state.standsCleared.includes(id)).length;
  const standRatio = reqStands.length > 0 ? clearedStands / reqStands.length : 0;
  return Math.max(doneCount / trackable.length, standRatio);
}

export function checkAndPreloadNextStage(stageIdx = state.currentStageIdx) {
  const ratio = getStageCompletionRatio(stageIdx);
  if (ratio >= 0.5 && stageIdx + 1 < STAGES.length) {
    preloadStageArt(stageIdx + 1);
    return true;
  }
  return false;
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

// NW1 Progress Code Export & Import (format unchanged)
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
    sanitizeProgressGating(state);
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
let cameraDistance = 4.6; // Clamped between 3.0m and 9.0m
const keys = {};
const joyDelta = { x: 0, y: 0 };

function isNodeDone(node) {
  if (!node) return false;
  if (node.type === 'well') return state.wellsVisited.includes(node.wellId);
  if (node.type === 'stand') return state.standsCleared.includes(node.standId);
  if (node.type === 'treasure') return Boolean(state.treasuresChosen[node.treasureId]);
  if (node.type === 'wisdom') return state.wisdomRead.includes(node.wisdomId);
  if (node.type === 'relic') return state.relicsInspected.includes(node.relicId);
  if (node.type === 'bread') return Boolean(state.breadPickupClaimed);
  if (node.type === 'portal') return isStageCleared(state.currentStageIdx);
  if (node.type === 'gatehouse_finale') return state.zone1Completed;
  return false;
}

function isNodeLocked(node) {
  if (!node) return false;
  if (node.type === 'portal') {
    const nextIdx = node.targetStageIdx ?? state.currentStageIdx + 1;
    return !isStageUnlocked(nextIdx);
  }
  if (node.type === 'gatehouse_finale') {
    return !areAllRequiredStandsCleared();
  }
  return false;
}

export function getDetailedInteractLabel(node, isLocked = false) {
  if (!node) return 'Interact';
  if (node.type === 'stand') {
    const st = STANDS[node.standId];
    return `Interact: ${st ? st.title : getShortNodeLabel(node, isLocked)}`;
  }
  if (node.type === 'well') {
    const w = WELLS[node.wellId];
    return `Interact: ${w ? w.title : getShortNodeLabel(node, isLocked)}`;
  }
  if (node.type === 'treasure') {
    const tr = TREASURES[node.treasureId];
    return `Interact: ${tr ? tr.title : getShortNodeLabel(node, isLocked)}`;
  }
  if (node.type === 'wisdom') {
    const wp = WISDOM_PAGES[node.wisdomId];
    return `Interact: ${wp ? wp.title : getShortNodeLabel(node, isLocked)}`;
  }
  if (node.type === 'relic') {
    if (node.relicId === 'aquamarine-tuning-stone') {
      return "Interact: Token · David's Aquamarine Tuning-Stone";
    }
    return "Interact: Relic 2 · David's Crownless Cypress Kinnor";
  }
  if (node.type === 'portal') {
    const next = (node.targetStageIdx ?? 1) + 1;
    return isLocked ? `Interact: 🔒 Stage ${next} (Locked)` : `Interact: Stage ${next} →`;
  }
  if (node.type === 'gatehouse_finale') {
    return isLocked ? 'Interact: 🔒 Treasure Gate (Locked)' : 'Interact: Treasure Gate · Finale';
  }
  if (node.type === 'bread') {
    return state.breadPickupClaimed
      ? 'Interact: Bread Pickup · Claimed ✓'
      : 'Interact: Bread Pickup · +1 Loaf of Bread';
  }
  return `Interact: ${getShortNodeLabel(node, isLocked)}`;
}

// Returns a deterministic safe spawn position in the clear central corridor in front of a node
export function getSafeNodeSpawn(node) {
  if (!node || !Array.isArray(node.pos)) {
    return { x: 0, y: 0, z: -5.5, yaw: 0, dist: 4.6 };
  }
  // Nudge Well 4 (and Wisdom 4 across the aisle) toward the center corridor with an angled view
  // so Well 3's floating crystal prop at (-3.4, 1.95, -19.0) never fills the corner of the screen.
  if (node.wellId === 'well_4' || node.id === 'node_well4_pastorji') {
    return { x: -1.85, y: 0, z: -21.95, yaw: 0.20, dist: 3.95 };
  }
  if (node.wisdomId === 'wisdom_4' || node.id === 'node_wisdom4') {
    return { x: 1.85, y: 0, z: -21.95, yaw: -0.20, dist: 3.95 };
  }
  const nx = Number(node.pos[0]) || 0;
  const nz = Number(node.pos[2]) || -7.5;
  const safeX = Math.abs(nx) > 1.0 ? Number((nx * 0.68).toFixed(2)) : 0;
  const safeZ = Number((nz + 1.85).toFixed(2));
  return { x: safeX, y: 0, z: safeZ, yaw: 0, dist: 4.6 };
}

// Returns the default safe spawn point for a stage (in front of the first uncleared Stand or primary node)
export function getDefinedStageSpawn(stageIdx) {
  const stage = STAGES[stageIdx] || STAGES[0];
  const nodes = stage.nodes || [];
  const firstUnclearedStand = nodes.find(
    (n) => n.type === 'stand' && n.standId && !state.standsCleared.includes(n.standId)
  );
  const targetNode = firstUnclearedStand || nodes[0];
  return getSafeNodeSpawn(targetNode);
}

export function syncCameraAndWorldImmediate(preserveCameraYaw = false) {
  if (!preserveCameraYaw) {
    cameraYaw = 0;
  }
  cameraDistance = Math.max(3.0, Math.min(9.0, cameraDistance || 4.6));
  if (worldManager && worldManager.eliasCompanion) {
    worldManager.eliasCompanion.position.set(playerPos.x - 1.75, 0, playerPos.z - 1.15);
  }
  if (camera) {
    const clampedDist = Math.max(3.0, Math.min(9.0, cameraDistance));
    const desiredCamPos = new THREE.Vector3(
      playerPos.x + Math.sin(cameraYaw) * clampedDist,
      2.2 + (clampedDist - 3.0) * 0.16,
      playerPos.z + Math.cos(cameraYaw) * clampedDist
    );
    const safeCamPos = worldManager
      ? worldManager.resolveCameraPosition(playerPos, desiredCamPos)
      : desiredCamPos;
    camera.position.copy(safeCamPos);
    camera.lookAt(
      playerPos.x - Math.sin(cameraYaw) * 4,
      1.35,
      playerPos.z - Math.cos(cameraYaw) * 4
    );
  }
  if (worldManager) {
    worldManager.update(0.016, performance.now() / 1000, playerPos, camera);
  }
  needsOneWorldRender = true;
}

export function refreshProximityInteract(isTeleport = false) {
  const promptBar = document.getElementById('proximity-prompt-bar');
  const promptBtn = document.getElementById('btn-proximity-interact');
  if (!promptBar || !promptBtn) return null;

  if (endingCleanupActive || finalePayoffState.active) {
    currentInteractNode = null;
    promptBar.classList.add('hidden');
    return null;
  }

  const near = worldManager ? worldManager.getNearestNode(playerPos, 4.2) : null;
  currentInteractNode = near;

  if (isTeleport) {
    interactCooldownUntil = performance.now() + 260;
    if (interactConfirmTimer) clearTimeout(interactConfirmTimer);
    promptBtn.disabled = true;
    interactConfirmTimer = setTimeout(() => {
      const confirmed = worldManager ? worldManager.getNearestNode(playerPos, 4.2) : null;
      currentInteractNode = confirmed;
      if (!endingCleanupActive && !finalePayoffState.active && confirmed) {
        const locked = isNodeLocked(confirmed);
        promptBar.classList.remove('hidden');
        promptBtn.textContent = getDetailedInteractLabel(confirmed, locked);
        promptBtn.dataset.targetNodeId = confirmed.id || '';
        promptBtn.disabled = false;
      } else {
        promptBar.classList.add('hidden');
        promptBtn.disabled = false;
      }
    }, 260);
  }

  if (near) {
    const locked = isNodeLocked(near);
    promptBar.classList.remove('hidden');
    promptBtn.textContent = getDetailedInteractLabel(near, locked);
    promptBtn.dataset.targetNodeId = near.id || '';
    promptBtn.disabled = performance.now() < interactCooldownUntil;
    promptBtn.onclick = () => {
      if (performance.now() < interactCooldownUntil) return;
      const liveNear = worldManager ? worldManager.getNearestNode(playerPos, 4.2) : null;
      if (liveNear) {
        currentInteractNode = liveNear;
        openNodeInteraction(liveNear);
      }
    };
  } else {
    promptBar.classList.add('hidden');
    promptBtn.dataset.targetNodeId = '';
  }
  return near;
}

export function setEndingCleanupMode(active) {
  endingCleanupActive = Boolean(active);
  document.body.classList.toggle('ending-cleanup-active', endingCleanupActive);
  if (worldManager) {
    worldManager.setLabelsHidden(endingCleanupActive);
  }
  const seaHud = document.getElementById('ending-sea-hud');
  if (seaHud) {
    seaHud.classList.toggle('hidden', !endingCleanupActive);
  }
  const codeInput = document.getElementById('ending-sea-nw1-code');
  if (codeInput && endingCleanupActive) {
    codeInput.value = generateNW1Code();
  }
  const promptBar = document.getElementById('proximity-prompt-bar');
  if (promptBar && endingCleanupActive) {
    promptBar.classList.add('hidden');
  }
  const stageProg = document.getElementById('hud-stage-progress');
  if (stageProg) {
    stageProg.classList.toggle('hidden', endingCleanupActive);
  }
  needsOneWorldRender = true;
}

export function loadStage(idx, customZ = null) {
  const requestedIdx = Math.max(0, Math.min(STAGES.length - 1, idx));
  if (!isStageUnlocked(requestedIdx)) {
    const reason = getStageLockReason(requestedIdx);
    showGatingToast(reason);
    return false;
  }
  if (endingCleanupActive) {
    setEndingCleanupMode(false);
  }
  state.currentStageIdx = requestedIdx;
  const stage = STAGES[requestedIdx];
  if (customZ !== null && customZ !== undefined) {
    playerPos.set(0, 0, Number(customZ));
    cameraYaw = 0;
    cameraDistance = 4.6;
  } else {
    const sp = getDefinedStageSpawn(requestedIdx);
    playerPos.set(sp.x, sp.y, sp.z);
    cameraYaw = sp.yaw ?? 0;
    cameraDistance = sp.dist ?? 4.6;
  }
  if (worldManager) {
    worldManager.buildStage(stage, isNodeDone, state.settings.ecoMode, isNodeLocked);
  }
  syncCameraAndWorldImmediate(true);
  refreshProximityInteract(true);
  saveState();
  renderStageBar();
  renderQuickNodeBar();
  return true;
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
  setText('hud-stage-progress', `Stage ${state.currentStageIdx + 1} of ${STAGES.length}`);
  const stageProg = document.getElementById('hud-stage-progress');
  if (stageProg) {
    stageProg.classList.toggle('hidden', endingCleanupActive);
  }

  const tokenEl = document.getElementById('hud-token');
  if (tokenEl) {
    if (!state.tokenEarned) {
      tokenEl.textContent = 'Unfound';
      tokenEl.className = 'hud-pill-val muted';
    } else if (state.tokenUsed) {
      tokenEl.textContent = 'Spent';
      tokenEl.className = 'hud-pill-val spent';
    } else {
      tokenEl.textContent = 'Ready';
      tokenEl.className = 'hud-pill-val ready';
    }
  }

  const hintCard = document.getElementById('controls-hint-card');
  if (hintCard) {
    hintCard.classList.toggle('hidden', Boolean(state.hintDismissed));
  }

  const stage = STAGES[state.currentStageIdx] || STAGES[0];
  setText('stage-title', stage.title);
  setText('stage-subtitle', `${stage.actLabel} · ${stage.subtitle}`);
  setText('stage-narration', stage.eliasIntro);
  loadArtIntoImage(
    document.getElementById('stage-art-thumb'),
    document.getElementById('stage-art-badge'),
    {
      stageIdx: state.currentStageIdx,
      pngUrl: STAGE_ART_MAP[state.currentStageIdx],
      title: stage.title,
      subtitle: stage.subtitle
    }
  );

  document.body.classList.toggle('large-text', Boolean(state.settings.largeText));
  document.body.classList.toggle('reduced-motion', Boolean(state.settings.reducedMotion));
  const ecoBtn = document.getElementById('btn-eco-toggle');
  if (ecoBtn) {
    ecoBtn.textContent = state.settings.ecoMode ? 'Eco: ON' : 'Eco: OFF';
  }
  const ttsBtn = document.getElementById('btn-tts-toggle');
  if (ttsBtn) {
    ttsBtn.textContent = state.settings.readAloudScroll ? 'Read-Aloud: ON' : 'Read-Aloud: OFF';
    ttsBtn.classList.toggle('btn-gold', Boolean(state.settings.readAloudScroll));
  }
}

function renderStageBar() {
  const wrap = document.getElementById('stage-tabs');
  if (!wrap) return;
  wrap.innerHTML = '';
  STAGES.forEach((stg, idx) => {
    const unlocked = isStageUnlocked(idx);
    const cleared = isStageCleared(idx);
    const shortTitle = stg.title.replace(/^Stage [IVX]+ [—·] /, '');
    const btn = document.createElement('button');
    const classes = ['stage-tab'];
    if (idx === state.currentStageIdx) classes.push('active');
    if (cleared) classes.push('cleared');
    if (!unlocked) classes.push('locked');
    btn.className = classes.join(' ');

    const slotSpan = document.createElement('span');
    slotSpan.className = 'chip-status-slot';
    slotSpan.setAttribute('aria-hidden', 'true');
    slotSpan.textContent = !unlocked ? '🔒' : cleared ? '✓' : '';

    const lblSpan = document.createElement('span');
    lblSpan.className = 'chip-label-text';
    lblSpan.textContent = `${idx + 1}. ${shortTitle}`;

    btn.appendChild(slotSpan);
    btn.appendChild(lblSpan);

    if (!unlocked) {
      const reason = getStageLockReason(idx);
      btn.title = reason;
      btn.dataset.tooltip = reason;
      btn.setAttribute('aria-disabled', 'true');
      btn.addEventListener('click', () => {
        audio.playChime('grace');
        document.querySelectorAll('.stage-tab.locked').forEach((b) => b.classList.remove('tooltip-active'));
        btn.classList.add('tooltip-active');
        showGatingToast(reason);
      });
    } else {
      btn.title = cleared
        ? `${stg.title} (Completed — Click to Replay)`
        : stg.title;
      btn.addEventListener('click', () => {
        audio.playChime('step');
        loadStage(idx);
      });
    }
    wrap.appendChild(btn);
  });

  // Auto-scroll current active stage chip into view inside horizontal chip bar
  const scrollActiveIntoView = () => {
    const activeBtn = wrap.querySelector('.stage-tab.active');
    if (activeBtn && wrap.scrollWidth > wrap.clientWidth) {
      const targetLeft = Math.max(
        0,
        activeBtn.offsetLeft - wrap.clientWidth / 2 + activeBtn.offsetWidth / 2
      );
      wrap.scrollLeft = targetLeft;
    }
  };
  scrollActiveIntoView();
  requestAnimationFrame(scrollActiveIntoView);
}

export function teleportToNode(node, openModalAfter = true) {
  if (!node) return;
  const sp = getSafeNodeSpawn(node);
  playerPos.set(sp.x, sp.y, sp.z);
  cameraYaw = sp.yaw ?? 0;
  cameraDistance = sp.dist ?? 4.6;
  syncCameraAndWorldImmediate(true);
  refreshProximityInteract(true);
  const qWrap = document.getElementById('quick-node-bar');
  if (qWrap && node.id) {
    const targetChip = qWrap.querySelector(`.node-chip[data-node-id="${node.id}"]`);
    if (targetChip && qWrap.scrollWidth > qWrap.clientWidth) {
      qWrap.scrollLeft = Math.max(
        0,
        targetChip.offsetLeft - qWrap.clientWidth / 2 + targetChip.offsetWidth / 2
      );
    }
  }
  if (openModalAfter) {
    openNodeInteraction(node);
  }
}

function renderQuickNodeBar() {
  const wrap = document.getElementById('quick-node-bar');
  if (!wrap) return;
  wrap.innerHTML = '';
  const stage = STAGES[state.currentStageIdx] || STAGES[0];
  stage.nodes.forEach((node) => {
    const btn = document.createElement('button');
    const done = isNodeDone(node);
    const locked = isNodeLocked(node);
    const baseLbl = getShortNodeLabel(node, false);
    btn.className = `node-chip type-${node.type} ${done ? 'done' : ''} ${locked ? 'locked-node' : ''}`;
    btn.dataset.nodeId = node.id || '';

    const slotSpan = document.createElement('span');
    slotSpan.className = 'chip-status-slot';
    slotSpan.setAttribute('aria-hidden', 'true');
    slotSpan.textContent = locked ? '🔒' : done ? '✓' : '';

    const lblSpan = document.createElement('span');
    lblSpan.className = 'chip-label-text';
    lblSpan.textContent = baseLbl;

    btn.appendChild(slotSpan);
    btn.appendChild(lblSpan);

    if (locked) {
      const lockMsg =
        node.type === 'gatehouse_finale'
          ? getAllMissingStandsReason()
          : getStageLockReason(node.targetStageIdx ?? state.currentStageIdx + 1);
      btn.title = lockMsg;
    } else {
      btn.title = node.label;
    }
    btn.addEventListener('click', () => {
      teleportToNode(node, true);
    });
    wrap.appendChild(btn);
  });

  const scrollCurrentNodeIntoView = () => {
    const activeNodeId = currentInteractNode?.id;
    if (!activeNodeId) return;
    const targetChip = wrap.querySelector(`.node-chip[data-node-id="${activeNodeId}"]`);
    if (targetChip && wrap.scrollWidth > wrap.clientWidth) {
      wrap.scrollLeft = Math.max(
        0,
        targetChip.offsetLeft - wrap.clientWidth / 2 + targetChip.offsetWidth / 2
      );
    }
  };
  scrollCurrentNodeIntoView();
  requestAnimationFrame(scrollCurrentNodeIntoView);
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
  } else if (node.type === 'bread') {
    openBreadPickupModal();
  } else if (node.type === 'portal') {
    const nextIdx = node.targetStageIdx ?? state.currentStageIdx + 1;
    if (!isStageCleared(state.currentStageIdx) || !isStageUnlocked(nextIdx)) {
      const reason = getStageLockReason(nextIdx);
      audio.playChime('grace');
      showGatingToast(reason);
      return;
    }
    openStageCompleteModal(nextIdx);
  } else if (node.type === 'gatehouse_finale') {
    if (!areAllRequiredStandsCleared()) {
      const reason = getAllMissingStandsReason();
      audio.playChime('grace');
      showGatingToast(reason);
      return;
    }
    triggerEndingSequence();
  }
}

export function isAnyModalOpen() {
  const modals = document.querySelectorAll('.modal-backdrop');
  for (let i = 0; i < modals.length; i++) {
    if (!modals[i].classList.contains('hidden')) return true;
  }
  return false;
}

function showModal(id) {
  document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.add('hidden'));
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

export function closeAllModals() {
  stopKjvSpeech();
  document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.add('hidden'));
  if (turntable) turntable.stop();
  if (worldManager) {
    worldManager.buildStage(
      STAGES[state.currentStageIdx],
      isNodeDone,
      state.settings.ecoMode,
      isNodeLocked
    );
    worldManager.setLabelsHidden(endingCleanupActive);
  }
  syncCameraAndWorldImmediate(true);
  refreshProximityInteract(false);
  renderStageBar();
  renderQuickNodeBar();
  updateHUD();
}

// ============================================================================
// REAL TITLE SCREEN (BEFORE INTRO / STATS MODAL)
// ============================================================================

export function openTitleModal() {
  showModal('title-modal');
  const savedExists = hasSavedWalk(state);

  const summaryEl = document.getElementById('title-save-summary');
  if (summaryEl) {
    summaryEl.classList.toggle('hidden', !savedExists);
    if (savedExists) {
      summaryEl.textContent = `Saved Walk Found: Stage ${state.currentStageIdx + 1} of ${STAGES.length} · Stands Cleared: ${state.standsCleared.length}/8 · Treasure: ${state.stats.treasure}`;
    }
  }

  const btnCont = document.getElementById('btn-title-continue');
  if (btnCont) {
    btnCont.classList.toggle('hidden', !savedExists);
    btnCont.textContent = `Continue Walk (Stage ${state.currentStageIdx + 1} of ${STAGES.length}) →`;
    btnCont.onclick = () => {
      audio.init();
      audio.playKinnorChord();
      state.firstSightCompleted = true;
      saveState();
      closeAllModals();
    };
  }

  const btnStart = document.getElementById('btn-title-start');
  if (btnStart) {
    btnStart.textContent = savedExists ? 'Start / Roll Stats →' : 'Start Walk →';
    btnStart.onclick = () => {
      audio.init();
      audio.playChime('step');
      openWelcomeModal();
    };
  }

  const confirmBox = document.getElementById('title-reset-confirm');
  if (confirmBox) confirmBox.classList.add('hidden');

  const btnReset = document.getElementById('btn-title-reset');
  if (btnReset) {
    btnReset.classList.toggle('hidden', !savedExists);
    btnReset.onclick = () => {
      if (confirmBox) confirmBox.classList.remove('hidden');
    };
  }

  const btnResetYes = document.getElementById('btn-title-reset-yes');
  if (btnResetYes) {
    btnResetYes.onclick = () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
      setEndingCleanupMode(false);
      state = createDefaultState();
      saveState();
      loadStage(0);
      if (confirmBox) confirmBox.classList.add('hidden');
      openTitleModal();
    };
  }

  const btnResetNo = document.getElementById('btn-title-reset-no');
  if (btnResetNo) {
    btnResetNo.onclick = () => {
      if (confirmBox) confirmBox.classList.add('hidden');
    };
  }
}

export function openWelcomeModal() {
  showModal('welcome-modal');
  loadArtIntoImage(
    document.getElementById('welcome-art-img'),
    document.getElementById('welcome-art-badge'),
    {
      stageIdx: 0,
      pngUrl: STAGE_ART_MAP[0],
      title: WORLD_CONFIG.worldTitle,
      subtitle: 'Book 1: The Unseen Chord'
    }
  );
  const rollInfo = document.getElementById('welcome-roll-preview');
  const updatePreview = () => {
    if (rollInfo) {
      rollInfo.textContent = `Current Starting Stats — Courage: ${state.startingStats.courage} | Strength: ${state.startingStats.strength} | Favor: ${state.startingStats.favor} | Treasure: ${state.stats.treasure}`;
    }
  };
  updatePreview();

  const savedExists = hasSavedWalk(state);

  const btnContinue = document.getElementById('btn-continue-walk');
  if (btnContinue) {
    btnContinue.classList.toggle('hidden', !savedExists);
    btnContinue.textContent = `Continue Walk (Stage ${state.currentStageIdx + 1} of ${STAGES.length}) →`;
    btnContinue.onclick = () => {
      audio.init();
      audio.playKinnorChord();
      state.firstSightCompleted = true;
      saveState();
      closeAllModals();
    };
  }

  const btnRoll = document.getElementById('btn-roll-stats');
  if (btnRoll) {
    btnRoll.onclick = () => {
      audio.init();
      audio.playChime('step');
      const c = 9;
      const s = 20;
      const f = 9;
      state.startingStats = { courage: c, strength: s, favor: f };
      state.stats.courage = c;
      state.stats.strength = s;
      state.stats.favor = f;
      updatePreview();
      saveState();
    };
  }

  const btnGuide = document.getElementById('btn-open-guide-from-welcome');
  if (btnGuide) {
    btnGuide.onclick = () => openGuideModal();
  }

  const btnBegin = document.getElementById('btn-begin-walk');
  if (btnBegin) {
    btnBegin.textContent = savedExists
      ? 'Start Fresh Walk (Stage 1) →'
      : 'Begin Walk beside Elias →';
    btnBegin.onclick = () => {
      audio.init();
      audio.playKinnorChord();
      setEndingCleanupMode(false);
      if (savedExists) {
        const startStats = { ...state.startingStats };
        const prevSettings = { ...state.settings };
        state = createDefaultState();
        state.settings = prevSettings;
        state.startingStats = startStats;
        state.stats = { ...startStats, treasure: 0 };
        state.firstSightCompleted = true;
        saveState();
        loadStage(0);
      } else {
        state.firstSightCompleted = true;
        saveState();
        loadStage(0);
      }
      closeAllModals();
    };
  }
}

export function openGuideModal() {
  showModal('guide-modal');
  const btnTitle = document.getElementById('btn-guide-to-title');
  if (btnTitle) {
    btnTitle.onclick = () => openTitleModal();
  }
}

export function openStageCompleteModal(nextStageIdx) {
  if (!isStageCleared(state.currentStageIdx)) {
    const reason = getStageLockReason(nextStageIdx ?? state.currentStageIdx + 1);
    showGatingToast(reason);
    return;
  }

  const curStage = STAGES[state.currentStageIdx] || STAGES[0];
  const targetIdx = Math.max(0, Math.min(STAGES.length - 1, nextStageIdx));
  const nextStage = STAGES[targetIdx] || STAGES[0];

  preloadStageArt(targetIdx);

  setText('stage-complete-title', `${curStage.title} — Completed`);
  setText(
    'stage-complete-meta',
    `Stage ${state.currentStageIdx + 1} of ${STAGES.length} · Treasure: ${state.stats.treasure} · Scrolls: ${state.scrollsLearned.length}/5`
  );
  setText(
    'stage-complete-summary',
    `You and Elias have cleared every Stand in ${curStage.title}. Ahead lies ${nextStage.title} (${nextStage.actLabel}).`
  );
  // Display the completed stage's own banner art with its subject focal point centered
  const bannerUrl = STAGE_ART_MAP[state.currentStageIdx] || STAGE_ART_MAP[targetIdx];
  loadArtIntoImage(
    document.getElementById('stage-complete-art-img'),
    document.getElementById('stage-complete-art-badge'),
    {
      stageIdx: state.currentStageIdx,
      pngUrl: bannerUrl,
      title: curStage.title,
      subtitle: curStage.subtitle,
      focalPoint: getArtFocalPoint(bannerUrl)
    }
  );

  const btnBook1 = document.getElementById('btn-stage-complete-book1');
  if (btnBook1) {
    btnBook1.onclick = () => openGatehouseModal();
  }

  const btnCont = document.getElementById('btn-stage-complete-continue');
  if (btnCont) {
    btnCont.textContent = `Continue to Stage ${targetIdx + 1} of ${STAGES.length} →`;
    btnCont.onclick = () => {
      loadStage(targetIdx);
      closeAllModals();
    };
  }

  showModal('stage-complete-modal');
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
  if (page.verses && page.verses.length > 0) {
    speakKjvScroll(
      page.verses.map((v) => v.text).join(' '),
      page.verses.map((v) => v.ref).join(' and ')
    );
  }
  loadArtIntoImage(
    document.getElementById('wisdom-art-img'),
    document.getElementById('wisdom-art-badge'),
    {
      stageIdx: state.currentStageIdx,
      pngUrl: WISDOM_ART_MAP[page.id] || STAGE_ART_MAP[state.currentStageIdx],
      title: page.title,
      subtitle: page.sectionRef
    }
  );
  showModal('wisdom-modal');
}

export function openBreadPickupModal() {
  const alreadyClaimed = Boolean(state.breadPickupClaimed);
  if (!alreadyClaimed) {
    state.breadPickupClaimed = true;
    state.bread = Math.min(4, (Number(state.bread) || 0) + 1);
    audio.playKinnorChord();
    saveState();
  }
  const msg = alreadyClaimed
    ? `Bread Pickup Claimed ✓ — You have already gathered this Loaf of Bread (Current Bread: ${state.bread}).`
    : `Gain: +1 Loaf of Bread (now ${state.bread} Bread)! Use Bread mid-fight or at a Well to restore +2 Strength.`;
  setText('well-title', 'Bread of the Juniper Tree · Stage IV Pickup');
  setText('well-meta', 'Section 175 · Placed Beside Well 3 on the Columbarium Bench · 1 Kings 19:6 (KJV)');
  setText(
    'well-narrative',
    'Beside the sun-warmed wooden bench at Well 3 rests a warm barley loaf wrapped in linen—a provision for the climb ahead before the Youth Q&A and the Sea of Glass.'
  );
  setText(
    'well-kjv-text',
    '"And he looked, and, behold, there was a cake baken on the coals, and a cruse of water at his head. And he did eat and drink, and laid him down again." — 1 Kings 19:6 (KJV)'
  );
  setText('well-reward-banner', msg);
  setText('well-question', 'Where has the Lord provided quiet strength for the next step of your walk today?');
  const artCfg = WELL_ART_MAP.well_3 || { url: STAGE_ART_MAP[3], motif: 'sea_of_glass', stageIdx: 3 };
  loadArtIntoImage(
    document.getElementById('well-art-img'),
    document.getElementById('well-art-badge'),
    {
      stageIdx: 3,
      pngUrl: artCfg.url,
      title: 'Bread of the Juniper Tree',
      subtitle: '+1 Loaf of Bread · 1 Kings 19:6 (KJV)',
      motif: artCfg.motif
    }
  );
  const breadBtn = document.getElementById('btn-well-eat-bread');
  if (breadBtn) {
    const strRoom = Math.max(0, state.startingStats.strength - state.stats.strength);
    const actualBreadGain = state.bread > 0 ? Math.min(2, strRoom) : 0;
    breadBtn.disabled = state.bread <= 0 || strRoom <= 0;
    breadBtn.textContent =
      state.bread <= 0
        ? 'Use Bread · +0 Strength (0 left)'
        : strRoom <= 0
          ? 'Use Bread · +0 Strength (Full)'
          : `Use Bread · +${actualBreadGain} Strength`;
    breadBtn.onclick = () => {
      if (state.bread > 0 && state.stats.strength < state.startingStats.strength) {
        const prevS = state.stats.strength;
        state.bread -= 1;
        state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 2);
        const gainedNow = state.stats.strength - prevS;
        saveState();
        openBreadPickupModal();
        setText(
          'well-reward-banner',
          `Used Bread: Gain: +${gainedNow} Strength (now ${state.stats.strength}/${state.startingStats.strength} · ${state.bread} Bread left).`
        );
      }
    };
  }
  showModal('well-modal');
}

export function openWellModal(wellId, customBannerMessage = null) {
  const well = WELLS[wellId] || Object.values(WELLS)[0];
  state.lastWellId = well.id;
  state.lastWellStageIdx = well.stageIdx ?? state.currentStageIdx;

  const firstVisit = !state.wellsVisited.includes(well.id);
  let rewardNotice = '';

  if (customBannerMessage) {
    rewardNotice = customBannerMessage;
  } else if (firstVisit) {
    state.wellsVisited.push(well.id);
    const prevFavor = state.stats.favor;
    const prevStrength = state.stats.strength;
    state.stats.favor = Math.min(state.startingStats.favor, state.stats.favor + 1);
    state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 3);
    const gainedFavor = state.stats.favor - prevFavor;
    const gainedStr = state.stats.strength - prevStrength;

    const favorPart =
      gainedFavor <= 0
        ? `Favor already full (${state.stats.favor}/${state.startingStats.favor}).`
        : `Favor +${gainedFavor} (now ${state.stats.favor}/${state.startingStats.favor}).`;
    const strPart =
      gainedStr <= 0
        ? `Strength already full (${state.stats.strength}/${state.startingStats.strength}).`
        : `Strength +${gainedStr} (now ${state.stats.strength}/${state.startingStats.strength}).`;

    rewardNotice = `${favorPart} ${strPart}`;
    if (well.grantsScroll && !state.scrollsLearned.includes(well.grantsScroll)) {
      state.scrollsLearned.push(well.grantsScroll);
      const sc = SCROLLS[well.grantsScroll];
      if (sc) rewardNotice += ` Learned Scroll #${sc.num}: ${sc.ref}!`;
    }
    if (well.grantsToken && !state.tokenEarned) {
      state.tokenEarned = true;
      rewardNotice += ` Received Mentor's Token: ${MENTOR_TOKEN.name}!`;
    }
    if (well.id === 'well_3' && !state.breadPickupClaimed) {
      state.breadPickupClaimed = true;
      state.bread = Math.min(4, (Number(state.bread) || 0) + 1);
      rewardNotice += ` Picked up +1 Loaf of Bread (now ${state.bread} Bread)!`;
    }
  } else {
    // Reopening an already-visited Well: read-only restoration summary (each Well can be used only once)
    const strStatus =
      state.stats.strength >= state.startingStats.strength
        ? `Strength already full (${state.stats.strength}/${state.startingStats.strength}).`
        : `Strength ${state.stats.strength}/${state.startingStats.strength}.`;
    const sc = well.grantsScroll ? SCROLLS[well.grantsScroll] : null;
    const scrollInfo = sc ? ` Scroll #${sc.num} (${sc.ref}) inscribed.` : '';
    rewardNotice = `Well Cleared ✓ (Used 1/1) — Favor ${state.stats.favor}/${state.startingStats.favor}. ${strStatus}${scrollInfo}`;
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
  if (firstVerse && !customBannerMessage) {
    speakKjvScroll(firstVerse.text, firstVerse.ref);
  }

  const artCfg = WELL_ART_MAP[well.id] || { url: STAGE_ART_MAP[well.stageIdx ?? state.currentStageIdx], motif: 'sea_of_glass', stageIdx: well.stageIdx ?? 0 };
  loadArtIntoImage(
    document.getElementById('well-art-img'),
    document.getElementById('well-art-badge'),
    {
      stageIdx: artCfg.stageIdx,
      pngUrl: artCfg.url,
      title: well.title,
      subtitle: well.subtitle,
      motif: artCfg.motif
    }
  );

  const breadBtn = document.getElementById('btn-well-eat-bread');
  if (breadBtn) {
    const strRoom = Math.max(0, state.startingStats.strength - state.stats.strength);
    const actualBreadGain = state.bread > 0 ? Math.min(2, strRoom) : 0;
    breadBtn.disabled = state.bread <= 0 || strRoom <= 0;
    breadBtn.textContent =
      state.bread <= 0
        ? 'Use Bread · +0 Strength (0 left)'
        : strRoom <= 0
          ? 'Use Bread · +0 Strength (Full)'
          : `Use Bread · +${actualBreadGain} Strength`;
    breadBtn.onclick = () => {
      if (state.bread > 0 && state.stats.strength < state.startingStats.strength) {
        const prevS = state.stats.strength;
        state.bread -= 1;
        state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 2);
        const gainedNow = state.stats.strength - prevS;
        saveState();
        openWellModal(
          well.id,
          `Ate 1 Loaf of Bread at the Well: Gain: +${gainedNow} Strength (now ${state.stats.strength}/${state.startingStats.strength}).`
        );
      }
    };
  }
  showModal('well-modal');
}

export function formatTreasureChoiceStatText(choice, isGive = true) {
  if (!choice) return '';
  if (isGive) {
    const trGain = choice.treasureDelta > 0 ? `+${choice.treasureDelta} Treasure` : '+1 Treasure';
    return `Cost: 2 Strength or 1 Favor · Gain: ${trGain}`;
  }
  return 'No cost · +0 Treasure';
}

export function openTreasureModal(treasureId) {
  const tr = TREASURES[treasureId] || Object.values(TREASURES)[0];
  const prevChoice = state.treasuresChosen[tr.id];
  setText('treasure-title', tr.title);
  setText('treasure-meta', `Section ${tr.sectionNum} · ${tr.person} · Companion-POV Agency`);
  setText('treasure-narrative', tr.prompt);
  setText('treasure-give-label', tr.giveChoice.label);
  loadArtIntoImage(
    document.getElementById('treasure-art-img'),
    document.getElementById('treasure-art-badge'),
    {
      stageIdx: tr.stageIdx ?? state.currentStageIdx,
      pngUrl: TREASURE_ART_MAP[tr.id] || STAGE_ART_MAP[tr.stageIdx ?? state.currentStageIdx],
      title: tr.title,
      subtitle: `Section ${tr.sectionNum} · ${tr.person}`
    }
  );
  setText('treasure-give-cost', formatTreasureChoiceStatText(tr.giveChoice, true));
  setText('treasure-keep-label', tr.keepChoice.label);
  setText('treasure-keep-cost', formatTreasureChoiceStatText(tr.keepChoice, false));

  const outcomeBox = document.getElementById('treasure-outcome-box');
  const btnGiveStr = document.getElementById('btn-treasure-give');
  const btnGiveFavor = document.getElementById('btn-treasure-give-favor');
  const btnKeep = document.getElementById('btn-treasure-keep');

  if (prevChoice) {
    if (outcomeBox) {
      outcomeBox.classList.remove('hidden');
      const chosenObj = prevChoice === 'give' ? tr.giveChoice : tr.keepChoice;
      outcomeBox.textContent = `✓ Choice Recorded (${prevChoice.toUpperCase()}): ${chosenObj.outcomeText}`;
    }
    if (btnGiveStr) {
      btnGiveStr.disabled = true;
      btnGiveStr.classList.toggle('btn-applied', prevChoice === 'give');
      btnGiveStr.textContent = prevChoice === 'give' ? 'Chosen: Give (+1 Treasure) ✓' : 'Give (Cost: 2 Strength · Gain: +1 Treasure)';
    }
    if (btnGiveFavor) {
      btnGiveFavor.disabled = true;
      btnGiveFavor.classList.toggle('btn-applied', prevChoice === 'give');
      btnGiveFavor.textContent = prevChoice === 'give' ? 'Give Sacrifice Recorded ✓' : 'Give (Cost: 1 Favor · Gain: +1 Treasure)';
    }
    if (btnKeep) {
      btnKeep.disabled = true;
      btnKeep.classList.toggle('btn-applied', prevChoice === 'keep');
      btnKeep.textContent = prevChoice === 'keep' ? 'Chosen: Keep (+0 Treasure) ✓' : 'Keep / Pass By (+0 Treasure)';
    }
  } else {
    if (outcomeBox) outcomeBox.classList.add('hidden');
    const canSpendStr = state.stats.strength > 2;
    const canSpendFavor = state.stats.favor >= 1;

    if (btnGiveStr) {
      btnGiveStr.disabled = !canSpendStr;
      btnGiveStr.classList.remove('btn-applied');
      btnGiveStr.textContent = canSpendStr
        ? `Give (Cost: 2 Strength · Gain: +1 Treasure)`
        : `Give (Need >2 Strength · Cur: ${state.stats.strength})`;
      btnGiveStr.onclick = () => {
        if (state.treasuresChosen[tr.id] || state.stats.strength <= 2) return;
        state.stats.strength = Math.max(1, state.stats.strength - 2);
        state.stats.treasure += tr.giveChoice.treasureDelta || 1;
        state.treasuresChosen[tr.id] = 'give';
        state.treasureLog.push(`${tr.giveChoice.deedRecord} (Sacrificed 2 Strength)`);
        audio.playChime('treasure');
        saveState();
        openTreasureModal(tr.id);
      };
    }

    if (btnGiveFavor) {
      btnGiveFavor.disabled = !canSpendFavor;
      btnGiveFavor.classList.remove('btn-applied');
      btnGiveFavor.textContent = canSpendFavor
        ? `Give (Cost: 1 Favor · Gain: +1 Treasure)`
        : `Give (Need 1 Favor · Cur: 0)`;
      btnGiveFavor.onclick = () => {
        if (state.treasuresChosen[tr.id] || state.stats.favor < 1) return;
        state.stats.favor = Math.max(0, state.stats.favor - 1);
        state.stats.treasure += tr.giveChoice.treasureDelta || 1;
        state.treasuresChosen[tr.id] = 'give';
        state.treasureLog.push(`${tr.giveChoice.deedRecord} (Sacrificed 1 Favor)`);
        audio.playChime('treasure');
        saveState();
        openTreasureModal(tr.id);
      };
    }

    if (btnKeep) {
      btnKeep.disabled = false;
      btnKeep.classList.remove('btn-applied');
      btnKeep.textContent = 'Keep / Pass By (+0 Treasure)';
      btnKeep.onclick = () => {
        if (state.treasuresChosen[tr.id]) return;
        state.treasuresChosen[tr.id] = 'keep';
        audio.playChime('step');
        saveState();
        openTreasureModal(tr.id);
      };
    }
  }
  showModal('treasure-modal');
}

function getStandStep1Subline(st) {
  if (!st) return '';
  if (st.isRiggedBait) {
    return 'Walk away in wisdom (Cost: 1 Favor · Learn Scroll 5)';
  }
  const cDelta = st.victoryLawEffect?.courageDelta || 0;
  const sDelta = st.victoryLawEffect?.strengthDelta || 0;
  const nextC = Math.max(4, st.baseCourage + cDelta);
  const nextS = Math.max(1, st.baseStrength + sDelta);
  const parts = [];
  if (cDelta < 0) parts.push(`Courage ${st.baseCourage}→${nextC}`);
  if (sDelta < 0) parts.push(`Strength ${st.baseStrength}→${nextS}`);
  const summaryByStand = {
    stand_1: 'Humility before Round 1',
    stand_2: 'Bring secret into the light',
    stand_3: 'Celebrate another’s good',
    stand_5: 'Honest lament beside Yuna',
    stand_6: 'Bear your brother’s burden',
    stand_7: 'Costly honesty before the youth',
    stand_8: 'Confess & lock hands in fellowship'
  };
  const prefix = summaryByStand[st.id] || 'Apply humility';
  return parts.length > 0 ? `${prefix} (${parts.join(', ')})` : prefix;
}

export function openStandModal(standId) {
  const st = STANDS[standId] || Object.values(STANDS)[0];
  const alreadyCleared = state.standsCleared.includes(st.id);
  const isFirstStronghold = !state.seenStrongholdDef;
  if (!state.seenStrongholdDef) {
    state.seenStrongholdDef = true;
    saveState();
  }
  state.tokenSpentInCurrentStand = false;
  const startRollBonus = st.baseCourage + (st.rollBonus ?? 1);

  if (alreadyCleared) {
    // Reopening a cleared Stand opens read-only with the "Cleared ✓" badge, victory text, and Close button
    activeStandSession = {
      stand: st,
      enemyStrength: 0,
      maxEnemyStrength: st.baseStrength,
      enemyCourage: st.baseCourage,
      baseEnemyCourage: st.baseCourage,
      round: 0,
      victoryLawApplied: true,
      scrollApplied: true,
      tokenAuto10Next: false,
      lastRoundLost: false,
      isWon: true,
      isAlreadyCleared: true,
      showStrongholdDef: false,
      log: [
        `Stand Cleared ✓ — ${st.title} (${st.strongholdName}) has already been overcome on this walk.`
      ]
    };
  } else {
    const initialLog = [
      `Stand entered: ${st.title} (${st.strongholdName} · Courage ${st.baseCourage}, Strength ${st.baseStrength} · Stronghold rolls 2d6+${startRollBonus}).`,
      `Scripture Root: ${st.scriptureRoot}`
    ];
    if (st.wisdomLine) {
      initialLog.push(`${st.wisdomLine} ${st.wisdomKjvText || ''}`.trim());
    }
    initialLog.push(`Step 1 Prompt: ${st.victoryLawPrompt}`);
    activeStandSession = {
      stand: st,
      enemyStrength: st.baseStrength,
      maxEnemyStrength: st.baseStrength,
      enemyCourage: st.baseCourage,
      baseEnemyCourage: st.baseCourage,
      round: 0,
      victoryLawApplied: false,
      scrollApplied: false,
      tokenAuto10Next: false,
      lastRoundLost: false,
      isWon: false,
      isAlreadyCleared: false,
      showStrongholdDef: isFirstStronghold || st.id === 'stand_1',
      log: initialLog
    };
  }
  renderStandSession();
  bindStandAuxButtons();
  showModal('stand-modal');
}

function executeRiggedBaitWalkOut(costType = 'auto') {
  if (!activeStandSession) return;
  const s = activeStandSession;
  const st = s.stand;
  if (!st.isRiggedBait || s.isWon || s.isAlreadyCleared) return;

  let chosenCost = costType;
  if (chosenCost === 'auto') {
    chosenCost = state.stats.favor >= 1 ? 'favor' : 'strength';
  }

  let costDesc = '';
  if (chosenCost === 'favor' && state.stats.favor >= 1) {
    state.stats.favor = Math.max(0, state.stats.favor - 1);
    costDesc = 'Cost: 1 Favor';
  } else {
    state.stats.strength = Math.max(0, state.stats.strength - 1);
    costDesc = 'Cost: 1 Strength';
    if (state.stats.strength <= 0) {
      saveState();
      triggerGraceFall(st);
      return;
    }
  }

  const firstClear = !state.standsCleared.includes(st.id);
  s.isWon = true;
  s.victoryLawApplied = true;
  s.enemyStrength = 0;
  if (firstClear) {
    state.standsCleared.push(st.id);
    if (!state.scrollsLearned.includes('scroll_5')) state.scrollsLearned.push('scroll_5');
  }
  s.log.push(
    `Victory Law Walk-Out Applied ✓ (${costDesc}): Walked away from ${st.title} in wisdom and inscribed Scroll #5 (1 Corinthians 6:12 KJV)!`
  );
  audio.playChime('stand_win');
  saveState();
  renderStageBar();
  renderQuickNodeBar();
  renderStandSession();
  bindStandAuxButtons();
}

function renderStandSession() {
  if (!activeStandSession) return;
  const s = activeStandSession;
  const st = s.stand;
  const rollBonus = st.rollBonus ?? 1;
  const effectiveEnemyRollMod = s.enemyCourage + rollBonus;
  const baseEnemyRollMod = s.baseEnemyCourage + rollBonus;

  setText('stand-title', st.title);
  setText('stand-meta', `Section ${st.sectionNum} · ${st.strongholdName} · ${st.scriptureRoot}`);
  setText('stand-narrative', st.whisper);
  setText('stand-enemy-name', st.strongholdName);

  const clearedBadge = document.getElementById('stand-cleared-badge');
  if (clearedBadge) {
    clearedBadge.classList.toggle('hidden', !(s.isAlreadyCleared || s.isWon));
    clearedBadge.textContent = 'Cleared ✓';
  }

  // Show both Courage and Strength with explicit before->after indicator when reduced by Step 1 / Scroll
  const eCourageEl = document.getElementById('stand-enemy-courage');
  if (eCourageEl) {
    if (s.enemyCourage < s.baseEnemyCourage) {
      eCourageEl.textContent = `${s.enemyCourage}/${s.baseEnemyCourage} (${s.baseEnemyCourage}→${s.enemyCourage})`;
      eCourageEl.className = 'stat-reduced';
    } else {
      eCourageEl.textContent = `${s.enemyCourage}/${s.baseEnemyCourage}`;
      eCourageEl.className = '';
    }
  }
  const eStrengthEl = document.getElementById('stand-enemy-strength');
  if (eStrengthEl) {
    if (s.isAlreadyCleared || s.isWon) {
      eStrengthEl.textContent = `0/${s.maxEnemyStrength} (Cleared ✓)`;
      eStrengthEl.className = 'stat-reduced';
    } else if (s.enemyStrength < s.maxEnemyStrength) {
      eStrengthEl.textContent = `${s.enemyStrength}/${s.maxEnemyStrength} (${s.maxEnemyStrength}→${s.enemyStrength})`;
      eStrengthEl.className = 'stat-reduced';
    } else {
      eStrengthEl.textContent = `${s.enemyStrength}/${s.maxEnemyStrength}`;
      eStrengthEl.className = '';
    }
  }
  const eRollEl = document.getElementById('stand-enemy-roll');
  if (eRollEl) {
    if (effectiveEnemyRollMod < baseEnemyRollMod) {
      eRollEl.textContent = `Stronghold rolls 2d6+${effectiveEnemyRollMod} (was 2d6+${baseEnemyRollMod})`;
    } else {
      eRollEl.textContent = `Stronghold rolls 2d6+${effectiveEnemyRollMod}`;
    }
  }

  setText('stand-player-courage', state.stats.courage);
  setText('stand-player-strength', `${state.stats.strength}/${state.startingStats.strength}`);
  setText('stand-player-favor', `${state.stats.favor}/${state.startingStats.favor}`);

  const defEl = document.getElementById('stand-stronghold-def');
  if (defEl) {
    defEl.classList.toggle('hidden', !s.showStrongholdDef || s.isAlreadyCleared);
  }
  const coachEl = document.getElementById('stand-coach-tip');
  if (coachEl) {
    coachEl.classList.toggle('hidden', !(st.id === 'stand_1' && s.round === 0 && !s.isWon && !s.isAlreadyCleared));
  }
  const wisdomBannerEl = document.getElementById('stand-wisdom-banner');
  if (wisdomBannerEl) {
    if (st.wisdomLine) {
      wisdomBannerEl.classList.remove('hidden');
      wisdomBannerEl.innerHTML = `<strong style="color:var(--gold);">${st.wisdomLine}</strong>${st.wisdomKjvText ? ` <span style="font-style:italic; color:#fef3c7;">${st.wisdomKjvText}</span>` : ''}`;
    } else {
      wisdomBannerEl.classList.add('hidden');
      wisdomBannerEl.textContent = '';
    }
  }

  // Keep #stand-victory-banner hidden so #stand-combat-log is the SINGLE scroll area inside #stand-modal
  const vicBanner = document.getElementById('stand-victory-banner');
  if (vicBanner) {
    vicBanner.textContent = '';
    vicBanner.classList.add('hidden');
  }

  const artCfg = STAND_ART_MAP[st.id] || { url: STAGE_ART_MAP[st.stageIdx ?? state.currentStageIdx], motif: 'mirror', stageIdx: st.stageIdx ?? 0 };
  loadArtIntoImage(
    document.getElementById('stand-art-img'),
    document.getElementById('stand-art-badge'),
    {
      stageIdx: artCfg.stageIdx,
      pngUrl: artCfg.url,
      title: st.title,
      subtitle: `${st.strongholdName} · ${st.scriptureRoot}`,
      motif: artCfg.motif
    }
  );

  // Single unified scroll area (#stand-combat-log) containing combat log lines + victory card
  const logEl = document.getElementById('stand-combat-log');
  if (logEl) {
    const logLinesHtml = s.log.map((line) => `<div class="stand-log-line">${line}</div>`).join('');
    const victoryHtml = s.isWon
      ? `<div class="stand-log-victory-card"><strong style="color:var(--gold);">✓ Victory in ${st.title} (Cleared ✓):</strong> ${st.victoryText}</div>`
      : '';
    logEl.innerHTML = logLinesHtml + victoryHtml;
    logEl.scrollTop = logEl.scrollHeight;
  }

  const stepActionsWrap = document.getElementById('stand-step-actions');
  if (stepActionsWrap) {
    stepActionsWrap.classList.toggle('hidden', Boolean(s.isAlreadyCleared));
  }

  const btnLaw = document.getElementById('btn-stand-victory-law');
  if (btnLaw) {
    if (st.isRiggedBait) {
      btnLaw.disabled = s.isWon || s.round > 0 || state.stats.favor < 1;
      btnLaw.classList.toggle('btn-applied', Boolean(s.isWon && s.victoryLawApplied));
      const t = s.isWon && s.victoryLawApplied
        ? 'Walk-Out Victory Law — Applied ✓'
        : 'Step 1: Walk Out in Wisdom (Cost: 1 Favor)';
      const sub = state.stats.favor >= 1
        ? 'Spend 1 Favor · Refuse rigged fight & learn Scroll 5'
        : 'Need 1 Favor (use Strength option instead)';
      btnLaw.innerHTML = `<span class="step-btn-title">${t}</span><span class="step-btn-sub">${sub}</span>`;
      btnLaw.onclick = () => executeRiggedBaitWalkOut('favor');
    } else {
      btnLaw.disabled = s.victoryLawApplied || s.round > 0 || s.isWon;
      btnLaw.classList.toggle('btn-applied', Boolean(s.victoryLawApplied));
      const step1Title = s.victoryLawApplied
        ? 'Step 1: Victory Law — Applied ✓'
        : 'Step 1: Apply Victory Law';
      const step1Sub = getStandStep1Subline(st);
      btnLaw.innerHTML = `<span class="step-btn-title">${step1Title}</span><span class="step-btn-sub">${step1Sub}</span>`;
      btnLaw.onclick = () => {
        if (s.victoryLawApplied || s.round > 0 || s.isWon) return;
        const prevC = s.enemyCourage;
        const prevS = s.enemyStrength;
        s.victoryLawApplied = true;
        s.enemyCourage = Math.max(4, s.enemyCourage + (st.victoryLawEffect?.courageDelta || 0));
        s.enemyStrength = Math.max(1, s.enemyStrength + (st.victoryLawEffect?.strengthDelta || 0));
        const nextRollMod = s.enemyCourage + (st.rollBonus ?? 1);
        s.log.push(
          `Step 1 (Victory Law) Applied ✓: ${st.victoryLawEffect?.note || ''} [Stronghold Courage ${prevC}→${s.enemyCourage} (rolls 2d6+${nextRollMod}), Strength ${prevS}→${s.enemyStrength}]`
        );
        audio.playChime('stand_win');
        renderStandSession();
        bindStandAuxButtons();
      };
    }
  }

  const btnScroll = document.getElementById('btn-stand-scroll');
  if (btnScroll) {
    if (st.isRiggedBait) {
      btnScroll.disabled = s.isWon || s.round > 0;
      btnScroll.classList.toggle('btn-applied', Boolean(s.isWon && s.victoryLawApplied));
      btnScroll.innerHTML = `<span class="step-btn-title">${s.isWon && s.victoryLawApplied ? 'Walk-Out Recorded ✓' : 'Walk Out in Wisdom (Cost: 1 Strength)'}</span><span class="step-btn-sub">Spend 1 Strength · Refuse rigged fight & learn Scroll 5</span>`;
      btnScroll.onclick = () => executeRiggedBaitWalkOut('strength');
    } else {
      const resIds = st.resonantScrolls || [];
      const primaryId = resIds[0];
      const primaryScroll = primaryId ? SCROLLS[primaryId] : null;
      const learnedMatchId = resIds.find((id) => state.scrollsLearned.includes(id));
      const canSpeakScroll = Boolean(learnedMatchId || st.id === 'stand_3');
      btnScroll.disabled = !canSpeakScroll || s.scrollApplied || s.round > 0 || s.isWon;
      btnScroll.classList.toggle('btn-applied', Boolean(s.scrollApplied));
      const scrollRefText = primaryScroll ? primaryScroll.ref : 'KJV Scroll';
      btnScroll.textContent = s.scrollApplied
        ? `Speak ${scrollRefText} — Applied ✓`
        : `Speak ${scrollRefText}`;
      btnScroll.onclick = () => {
        if (!canSpeakScroll || s.scrollApplied || s.round > 0 || s.isWon) return;
        const scObj = primaryScroll || (learnedMatchId ? SCROLLS[learnedMatchId] : null);
        if (!scObj) return;
        s.scrollApplied = true;
        const alreadyReducedByStep1 =
          s.victoryLawApplied &&
          (st.id === 'stand_2' || st.id === 'stand_3' || st.id === 'stand_6' || st.id === 'stand_8');
        if (!alreadyReducedByStep1) {
          const prevC = s.enemyCourage;
          const prevS = s.enemyStrength;
          const cDelta = st.scrollLawEffect?.courageDelta || 0;
          const sDelta =
            s.victoryLawApplied && st.id === 'stand_5'
              ? 0
              : st.scrollLawEffect?.strengthDelta || 0;
          s.enemyCourage = Math.max(4, s.enemyCourage + cDelta);
          s.enemyStrength = Math.max(1, s.enemyStrength + sDelta);
          const nextRollMod = s.enemyCourage + (st.rollBonus ?? 1);
          s.log.push(
            `Spoke ${scObj.ref} verbatim: "${scObj.text}" -> ${st.scrollLawEffect?.note || ''} [Courage ${prevC}→${s.enemyCourage} (rolls 2d6+${nextRollMod}), Strength ${prevS}→${s.enemyStrength}]`
          );
        } else {
          s.log.push(`Spoke ${scObj.ref} verbatim: "${scObj.text}" — Standing firm on God's Word!`);
        }
        speakKjvScroll(scObj.text, scObj.ref);
        audio.playKinnorChord();
        renderStandSession();
        bindStandAuxButtons();
      };
    }
  }

  const btnRoll = document.getElementById('btn-stand-roll');
  if (btnRoll) {
    btnRoll.classList.toggle('btn-claim-victory', Boolean(s.isWon));
    if (s.isAlreadyCleared) {
      btnRoll.textContent = 'Close (Cleared ✓)';
    } else if (s.isWon) {
      btnRoll.textContent = 'Claim Victory ✓';
    } else {
      btnRoll.textContent = s.tokenAuto10Next
        ? `Roll: 10 + Courage ${state.stats.courage} vs 2d6 + ${effectiveEnemyRollMod}`
        : `Roll: 2d6 + Courage ${state.stats.courage} vs 2d6 + ${effectiveEnemyRollMod}`;
    }
    btnRoll.onclick = () => handleStandRollRound();
  }
}

function handleStandRollRound() {
  if (!activeStandSession) return;
  const s = activeStandSession;
  const st = s.stand;

  // If the Stand has already been won or was already cleared, clicking Close / Claim Victory simply closes the modal
  if (s.isWon || s.isAlreadyCleared) {
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
  const enemyRollMod = s.enemyCourage + (st.rollBonus ?? 1);
  const pTotal = pD1 + pD2 + state.stats.courage;
  const eTotal = eD1 + eD2 + enemyRollMod;

  if (pTotal > eTotal) {
    s.enemyStrength = Math.max(0, s.enemyStrength - 2);
    s.log.push(
      `Round ${s.round}: You rolled [${pD1}+${pD2}${usedAuto10 ? ' Token=10' : ''}] + ${state.stats.courage} = ${pTotal} vs Stronghold [${eD1}+${eD2}] + ${enemyRollMod} = ${eTotal} -> WIN! Stronghold -2 Strength (${s.enemyStrength} left).`
    );
    audio.playChime('stand_win');
    if (s.enemyStrength <= 0) {
      const firstClear = !state.standsCleared.includes(st.id);
      s.isWon = true;
      if (firstClear) {
        state.standsCleared.push(st.id);
        if (st.id === 'stand_6') {
          state.oil = Math.min(2, state.oil + 1);
        }
        if (st.id === 'stand_4' && !state.scrollsLearned.includes('scroll_5')) {
          state.scrollsLearned.push('scroll_5');
        }
      }
      saveState();
      renderStageBar();
      renderQuickNodeBar();
    }
  } else if (eTotal > pTotal) {
    state.stats.strength = Math.max(0, state.stats.strength - 2);
    s.lastRoundLost = true;
    s.log.push(
      `Round ${s.round}: You rolled [${pD1}+${pD2}] + ${state.stats.courage} = ${pTotal} vs Stronghold [${eD1}+${eD2}] + ${enemyRollMod} = ${eTotal} -> HIT (Cost: -2 Strength, now ${state.stats.strength}). You may Test Favor to halve loss!`
    );
    audio.playChime('grace');
    saveState();
    if (state.stats.strength <= 0) {
      triggerGraceFall(st);
      return;
    }
  } else {
    // Watchman Tie Rule: player loses 1 Strength on a tie
    state.stats.strength = Math.max(0, state.stats.strength - 1);
    s.log.push(
      `Round ${s.round}: Tie (${pTotal} vs ${eTotal}) — Watchman clash! Cost: -1 Strength (now ${state.stats.strength}/${state.startingStats.strength}).`
    );
    audio.playChime('grace');
    saveState();
    if (state.stats.strength <= 0) {
      triggerGraceFall(st);
      return;
    }
  }
  renderStandSession();
  bindStandAuxButtons();
}

function bindStandAuxButtons() {
  if (!activeStandSession) return;
  const s = activeStandSession;
  const st = s.stand;
  const hideAux = Boolean(s.isAlreadyCleared);

  const btnFavor = document.getElementById('btn-stand-favor');
  if (btnFavor) {
    btnFavor.classList.toggle('hidden', hideAux);
    btnFavor.disabled = !s.lastRoundLost || state.stats.favor <= 0 || s.isWon;
    btnFavor.textContent = s.lastRoundLost
      ? `Test Favor (<=${state.stats.favor})`
      : 'Test Favor';
    btnFavor.onclick = () => {
      if (!s.lastRoundLost || state.stats.favor <= 0 || s.isWon) return;
      const d1 = rollDie();
      const d2 = rollDie();
      const sum = d1 + d2;
      const blessed = sum <= state.stats.favor;
      state.stats.favor = Math.max(0, state.stats.favor - 1);
      s.lastRoundLost = false;
      if (blessed) {
        state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 1);
        s.log.push(`Favor Test [${d1}+${d2}=${sum} <= Favor]: Blessed! Last round loss halved (Gain: +1 Strength, Cost: -1 Favor).`);
        audio.playChime('stand_win');
      } else {
        s.log.push(`Favor Test [${d1}+${d2}=${sum} > Favor]: Tested (Cost: -1 Favor).`);
      }
      saveState();
      renderStandSession();
      bindStandAuxButtons();
    };
  }

  const btnOil = document.getElementById('btn-stand-oil');
  if (btnOil) {
    btnOil.classList.toggle('hidden', hideAux);
    const strRoom = Math.max(0, state.startingStats.strength - state.stats.strength);
    const actualOilGain = state.oil > 0 ? Math.min(4, strRoom) : 0;
    btnOil.disabled = state.oil <= 0 || strRoom <= 0 || s.isWon;
    btnOil.textContent =
      state.oil <= 0
        ? 'Use Oil · +0 Strength (0 left)'
        : strRoom <= 0
          ? 'Use Oil · +0 Strength (Full)'
          : `Use Oil · +${actualOilGain} Strength`;
    btnOil.onclick = () => {
      if (state.oil <= 0 || state.stats.strength >= state.startingStats.strength || s.isWon) return;
      const prevStr = state.stats.strength;
      state.oil -= 1;
      state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 4);
      const gained = state.stats.strength - prevStr;
      s.log.push(`Anointed with Oil: Gain: +${gained} Strength (now ${state.stats.strength}/${state.startingStats.strength}).`);
      audio.playKinnorChord();
      saveState();
      renderStandSession();
      bindStandAuxButtons();
    };
  }

  const btnBread = document.getElementById('btn-stand-bread');
  if (btnBread) {
    btnBread.classList.toggle('hidden', hideAux);
    const strRoom = Math.max(0, state.startingStats.strength - state.stats.strength);
    const actualBreadGain = state.bread > 0 ? Math.min(2, strRoom) : 0;
    btnBread.disabled = state.bread <= 0 || strRoom <= 0 || s.isWon;
    btnBread.textContent =
      state.bread <= 0
        ? 'Use Bread · +0 Strength (0 left)'
        : strRoom <= 0
          ? 'Use Bread · +0 Strength (Full)'
          : `Use Bread · +${actualBreadGain} Strength`;
    btnBread.onclick = () => {
      if (state.bread <= 0 || state.stats.strength >= state.startingStats.strength || s.isWon) return;
      const prevStr = state.stats.strength;
      state.bread -= 1;
      state.stats.strength = Math.min(state.startingStats.strength, state.stats.strength + 2);
      const gained = state.stats.strength - prevStr;
      s.log.push(`Ate 1 Loaf of Bread: Gain: +${gained} Strength (now ${state.stats.strength}/${state.startingStats.strength}).`);
      audio.playKinnorChord();
      saveState();
      renderStandSession();
      bindStandAuxButtons();
    };
  }

  const btnToken = document.getElementById('btn-stand-token');
  if (btnToken) {
    btnToken.classList.toggle('hidden', hideAux);
    btnToken.disabled = !state.tokenEarned || state.tokenUsed || s.tokenAuto10Next || s.isWon;
    btnToken.textContent = !state.tokenEarned
      ? 'Token (Well 1)'
      : state.tokenUsed
        ? 'Token (Used)'
        : 'Token (Auto-10)';
    btnToken.onclick = () => {
      if (!state.tokenEarned || state.tokenUsed || s.isWon) return;
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
    btnWithdraw.classList.toggle('hidden', hideAux);
    btnWithdraw.disabled = Boolean(s.isWon);
    btnWithdraw.textContent = 'Withdraw (-2 Str)';
    btnWithdraw.onclick = () => {
      if (s.isWon) return;
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

export function triggerGraceFall(failedStand = null) {
  // Watchman Cost of Failure: "Fallen, but not forsaken" (Micah 7:8 KJV)
  // Restore Strength to 50%, lose 1 Treasure if you have any, and return to start of current stage with Stand un-cleared.
  if (state.tokenSpentInCurrentStand) {
    state.tokenUsed = false;
    state.tokenSpentInCurrentStand = false;
  }
  const st = failedStand || activeStandSession?.stand || null;
  if (st && st.id) {
    state.standsCleared = state.standsCleared.filter((id) => id !== st.id);
  }

  const restoredStr = Math.max(1, Math.round((Number(state.startingStats.strength) || 20) * 0.5));
  const hadTreasure = state.stats.treasure > 0;
  if (hadTreasure) {
    state.stats.treasure = Math.max(0, state.stats.treasure - 1);
  }
  state.stats.strength = restoredStr;
  saveState();

  const curStageIdx = state.currentStageIdx || 0;
  const curStage = STAGES[curStageIdx] || STAGES[0];
  // Immediately reposition player at the start of the current stage
  loadStage(curStageIdx);

  const kjvVerse =
    '"Rejoice not against me, O mine enemy: when I fall, I shall arise; when I sit in darkness, the LORD shall be a light unto me." — Micah 7:8 (KJV)';
  setText('grace-title', 'Fallen, but not forsaken');
  setText('grace-kjv', kjvVerse);
  const trLossNote = hadTreasure
    ? `Lost 1 Treasure (now ${state.stats.treasure}).`
    : `Treasure remains at 0.`;
  const standLabel = st ? st.title : 'this Stand';
  setText(
    'grace-narrative',
    `Your Strength reached 0 against ${standLabel}. Strength is restored to 50% (${restoredStr}/${state.startingStats.strength}). ${trLossNote} You have been returned to the start of ${curStage.title} with ${standLabel} un-cleared.`
  );
  setText('grace-stat-strength', `${state.stats.strength}/${state.startingStats.strength}`);
  setText('grace-stat-favor', `${state.stats.favor}/${state.startingStats.favor}`);
  setText('grace-stat-oil', `${state.oil}`);
  setText('grace-stat-bread', `${state.bread}`);
  setText('grace-stat-treasure', `${state.stats.treasure}`);
  speakKjvScroll(
    'Rejoice not against me, O mine enemy: when I fall, I shall arise; when I sit in darkness, the LORD shall be a light unto me.',
    'Micah 7:8 (KJV)'
  );

  const btnRestore = document.getElementById('btn-grace-restore-str');
  if (btnRestore) {
    btnRestore.textContent = `Rise at Start of ${curStage.title} (Strength ${restoredStr}/${state.startingStats.strength}) →`;
    btnRestore.onclick = () => {
      loadStage(curStageIdx);
      closeAllModals();
    };
  }

  const btnSupply = document.getElementById('btn-grace-restore-supply');
  if (btnSupply) {
    btnSupply.classList.add('hidden');
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

// ============================================================================
// SEA OF GLASS FINALE MOMENT & ENDING MODAL (§299 vs §300)
// ============================================================================

export function triggerEndingSequence() {
  if (!areAllRequiredStandsCleared()) {
    const reason = getAllMissingStandsReason();
    showGatingToast(reason);
    return false;
  }

  closeAllModals();
  if (state.currentStageIdx !== 5) {
    loadStage(5, -22);
  }
  setEndingCleanupMode(true);
  playerPos.set(0.85, 0, -23.5);
  finalePayoffState.active = true;
  finalePayoffState.startTime = performance.now();
  finalePayoffState.durationMs = state.settings.ecoMode ? 2400 : 4200;

  const bar = document.getElementById('sea-of-glass-payoff-bar');
  if (bar) bar.classList.remove('hidden');

  const skipBtn = document.getElementById('btn-skip-payoff');
  if (skipBtn) {
    skipBtn.onclick = () => finishSeaOfGlassPayoff();
  }

  audio.init();
  audio.playKinnorChord();
  return true;
}

export function finishSeaOfGlassPayoff() {
  finalePayoffState.active = false;
  const bar = document.getElementById('sea-of-glass-payoff-bar');
  if (bar) bar.classList.add('hidden');
  openFinaleModal();
}

export function openFinaleModal() {
  if (!areAllRequiredStandsCleared()) {
    const reason = getAllMissingStandsReason();
    showGatingToast(reason);
    return false;
  }

  const bar = document.getElementById('sea-of-glass-payoff-bar');
  if (bar) bar.classList.add('hidden');
  finalePayoffState.active = false;

  // Book 1 Section 298/299/300 rules:
  // 0-3 Treasure -> Section 299 (The Good Ending — The Honest Recovery Road)
  // 4-8 Treasure -> Section 300 (The True Ending — The Unseen Chord)
  const isTrue = state.stats.treasure >= 4;
  const ending = isTrue ? ENDINGS.true_ending : ENDINGS.good_ending;
  state.zone1Completed = true;
  state.endingReached = ending.id;
  saveState();
  setEndingCleanupMode(true);

  setText('finale-title', ending.title);
  setText(
    'finale-subtitle',
    `Section ${ending.sectionNum} · Your Treasure: ${state.stats.treasure} (${isTrue ? '4–8 Treasure · True Ending' : '0–3 Treasure · Good Ending'})`
  );
  setText('finale-narrative', (ending.body || []).join('\n\n'));
  setText('finale-kjv', `"${ending.epigraphText}" — ${ending.epigraphRef}`);
  setText('finale-Benediction', 'The love of God and the love of people is the treasure of life—found not by taking, but by giving.');

  // End-screen stat summary: Stands cleared, Treasure given vs kept, Scrolls learned, Wells used + ending hint
  const choices = Object.values(state.treasuresChosen || {});
  const givenCount = Math.max(
    state.stats.treasure,
    choices.filter((v) => v === 'give').length
  );
  const keptCount = choices.filter((v) => v === 'keep').length;
  setText('finale-stat-stands', `${state.standsCleared.length} / 8`);
  setText('finale-stat-treasure', `${givenCount} Given · ${keptCount} Kept`);
  setText('finale-stat-scrolls', `${state.scrollsLearned.length} / 5`);
  setText('finale-stat-wells', `${state.wellsVisited.length} / 5`);
  setText(
    'finale-ending-hint',
    isTrue
      ? 'You found the True Ending (Section 300: The Unseen Chord · 4+ Treasure given).'
      : 'Give more Treasure to find the True Ending (4+ Treasure unlocks Section 300: The Unseen Chord).'
  );

  loadArtIntoImage(
    document.getElementById('finale-art-img'),
    document.getElementById('finale-art-badge'),
    {
      stageIdx: 5,
      pngUrl: ENDING_ART_MAP[ending.id] || STAGE_ART_MAP[5],
      title: ending.title,
      subtitle: `Section ${ending.sectionNum} · ${ending.epigraphRef}`
    }
  );
  const nw1Code = generateNW1Code();
  const codeBox = document.getElementById('finale-nw1-code');
  if (codeBox) codeBox.value = nw1Code;
  const seaCodeBox = document.getElementById('ending-sea-nw1-code');
  if (seaCodeBox) seaCodeBox.value = nw1Code;

  const btnReturnTitle = document.getElementById('btn-finale-return-title');
  if (btnReturnTitle) {
    btnReturnTitle.onclick = () => openTitleModal();
  }

  audio.playKinnorChord();
  showModal('finale-modal');
  return true;
}

export function openGatehouseModal() {
  const codeInput = document.getElementById('gatehouse-nw1-export');
  if (codeInput) codeInput.value = generateNW1Code();
  const statusEl = document.getElementById('gatehouse-import-status');
  if (statusEl) statusEl.textContent = '';
  const confirmEl = document.getElementById('gatehouse-reset-confirm');
  if (confirmEl) confirmEl.classList.add('hidden');

  const shopLink = document.getElementById('gatehouse-book-link');
  if (shopLink) {
    if (WORLD_CONFIG.gatehouseBook1Url) {
      shopLink.href = WORLD_CONFIG.gatehouseBook1Url;
      shopLink.classList.remove('hidden');
    } else {
      shopLink.classList.add('hidden');
    }
  }

  loadArtIntoImage(
    document.getElementById('gatehouse-art-img'),
    document.getElementById('gatehouse-art-badge'),
    {
      stageIdx: 5,
      pngUrl: PORTRAIT_ART_MAP.gatehouseBanner,
      title: 'Book 1: The Unseen Chord',
      subtitle: 'Gatehouse Edition & NW1 Progress Code'
    }
  );
  showModal('gatehouse-modal');
}

function getEffectivePixelRatio() {
  if (state.settings.ecoMode) return 1.0;
  return Math.min(window.devicePixelRatio || 1, 1.5);
}

function initThreeWorld() {
  const container = document.getElementById('viewport-container');
  renderer = new THREE.WebGLRenderer({
    antialias: !state.settings.ecoMode,
    powerPreference: 'high-performance'
  });
  renderer.shadowMap.enabled = false;
  renderer.setPixelRatio(getEffectivePixelRatio());
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (container) container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 160);
  worldManager = new WorldStageManager(scene);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(getEffectivePixelRatio());
    renderer.setSize(window.innerWidth, window.innerHeight);
    needsOneWorldRender = true;
  });

  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Escape' || e.key === 'Escape') {
      if (isAnyModalOpen()) {
        e.preventDefault();
        closeAllModals();
      }
      return;
    }
    if (
      (e.code === 'KeyE' || e.code === 'Enter') &&
      !isAnyModalOpen() &&
      !finalePayoffState.active &&
      !endingCleanupActive &&
      performance.now() >= interactCooldownUntil
    ) {
      const near = worldManager.getNearestNode(playerPos, 4.2);
      if (near) openNodeInteraction(near);
    }
  });
  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  // Scroll-to-zoom clamped so camera cannot go closer than 3.0m from the player (default 4.6m, max 9.0m)
  renderer.domElement.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      cameraDistance = Math.max(3.0, Math.min(9.0, cameraDistance + e.deltaY * 0.004));
      needsOneWorldRender = true;
    },
    { passive: false }
  );

  let dragging = false;
  let lastX = 0;
  let downX = 0;
  let downY = 0;
  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();

  renderer.domElement.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    downX = e.clientX;
    downY = e.clientY;
    audio.init();
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    cameraYaw -= dx * 0.0045;
  });
  window.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    // Tap / Click picking on pointerup only (zero per-frame ReadPixels / zero GPU stall)
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (
      moved < 6 &&
      e.target === renderer.domElement &&
      worldManager &&
      camera &&
      !isAnyModalOpen() &&
      !endingCleanupActive
    ) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNDC, camera);
      const hits = raycaster.intersectObjects(worldManager.nodeGroups, true);
      if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj && !obj.userData?.node) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.node) {
          teleportToNode(obj.userData.node, true);
        }
      }
    }
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
      const dx = Math.max(-34, Math.min(34, e.clientX - cx));
      const dy = Math.max(-34, Math.min(34, e.clientY - cy));
      joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
      joyDelta.x = dx / 34;
      joyDelta.y = dy / 34;
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

  bindClick('btn-mobile-hud-drawer', () => {
    const topbar = document.getElementById('hud-topbar');
    const btn = document.getElementById('btn-mobile-hud-drawer');
    if (!topbar || !btn) return;
    const isOpen = topbar.classList.toggle('mobile-drawer-open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.textContent = isOpen ? '▴ Less' : '▾ More';
  });

  bindClick('btn-nav-zone-start', () => openTitleModal());
  bindClick('btn-ending-return-title', () => openTitleModal());
  bindClick('btn-nav-inventory', () => openInventoryModal());
  bindClick('btn-nav-relics', () => openRelicModal('aquamarine-tuning-stone'));
  bindClick('btn-nav-gatehouse', () => openGatehouseModal());
  bindClick('btn-nav-help', () => openGuideModal());

  bindClick('btn-dismiss-hint', () => {
    state.hintDismissed = true;
    saveState();
  });

  bindClick('btn-toggle-story', () => {
    const drawer = document.getElementById('stage-drawer');
    if (drawer) drawer.classList.toggle('hidden');
  });
  bindClick('btn-close-story', () => {
    const drawer = document.getElementById('stage-drawer');
    if (drawer) drawer.classList.add('hidden');
  });

  bindClick('btn-eco-toggle', () => {
    state.settings.ecoMode = !state.settings.ecoMode;
    if (renderer) renderer.setPixelRatio(getEffectivePixelRatio());
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

  bindClick('btn-tts-toggle', () => {
    state.settings.readAloudScroll = !state.settings.readAloudScroll;
    if (!state.settings.readAloudScroll) {
      stopKjvSpeech();
    }
    saveState();
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
    const confirmBox = document.getElementById('gatehouse-reset-confirm');
    if (confirmBox) confirmBox.classList.remove('hidden');
  });

  bindClick('btn-gatehouse-reset-yes', () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setEndingCleanupMode(false);
    state = createDefaultState();
    saveState();
    loadStage(0);
    openTitleModal();
  });

  bindClick('btn-gatehouse-reset-no', () => {
    const confirmBox = document.getElementById('gatehouse-reset-confirm');
    if (confirmBox) confirmBox.classList.add('hidden');
  });
}

let lastTime = performance.now();
let fpsFrames = 0;
let fpsWindowStart = performance.now();
let currentFps = 60;
let renderPausedByModal = false;

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;
  const elapsed = now / 1000;

  fpsFrames += 1;
  if (now - fpsWindowStart >= 500) {
    currentFps = Math.round((fpsFrames * 1000) / (now - fpsWindowStart));
    fpsFrames = 0;
    fpsWindowStart = now;
  }

  // Handle Sea of Glass Finale Payoff moment (under 10s, skippable)
  if (finalePayoffState.active) {
    renderPausedByModal = false;
    const progress = (now - finalePayoffState.startTime) / finalePayoffState.durationMs;
    if (worldManager && camera) {
      worldManager.updateFinaleMoment(progress, elapsed, null, camera, state.settings.ecoMode);
    }
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
    if (progress >= 1.0) {
      finishSeaOfGlassPayoff();
    }
    return;
  }

  // Pause 3D rendering while any modal is open (after 1 initial background frame)
  const modalOpen = isAnyModalOpen();
  if (modalOpen && !needsOneWorldRender) {
    renderPausedByModal = true;
    return;
  }
  renderPausedByModal = false;
  needsOneWorldRender = false;

  let moveForward = 0;
  let moveRight = 0;
  if (!modalOpen) {
    if (keys.KeyW || keys.ArrowUp) moveForward += 1;
    if (keys.KeyS || keys.ArrowDown) moveForward -= 1;
    if (keys.KeyD || keys.ArrowRight) moveRight += 1;
    if (keys.KeyA || keys.ArrowLeft) moveRight -= 1;
    moveForward -= joyDelta.y;
    moveRight += joyDelta.x;
  }

  if (moveForward !== 0 || moveRight !== 0) {
    const speed = 6.2 * dt;
    const sin = Math.sin(cameraYaw);
    const cos = Math.cos(cameraYaw);
    playerPos.x += (moveRight * cos - moveForward * sin) * speed;
    playerPos.z += (-moveForward * cos - moveRight * sin) * speed;
    playerPos.x = Math.max(-5.2, Math.min(5.2, playerPos.x));
    playerPos.z = Math.max(-27.5, Math.min(14.5, playerPos.z));
  }

  if (camera) {
    const clampedDist = Math.max(3.0, Math.min(9.0, cameraDistance));
    const desiredCamPos = new THREE.Vector3(
      playerPos.x + Math.sin(cameraYaw) * clampedDist,
      2.2 + (clampedDist - 3.0) * 0.16,
      playerPos.z + Math.cos(cameraYaw) * clampedDist
    );
    const safeCamPos = worldManager
      ? worldManager.resolveCameraPosition(playerPos, desiredCamPos)
      : desiredCamPos;
    camera.position.copy(safeCamPos);
    camera.lookAt(
      playerPos.x - Math.sin(cameraYaw) * 4,
      1.35,
      playerPos.z - Math.cos(cameraYaw) * 4
    );
  }

  if (worldManager) {
    worldManager.update(dt, elapsed, playerPos, camera);
    refreshProximityInteract(false);
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  preloadAllZone1Art();
  initThreeWorld();
  bindUIButtons();
  loadStage(state.currentStageIdx);
  updateHUD();
  openTitleModal();
  requestAnimationFrame(animate);
});

window.narrowWayApp = {
  getState: () => state,
  getWorldManager: () => worldManager,
  getPlayerPos: () => playerPos,
  getCamera: () => camera,
  getRenderer: () => renderer,
  isEndingCleanupActive: () => endingCleanupActive,
  getInteractCooldownRemainingMs: () => Math.max(0, Math.round(interactCooldownUntil - performance.now())),
  getCurrentInteractNode: () => currentInteractNode,
  getPerformanceMetrics: () => ({
    fps: currentFps,
    pixelRatio: renderer ? renderer.getPixelRatio() : 1,
    renderPausedByModal,
    pointLightsInStage: scene
      ? (() => {
          let c = 0;
          scene.traverse((o) => {
            if (o.isPointLight) c += 1;
          });
          return c;
        })()
      : 0
  }),
  setCameraDistance: (d) => {
    cameraDistance = Math.max(3.0, Math.min(9.0, Number(d) || 4.6));
    needsOneWorldRender = true;
    return cameraDistance;
  },
  getCameraDistance: () => cameraDistance,
  getRequiredStandsForStage,
  getUnclearedStandsForStage,
  isStageCleared,
  isStageUnlocked,
  getHighestUnlockedStageIdx,
  areAllRequiredStandsCleared,
  getStageCompletionRatio,
  checkAndPreloadNextStage,
  isStageArtPreloaded,
  preloadStageArt,
  formatTreasureChoiceStatText,
  getDetailedInteractLabel,
  getSafeNodeSpawn,
  getDefinedStageSpawn,
  teleportToNode,
  refreshProximityInteract,
  setEndingCleanupMode,
  speakKjvScroll,
  stopKjvSpeech,
  STAGE_ART_MAP,
  PORTRAIT_ART_MAP,
  STAND_ART_MAP,
  WELL_ART_MAP,
  TREASURE_ART_MAP,
  WISDOM_ART_MAP,
  ENDING_ART_MAP,
  ART_FOCAL_POINT_MAP,
  getArtFocalPoint,
  loadArtIntoImage,
  loadStage,
  openTitleModal,
  openWelcomeModal,
  openGuideModal,
  openStageCompleteModal,
  openStandModal,
  openTreasureModal,
  openWellModal,
  openBreadPickupModal,
  openWisdomModal,
  openRelicModal,
  triggerEndingSequence,
  finishSeaOfGlassPayoff,
  openFinaleModal,
  openGatehouseModal,
  generateNW1Code,
  restoreFromNW1Code,
  closeAllModals
};
