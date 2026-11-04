// ============================================================================
// THE NARROW WAY — Zone 1 Web Audio Controller (Kinnor Chords & Seoul Rain)
// Synthesizes gentle Web Audio harmonic kinnor/harp
// chords (including Elias & David's 4-note unfinished melody from Sec. 18, 77,
// 129, 282) and soft rain/crystal ambience with Master & Music volume controls.
// ============================================================================

export class NarrowWayAudio {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.muted = false;
    this.masterVolume = 0.85;
    this.musicVolume = 0.75;
    this.masterGain = null;
    this.rainGain = null;
    this.musicTimer = null;
    this.currentTheme = 'seoul_corridor';

    const unlock = () => this.init();
    window.addEventListener('pointerdown', unlock, { passive: true, once: true });
    window.addEventListener('keydown', unlock, { passive: true, once: true });
  }

  init() {
    if (this.initialized) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.getEffectiveMaster();
      this.masterGain.connect(this.ctx.destination);

      // Gentle rain / wind ambient bed
      const bufLen = this.ctx.sampleRate * 3;
      const noiseBuf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufLen; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.03 * white) / 1.03;
        data[i] = last * 0.09;
      }
      const src = this.ctx.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 420;
      filter.Q.value = 1.4;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.value = 0.08 * this.musicVolume;

      src.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);
      src.start(0);

      this.initialized = true;
      this.startFourNoteLoop();
    } catch (_) {}
  }

  getEffectiveMaster() {
    return this.muted ? 0.0 : this.masterVolume * 0.28;
  }

  setVolumes({ master, music, muted } = {}) {
    if (typeof master === 'number') this.masterVolume = Math.max(0, Math.min(1, master));
    if (typeof music === 'number') this.musicVolume = Math.max(0, Math.min(1, music));
    if (typeof muted === 'boolean') this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.getEffectiveMaster(), this.ctx.currentTime, 0.05);
    }
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setTargetAtTime(0.08 * this.musicVolume, this.ctx.currentTime, 0.05);
    }
  }

  setStageTheme(theme) {
    this.currentTheme = theme || 'seoul_corridor';
  }

  // Pluck a single warm cypress kinnor / acoustic note
  pluckNote(freq, duration = 2.2, gainScale = 0.16) {
    if (!this.initialized || this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      sub.type = 'sine';
      sub.frequency.setValueAtTime(freq * 0.5, now);

      const peak = Math.max(0.001, gainScale * this.musicVolume);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      sub.start(now);
      osc.stop(now + duration + 0.05);
      sub.stop(now + duration + 0.05);
    } catch (_) {}
  }

  // Play the 4 unpolished notes from the cassette-player slip (Sec. 18, 77, 129, 282)
  // F#4 (369.99 Hz) -> A4 (440.00 Hz) -> E4 (329.63 Hz) -> D4 (293.66 Hz)
  playFourUnfinishedNotes() {
    this.init();
    const notes = [369.99, 440.0, 329.63, 293.66];
    notes.forEach((f, idx) => {
      setTimeout(() => this.pluckNote(f, 2.4, 0.22), idx * 520);
    });
  }

  playTreasureChime() {
    this.init();
    const chord = [293.66, 369.99, 440.0, 587.33]; // D major warm chord
    chord.forEach((f, idx) => {
      setTimeout(() => this.pluckNote(f, 2.6, 0.2), idx * 140);
    });
  }

  playWellChime() {
    this.init();
    const chord = [261.63, 329.63, 392.0, 523.25];
    chord.forEach((f, idx) => {
      setTimeout(() => this.pluckNote(f, 2.8, 0.18), idx * 160);
    });
  }

  playDiceRollSound() {
    this.init();
    this.pluckNote(329.63, 0.45, 0.12);
    setTimeout(() => this.pluckNote(392.0, 0.55, 0.14), 110);
  }

  startFourNoteLoop() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    const motif = [293.66, 369.99, 440.0, 329.63, 246.94, 293.66];
    let step = 0;
    this.musicTimer = setInterval(() => {
      if (!this.initialized || this.muted || document.hidden || this.musicVolume <= 0.01) return;
      const f = motif[step % motif.length];
      this.pluckNote(f, 3.2, 0.08);
      step++;
    }, 3400);
  }

  playKinnorChord() {
    this.playFourUnfinishedNotes();
  }

  playChime(type = 'step') {
    if (type === 'treasure') {
      this.playTreasureChime();
    } else if (type === 'stand_win' || type === 'grace') {
      this.playWellChime();
    } else {
      this.playDiceRollSound();
    }
  }

  toggleMute() {
    this.setVolumes({ muted: !this.muted });
    return this.muted;
  }
}

export const audio = new NarrowWayAudio();
