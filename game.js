/* =================================================================
   THAI BLESSING COOKING CHALLENGE — game.js
   Vanilla JS, mobile-first.
   Sections:
     1. Mascot SVG (4 expressions)
     2. State + screen router
     3. Home screen (live counter, start)
     4. Game loop (30s, queue of micro-tasks)
        - Task A: Swipe to cut chili
        - Task B: Tap correct ingredient
        - Task C: Drag to stir
        - Task D: Tap timing to plate
     5. Result screen (rank, percentile, confetti)
     6. Lead capture (validates name + WhatsApp)
     7. Share screen (Web Share API + clipboard)
   ================================================================= */

(() => {
'use strict';

/* =====================================================
   1. MASCOT — Mama Thai Blessing
   Single SVG body, swap face by expression.
   ===================================================== */
const MASCOT_FACES = {
  happy: `
    <!-- happy: smile + sparkle eyes -->
    <ellipse cx="38" cy="58" rx="3.5" ry="4" fill="#1a1a1a"/>
    <ellipse cx="62" cy="58" rx="3.5" ry="4" fill="#1a1a1a"/>
    <circle cx="36.5" cy="56.5" r="1" fill="#fff"/>
    <circle cx="60.5" cy="56.5" r="1" fill="#fff"/>
    <path d="M40 70 Q50 78 60 70" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="65" r="3" fill="#ff8a8a" opacity=".7"/>
    <circle cx="70" cy="65" r="3" fill="#ff8a8a" opacity=".7"/>`,

  shocked: `
    <!-- shocked: O mouth + wide eyes -->
    <circle cx="38" cy="58" r="5" fill="#fff" stroke="#1a1a1a" stroke-width="1.5"/>
    <circle cx="62" cy="58" r="5" fill="#fff" stroke="#1a1a1a" stroke-width="1.5"/>
    <circle cx="38" cy="58" r="2.5" fill="#1a1a1a"/>
    <circle cx="62" cy="58" r="2.5" fill="#1a1a1a"/>
    <ellipse cx="50" cy="73" rx="4" ry="6" fill="#1a1a1a"/>`,

  angry: `
    <!-- angry but funny: angled brows + frown -->
    <path d="M32 52 L44 56" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
    <path d="M68 52 L56 56" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="38" cy="60" rx="3" ry="3.5" fill="#1a1a1a"/>
    <ellipse cx="62" cy="60" rx="3" ry="3.5" fill="#1a1a1a"/>
    <path d="M40 75 Q50 68 60 75" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="28" cy="62" r="3" fill="#ff5555" opacity=".8"/>
    <circle cx="72" cy="62" r="3" fill="#ff5555" opacity=".8"/>`,

  proud: `
    <!-- proud: closed-eye smile + sparkles -->
    <path d="M33 58 Q38 53 43 58" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M57 58 Q62 53 67 58" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M38 70 Q50 80 62 70" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="65" r="3" fill="#ff8a8a" opacity=".7"/>
    <circle cx="70" cy="65" r="3" fill="#ff8a8a" opacity=".7"/>
    <text x="20" y="35" font-size="14">✨</text>
    <text x="72" y="35" font-size="14">✨</text>`,
};

/** Render mascot SVG with given expression. */
function mascotSVG(expression = 'happy') {
  return `
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <!-- headband -->
      <path d="M22 42 Q50 30 78 42 L78 50 Q50 42 22 50 Z" fill="#E53935"/>
      <circle cx="32" cy="40" r="3" fill="#FFD600"/>
      <circle cx="50" cy="36" r="3" fill="#FFD600"/>
      <circle cx="68" cy="40" r="3" fill="#FFD600"/>
      <!-- hair tuft -->
      <path d="M40 36 Q50 22 60 36" fill="#1a1a1a"/>
      <!-- face -->
      <ellipse cx="50" cy="62" rx="28" ry="30" fill="#ffd9b3"/>
      ${MASCOT_FACES[expression] || MASCOT_FACES.happy}
      <!-- body / apron -->
      <path d="M22 92 Q50 88 78 92 L82 118 L18 118 Z" fill="#fff"/>
      <path d="M30 92 L30 118 M70 92 L70 118" stroke="#E53935" stroke-width="2"/>
      <text x="38" y="110" font-size="11" fill="#E53935" font-weight="bold">CHEF</text>
      <!-- apron strap -->
      <path d="M40 92 L48 86 L52 86 L60 92" stroke="#E53935" stroke-width="2.5" fill="none"/>
    </svg>`;
}

/** Set mascot expression for a given mount element. */
function setMascot(el, expression) {
  if (!el) return;
  el.innerHTML = mascotSVG(expression);
}

/* =====================================================
   2. STATE + ROUTER
   ===================================================== */
const $ = (sel) => document.querySelector(sel);

const state = {
  score: 0,
  timeLeft: 30,
  percentile: 0,
  taskCount: 0,
  perfectCount: 0,
};

const SCREENS = ['home', 'game', 'result', 'share'];
function showScreen(name) {
  SCREENS.forEach((s) => {
    const el = document.getElementById(`screen-${s}`);
    if (el) el.classList.toggle('active', s === name);
  });
}

/* =====================================================
   3. HOME SCREEN
   ===================================================== */
function initHome() {
  setMascot($('#home-mascot'), 'happy');

  // Fake live counter that drifts up/down for social proof
  const counterEl = $('#live-count');
  let n = 1200 + Math.floor(Math.random() * 200);
  counterEl.textContent = n.toLocaleString();
  setInterval(() => {
    n += Math.floor(Math.random() * 7) - 2;
    if (n < 800) n = 800;
    counterEl.textContent = n.toLocaleString();
  }, 1500);

  $('#btn-start').addEventListener('click', () => {
    haptic();
    startGame();
  });
}

/* =====================================================
   4. GAME LOOP
   ===================================================== */
const TASK_DURATION = 4000;       // ms each task max
const GAME_DURATION = 30;         // seconds total
let gameTimerId = null;
let taskTimeoutId = null;
let currentCleanup = null;

function startGame() {
  state.score = 0;
  state.timeLeft = GAME_DURATION;
  state.taskCount = 0;
  state.perfectCount = 0;

  $('#hud-score').textContent = '0';
  $('#hud-timer').textContent = GAME_DURATION;
  $('#hud-timer').classList.remove('danger');
  $('#timer-fill').style.width = '100%';

  showScreen('game');
  setMascot($('#game-mascot'), 'happy');
  nextTask();

  const startedAt = Date.now();
  gameTimerId = setInterval(() => {
    const elapsed = (Date.now() - startedAt) / 1000;
    const left = Math.max(0, GAME_DURATION - elapsed);
    state.timeLeft = left;
    $('#hud-timer').textContent = Math.ceil(left);
    $('#timer-fill').style.width = `${(left / GAME_DURATION) * 100}%`;
    if (left <= 5) $('#hud-timer').classList.add('danger');
    if (left <= 0) endGame();
  }, 100);
}

function endGame() {
  clearInterval(gameTimerId);
  clearTimeout(taskTimeoutId);
  if (currentCleanup) currentCleanup();
  showResult();
}

/** Pick a random task and run it. */
function nextTask() {
  if (state.timeLeft <= 0) return;
  const tasks = [taskCutChili, taskTapIngredient, taskStir, taskTiming];
  const task = tasks[Math.floor(Math.random() * tasks.length)];
  state.taskCount++;
  task();
}

/** End-of-task helper: scores, feedback, and chains the next task. */
function finishTask(result) {
  // result: 'perfect' | 'good' | 'wrong'
  const points = result === 'perfect' ? 50 : result === 'good' ? 25 : 0;
  state.score += points;
  if (result === 'perfect') state.perfectCount++;
  $('#hud-score').textContent = state.score;
  showFeedback(result);
  setMascot(
    $('#game-mascot'),
    result === 'perfect' ? 'proud' : result === 'good' ? 'happy' : 'shocked'
  );
  haptic(result === 'wrong' ? 30 : 10);

  clearTimeout(taskTimeoutId);
  taskTimeoutId = setTimeout(() => {
    if (state.timeLeft > 0) nextTask();
  }, 600);
}

function showFeedback(kind) {
  const el = $('#fb-toast');
  el.className = 'fb-toast';
  void el.offsetWidth; // restart anim
  el.textContent = kind === 'perfect' ? 'PERFECT!' : kind === 'good' ? 'GOOD!' : 'OOPS!';
  el.classList.add('show', `fb-${kind}`);
}

function clearStage() {
  const stage = $('#game-stage');
  stage.innerHTML = '';
  return stage;
}

/* ----- TASK A: Swipe to cut chili ----- */
function taskCutChili() {
  $('#task-prompt').textContent = '✂️ Swipe to cut!';
  const stage = clearStage();
  stage.insertAdjacentHTML('beforeend', `
    <div class="cut-line"></div>
    <div class="chili-target">🌶️</div>
    <div class="cut-flash"></div>
  `);
  const target = stage.querySelector('.chili-target');
  const flash = stage.querySelector('.cut-flash');

  let startX = null, startY = null, startT = 0, done = false;
  const onDown = (e) => {
    const p = pointer(e);
    startX = p.x; startY = p.y; startT = Date.now();
  };
  const onUp = (e) => {
    if (done || startX == null) return;
    const p = pointer(e);
    const dx = p.x - startX;
    const dy = p.y - startY;
    const dist = Math.hypot(dx, dy);
    const dt = Date.now() - startT;
    const speed = dist / Math.max(dt, 1); // px/ms
    if (dist > 80 && Math.abs(dx) > Math.abs(dy)) {
      done = true;
      target.classList.add('cut');
      flash.classList.add('fire');
      const result = speed > 0.7 ? 'perfect' : 'good';
      finishTask(result);
      cleanup();
    }
  };

  stage.addEventListener('pointerdown', onDown);
  stage.addEventListener('pointerup', onUp);
  stage.addEventListener('pointercancel', onUp);

  function cleanup() {
    stage.removeEventListener('pointerdown', onDown);
    stage.removeEventListener('pointerup', onUp);
    stage.removeEventListener('pointercancel', onUp);
  }
  currentCleanup = () => { if (!done) { done = true; cleanup(); } };

  taskTimeoutId = setTimeout(() => {
    if (done) return;
    done = true;
    cleanup();
    finishTask('wrong');
  }, TASK_DURATION);
}

/* ----- TASK B: Tap correct ingredient ----- */
const INGREDIENTS = [
  { e: '🌶️', n: 'Chili' },
  { e: '🍋', n: 'Lime' },
  { e: '🥬', n: 'Basil' },
  { e: '🍤', n: 'Shrimp' },
  { e: '🥥', n: 'Coconut' },
  { e: '🧄', n: 'Garlic' },
  { e: '🍅', n: 'Tomato' },
  { e: '🥒', n: 'Cucumber' },
  { e: '🥚', n: 'Egg' },
];
function taskTapIngredient() {
  const pool = shuffled(INGREDIENTS).slice(0, 6);
  const target = pool[Math.floor(Math.random() * pool.length)];
  $('#task-prompt').textContent = `🎯 Tap the ${target.n}!`;

  const stage = clearStage();
  const grid = document.createElement('div');
  grid.className = 'ing-grid';
  pool.forEach((ing) => {
    const cell = document.createElement('button');
    cell.className = 'ing-item';
    cell.textContent = ing.e;
    cell.addEventListener('click', () => {
      if (done) return;
      done = true;
      if (ing.n === target.n) {
        cell.classList.add('correct');
        const dt = Date.now() - startT;
        finishTask(dt < 1200 ? 'perfect' : 'good');
      } else {
        cell.classList.add('wrong');
        finishTask('wrong');
      }
    });
    grid.appendChild(cell);
  });
  stage.appendChild(grid);

  let done = false;
  const startT = Date.now();
  currentCleanup = () => { done = true; };
  taskTimeoutId = setTimeout(() => {
    if (done) return;
    done = true;
    finishTask('wrong');
  }, TASK_DURATION);
}

/* ----- TASK C: Drag to stir ----- */
function taskStir() {
  $('#task-prompt').textContent = '🥄 Drag in circles to stir!';
  const stage = clearStage();
  stage.insertAdjacentHTML('beforeend', `
    <div class="stir-pot">
      <div class="stir-spoon"></div>
      <div class="stir-progress"><div class="stir-progress-fill"></div></div>
    </div>
  `);
  const pot = stage.querySelector('.stir-pot');
  const spoon = stage.querySelector('.stir-spoon');
  const fill = stage.querySelector('.stir-progress-fill');

  let lastAngle = null;
  let totalRotation = 0;
  const required = Math.PI * 4; // 2 full rotations
  let done = false;
  let active = false;
  const startT = Date.now();

  const center = () => {
    const r = pot.getBoundingClientRect();
    return { x: r.left + r.width/2, y: r.top + r.height/2 };
  };
  const angleAt = (e) => {
    const c = center();
    const p = pointer(e);
    return Math.atan2(p.y - c.y, p.x - c.x);
  };

  const onDown = (e) => {
    active = true;
    lastAngle = angleAt(e);
  };
  const onMove = (e) => {
    if (!active || done) return;
    const a = angleAt(e);
    let d = a - lastAngle;
    if (d > Math.PI) d -= 2*Math.PI;
    if (d < -Math.PI) d += 2*Math.PI;
    totalRotation += Math.abs(d);
    lastAngle = a;
    spoon.style.transform = `rotate(${a + Math.PI/2}rad)`;
    const ratio = Math.min(1, totalRotation / required);
    fill.style.width = `${ratio * 100}%`;
    if (ratio >= 1 && !done) {
      done = true;
      cleanup();
      const elapsed = Date.now() - startT;
      finishTask(elapsed < 2500 ? 'perfect' : 'good');
    }
  };
  const onUp = () => { active = false; };

  pot.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);

  function cleanup() {
    pot.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
  }
  currentCleanup = () => { if (!done) { done = true; cleanup(); } };
  taskTimeoutId = setTimeout(() => {
    if (done) return;
    done = true;
    cleanup();
    finishTask(totalRotation > required * 0.5 ? 'good' : 'wrong');
  }, TASK_DURATION + 1500);
}

/* ----- TASK D: Tap timing to plate ----- */
function taskTiming() {
  $('#task-prompt').textContent = '🍽️ Tap when in the YELLOW zone!';
  const stage = clearStage();
  stage.insertAdjacentHTML('beforeend', `
    <div style="display:flex;flex-direction:column;align-items:center;width:100%">
      <div class="timing-bar">
        <div class="timing-zone"></div>
        <div class="timing-zone-perfect"></div>
        <div class="timing-marker" id="timing-marker"></div>
      </div>
      <button class="timing-tap-btn" id="timing-tap">TAP!</button>
    </div>
  `);
  const marker = stage.querySelector('#timing-marker');
  const btn = stage.querySelector('#timing-tap');

  let pos = 0;
  let dir = 1;
  let done = false;
  let rafId = null;

  const tick = () => {
    if (done) return;
    pos += dir * 1.6; // % per frame
    if (pos > 100) { pos = 100; dir = -1; }
    if (pos < 0)   { pos = 0;   dir = 1; }
    marker.style.left = `calc(${pos}% - 3px)`;
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  btn.addEventListener('click', () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(rafId);
    if (pos >= 46 && pos <= 54)       finishTask('perfect');
    else if (pos >= 36 && pos <= 64)  finishTask('good');
    else                              finishTask('wrong');
  });

  currentCleanup = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(rafId);
  };
  taskTimeoutId = setTimeout(() => {
    if (done) return;
    done = true;
    cancelAnimationFrame(rafId);
    finishTask('wrong');
  }, TASK_DURATION + 1000);
}

/* =====================================================
   5. RESULT SCREEN
   ===================================================== */
function showResult() {
  // Score is up to ~taskCount*50. Normalize to 0-100 percentile-ish.
  // Plus a small random kick so two players with the same score see slight variance.
  const maxLikely = Math.max(state.taskCount, 6) * 50;
  const ratio = Math.min(1, state.score / maxLikely);
  const noise = Math.random() * 6 - 3;
  let pct = Math.round(ratio * 95 + noise);
  // Clamp so even bad players see >5 (keeps the share text fun)
  pct = Math.max(5, Math.min(98, pct));
  state.percentile = pct;

  const rank = pickRank(pct);
  $('#rank-title').textContent = rank.title;
  $('#rank-emoji').textContent = rank.emoji;
  $('#result-score').textContent = state.score;
  $('#percentile-num').textContent = pct;
  setMascot($('#result-mascot'), rank.mascot);

  showScreen('result');
  if (pct >= 70) burstConfetti();
}

function pickRank(pct) {
  if (pct >= 90) return { title: 'Master Chef',         emoji: '👑', mascot: 'proud' };
  if (pct >= 70) return { title: 'Pro Cook',            emoji: '🔥', mascot: 'happy' };
  if (pct >= 50) return { title: 'Beginner',            emoji: '🍳', mascot: 'happy' };
  return            { title: 'Mama Disappointed 😅',    emoji: '😤', mascot: 'angry' };
}

function burstConfetti() {
  const stage = $('#screen-result');
  const colors = ['#E53935', '#FFD600', '#00C853', '#fff'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = `${Math.random() * 100}%`;
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = `${1.5 + Math.random() * 2}s`;
    c.style.animationDelay = `${Math.random() * .5}s`;
    c.style.transform = `rotate(${Math.random()*360}deg)`;
    stage.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

function initResult() {
  $('#btn-claim').addEventListener('click', () => { haptic(); openLead(); });
  $('#btn-replay').addEventListener('click', () => { haptic(); startGame(); });
}

/* =====================================================
   6. LEAD CAPTURE
   ===================================================== */
function openLead()  { $('#lead-overlay').classList.add('show'); }
function closeLead() { $('#lead-overlay').classList.remove('show'); }

function initLead() {
  $('#lead-close').addEventListener('click', closeLead);
  $('#lead-overlay').addEventListener('click', (e) => {
    if (e.target === $('#lead-overlay')) closeLead();
  });

  $('#lead-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = $('#lead-name').value.trim();
    const phone = $('#lead-phone').value.trim();
    let valid = true;

    if (name.length < 2) { flagInvalid($('#lead-name')); valid = false; }
    // strip spaces/dashes for the digit check; keep optional leading +
    const digits = phone.replace(/[\s\-]/g, '');
    if (!/^\+?\d{7,15}$/.test(digits)) { flagInvalid($('#lead-phone')); valid = false; }

    if (!valid) return;

    // Persist locally so the merchant can collect from analytics later.
    // Replace with a real POST to your CRM/WhatsApp API when wiring backend.
    try {
      const leads = JSON.parse(localStorage.getItem('tbc_leads') || '[]');
      leads.push({
        name, phone,
        score: state.score,
        percentile: state.percentile,
        ts: new Date().toISOString(),
      });
      localStorage.setItem('tbc_leads', JSON.stringify(leads));
    } catch (_) {}

    haptic(20);
    closeLead();
    showShare();
  });
}

function flagInvalid(input) {
  input.classList.add('invalid');
  input.addEventListener('input', () => input.classList.remove('invalid'), { once: true });
}

/* =====================================================
   7. SHARE SCREEN
   ===================================================== */
function showShare() {
  $('#share-pct').textContent = state.percentile;
  setMascot($('#share-mascot'), 'proud');
  showScreen('share');
}

function initShare() {
  $('#btn-share').addEventListener('click', async () => {
    haptic();
    const text = `🔥 I beat ${state.percentile}% of players in the Thai Blessing Cooking Challenge! Can you beat me?`;
    const url = location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'Thai Blessing Challenge', text, url }); } catch (_) {}
    } else {
      copyToClipboard(`${text}\n${url}`);
      flashBtn($('#btn-share'), 'COPIED!');
    }
  });

  $('#btn-copy').addEventListener('click', () => {
    haptic();
    const text = `🔥 I beat ${state.percentile}% of players! ${location.href}`;
    copyToClipboard(text);
    flashBtn($('#btn-copy'), '✅ Copied!');
  });

  $('#btn-restart').addEventListener('click', () => {
    haptic();
    showScreen('home');
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  else fallbackCopy(text);
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (_) {}
  ta.remove();
}
function flashBtn(btn, label) {
  const old = btn.textContent;
  btn.textContent = label;
  setTimeout(() => { btn.textContent = old; }, 1400);
}

/* =====================================================
   UTIL
   ===================================================== */
function pointer(e) {
  if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.changedTouches && e.changedTouches[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function haptic(ms = 8) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

/* =====================================================
   BOOT
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initHome();
  initResult();
  initLead();
  initShare();
});

})();
