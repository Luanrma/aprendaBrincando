import { $, clamp, pickOne, shuffle, unique } from "../core/utils.js";

export function defaultMathState() {
  return {
    math: {
      perTrack: {
        soma: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
        subtracao: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
        multiplicacao: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
        divisao: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
        geral: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
      },
    },
  };
}

export function migrateMathIfNeeded(parsedMath) {
  // versão antiga: { completedStages, unlockedStage, completed }
  if (parsedMath && Array.isArray(parsedMath.completedStages)) {
    return {
      perTrack: {
        geral: {
          completedStages: parsedMath.completedStages,
          unlockedStage: typeof parsedMath.unlockedStage === "number" ? parsedMath.unlockedStage : 0,
          completed: !!parsedMath.completed,
        },
        soma: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
        subtracao: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
        multiplicacao: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
        divisao: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
      },
    };
  }
  return null;
}

const MATH_TRACKS = [
  { key: "soma", title: "Soma", lockedUntilOpsDone: false, ops: ["+"] },
  { key: "subtracao", title: "Subtração", lockedUntilOpsDone: false, ops: ["−"] },
  { key: "multiplicacao", title: "Multiplicação", lockedUntilOpsDone: false, ops: ["×"] },
  { key: "divisao", title: "Divisão", lockedUntilOpsDone: false, ops: ["÷"] },
  { key: "geral", title: "Geral", lockedUntilOpsDone: true, ops: ["+", "−", "×", "÷"] },
];

function getMathTrack(trackKey) {
  return MATH_TRACKS.find((t) => t.key === trackKey) || MATH_TRACKS[0];
}

function getNumberRangeForDifficulty(stageIndex) {
  if (stageIndex === 0) return { min: 0, max: 99 };
  if (stageIndex === 1) return { min: 100, max: 999 };
  return { min: 1000, max: 9999 };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function initMatematica(ctx) {
  const { state, saveState, showScreen, setFeedback, addPoints, playCorrectSound } = ctx;

  const STAGES_META = [
    { titleSuffix: "(Fácil)", rounds: 8, pass: 0.75 },
    { titleSuffix: "(Médio)", rounds: 10, pass: 0.75 },
    { titleSuffix: "(Difícil)", rounds: 12, pass: 0.75 },
  ];

  const mathRun = { trackKey: "soma", stageIndex: 0, roundsTotal: 0, round: 0, correct: 0, points: 0 };
  let currentMath = null;
  let mathLocked = false;

  function getMathProgress(trackKey) {
    const perTrack = state?.math?.perTrack || {};
    if (!perTrack[trackKey]) {
      perTrack[trackKey] = { completedStages: [false, false, false], unlockedStage: 0, completed: false };
      state.math.perTrack = perTrack;
      saveState();
    }
    return perTrack[trackKey];
  }

  function areOperationsTracksCompleted() {
    return ["soma", "subtracao", "multiplicacao", "divisao"].every((k) => !!getMathProgress(k).completed);
  }

  function getNextMathStageToPlay(trackKey) {
    const p = getMathProgress(trackKey);
    const completedStages = Array.isArray(p.completedStages) ? p.completedStages : [false, false, false];
    const idx = completedStages.findIndex((x) => !x);
    return idx === -1 ? null : idx;
  }

  function updateMathStageBar() {
    const track = getMathTrack(mathRun.trackKey);
    const suffix = STAGES_META[mathRun.stageIndex]?.titleSuffix || "";
    const title = `Sessão ${mathRun.stageIndex + 1} • ${track.title} ${suffix}`.trim();
    $("mathStageTitle").textContent = title;
    $("mathStageProgress").textContent = `Questão ${Math.min(mathRun.round + 1, mathRun.roundsTotal)}/${mathRun.roundsTotal}`;
  }

  function makeMathQuestionForStage(stageIndex) {
    const track = getMathTrack(mathRun.trackKey);
    const range = getNumberRangeForDifficulty(stageIndex);

    const ops = track.key === "geral" ? STAGES_META[stageIndex].titleSuffix.includes("Difícil") ? track.ops : track.ops.filter((o) => o !== "÷") : track.ops;
    const op = pickOne(ops);

    let a, b, text, answer;

    if (op === "×") {
      a = randInt(range.min, range.max);
      b = randInt(range.min, range.max);
      answer = a * b;
      text = `Quanto é ${a} × ${b}?`;
    } else if (op === "÷") {
      let tries = 0;
      while (tries < 60) {
        b = randInt(Math.max(1, range.min), range.max);
        const qMin = Math.ceil(range.min / b);
        const qMax = Math.floor(range.max / b);
        if (qMax >= Math.max(1, qMin)) {
          const q = randInt(Math.max(1, qMin), Math.max(1, qMax));
          a = b * q;
          answer = q;
          break;
        }
        tries += 1;
      }
      if (typeof a !== "number" || typeof b !== "number") {
        b = randInt(1, 9);
        answer = randInt(1, 9);
        a = b * answer;
      }
      text = `Quanto é ${a} ÷ ${b}?`;
    } else if (op === "−") {
      a = randInt(range.min, range.max);
      b = randInt(range.min, range.max);
      if (b > a) [a, b] = [b, a];
      answer = a - b;
      text = `Quanto é ${a} − ${b}?`;
    } else {
      a = randInt(range.min, range.max);
      b = randInt(range.min, range.max);
      answer = a + b;
      text = `Quanto é ${a} + ${b}?`;
    }

    const magnitude = Math.max(10, Math.round(Math.abs(answer) * 0.05));
    const deltas = unique(Array.from({ length: 3 }, () => randInt(1, magnitude) * (Math.random() < 0.5 ? -1 : 1)));
    const wrongs = deltas.map((d) => Math.max(0, answer + d));
    const choices = shuffle(unique([answer, ...wrongs]).slice(0, 4));
    while (choices.length < 4) choices.push(answer + choices.length + 1);

    return { text, answer, choices: shuffle(choices) };
  }

  function startMathStage(trackKey, stageIndex) {
    mathRun.trackKey = trackKey;
    mathRun.stageIndex = stageIndex;
    mathRun.roundsTotal = STAGES_META[stageIndex].rounds;
    mathRun.round = 0;
    mathRun.correct = 0;
    mathRun.points = 0;
    showScreen("math");
    renderMath();
  }

  function renderMath() {
    updateMathStageBar();
    currentMath = makeMathQuestionForStage(mathRun.stageIndex);
    mathLocked = false;

    $("mathEmoji").textContent = "🧠";
    $("mathQuestion").textContent = currentMath.text;
    const box = $("mathChoices");
    box.innerHTML = "";
    setFeedback($("mathFeedback"), "", null);

    currentMath.choices.forEach((n) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn choice-btn";
      btn.textContent = String(n);
      btn.addEventListener("click", () => onMathAnswer(btn, n));
      box.appendChild(btn);
    });
  }

  function showMathResult({ passed, finishedAll }) {
    const track = getMathTrack(mathRun.trackKey);
    const total = mathRun.roundsTotal;
    const acc = total ? mathRun.correct / total : 0;

    $("mathResultCorrect").textContent = `${mathRun.correct}/${total}`;
    $("mathResultAccuracy").textContent = `${Math.round(acc * 100)}%`;
    $("mathResultPoints").textContent = String(mathRun.points);

    const title = $("mathResultTitle");
    const msg = $("mathResultMessage");
    const primaryBtn = $("btnMathResultPrimary");
    const primaryHint = $("mathResultPrimaryHint");

    if (finishedAll) return renderMathFinishedAll(track, { title, msg, primaryBtn, primaryHint });
    if (passed) return renderMathPassed({ title, msg, primaryBtn, primaryHint });
    return renderMathFailed({ title, msg, primaryBtn, primaryHint });

    showScreen("mathResult");
  }

  function renderMathFinishedAll(track, ui) {
    const { title, msg, primaryBtn, primaryHint } = ui;
    title.textContent = "Trilha concluída! 🎉";

    const opsDone = areOperationsTracksCompleted();
    const geralUnlockedNow = opsDone && !getMathProgress("geral").completed && track.key !== "geral";

    msg.textContent = getFinishedAllMessage(track, geralUnlockedNow);

    if (!geralUnlockedNow) return setFinishedAllPrimaryHome(primaryBtn, primaryHint);
    return setFinishedAllPrimaryGoGeral(primaryBtn, primaryHint);
  }

  function getFinishedAllMessage(track, geralUnlockedNow) {
    if (track.key === "geral") return `Você concluiu o desafio final (Geral). Pontuação total: ${state.points}.`;
    if (geralUnlockedNow) return `Você concluiu: ${track.title}. O desafio final "Geral" foi liberado!`;
    return `Você concluiu: ${track.title}.`;
  }

  function setFinishedAllPrimaryGoGeral(primaryBtn, primaryHint) {
    primaryBtn.textContent = "Ir para Geral";
    primaryHint.textContent = "desafio final";
    primaryBtn.dataset.action = "go_geral";
  }

  function setFinishedAllPrimaryHome(primaryBtn, primaryHint) {
    primaryBtn.textContent = "Voltar ao início";
    primaryHint.textContent = "ver a trilha";
    primaryBtn.dataset.action = "home";
  }

  function renderMathPassed(ui) {
    const { title, msg, primaryBtn, primaryHint } = ui;
    title.textContent = "Muito bem! ✅";
    msg.textContent = "Sessão concluída! Próxima sessão liberada.";
    primaryBtn.textContent = "Continuar";
    primaryHint.textContent = "próxima sessão";
    primaryBtn.dataset.action = "next";
  }

  function renderMathFailed(ui) {
    const { title, msg, primaryBtn, primaryHint } = ui;
    title.textContent = "Vamos tentar de novo 💪";
    msg.textContent = "Você não atingiu a meta. Tente novamente!";
    primaryBtn.textContent = "Repetir sessão";
    primaryHint.textContent = "treinar mais";
    primaryBtn.dataset.action = "retry";
  }

  function finishMathStage() {
    const pass = STAGES_META[mathRun.stageIndex].pass;
    const acc = mathRun.roundsTotal ? mathRun.correct / mathRun.roundsTotal : 0;
    const passed = acc >= pass;

    if (!passed) return finishMathFailed();
    return finishMathPassed();
  }

  function finishMathFailed() {
    saveState();
    showMathResult({ passed: false, finishedAll: false });
  }

  function finishMathPassed() {
    const p = getMathProgress(mathRun.trackKey);
    p.completedStages[mathRun.stageIndex] = true;
    p.unlockedStage = Math.max(p.unlockedStage, mathRun.stageIndex + 1);

    const next = getNextMathStageToPlay(mathRun.trackKey);
    if (next !== null) return finishMathPassedAndContinue();
    return finishMathPassedAndCompleteAll(p);
  }

  function finishMathPassedAndContinue() {
    saveState();
    showMathResult({ passed: true, finishedAll: false });
  }

  function finishMathPassedAndCompleteAll(p) {
    p.completed = true;
    p.unlockedStage = 2;
    saveState();
    showMathResult({ passed: true, finishedAll: true });
  }

  function onMathAnswer(btn, chosen) {
    if (mathLocked) return;
    mathLocked = true;

    const ok = chosen === currentMath.answer;
    btn.classList.add(ok ? "ok" : "bad");

    if (ok) {
      setFeedback($("mathFeedback"), "Acertou! ✅", "ok");
      addPoints(10);
      mathRun.points += 10;
      mathRun.correct += 1;
      playCorrectSound();
    } else {
      setFeedback($("mathFeedback"), `Quase! A resposta era ${currentMath.answer}.`, "bad");
      addPoints(0);
    }

    [...$("mathChoices").children].forEach((b) => {
      const n = Number(b.textContent);
      if (n === currentMath.answer) b.classList.add("ok");
      b.disabled = true;
    });

    setTimeout(() => {
      mathRun.round += 1;
      if (mathRun.round >= mathRun.roundsTotal) finishMathStage();
      else renderMath();
    }, 900);
  }

  function renderHome() {
    const tabsEl = $("mathTabs");
    const pathEl = $("mathPath");
    if (!tabsEl || !pathEl) return;

    tabsEl.innerHTML = "";
    pathEl.innerHTML = "";

    const opsDone = areOperationsTracksCompleted();
    const selected = state?.settings?.mathTrack || "soma";
    const canUseTrack = (track) => !(track.lockedUntilOpsDone && !opsDone);

    MATH_TRACKS.forEach((track) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab" + (track.key === selected ? " active" : "");
      btn.textContent = track.title;
      if (!canUseTrack(track)) btn.disabled = true;
      btn.addEventListener("click", () => {
        state.settings.mathTrack = track.key;
        saveState();
        renderHome();
      });
      tabsEl.appendChild(btn);
    });

    // Lista do track selecionado
    const track = getMathTrack(selected);
    const trackLocked = track.lockedUntilOpsDone && !opsDone;
    const p = getMathProgress(track.key);
    const next = getNextMathStageToPlay(track.key);
    const unlockedMax = typeof p.unlockedStage === "number" ? p.unlockedStage : 0;

    track.ops; // keep linter happy

    for (let i = 0; i < 3; i++) {
      const meta = STAGES_META[i];
      const stageTitle = `Sessão ${i + 1} • ${track.title} ${meta.titleSuffix}`;
      const completed = !!p.completedStages?.[i];
      const locked = trackLocked || (!completed && i > unlockedMax);
      const current = !locked && next !== null ? i === next : false;

      const item = document.createElement("div");
      item.className = "path-item" + (locked ? " locked" : "") + (completed ? " completed" : "") + (current ? " current" : "");
      item.dataset.track = track.key;
      item.dataset.stage = String(i);

      const badge = document.createElement("div");
      badge.className = "path-badge";
      badge.textContent = String(i + 1);

      const text = document.createElement("div");
      text.className = "path-text";

      const name = document.createElement("div");
      name.className = "path-name";
      name.textContent = stageTitle;

      const status = document.createElement("div");
      status.className = "path-status";
      status.textContent = trackLocked
        ? 'Bloqueada (conclua Soma/Subtração/Multiplicação/Divisão)'
        : completed
          ? "Concluída"
          : locked
            ? "Bloqueada"
            : current
              ? "Próxima"
              : "Disponível";

      text.appendChild(name);
      text.appendChild(status);
      item.appendChild(badge);
      item.appendChild(text);
      pathEl.appendChild(item);
    }

    if (!pathEl.dataset.bound) {
      pathEl.addEventListener("click", (ev) => {
        const target = ev.target;
        if (!(target instanceof HTMLElement)) return;
        const item = target.closest(".path-item");
        if (!item || item.classList.contains("locked")) return;
        const t = item.dataset.track;
        const s = Number(item.dataset.stage);
        if (!t || Number.isNaN(s)) return;
        startMathStage(t, s);
      });
      pathEl.dataset.bound = "1";
    }
  }

  function startFromHome() {
    const opsDone = areOperationsTracksCompleted();
    const selected = state?.settings?.mathTrack || "soma";
    const track = getMathTrack(selected);

    if (track.lockedUntilOpsDone && !opsDone) {
      alert('O desafio "Geral" é o final. Conclua Soma/Subtração/Multiplicação/Divisão primeiro.');
      state.settings.mathTrack = "soma";
      saveState();
    }

    const trackKey = state.settings.mathTrack || "soma";
    const stageToPlay = getNextMathStageToPlay(trackKey);
    if (stageToPlay !== null) {
      startMathStage(trackKey, stageToPlay);
      return;
    }

    const ok = confirm(`Você já concluiu a trilha "${getMathTrack(trackKey).title}". Quer recomeçar?`);
    if (!ok) return;
    state.math.perTrack[trackKey] = { completedStages: [false, false, false], unlockedStage: 0, completed: false };
    saveState();
    startMathStage(trackKey, 0);
  }

  // listeners
  $("btnMathNew")?.addEventListener("click", () => startMathStage(mathRun.trackKey, mathRun.stageIndex));
  $("btnMathResultHome")?.addEventListener("click", () => showScreen("home"));
  $("btnMathResultPrimary")?.addEventListener("click", () => {
    const action = $("btnMathResultPrimary").dataset.action || "home";
    if (action === "retry") return startMathStage(mathRun.trackKey, mathRun.stageIndex);
    if (action === "next") return startMathStage(mathRun.trackKey, getNextMathStageToPlay(mathRun.trackKey) ?? 0);
    if (action === "go_geral") {
      state.settings.mathTrack = "geral";
      saveState();
      return startMathStage("geral", getNextMathStageToPlay("geral") ?? 0);
    }
    showScreen("home");
  });

  return { renderHome, startFromHome, defaultSettings: { mathTrack: "soma" }, resetProgress: defaultMathState };
}
