import { $ } from "./core/utils.js";
import { defaultPortuguesState, initPortugues } from "./features/portugues.js";
import { defaultMathState, initMatematica, migrateMathIfNeeded } from "./features/matematica.js";

const STORAGE_KEY = "aprendaBrincando:v1";

function xpRequiredForLevel(level) {
  const base = 120;
  const growth = 1.25;
  return Math.round(base * Math.pow(growth, level - 1));
}

function getLevelInfo(totalXP) {
  let level = 1;
  let xpIntoLevel = totalXP;
  let req = xpRequiredForLevel(level);
  while (xpIntoLevel >= req) {
    xpIntoLevel -= req;
    level += 1;
    req = xpRequiredForLevel(level);
    if (level > 99) break;
  }
  const progress = req > 0 ? xpIntoLevel / req : 0;
  return { level, xpIntoLevel, xpToNext: req, progress: Math.max(0, Math.min(1, progress)) };
}

function getDefaultState() {
  return {
    points: 0,
    bestScore: 0,
    settings: { voiceURI: "", mathTrack: "soma" },
    ...defaultPortuguesState(),
    ...defaultMathState(),
  };
}

function loadState() {
  const defaults = getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);

    // migração de matemática antiga
    const migratedMath = migrateMathIfNeeded(parsed?.math);

    return {
      ...defaults,
      points: typeof parsed.points === "number" ? parsed.points : defaults.points,
      bestScore: typeof parsed.bestScore === "number" ? parsed.bestScore : defaults.bestScore,
      settings: {
        ...defaults.settings,
        voiceURI: parsed?.settings?.voiceURI || defaults.settings.voiceURI,
        mathTrack: parsed?.settings?.mathTrack || defaults.settings.mathTrack,
      },
      literacy: parsed?.literacy || defaults.literacy,
      spell: parsed?.spell || defaults.spell,
      math: migratedMath || parsed?.math || defaults.math,
    };
  } catch {
    return defaults;
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      points: state.points,
      bestScore: state.bestScore,
      settings: state.settings,
      literacy: state.literacy,
      spell: state.spell,
      math: state.math,
    })
  );
}

// ----------------- Voz (TTS) e sons -----------------

const tts = {
  supported: "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
  voices: [],
  voice: null,
};

function scoreVoice(v) {
  const lang = (v.lang || "").toLowerCase();
  const name = (v.name || "").toLowerCase();
  let s = 0;
  if (lang.startsWith("pt-br")) s += 100;
  else if (lang.startsWith("pt-pt")) s += 60;
  else if (lang.startsWith("pt")) s += 40;
  if (name.includes("natural")) s += 50;
  if (name.includes("google")) s += 30;
  if (name.includes("microsoft")) s += 25;
  if (name.includes("brazil") || name.includes("brasil")) s += 15;
  return s;
}

function refreshVoices() {
  if (!tts.supported) return;
  const voices = window.speechSynthesis.getVoices() || [];
  tts.voices = voices;
  const chosenURI = state?.settings?.voiceURI || "";
  const chosen = chosenURI ? voices.find((v) => v.voiceURI === chosenURI) : null;
  if (chosen) {
    tts.voice = chosen;
    return;
  }
  const pt = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("pt"));
  tts.voice = (pt.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || voices[0]) ?? null;
}

function speakPtBr(text) {
  if (!tts.supported || !text) return false;
  refreshVoices();
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR";
    if (tts.voice) u.voice = tts.voice;
    u.rate = 0.92;
    u.pitch = 1.05;
    u.volume = 1.0;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

let audioCtx = null;
function ensureAudioCtx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function playCorrectSound() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [
    { f: 523.25, t: now, d: 0.1 },
    { f: 659.25, t: now + 0.11, d: 0.14 },
  ];
  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(n.f, n.t);
    gain.gain.setValueAtTime(0.0001, n.t);
    gain.gain.exponentialRampToValueAtTime(0.28, n.t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, n.t + n.d);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(n.t);
    osc.stop(n.t + n.d + 0.02);
  });
}

function populateVoiceSelect(selectId = "ttsVoice") {
  const sel = $(selectId);
  if (!sel) return;
  if (!tts.supported) {
    sel.parentElement && (sel.parentElement.style.display = "none");
    return;
  }

  const current = state.settings.voiceURI || "";
  const voices = tts.voices || [];
  const ptVoices = voices
    .filter((v) => (v.lang || "").toLowerCase().startsWith("pt"))
    .sort((a, b) => scoreVoice(b) - scoreVoice(a));

  sel.innerHTML = "";
  const optAuto = document.createElement("option");
  optAuto.value = "";
  optAuto.textContent = "Automática (pt-BR)";
  sel.appendChild(optAuto);

  ptVoices.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v.voiceURI;
    opt.textContent = `${v.name} • ${v.lang}`;
    sel.appendChild(opt);
  });
  sel.value = current;
}

// ----------------- UI / Navegação -----------------

const state = {
  ...loadState(),
  level: 1,
};
state.level = getLevelInfo(state.points).level;

const screens = {
  home: $("screen-home"),
  literacy: $("screen-literacy"),
  literacyResult: $("screen-literacy-result"),
  spell: $("screen-spell"),
  spellResult: $("screen-spell-result"),
  math: $("screen-math"),
  mathResult: $("screen-math-result"),
};

function showScreen(name) {
  Object.entries(screens).forEach(([k, el]) => el.classList.toggle("hidden", k !== name));
  if (name === "home") renderHome();
}

function setFeedback(el, text, type) {
  el.textContent = text || "";
  el.style.color = type === "ok" ? "var(--ok)" : type === "bad" ? "var(--bad)" : "var(--text)";
}

function updateHud() {
  $("points").textContent = String(state.points);
  const info = getLevelInfo(state.points);
  state.level = info.level;
  $("level").textContent = String(info.level);
  const fill = $("xpFill");
  const text = $("xpText");
  if (fill) fill.style.width = `${Math.round(info.progress * 100)}%`;
  if (text) text.textContent = `${info.xpIntoLevel} / ${info.xpToNext} XP`;
  $("bestScore").textContent = String(state.bestScore);
}

function addPoints(delta) {
  state.points = Math.max(0, state.points + delta);
  state.level = getLevelInfo(state.points).level;
  state.bestScore = Math.max(state.bestScore, state.points);
  saveState();
  updateHud();
}

// ----------------- Features -----------------

const ctx = {
  state,
  saveState,
  showScreen,
  setFeedback,
  addPoints,
  speakPtBr,
  playCorrectSound,
  ensureAudioCtx,
  populateVoiceSelect,
};

const portugues = initPortugues(ctx);
const matematica = initMatematica(ctx);

function renderHome() {
  portugues.renderHome();
  matematica.renderHome();

  const hint = $("literacyHint");
  if (hint) hint.textContent = portugues.getHomeHint();
}

// ----------------- Eventos globais -----------------

$("btnHome")?.addEventListener("click", () => showScreen("home"));
$("btnStartLiteracy")?.addEventListener("click", () => portugues.startFromHome());
$("btnStartMath")?.addEventListener("click", () => matematica.startFromHome());

$("btnResetProgress")?.addEventListener("click", () => {
  const ok = confirm("Quer zerar pontos e melhor pontuação?");
  if (!ok) return;

  const defaults = getDefaultState();
  Object.assign(state, defaults);
  saveState();
  updateHud();
  showScreen("home");
});

// voz
$("ttsVoice")?.addEventListener("change", (e) => {
  state.settings.voiceURI = e.target.value;
  saveState();
  refreshVoices();
});
$("ttsVoiceSpell")?.addEventListener("change", (e) => {
  state.settings.voiceURI = e.target.value;
  saveState();
  refreshVoices();
});

// Inicialização
updateHud();
showScreen("home");

if (tts.supported) {
  refreshVoices();
  populateVoiceSelect("ttsVoice");
  populateVoiceSelect("ttsVoiceSpell");
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    refreshVoices();
    populateVoiceSelect("ttsVoice");
    populateVoiceSelect("ttsVoiceSpell");
  });
}

