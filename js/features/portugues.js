import { $, shuffle } from "../core/utils.js";

export function defaultPortuguesState() {
  return {
    literacy: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
    spell: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
  };
}

// Banco de palavras (mistura temas), usado nas duas dinâmicas
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LITERACY_ITEMS = [
  // Fácil
  { emoji: "🍞", word: "PAO", difficulty: "facil" },
  { emoji: "🥛", word: "LEITE", difficulty: "facil" },
  { emoji: "🍎", word: "MACA", difficulty: "facil" },
  { emoji: "🍇", word: "UVA", difficulty: "facil" },
  { emoji: "🍚", word: "ARROZ", difficulty: "facil" },
  { emoji: "🍯", word: "MEL", difficulty: "facil" },
  { emoji: "🥚", word: "OVO", difficulty: "facil" },
  { emoji: "🧂", word: "SAL", difficulty: "facil" },
  { emoji: "🍰", word: "BOLO", difficulty: "facil" },
  { emoji: "🧃", word: "SUCO", difficulty: "facil" },
  { emoji: "🍐", word: "PERA", difficulty: "facil" },
  { emoji: "🥝", word: "KIWI", difficulty: "facil" },
  { emoji: "🍕", word: "PIZZA", difficulty: "facil" },
  { emoji: "🥭", word: "MANGA", difficulty: "facil" },
  { emoji: "🐱", word: "GATO", difficulty: "facil" },
  { emoji: "🐭", word: "RATO", difficulty: "facil" },
  { emoji: "🐄", word: "VACA", difficulty: "facil" },
  { emoji: "🐶", word: "CAO", difficulty: "facil" },
  { emoji: "🐸", word: "SAPO", difficulty: "facil" },
  { emoji: "🐻", word: "URSO", difficulty: "facil" },
  { emoji: "🐟", word: "PEIXE", difficulty: "facil" },
  { emoji: "🦆", word: "PATO", difficulty: "facil" },
  { emoji: "🐓", word: "GALO", difficulty: "facil" },
  { emoji: "🦫", word: "TATU", difficulty: "facil" },
  { emoji: "🏠", word: "CASA", difficulty: "facil" },
  { emoji: "🚗", word: "CARRO", difficulty: "facil" },
  { emoji: "📚", word: "LIVRO", difficulty: "facil" },
  { emoji: "✏️", word: "LAPIS", difficulty: "facil" },
  { emoji: "🛏️", word: "CAMA", difficulty: "facil" },
  { emoji: "🥤", word: "COPO", difficulty: "facil" },
  { emoji: "🧢", word: "BONE", difficulty: "facil" },
  { emoji: "🚪", word: "PORTA", difficulty: "facil" },
  { emoji: "🗝️", word: "CHAVE", difficulty: "facil" },

  // Países (bandeiras)
  { emoji: "🇨🇱", word: "CHILE", difficulty: "facil" },
  { emoji: "🇨🇳", word: "CHINA", difficulty: "facil" },
  { emoji: "🇯🇵", word: "JAPAO", difficulty: "facil" },
  { emoji: "🇵🇪", word: "PERU", difficulty: "facil" },
  { emoji: "🇮🇳", word: "INDIA", difficulty: "facil" },

  // Médio
  { emoji: "🍌", word: "BANANA", difficulty: "medio" },
  { emoji: "🍓", word: "MORANGO", difficulty: "medio" },
  { emoji: "🧀", word: "QUEIJO", difficulty: "medio" },
  { emoji: "🥕", word: "CENOURA", difficulty: "medio" },
  { emoji: "🍊", word: "LARANJA", difficulty: "medio" },
  { emoji: "🍍", word: "ABACAXI", difficulty: "medio" },
  { emoji: "🍅", word: "TOMATE", difficulty: "medio" },
  { emoji: "🥛", word: "IOGURTE", difficulty: "medio" },
  { emoji: "🥑", word: "ABACATE", difficulty: "medio" },
  { emoji: "🍋", word: "LIMAO", difficulty: "medio" },
  { emoji: "🐰", word: "COELHO", difficulty: "medio" },
  { emoji: "🐴", word: "CAVALO", difficulty: "medio" },
  { emoji: "🐔", word: "GALINHA", difficulty: "medio" },
  { emoji: "🐒", word: "MACACO", difficulty: "medio" },
  { emoji: "🦒", word: "GIRAFA", difficulty: "medio" },
  { emoji: "🦈", word: "TUBARAO", difficulty: "medio" },
  { emoji: "🦊", word: "RAPOSA", difficulty: "medio" },
  { emoji: "🐝", word: "ABELHA", difficulty: "medio" },
  { emoji: "🦉", word: "CORUJA", difficulty: "medio" },
  { emoji: "🚌", word: "ONIBUS", difficulty: "medio" },
  { emoji: "⌚", word: "RELOGIO", difficulty: "medio" },
  { emoji: "📱", word: "CELULAR", difficulty: "medio" },
  { emoji: "🪑", word: "CADEIRA", difficulty: "medio" },
  { emoji: "📓", word: "CADERNO", difficulty: "medio" },
  { emoji: "🪟", word: "JANELA", difficulty: "medio" },
  { emoji: "🏫", word: "ESCOLA", difficulty: "medio" },
  { emoji: "🎒", word: "MOCHILA", difficulty: "medio" },
  { emoji: "🧴", word: "SHAMPOO", difficulty: "medio" },

  // Países (bandeiras)
  { emoji: "🇧🇷", word: "BRASIL", difficulty: "medio" },
  { emoji: "🇲🇽", word: "MEXICO", difficulty: "medio" },
  { emoji: "🇨🇦", word: "CANADA", difficulty: "medio" },
  { emoji: "🇮🇹", word: "ITALIA", difficulty: "medio" },
  { emoji: "🇫🇷", word: "FRANCA", difficulty: "medio" },
  { emoji: "🇪🇸", word: "ESPANHA", difficulty: "medio" },

  // Difícil
  { emoji: "🍪", word: "BISCOITO", difficulty: "dificil" },
  { emoji: "🍫", word: "CHOCOLATE", difficulty: "dificil" },
  { emoji: "🍉", word: "MELANCIA", difficulty: "dificil" },
  { emoji: "🍝", word: "MACARRAO", difficulty: "dificil" },
  { emoji: "🥜", word: "AMENDOIM", difficulty: "dificil" },
  { emoji: "🍔", word: "HAMBURGUER", difficulty: "dificil" },
  { emoji: "🥞", word: "PANQUECA", difficulty: "dificil" },
  { emoji: "🍦", word: "SORVETE", difficulty: "dificil" },
  { emoji: "🍿", word: "PIPOCA", difficulty: "dificil" },
  { emoji: "🐶", word: "CACHORRO", difficulty: "dificil" },
  { emoji: "🐘", word: "ELEFANTE", difficulty: "dificil" },
  { emoji: "🐢", word: "TARTARUGA", difficulty: "dificil" },
  { emoji: "🦋", word: "BORBOLETA", difficulty: "dificil" },
  { emoji: "🦏", word: "RINOCERONTE", difficulty: "dificil" },
  { emoji: "🐦", word: "PASSARINHO", difficulty: "dificil" },
  { emoji: "🐊", word: "CROCODILO", difficulty: "dificil" },
  { emoji: "🧹", word: "VASSOURA", difficulty: "dificil" },
  { emoji: "🧯", word: "EXTINTOR", difficulty: "dificil" },
  { emoji: "💻", word: "COMPUTADOR", difficulty: "dificil" },
  { emoji: "📺", word: "TELEVISAO", difficulty: "dificil" },
  { emoji: "🧩", word: "QUEBRACABECA", difficulty: "dificil" },
  { emoji: "🩹", word: "BORRACHA", difficulty: "dificil" },
  { emoji: "☂️", word: "GUARDACHUVA", difficulty: "dificil" },
  { emoji: "🧊", word: "GELADEIRA", difficulty: "dificil" },

  // Países (bandeiras)
  { emoji: "🇵🇹", word: "PORTUGAL", difficulty: "dificil" },
  { emoji: "🇦🇷", word: "ARGENTINA", difficulty: "dificil" },
  { emoji: "🇩🇪", word: "ALEMANHA", difficulty: "dificil" },
  { emoji: "🇦🇺", word: "AUSTRALIA", difficulty: "dificil" },
  { emoji: "🇺🇸", word: "ESTADOSUNIDOS", difficulty: "dificil" },
];

const LITERACY_STAGES = [
  { id: 0, title: "Sessão 1 • Fácil", difficulty: "facil", rounds: 8, pass: 0.75 },
  { id: 1, title: "Sessão 2 • Médio", difficulty: "medio", rounds: 10, pass: 0.75 },
  { id: 2, title: "Sessão 3 • Difícil", difficulty: "dificil", rounds: 12, pass: 0.75 },
];

const SPELL_STAGES = [
  { id: 0, title: "Sessão 4 • Escrita (Fácil)", minLen: 2, maxLen: 5, rounds: 6, pass: 0.75 },
  { id: 1, title: "Sessão 5 • Escrita (Médio)", minLen: 6, maxLen: 7, rounds: 8, pass: 0.75 },
  { id: 2, title: "Sessão 6 • Escrita (Difícil)", minLen: 8, maxLen: 99, rounds: 10, pass: 0.75 },
];

export function initPortugues(ctx) {
  const { state, saveState, showScreen, setFeedback, addPoints, speakPtBr, playCorrectSound, ensureAudioCtx, populateVoiceSelect } =
    ctx;

  const literacyRun = { stageIndex: 0, roundsTotal: 0, round: 0, correct: 0, points: 0, pool: [], poolIdx: 0, lastWord: "" };
  let currentLiteracy = null;
  let literacyLocked = false;

  const spellRun = { stageIndex: 0, roundsTotal: 0, round: 0, correct: 0, points: 0, pool: [], poolIdx: 0, lastWord: "", typed: "" };
  let currentSpell = null;
  let spellLocked = false;
  let spellKeyboardReady = false;

  function normalizeFirstLetter(word) {
    return word
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")[0];
  }

  function normalizeWord(word) {
    return String(word || "")
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^A-Z]/g, "");
  }

  function getNextLiteracyStageToPlay() {
    const completedStages = Array.isArray(state?.literacy?.completedStages) ? state.literacy.completedStages : [false, false, false];
    const idx = completedStages.findIndex((x) => !x);
    return idx === -1 ? null : idx;
  }

  function getNextSpellStageToPlay() {
    const completedStages = Array.isArray(state?.spell?.completedStages) ? state.spell.completedStages : [false, false, false];
    const idx = completedStages.findIndex((x) => !x);
    return idx === -1 ? null : idx;
  }

  function buildLiteracyPoolForStage(stageIndex) {
    const stage = LITERACY_STAGES[stageIndex];
    const items = LITERACY_ITEMS.filter((it) => it.difficulty === stage.difficulty);
    literacyRun.pool = shuffle(items.length ? items : LITERACY_ITEMS);
    literacyRun.poolIdx = 0;
    literacyRun.lastWord = "";
  }

  function nextLiteracyItem() {
    if (!literacyRun.pool.length || literacyRun.poolIdx >= literacyRun.pool.length) buildLiteracyPoolForStage(literacyRun.stageIndex);
    let item = literacyRun.pool[literacyRun.poolIdx++];
    if (item?.word && item.word === literacyRun.lastWord && literacyRun.pool.length > 1) item = literacyRun.pool[literacyRun.poolIdx++ % literacyRun.pool.length];
    literacyRun.lastWord = item?.word || "";
    return item;
  }

  function updateLiteracyStageBar() {
    const stage = LITERACY_STAGES[literacyRun.stageIndex];
    $("litStageTitle").textContent = stage.title;
    $("litStageProgress").textContent = `Questão ${Math.min(literacyRun.round + 1, literacyRun.roundsTotal)}/${literacyRun.roundsTotal}`;
  }

  function makeLiteracyQuestion() {
    const item = nextLiteracyItem();
    const first = normalizeFirstLetter(item.word);
    const wrong = shuffle(ALPHABET.filter((l) => l !== first)).slice(0, 3);
    const choices = shuffle([first, ...wrong]);
    return { emoji: item.emoji, word: item.word, answer: first, choices };
  }

  function startLiteracyStage(stageIndex) {
    literacyRun.stageIndex = stageIndex;
    literacyRun.roundsTotal = LITERACY_STAGES[stageIndex].rounds;
    literacyRun.round = 0;
    literacyRun.correct = 0;
    literacyRun.points = 0;
    buildLiteracyPoolForStage(stageIndex);
    renderLiteracy();
  }

  function renderLiteracy() {
    updateLiteracyStageBar();
    currentLiteracy = makeLiteracyQuestion();
    literacyLocked = false;

    $("litEmoji").textContent = currentLiteracy.emoji;
    $("litQuestion").textContent = `Qual é a primeira letra de "${currentLiteracy.word}"?`;

    setTimeout(() => speakPtBr(currentLiteracy.word), 150);

    const box = $("litChoices");
    box.innerHTML = "";
    setFeedback($("litFeedback"), "", null);
    currentLiteracy.choices.forEach((letter) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn choice-btn";
      btn.textContent = letter;
      btn.addEventListener("click", () => onLiteracyAnswer(btn, letter));
      box.appendChild(btn);
    });
  }

  function showLiteracyResult({ passed, finishedAll }) {
    const stage = LITERACY_STAGES[literacyRun.stageIndex];
    const total = literacyRun.roundsTotal;
    const acc = total ? literacyRun.correct / total : 0;
    $("litResultCorrect").textContent = `${literacyRun.correct}/${total}`;
    $("litResultAccuracy").textContent = `${Math.round(acc * 100)}%`;
    $("litResultPoints").textContent = String(literacyRun.points);

    const primaryBtn = $("btnLitResultPrimary");
    const primaryHint = $("litResultPrimaryHint");

    if (finishedAll) {
      $("litResultTitle").textContent = "Trilha concluída! 🎉";
      $("litResultMessage").textContent = "Agora vem um novo desafio: ouvir e ESCREVER a palavra escolhendo as letras!";
      primaryBtn.textContent = "Começar escrita";
      primaryHint.textContent = "novo desafio";
      primaryBtn.dataset.action = "spell";
    } else if (passed) {
      $("litResultTitle").textContent = "Muito bem! ✅";
      $("litResultMessage").textContent = `Você passou na ${stage.title}. Próxima sessão liberada!`;
      primaryBtn.textContent = "Continuar";
      primaryHint.textContent = "próxima sessão";
      primaryBtn.dataset.action = "next";
    } else {
      $("litResultTitle").textContent = "Vamos tentar de novo 💪";
      $("litResultMessage").textContent = `Você precisa de pelo menos ${Math.round(stage.pass * 100)}% de acertos para passar.`;
      primaryBtn.textContent = "Repetir sessão";
      primaryHint.textContent = "treinar mais";
      primaryBtn.dataset.action = "retry";
    }
    showScreen("literacyResult");
  }

  function finishLiteracyStage() {
    const stage = LITERACY_STAGES[literacyRun.stageIndex];
    const acc = literacyRun.roundsTotal ? literacyRun.correct / literacyRun.roundsTotal : 0;
    const passed = acc >= stage.pass;

    if (!passed) return finishLiteracyFailed();
    return finishLiteracyPassed();
  }

  function finishLiteracyFailed() {
    saveState();
    showLiteracyResult({ passed: false, finishedAll: false });
  }

  function finishLiteracyPassed() {
    state.literacy.completedStages[literacyRun.stageIndex] = true;
    state.literacy.unlockedStage = Math.max(state.literacy.unlockedStage, literacyRun.stageIndex + 1);

    const nextStage = getNextLiteracyStageToPlay();
    if (nextStage !== null) return finishLiteracyPassedAndContinue();
    return finishLiteracyPassedAndCompleteAll();
  }

  function finishLiteracyPassedAndContinue() {
    saveState();
    showLiteracyResult({ passed: true, finishedAll: false });
  }

  function finishLiteracyPassedAndCompleteAll() {
    state.literacy.completed = true;
    state.literacy.unlockedStage = LITERACY_STAGES.length - 1;
    state.spell.unlockedStage = Math.max(state.spell.unlockedStage || 0, 0);
    saveState();
    showLiteracyResult({ passed: true, finishedAll: true });
  }

  function onLiteracyAnswer(btn, chosen) {
    if (literacyLocked) return;
    literacyLocked = true;

    const ok = chosen === currentLiteracy.answer;
    btn.classList.add(ok ? "ok" : "bad");

    if (ok) {
      setFeedback($("litFeedback"), "Muito bem! ✅", "ok");
      addPoints(10);
      literacyRun.points += 10;
      literacyRun.correct += 1;
      playCorrectSound();
    } else {
      setFeedback($("litFeedback"), `Ops! A resposta era "${currentLiteracy.answer}".`, "bad");
      addPoints(0);
    }

    [...$("litChoices").children].forEach((b) => {
      const letter = b.textContent;
      if (letter === currentLiteracy.answer) b.classList.add("ok");
      b.disabled = true;
    });

    setTimeout(() => {
      literacyRun.round += 1;
      if (literacyRun.round >= literacyRun.roundsTotal) finishLiteracyStage();
      else renderLiteracy();
    }, 850);
  }

  // ----- Escrita -----

  function lettersLen(word) {
    return normalizeWord(word).length;
  }

  function buildSpellPoolForStage(stageIndex) {
    const stage = SPELL_STAGES[stageIndex];
    const items = LITERACY_ITEMS.filter((it) => {
      const len = lettersLen(it.word);
      return len >= stage.minLen && len <= stage.maxLen;
    });
    spellRun.pool = shuffle(items.length ? items : LITERACY_ITEMS);
    spellRun.poolIdx = 0;
    spellRun.lastWord = "";
  }

  function nextSpellItem() {
    if (!spellRun.pool.length || spellRun.poolIdx >= spellRun.pool.length) buildSpellPoolForStage(spellRun.stageIndex);
    let item = spellRun.pool[spellRun.poolIdx++];
    const w = normalizeWord(item?.word || "");
    if (w && w === spellRun.lastWord && spellRun.pool.length > 1) item = spellRun.pool[spellRun.poolIdx++ % spellRun.pool.length];
    spellRun.lastWord = normalizeWord(item?.word || "");
    return item;
  }

  function updateSpellStageBar() {
    const stage = SPELL_STAGES[spellRun.stageIndex];
    $("spellStageTitle").textContent = stage.title;
    $("spellStageProgress").textContent = `Questão ${Math.min(spellRun.round + 1, spellRun.roundsTotal)}/${spellRun.roundsTotal}`;
  }

  function initSpellKeyboard() {
    const el = $("spellKeyboard");
    if (!el || spellKeyboardReady) return;
    el.innerHTML = "";

    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((ch) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn key-btn";
      b.textContent = ch;
      b.dataset.key = ch;
      el.appendChild(b);
    });

    const back = document.createElement("button");
    back.type = "button";
    back.className = "btn key-btn wide danger";
    back.textContent = "Apagar";
    back.dataset.key = "BACK";
    el.appendChild(back);

    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "btn key-btn wide";
    clear.textContent = "Limpar";
    clear.dataset.key = "CLEAR";
    el.appendChild(clear);

    const ok = document.createElement("button");
    ok.type = "button";
    ok.className = "btn key-btn wide ok";
    ok.textContent = "OK";
    ok.dataset.key = "OK";
    el.appendChild(ok);

    el.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const key = target.dataset.key;
      if (!key) return;
      onSpellKey(key);
    });

    spellKeyboardReady = true;
  }

  function renderSpellWordBoxes() {
    const el = $("spellWord");
    if (!el || !currentSpell) return;
    el.innerHTML = "";
    for (let i = 0; i < currentSpell.target.length; i++) {
      const box = document.createElement("div");
      box.className = "spell-box" + (spellRun.typed[i] ? " filled" : "");
      box.textContent = spellRun.typed[i] || "";
      el.appendChild(box);
    }
  }

  function renderSpell() {
    initSpellKeyboard();
    updateSpellStageBar();
    spellLocked = false;

    const item = nextSpellItem();
    currentSpell = { emoji: item.emoji, word: item.word, target: normalizeWord(item.word) };
    spellRun.typed = "";

    $("spellEmoji").textContent = item.emoji || "👂";
    $("spellQuestion").textContent = "Ouça e escreva a palavra";
    setFeedback($("spellFeedback"), "", null);
    renderSpellWordBoxes();
    setTimeout(() => speakPtBr(item.word), 150);
  }

  function startSpellStage(stageIndex) {
    spellRun.stageIndex = stageIndex;
    spellRun.roundsTotal = SPELL_STAGES[stageIndex].rounds;
    spellRun.round = 0;
    spellRun.correct = 0;
    spellRun.points = 0;
    buildSpellPoolForStage(stageIndex);
    showScreen("spell");
    populateVoiceSelect("ttsVoiceSpell");
    renderSpell();
  }

  function onSpellKey(key) {
    if (spellLocked || !currentSpell) return;
    ensureAudioCtx();

    if (key === "BACK") {
      spellRun.typed = spellRun.typed.slice(0, -1);
      renderSpellWordBoxes();
      return;
    }
    if (key === "CLEAR") {
      spellRun.typed = "";
      renderSpellWordBoxes();
      return;
    }
    if (key === "OK") {
      confirmSpellAnswer();
      return;
    }
    if (spellRun.typed.length >= currentSpell.target.length) return;
    if (!/^[A-Z]$/.test(key)) return;
    spellRun.typed += key;
    renderSpellWordBoxes();
  }

  function showSpellResult({ passed, finishedAll }) {
    const stage = SPELL_STAGES[spellRun.stageIndex];
    const total = spellRun.roundsTotal;
    const acc = total ? spellRun.correct / total : 0;

    $("spellResultCorrect").textContent = `${spellRun.correct}/${total}`;
    $("spellResultAccuracy").textContent = `${Math.round(acc * 100)}%`;
    $("spellResultPoints").textContent = String(spellRun.points);

    const title = $("spellResultTitle");
    const msg = $("spellResultMessage");
    const primaryBtn = $("btnSpellResultPrimary");
    const primaryHint = $("spellResultPrimaryHint");

    if (finishedAll) {
      title.textContent = "Parabéns! Você concluiu tudo! 🎉";
      msg.textContent = `Pontuação total: ${state.points}.`;
      primaryBtn.textContent = "Voltar ao início";
      primaryHint.textContent = "ver a trilha";
      primaryBtn.dataset.action = "home";
    } else if (passed) {
      title.textContent = "Excelente! ✅";
      msg.textContent = `Você passou na ${stage.title}. Próxima sessão liberada!`;
      primaryBtn.textContent = "Continuar";
      primaryHint.textContent = "próxima sessão";
      primaryBtn.dataset.action = "next";
    } else {
      title.textContent = "Quase lá 💪";
      msg.textContent = `Você precisa de pelo menos ${Math.round(stage.pass * 100)}% de acertos para passar.`;
      primaryBtn.textContent = "Repetir sessão";
      primaryHint.textContent = "treinar mais";
      primaryBtn.dataset.action = "retry";
    }

    showScreen("spellResult");
  }

  function finishSpellStage() {
    const stage = SPELL_STAGES[spellRun.stageIndex];
    const acc = spellRun.roundsTotal ? spellRun.correct / spellRun.roundsTotal : 0;
    const passed = acc >= stage.pass;

    if (!passed) return finishSpellFailed();
    return finishSpellPassed();
  }

  function finishSpellFailed() {
    saveState();
    showSpellResult({ passed: false, finishedAll: false });
  }

  function finishSpellPassed() {
    state.spell.completedStages[spellRun.stageIndex] = true;
    state.spell.unlockedStage = Math.max(state.spell.unlockedStage, spellRun.stageIndex + 1);

    const next = getNextSpellStageToPlay();
    if (next !== null) return finishSpellPassedAndContinue();
    return finishSpellPassedAndCompleteAll();
  }

  function finishSpellPassedAndContinue() {
    saveState();
    showSpellResult({ passed: true, finishedAll: false });
  }

  function finishSpellPassedAndCompleteAll() {
    state.spell.completed = true;
    state.spell.unlockedStage = SPELL_STAGES.length - 1;
    saveState();
    showSpellResult({ passed: true, finishedAll: true });
  }

  function confirmSpellAnswer() {
    if (spellLocked || !currentSpell) return;

    const target = currentSpell.target;
    const typed = normalizeWord(spellRun.typed);

    if (typed.length < target.length) {
      setFeedback($("spellFeedback"), "Complete a palavra antes de apertar OK.", "bad");
      return;
    }

    spellLocked = true;
    const ok = typed === target;

    if (ok) {
      setFeedback($("spellFeedback"), "Muito bem! ✅", "ok");
      addPoints(15);
      spellRun.points += 15;
      spellRun.correct += 1;
      playCorrectSound();
    } else {
      setFeedback($("spellFeedback"), `A palavra era: ${target}`, "bad");
    }

    setTimeout(() => {
      spellRun.round += 1;
      if (spellRun.round >= spellRun.roundsTotal) finishSpellStage();
      else renderSpell();
    }, 900);
  }

  // ---- Home render ----
  function renderLiteracyPath() {
    const el = $("literacyPath");
    if (!el) return;
    el.innerHTML = "";
    const next = getNextLiteracyStageToPlay();
    const unlockedMax = typeof state?.literacy?.unlockedStage === "number" ? state.literacy.unlockedStage : 0;

    bindLiteracyPathClick(el);

    LITERACY_STAGES.forEach((stage, i) => {
      const completed = !!state?.literacy?.completedStages?.[i];
      const locked = !completed && i > unlockedMax;
      const current = next !== null ? i === next : false;

      const item = document.createElement("div");
      item.className = "path-item" + (locked ? " locked" : "") + (completed ? " completed" : "") + (current ? " current" : "");
      item.dataset.stage = String(i);

      const badge = document.createElement("div");
      badge.className = "path-badge";
      badge.textContent = String(i + 1);

      const text = document.createElement("div");
      text.className = "path-text";
      const name = document.createElement("div");
      name.className = "path-name";
      name.textContent = stage.title;
      const status = document.createElement("div");
      status.className = "path-status";
      status.textContent = completed ? "Concluída" : locked ? "Bloqueada" : current ? "Próxima" : "Disponível";
      text.appendChild(name);
      text.appendChild(status);

      item.appendChild(badge);
      item.appendChild(text);
      el.appendChild(item);
    });
  }

  function bindLiteracyPathClick(el) {
    if (el.dataset.bound) return;
    el.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const item = target.closest(".path-item");
      if (!item) return;
      if (item.classList.contains("locked")) return;

      const stageIndex = Number(item.dataset.stage);
      if (Number.isNaN(stageIndex)) return;

      showScreen("literacy");
      populateVoiceSelect("ttsVoice");
      startLiteracyStage(stageIndex);
    });
    el.dataset.bound = "1";
  }

  function renderSpellingPath() {
    const el = $("spellingPath");
    if (!el) return;
    el.innerHTML = "";

    const literacyDone = !!state?.literacy?.completed;
    const next = literacyDone ? getNextSpellStageToPlay() : null;
    const unlockedMax = literacyDone ? (typeof state?.spell?.unlockedStage === "number" ? state.spell.unlockedStage : 0) : -1;

    bindSpellPathClick(el);

    SPELL_STAGES.forEach((stage, i) => {
      const completed = !!state?.spell?.completedStages?.[i];
      const locked = !literacyDone || (!completed && i > unlockedMax);
      const current = literacyDone && next !== null ? i === next : false;

      const item = document.createElement("div");
      item.className = "path-item" + (locked ? " locked" : "") + (completed ? " completed" : "") + (current ? " current" : "");
      item.dataset.stage = String(i);

      const badge = document.createElement("div");
      badge.className = "path-badge";
      badge.textContent = String(i + 1);

      const text = document.createElement("div");
      text.className = "path-text";
      const name = document.createElement("div");
      name.className = "path-name";
      name.textContent = stage.title;

      const status = document.createElement("div");
      status.className = "path-status";
      status.textContent = !literacyDone
        ? "Bloqueada (conclua a 1ª trilha)"
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
      el.appendChild(item);
    });
  }

  function bindSpellPathClick(el) {
    if (el.dataset.bound) return;
    el.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const item = target.closest(".path-item");
      if (!item) return;
      if (item.classList.contains("locked")) return;
      if (!state?.literacy?.completed) return;

      const stageIndex = Number(item.dataset.stage);
      if (Number.isNaN(stageIndex)) return;

      startSpellStage(stageIndex);
    });
    el.dataset.bound = "1";
  }

  function getHomeHint() {
    const nextLit = getNextLiteracyStageToPlay();
    const nextSpell = getNextSpellStageToPlay();
    if (nextLit !== null) return `próxima: ${LITERACY_STAGES[nextLit].title} (progressivo)`;
    if (nextSpell !== null) return `próxima: ${SPELL_STAGES[nextSpell].title} (escrita)`;
    return "tudo concluído — clique para recomeçar";
  }

  function renderHome() {
    renderLiteracyPath();
    renderSpellingPath();
  }

  function startFromHome() {
    const nextLit = getNextLiteracyStageToPlay();
    if (nextLit !== null) {
      showScreen("literacy");
      populateVoiceSelect("ttsVoice");
      startLiteracyStage(nextLit);
      return;
    }

    const nextSpell = getNextSpellStageToPlay();
    if (nextSpell !== null) {
      startSpellStage(nextSpell);
      return;
    }

    const ok = confirm("Você já concluiu todas as trilhas de português. Quer recomeçar?");
    if (!ok) return;
    Object.assign(state, defaultPortuguesState());
    saveState();
    showScreen("literacy");
    populateVoiceSelect("ttsVoice");
    startLiteracyStage(0);
  }

  // ---- listeners internos (telas PT) ----
  $("btnLiteracyNew")?.addEventListener("click", () => startLiteracyStage(literacyRun.stageIndex));
  $("btnLitSpeak")?.addEventListener("click", () => {
    ensureAudioCtx();
    if (currentLiteracy?.word) speakPtBr(currentLiteracy.word);
  });

  $("btnSpellSpeak")?.addEventListener("click", () => {
    ensureAudioCtx();
    if (currentSpell?.word) speakPtBr(currentSpell.word);
  });
  $("btnSpellRestart")?.addEventListener("click", () => startSpellStage(spellRun.stageIndex));

  $("btnLitResultHome")?.addEventListener("click", () => showScreen("home"));
  $("btnLitResultPrimary")?.addEventListener("click", () => {
    const action = $("btnLitResultPrimary").dataset.action || "home";
    if (action === "retry") {
      showScreen("literacy");
      startLiteracyStage(literacyRun.stageIndex);
      return;
    }
    if (action === "next") {
      showScreen("literacy");
      startLiteracyStage(getNextLiteracyStageToPlay() ?? 0);
      return;
    }
    if (action === "spell") {
      startSpellStage(getNextSpellStageToPlay() ?? 0);
      return;
    }
    showScreen("home");
  });

  $("btnSpellResultHome")?.addEventListener("click", () => showScreen("home"));
  $("btnSpellResultPrimary")?.addEventListener("click", () => {
    const action = $("btnSpellResultPrimary").dataset.action || "home";
    if (action === "retry") {
      startSpellStage(spellRun.stageIndex);
      return;
    }
    if (action === "next") {
      startSpellStage(getNextSpellStageToPlay() ?? 0);
      return;
    }
    showScreen("home");
  });

  return { renderHome, getHomeHint, startFromHome };
}
