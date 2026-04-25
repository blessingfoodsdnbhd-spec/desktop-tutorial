/* =========================================================
   Sound — Web Audio synthesis (no external files, no libs)
   ========================================================= */

const Sound = {
  ctx: null,
  master: null,
  musicGain: null,
  sfxGain: null,
  musicOn: true,
  sfxOn: true,
  musicTimer: null,
  loopIndex: 0,

  init() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master   = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain   = this.ctx.createGain();
    this.master.gain.value    = 0.7;
    this.musicGain.gain.value = 0.18;
    this.sfxGain.gain.value   = 0.4;
    this.musicGain.connect(this.master);
    this.sfxGain.connect(this.master);
    this.master.connect(this.ctx.destination);
  },

  resume() {
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  },

  setMuted(muted) {
    this.musicOn = !muted;
    this.sfxOn   = !muted;
    if (muted) this.stopMusic();
    else if (this.ctx) this.startMusic();
    try { localStorage.setItem("tbf_muted", muted ? "1" : "0"); } catch (e) {}
  },

  loadPref() {
    try { return localStorage.getItem("tbf_muted") === "1"; } catch (e) { return false; }
  },

  // ---- One-shot tone helper ----
  tone(freq, dur, type = "sine", vol = 0.4, attack = 0.005, dest = null) {
    if (!this.ctx || !this.sfxOn) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(dest || this.sfxGain);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  },

  // ---- SFX ----
  chop() {
    if (!this.ctx || !this.sfxOn) return;
    // Short noise burst + low thump
    const t = this.ctx.currentTime;
    const buf = this.ctx.createBuffer(1, 882, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    src.connect(g).connect(this.sfxGain);
    src.start(t);
    this.tone(110, 0.06, "square", 0.25);
  },

  tap() {
    this.tone(880, 0.05, "sine", 0.18);
  },

  good() {
    this.tone(660, 0.08, "triangle", 0.25);
    setTimeout(() => this.tone(990, 0.12, "triangle", 0.28), 70);
  },

  bad() {
    if (!this.ctx || !this.sfxOn) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.25);
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(g).connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.3);
  },

  ding() {
    this.tone(1320, 0.15, "sine", 0.3);
    setTimeout(() => this.tone(1760, 0.2, "sine", 0.25), 60);
  },

  win() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      setTimeout(() => this.tone(f, 0.22, "triangle", 0.32), i * 110);
    });
  },

  // ---- Background music (looping pentatonic arpeggio + bass) ----
  // A pentatonic pattern in C: C D E G A
  pattern: [
    // {freq, beat, dur}
    { f: 261.63, b: 0,   d: 0.45 }, // C4
    { f: 392.00, b: 0.5, d: 0.45 }, // G4
    { f: 329.63, b: 1,   d: 0.45 }, // E4
    { f: 392.00, b: 1.5, d: 0.45 }, // G4
    { f: 440.00, b: 2,   d: 0.45 }, // A4
    { f: 392.00, b: 2.5, d: 0.45 }, // G4
    { f: 329.63, b: 3,   d: 0.45 }, // E4
    { f: 293.66, b: 3.5, d: 0.45 }, // D4
  ],
  bassPattern: [
    { f: 130.81, b: 0, d: 1.8 }, // C3
    { f: 196.00, b: 2, d: 1.8 }, // G3
  ],
  beatSec: 0.42,

  startMusic() {
    if (!this.ctx || !this.musicOn || this.musicTimer) return;
    const loopLen = 4 * this.beatSec; // 4 beats per loop
    const scheduleLoop = () => {
      if (!this.musicOn) return;
      const startT = this.ctx.currentTime + 0.05;
      // Melody
      this.pattern.forEach((n) => {
        const t = startT + n.b * this.beatSec;
        const osc = this.ctx.createOscillator();
        const g   = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.f, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.22, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        osc.connect(g).connect(this.musicGain);
        osc.start(t);
        osc.stop(t + n.d + 0.05);
      });
      // Bass
      this.bassPattern.forEach((n) => {
        const t = startT + n.b * this.beatSec;
        const osc = this.ctx.createOscillator();
        const g   = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(n.f, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.28, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        osc.connect(g).connect(this.musicGain);
        osc.start(t);
        osc.stop(t + n.d + 0.05);
      });
    };
    scheduleLoop();
    this.musicTimer = setInterval(scheduleLoop, loopLen * 1000);
  },

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    // Fade out current music gain briefly to silence tails smoothly
    if (this.musicGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
      this.musicGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      setTimeout(() => {
        if (this.musicGain) this.musicGain.gain.value = 0.18;
      }, 250);
    }
  }
};
