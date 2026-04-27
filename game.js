/* =========================================================
   Chef Mali's Thai Kitchen — original cooking mini-game
   Pure HTML/CSS/JS, no dependencies.
   ========================================================= */

// ---------- i18n ----------
const I18N = {
  en: {
    title: "Chef Mali's Thai Kitchen",
    subtitle: "Cook 4 classic Thai dishes!",
    start: "Start Cooking",
    hint: "Tip: Use mouse / tap. Have fun!",
    pick_dish: "Pick a Dish",
    back: "← Back",
    step: "Step",
    score: "Score",
    final_score: "Final Score",
    play_again: "Play Again",
    other_dish: "Try Another Dish",
    footer: "Made with 🌶️ — an original Thai cooking mini-game",

    // Quotes by stars
    quote_3: "Aroi mak mak! Absolutely delicious! ⭐",
    quote_2: "Not bad — keep practicing!",
    quote_1: "Hmm, a bit messy… try again?",
    quote_0: "Oh no… let's start over!",

    // Step instructions
    instr_chop:    "Click to chop! Hit every piece.",
    instr_tap:     "Tap rapidly to fill the bar!",
    instr_timing:  "Stop the bar in the green zone!",
    instr_drag:    "Drag ingredients onto the plate.",
    instr_pound:   "Pound the paste — tap fast!",
    instr_pour:    "Hold to pour — release in the green zone!",
    instr_stir:    "Stir-fry! Tap rapidly!",
    instr_squeeze: "Squeeze the lime — tap rapidly!",
    instr_slice:   "Slice the mango — click each piece!",
    instr_mix:     "Mix the rice — tap rapidly!",
    instr_plate:   "Plate up! Drag ingredients to the dish.",
    instr_boil:    "Stop when the water is just right!",
    instr_herbs:   "Drop herbs into the pot!",
    instr_basil:   "Add chicken & basil to the curry!",

    perfect: "Perfect!",
    good: "Good!",
    nice: "Nice!",
    miss: "Miss!",
    timeup: "Time's up!",
    need: "Need",
    wrong: "Wrong!"
  },
  zh: {
    title: "瑪莉廚師的泰國廚房",
    subtitle: "來煮 4 道經典泰國菜！",
    start: "開始下廚",
    hint: "提示：用滑鼠或觸控操作，玩得開心！",
    pick_dish: "選一道菜",
    back: "← 返回",
    step: "步驟",
    score: "分數",
    final_score: "最終分數",
    play_again: "再玩一次",
    other_dish: "換一道菜",
    footer: "用 🌶️ 做的 — 原創泰式料理小遊戲",

    quote_3: "阿羅伊馬！超級美味！⭐",
    quote_2: "還不錯～繼續加油！",
    quote_1: "嗯…有點亂，再試一次？",
    quote_0: "唉呀…我們重新來過吧！",

    instr_chop:    "點擊切菜！把每一塊都切了。",
    instr_tap:     "快速點擊填滿進度條！",
    instr_timing:  "在綠色區域停下！",
    instr_drag:    "把食材拖到盤子上。",
    instr_pound:   "搗咖哩醬 — 快速點擊！",
    instr_pour:    "按住倒入 — 在綠色區放開！",
    instr_stir:    "炒一炒！快速點擊！",
    instr_squeeze: "擠檸檬汁 — 快速點擊！",
    instr_slice:   "切芒果 — 點擊每一塊！",
    instr_mix:     "拌飯 — 快速點擊！",
    instr_plate:   "擺盤！把食材拖到菜上。",
    instr_boil:    "在水溫剛好時停下！",
    instr_herbs:   "把香料丟進湯裡！",
    instr_basil:   "加雞肉跟羅勒到咖哩！",

    perfect: "完美！",
    good: "不錯！",
    nice: "可以！",
    miss: "失誤！",
    timeup: "時間到！",
    need: "需要",
    wrong: "錯了！"
  }
};

// ---------- Dish data ----------
// Each step: { type, key (for instruction), ...config }
const DISHES = [
  {
    id: "padthai",
    emoji: "🍜",
    name: { en: "Pad Thai", zh: "泰式炒河粉" },
    desc: { en: "Stir-fried rice noodles", zh: "炒河粉" },
    plateBase: "🍜",
    soupColor: "#f4a261",
    steps: [
      { type: "chop",   key: "chop",  pieces: ["🧅","🧄","🥜","🥬"], duration: 8000 },
      { type: "tap",    key: "stir",  emoji: "🍳", target: 35, duration: 6000 },
      { type: "drag",   key: "plate",
        items:  ["🍤","🥜","🍋","🌶️","🥚"],
        decoys: ["🍌","🍫","🥦"],
        duration: 14000 }
    ]
  },
  {
    id: "tomyum",
    emoji: "🦐",
    name: { en: "Tom Yum Goong", zh: "冬蔭功" },
    desc: { en: "Spicy & sour shrimp soup", zh: "酸辣蝦湯" },
    plateBase: "🍲",
    soupColor: "#d93728",
    steps: [
      { type: "timing", key: "boil",  speed: 1.4, duration: 10000 },
      { type: "drag",   key: "herbs",
        items:  ["🌿","🍋","🌶️","🧄"],
        decoys: ["🍓","🍫","🥑"],
        duration: 12000 },
      { type: "tap",    key: "squeeze", emoji: "🍋", target: 30, duration: 5000 }
    ]
  },
  {
    id: "greencurry",
    emoji: "🍛",
    name: { en: "Green Curry", zh: "綠咖哩" },
    desc: { en: "Coconut curry with chicken", zh: "椰汁雞肉咖哩" },
    plateBase: "🍛",
    soupColor: "#94c47d",
    steps: [
      { type: "tap",    key: "pound", emoji: "🌿", target: 40, duration: 6000 },
      { type: "timing", key: "pour",  speed: 1.0, duration: 9000 },
      { type: "drag",   key: "basil",
        items:  ["🍗","🌿","🍆","🌶️"],
        decoys: ["🍩","🍇","🥨"],
        duration: 12000 }
    ]
  },
  {
    id: "mango",
    emoji: "🥭",
    name: { en: "Mango Sticky Rice", zh: "芒果糯米飯" },
    desc: { en: "Sweet rice & ripe mango", zh: "甜糯米配芒果" },
    plateBase: "🍚",
    soupColor: "#fff3c4",
    steps: [
      { type: "chop", key: "slice", pieces: ["🥭","🥭","🥭","🥭"], duration: 7000 },
      { type: "tap",  key: "mix",   emoji: "🥥", target: 30, duration: 5000 },
      { type: "drag", key: "plate",
        items:  ["🥭","🥥","🍯","🌸"],
        decoys: ["🥩","🌶️","🧅"],
        duration: 12000 }
    ]
  }
];

// ---------- State ----------
const STATE = {
  lang: "en",
  screen: "title",
  dishIndex: 0,
  stepIndex: 0,
  stepScores: [],
  currentScore: 0,
  timerInterval: null,
  cleanup: null,
  stepFinished: false
};

// ---------- Utility ----------
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const t  = (k) => I18N[STATE.lang][k] || k;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const rand  = (lo, hi) => Math.random() * (hi - lo) + lo;
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(name) {
  $$(".screen").forEach((s) => s.classList.remove("active"));
  $(`#screen-${name}`).classList.add("active");
  STATE.screen = name;
}

function applyI18n() {
  $$("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });
  document.documentElement.lang = STATE.lang === "zh" ? "zh-TW" : "en";
}

function flash(msg, x, y, bad = false) {
  const stage = $("#cook-stage");
  if (!stage) return;
  const pop = document.createElement("div");
  pop.className = "score-pop" + (bad ? " bad" : "");
  pop.textContent = msg;
  pop.style.left = x + "px";
  pop.style.top  = y + "px";
  stage.appendChild(pop);
  setTimeout(() => pop.remove(), 800);
}

function setTimerBar(pct) {
  $("#cook-timer-bar").style.width = clamp(pct, 0, 100) + "%";
}

function setScore(n) {
  STATE.currentScore = n;
  $("#cook-score").textContent = n;
}

function clearStage() {
  if (STATE.cleanup) {
    try { STATE.cleanup(); } catch (e) {}
    STATE.cleanup = null;
  }
  if (STATE.timerInterval) {
    clearInterval(STATE.timerInterval);
    STATE.timerInterval = null;
  }
  $("#cook-stage").innerHTML = "";
}

// ---------- Menu rendering ----------
function renderMenu() {
  const grid = $("#dish-grid");
  grid.innerHTML = "";
  DISHES.forEach((dish, i) => {
    const card = document.createElement("div");
    card.className = "dish-card";
    card.innerHTML = `
      <span class="dish-emoji">${dish.emoji}</span>
      <div class="dish-name">${dish.name[STATE.lang]}</div>
      <div class="dish-desc">${dish.desc[STATE.lang]}</div>
    `;
    card.addEventListener("click", () => startDish(i));
    grid.appendChild(card);
  });
}

// ---------- Cook flow ----------
function startDish(index) {
  STATE.dishIndex = index;
  STATE.stepIndex = 0;
  STATE.stepScores = [];
  STATE.currentScore = 0;
  const dish = DISHES[index];
  $("#cook-dish-emoji").textContent = dish.emoji;
  $("#cook-dish-name").textContent  = dish.name[STATE.lang];
  $("#cook-step-total").textContent = dish.steps.length;
  showScreen("cook");
  runStep();
}

function runStep() {
  clearStage();
  const dish = DISHES[STATE.dishIndex];
  const step = dish.steps[STATE.stepIndex];
  STATE.stepFinished = false;
  $("#cook-step-num").textContent = STATE.stepIndex + 1;
  $("#cook-instruction").textContent = t("instr_" + step.key);
  setScore(0);
  setTimerBar(100);

  // Generic timeout countdown
  const start = Date.now();
  STATE.timerInterval = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = 100 - (elapsed / step.duration) * 100;
    setTimerBar(pct);
    if (pct <= 0) {
      clearInterval(STATE.timerInterval);
      STATE.timerInterval = null;
      finishStep(); // time-up auto finish
    }
  }, 80);

  // Launch the relevant mini-game
  switch (step.type) {
    case "chop":   miniChop(step);   break;
    case "tap":    miniTap(step);    break;
    case "timing": miniTiming(step); break;
    case "drag":   miniDrag(step);   break;
  }
}

function finishStep() {
  if (STATE.stepFinished) return;
  STATE.stepFinished = true;
  clearStage();
  STATE.stepScores.push(STATE.currentScore);
  STATE.stepIndex++;
  const dish = DISHES[STATE.dishIndex];
  if (STATE.stepIndex >= dish.steps.length) {
    showResult();
  } else {
    setTimeout(runStep, 400);
  }
}

// ---------- Mini-game: CHOP ----------
function miniChop(step) {
  const stage = $("#cook-stage");

  // Cutting board background
  const board = document.createElement("div");
  board.className = "cutting-board";
  stage.appendChild(board);

  const total = step.pieces.length;
  let hit = 0;

  step.pieces.forEach((emoji, i) => {
    const el = document.createElement("div");
    el.className = "target";
    el.textContent = emoji;
    // Spread positions
    const cols = Math.ceil(Math.sqrt(total));
    const col = i % cols;
    const row = Math.floor(i / cols);
    const xPct = 15 + (col / Math.max(1, cols - 1 || 1)) * 70 + rand(-5, 5);
    const yPct = 20 + (row * 25) + rand(-5, 5);
    el.style.left = xPct + "%";
    el.style.top  = yPct + "%";
    el.addEventListener("click", (e) => {
      if (el.classList.contains("popped")) return;
      el.classList.add("popped");
      hit++;
      const gain = Math.round(100 / total);
      setScore(STATE.currentScore + gain);
      const r = stage.getBoundingClientRect();
      flash("+" + gain, e.clientX - r.left, e.clientY - r.top);
      if (hit >= total) {
        // bonus for finishing fast
        setTimeout(finishStep, 300);
      }
    });
    stage.appendChild(el);
  });

  STATE.cleanup = () => {};
}

// ---------- Mini-game: TAP ----------
function miniTap(step) {
  const stage = $("#cook-stage");
  const wrap = document.createElement("div");
  wrap.className = "tap-zone";
  wrap.innerHTML = `
    <div class="tap-emoji">${step.emoji}</div>
    <div class="tap-fill-wrap"><div class="tap-fill"></div></div>
    <div class="tap-hint">${t("instr_tap")}</div>
  `;
  stage.appendChild(wrap);

  let taps = 0;
  const fill = wrap.querySelector(".tap-fill");
  const tapEmoji = wrap.querySelector(".tap-emoji");

  const onTap = (e) => {
    taps++;
    const pct = clamp((taps / step.target) * 100, 0, 100);
    fill.style.width = pct + "%";
    setScore(Math.round(pct));
    tapEmoji.style.transform = "scale(0.92)";
    setTimeout(() => (tapEmoji.style.transform = "scale(1)"), 60);
    const r = stage.getBoundingClientRect();
    if (e && e.clientX) {
      flash("+1", (e.clientX || 0) - r.left, (e.clientY || 0) - r.top);
    }
    if (taps >= step.target) {
      setTimeout(finishStep, 300);
    }
  };

  wrap.addEventListener("click", onTap);
  // Keyboard support: space
  const onKey = (e) => {
    if (e.code === "Space") { e.preventDefault(); onTap({ clientX: 0, clientY: 0 }); }
  };
  document.addEventListener("keydown", onKey);
  STATE.cleanup = () => document.removeEventListener("keydown", onKey);
}

// ---------- Mini-game: TIMING ----------
function miniTiming(step) {
  const stage = $("#cook-stage");
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="timing-stage-extras">🥘</div>
    <div class="timing-track"><div class="timing-needle"></div></div>
    <button class="big-btn timing-button">STOP!</button>
  `;
  stage.appendChild(wrap);

  const needle = wrap.querySelector(".timing-needle");
  const btn    = wrap.querySelector(".timing-button");
  let pos = 0, dir = 1;
  const speed = step.speed || 1.2;

  let stopped = false;
  const interval = setInterval(() => {
    if (stopped) return;
    pos += dir * speed;
    if (pos >= 100) { pos = 100; dir = -1; }
    if (pos <= 0)   { pos = 0;   dir = 1;  }
    needle.style.left = pos + "%";
  }, 16);

  btn.addEventListener("click", () => {
    if (stopped) return;
    stopped = true;
    clearInterval(interval);

    // Green zone is 30%..50%, gold 50%..65%
    let score, label;
    if (pos >= 30 && pos <= 50) {
      score = 100; label = t("perfect");
    } else if (pos > 50 && pos <= 65) {
      score = 70;  label = t("good");
    } else if (pos >= 20 && pos < 30) {
      score = 50;  label = t("nice");
    } else {
      score = 20;  label = t("miss");
    }
    setScore(score);
    const r = stage.getBoundingClientRect();
    flash(label + " +" + score, r.width / 2, r.height / 2, score < 50);
    setTimeout(finishStep, 700);
  });

  STATE.cleanup = () => clearInterval(interval);
}

// ---------- Mini-game: DRAG (cooking pot with recipe + decoys) ----------
function miniDrag(step) {
  const stage = $("#cook-stage");
  const dish = DISHES[STATE.dishIndex];

  const correctList = step.items.slice();
  const decoyList   = (step.decoys || []).slice();
  const totalCorrect = correctList.length;

  // Recipe banner (shows what ingredients are needed)
  const banner = document.createElement("div");
  banner.className = "recipe-banner";
  const label = document.createElement("span");
  label.className = "recipe-label";
  label.textContent = t("need") + ":";
  banner.appendChild(label);
  correctList.forEach((emoji) => {
    const r = document.createElement("span");
    r.className = "recipe-item";
    r.dataset.emoji = emoji;
    r.textContent = emoji;
    banner.appendChild(r);
  });
  stage.appendChild(banner);

  // Pot drop target
  const target = document.createElement("div");
  target.className = "drag-target is-pot";
  target.style.setProperty("--soup-color", dish.soupColor || "#f4a261");
  target.innerHTML = `
    <div class="pot-handle-l"></div>
    <div class="pot-handle-r"></div>
    <div class="pot-rim"></div>
    <div class="pot-body"></div>
    <div class="pot-soup"></div>
    <div class="pot-steam">♨️</div>
    <div class="pot-contents"></div>
  `;
  stage.appendChild(target);
  const contents = target.querySelector(".pot-contents");

  // Tray with shuffled correct + decoy items
  const trayItems = shuffle([
    ...correctList.map((e) => ({ emoji: e, correct: true })),
    ...decoyList.map((e)   => ({ emoji: e, correct: false }))
  ]);
  const tray = document.createElement("div");
  tray.className = "drag-tray";
  trayItems.forEach(({ emoji, correct }) => {
    const el = document.createElement("div");
    el.className = "drag-item";
    el.textContent = emoji;
    tray.appendChild(el);
    enableDrag(el, target, emoji, correct);
  });
  stage.appendChild(tray);

  let placed = 0;

  function markCollected(emoji) {
    const r = banner.querySelector(`.recipe-item[data-emoji="${emoji}"]:not(.collected)`);
    if (r) r.classList.add("collected");
  }

  function enableDrag(el, dropTarget, emoji, isCorrect) {
    let ghost = null;
    const onDown = (e) => {
      e.preventDefault();
      if (el.classList.contains("placed")) return;
      const point = (e.touches ? e.touches[0] : e);
      ghost = document.createElement("div");
      ghost.className = "drag-ghost";
      ghost.textContent = emoji;
      ghost.style.left = point.clientX + "px";
      ghost.style.top  = point.clientY + "px";
      document.body.appendChild(ghost);

      const onMove = (ev) => {
        if (ev.touches) ev.preventDefault();
        const p = ev.touches ? ev.touches[0] : ev;
        ghost.style.left = p.clientX + "px";
        ghost.style.top  = p.clientY + "px";
        const rect = dropTarget.getBoundingClientRect();
        const inside =
          p.clientX >= rect.left && p.clientX <= rect.right &&
          p.clientY >= rect.top  && p.clientY <= rect.bottom;
        dropTarget.classList.toggle("hover", inside);
      };
      const onUp = (ev) => {
        const p = ev.changedTouches ? ev.changedTouches[0] : ev;
        const rect = dropTarget.getBoundingClientRect();
        const inside =
          p.clientX >= rect.left && p.clientX <= rect.right &&
          p.clientY >= rect.top  && p.clientY <= rect.bottom;
        const r = stage.getBoundingClientRect();

        if (inside) {
          if (isCorrect && !el.classList.contains("placed")) {
            el.classList.add("placed");
            placed++;
            const placedEl = document.createElement("span");
            placedEl.className = "placed-emoji";
            placedEl.textContent = emoji;
            contents.appendChild(placedEl);
            markCollected(emoji);
            const gain = Math.round(100 / totalCorrect);
            setScore(STATE.currentScore + gain);
            flash("+" + gain, p.clientX - r.left, p.clientY - r.top);
            if (placed >= totalCorrect) setTimeout(finishStep, 400);
          } else if (!isCorrect) {
            el.classList.add("shake");
            setTimeout(() => el.classList.remove("shake"), 450);
            if (!el.classList.contains("tried-wrong")) {
              el.classList.add("tried-wrong");
              const penalty = 15;
              setScore(Math.max(0, STATE.currentScore - penalty));
              flash("-" + penalty, p.clientX - r.left, p.clientY - r.top, true);
            } else {
              flash(t("wrong"), p.clientX - r.left, p.clientY - r.top, true);
            }
          }
        }
        dropTarget.classList.remove("hover");
        if (ghost) { ghost.remove(); ghost = null; }
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup",   onUp);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend",  onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup",   onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend",  onUp);
    };
    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: false });
  }

  STATE.cleanup = () => {};
}

// ---------- Result ----------
function showResult() {
  const dish = DISHES[STATE.dishIndex];
  const total = STATE.stepScores.reduce((a, b) => a + b, 0);
  const max = dish.steps.length * 100;
  const ratio = total / max;
  let stars;
  if (ratio >= 0.85) stars = 3;
  else if (ratio >= 0.6) stars = 2;
  else if (ratio >= 0.3) stars = 1;
  else stars = 0;

  $("#result-emoji").textContent     = dish.emoji;
  $("#result-dish-name").textContent = dish.name[STATE.lang];
  $("#result-stars").textContent     = stars > 0
    ? "⭐".repeat(stars) + "☆".repeat(3 - stars)
    : "☆☆☆";
  $("#result-score-num").textContent = total;
  $("#result-quote").textContent     = t("quote_" + stars);

  showScreen("result");
}

// ---------- Wire up ----------
function bindEvents() {
  document.body.addEventListener("click", (e) => {
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    if (action === "goto-menu")  { renderMenu(); showScreen("menu"); }
    if (action === "goto-title") { showScreen("title"); }
    if (action === "play-again") { startDish(STATE.dishIndex); }
  });

  $("#lang-toggle").addEventListener("click", () => {
    STATE.lang = STATE.lang === "en" ? "zh" : "en";
    applyI18n();
    if (STATE.screen === "menu") renderMenu();
    if (STATE.screen === "cook") {
      // Refresh instruction text
      const dish = DISHES[STATE.dishIndex];
      const step = dish.steps[STATE.stepIndex];
      if (step) $("#cook-instruction").textContent = t("instr_" + step.key);
      $("#cook-dish-name").textContent = dish.name[STATE.lang];
    }
    if (STATE.screen === "result") {
      const dish = DISHES[STATE.dishIndex];
      $("#result-dish-name").textContent = dish.name[STATE.lang];
    }
  });
}

// ---------- Boot ----------
function init() {
  // Detect browser language
  const nav = (navigator.language || "en").toLowerCase();
  STATE.lang = nav.startsWith("zh") ? "zh" : "en";
  applyI18n();
  bindEvents();
  showScreen("title");
}

document.addEventListener("DOMContentLoaded", init);
