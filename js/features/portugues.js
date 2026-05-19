import { $, shuffle } from "../core/utils.js";

export function defaultPortuguesState() {
  return {
    literacy: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
    spell: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
    phrase: { completedStages: [false, false, false], unlockedStage: 0, completed: false },
  };
}

// Banco de palavras (mistura temas), usado nas duas dinâmicas
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LITERACY_ITEMS = [
  // Fácil
  { emoji: "🍞", word: "PÃO", difficulty: "facil" },
  { emoji: "🍎", word: "MAÇÃ", difficulty: "facil" },
  { emoji: "🥛", word: "LEITE", difficulty: "facil" },
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
  { emoji: "🐶", word: "CÃO", difficulty: "facil" },
  { emoji: "🐸", word: "SAPO", difficulty: "facil" },
  { emoji: "🐻", word: "URSO", difficulty: "facil" },
  { emoji: "🐟", word: "PEIXE", difficulty: "facil" },
  { emoji: "🦆", word: "PATO", difficulty: "facil" },
  { emoji: "🐓", word: "GALO", difficulty: "facil" },
  { emoji: "🦫", word: "TATU", difficulty: "facil" },
  { emoji: "🏠", word: "CASA", difficulty: "facil" },
  { emoji: "🚗", word: "CARRO", difficulty: "facil" },
  { emoji: "📚", word: "LIVRO", difficulty: "facil" },
  { emoji: "✏️", word: "LÁPIS", difficulty: "facil" },
  { emoji: "🛏️", word: "CAMA", difficulty: "facil" },
  { emoji: "🥤", word: "COPO", difficulty: "facil" },
  { emoji: "🧢", word: "BONÉ", difficulty: "facil" },
  { emoji: "🚪", word: "PORTA", difficulty: "facil" },
  { emoji: "🗝️", word: "CHAVE", difficulty: "facil" },

  // Países (bandeiras)
  { emoji: "🇨🇱", word: "CHILE", difficulty: "facil" },
  { emoji: "🇨🇳", word: "CHINA", difficulty: "facil" },
  { emoji: "🇯🇵", word: "JAPÃO", difficulty: "facil" },
  { emoji: "🇵🇪", word: "PERU", difficulty: "facil" },
  { emoji: "🇮🇳", word: "ÍNDIA", difficulty: "facil" },

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
  { emoji: "🍋", word: "LIMÃO", difficulty: "medio" },
  { emoji: "🐰", word: "COELHO", difficulty: "medio" },
  { emoji: "🐴", word: "CAVALO", difficulty: "medio" },
  { emoji: "🐔", word: "GALINHA", difficulty: "medio" },
  { emoji: "🐒", word: "MACACO", difficulty: "medio" },
  { emoji: "🦒", word: "GIRAFA", difficulty: "medio" },
  { emoji: "🦈", word: "TUBARÃO", difficulty: "medio" },
  { emoji: "🦊", word: "RAPOSA", difficulty: "medio" },
  { emoji: "🐝", word: "ABELHA", difficulty: "medio" },
  { emoji: "🦉", word: "CORUJA", difficulty: "medio" },
  { emoji: "🚌", word: "ÔNIBUS", difficulty: "medio" },
  { emoji: "⌚", word: "RELÓGIO", difficulty: "medio" },
  { emoji: "📱", word: "CELULAR", difficulty: "medio" },
  { emoji: "🪑", word: "CADEIRA", difficulty: "medio" },
  { emoji: "📓", word: "CADERNO", difficulty: "medio" },
  { emoji: "🪟", word: "JANELA", difficulty: "medio" },
  { emoji: "🏫", word: "ESCOLA", difficulty: "medio" },
  { emoji: "🎒", word: "MOCHILA", difficulty: "medio" },
  { emoji: "🧴", word: "SHAMPOO", difficulty: "medio" },

  // Países (bandeiras)
  { emoji: "🇧🇷", word: "BRASIL", difficulty: "medio" },
  { emoji: "🇲🇽", word: "MÉXICO", difficulty: "medio" },
  { emoji: "🇨🇦", word: "CANADÁ", difficulty: "medio" },
  { emoji: "🇮🇹", word: "ITÁLIA", difficulty: "medio" },
  { emoji: "🇫🇷", word: "FRANÇA", difficulty: "medio" },
  { emoji: "🇪🇸", word: "ESPANHA", difficulty: "medio" },

  // Difícil
  { emoji: "🍪", word: "BISCOITO", difficulty: "dificil" },
  { emoji: "🍫", word: "CHOCOLATE", difficulty: "dificil" },
  { emoji: "🍉", word: "MELANCIA", difficulty: "dificil" },
  { emoji: "🍝", word: "MACARRÃO", difficulty: "dificil" },
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
  { emoji: "📺", word: "TELEVISÃO", difficulty: "dificil" },
  { emoji: "🧩", word: "QUEBRA-CABEÇA", difficulty: "dificil" },
  { emoji: "🌈", word: "ARCO-ÍRIS", difficulty: "dificil" },
  { emoji: "🩹", word: "BORRACHA", difficulty: "dificil" },
  { emoji: "☂️", word: "GUARDA-CHUVA", difficulty: "dificil" },
  { emoji: "🧊", word: "GELADEIRA", difficulty: "dificil" },

  // Países (bandeiras)
  { emoji: "🇵🇹", word: "PORTUGAL", difficulty: "dificil" },
  { emoji: "🇦🇷", word: "ARGENTINA", difficulty: "dificil" },
  { emoji: "🇩🇪", word: "ALEMANHA", difficulty: "dificil" },
  { emoji: "🇦🇺", word: "AUSTRÁLIA", difficulty: "dificil" },
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

const PHRASE_STAGES = [
  { id: 0, title: "Sessão 7 • Frases (Fácil)", rounds: 8, pass: 0.75 },
  { id: 1, title: "Sessão 8 • Frases (Médio)", rounds: 10, pass: 0.75 },
  { id: 2, title: "Sessão 9 • Frases (Difícil)", rounds: 12, pass: 0.75 },
];

const PHRASE_ITEMS = [
  // Fácil (até 3 palavras)
  { emoji: "❤️", word: "EU TE AMO" },
  { emoji: "🌟", word: "VOCÊ CONSEGUE" },
  { emoji: "🎉", word: "MUITO BEM" },
  { emoji: "😊", word: "BOM DIA" },
  { emoji: "🌙", word: "BOA NOITE" },
  { emoji: "🙏", word: "POR FAVOR" },
  { emoji: "🤝", word: "MUITO OBRIGADO" },
  { emoji: "💛", word: "EU TE ADORO" },
  { emoji: "👋", word: "OLÁ AMIGOS" },
  { emoji: "🧡", word: "TE AMO" },
  { emoji: "😄", word: "EU SOU FELIZ" },
  { emoji: "🏫", word: "VAMOS À ESCOLA" },

  // Médio (3 a 4 palavras)
  { emoji: "👩‍👧", word: "MAMÃE QUERIDA TE AMO" },
  { emoji: "👨‍👩‍👧", word: "EU AMO MINHA FAMÍLIA" },
  { emoji: "🧃", word: "SUCO DE MARACUJÁ" },
  { emoji: "🍓", word: "EU GOSTO DE MORANGO" },
  { emoji: "⚽", word: "EU GOSTO DE FUTEBOL" },
  { emoji: "📚", word: "EU GOSTO DE LER" },
  { emoji: "🌈", word: "EU VI O ARCO-ÍRIS" },
  { emoji: "🐶", word: "MEU CÃO É AMIGO" },
  { emoji: "🐱", word: "MEU GATO DORME MUITO" },
  { emoji: "🎵", word: "EU AMO MÚSICA" },
  { emoji: "🍽️", word: "EU COMO COMIDA BOA" },
  { emoji: "🧩", word: "EU FAÇO QUEBRA-CABEÇA" },

  // Difícil (4 palavras)
  { emoji: "💖", word: "EU TE AMO MUITO" },
  { emoji: "⭐", word: "VOCÊ É MUITO ESPECIAL" },
  { emoji: "👏", word: "PARABÉNS VOCÊ CONSEGUIU PASSAR" },
  { emoji: "💪", word: "TENTE MAIS UMA VEZ" },
  { emoji: "🎧", word: "EU USO FONE DE OUVIDO" },
  { emoji: "🚲", word: "EU ANDO DE BICICLETA" },
  { emoji: "🌻", word: "EU GOSTO DE FLORES" },
  { emoji: "🏡", word: "EU AMO MINHA CASA" },
  { emoji: "🐟", word: "EU VI UM PEIXE" },
  { emoji: "🍌", word: "EU COMI UMA BANANA" },
  { emoji: "🧠", word: "EU APRENDO TODO DIA" },
  { emoji: "🎮", word: "EU JOGO E APRENDO" },
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
  let writeMode = "spell"; // "spell" | "phrase"

  const phraseRun = { stageIndex: 0, roundsTotal: 0, round: 0, correct: 0, points: 0, pool: [], poolIdx: 0, lastWord: "", typed: "" };
  let currentPhrase = null;

  function normalizeFirstLetter(word) {
    return word
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")[0];
  }

  function normalizeWriteText(text, { keepSpaces }) {
    const raw = String(text || "").trim().toUpperCase();
    // Preserva Ç (senão o normalize+remove diacrítico converte Ç -> C)
    const token = "__CEDILLA__";
    const protectedCedilla = raw.replace(/Ç/g, token);

    const normalized = protectedCedilla
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replaceAll(token, "Ç");

    const cleaned = keepSpaces ? normalized.replace(/[^A-ZÇ ]/g, "") : normalized.replace(/[^A-ZÇ]/g, "");
    return keepSpaces ? cleaned.replace(/\s+/g, " ").trim() : cleaned;
  }

  function normalizeDisplayText(text, { keepSpaces }) {
    const raw = String(text || "").trim().toUpperCase();
    const token = "__CEDILLA__";
    const protectedCedilla = raw.replace(/Ç/g, token);

    const normalized = protectedCedilla
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replaceAll(token, "Ç");

    const cleaned = keepSpaces ? normalized.replace(/[^A-ZÇ \-]/g, "") : normalized.replace(/[^A-ZÇ\-]/g, "");
    return keepSpaces ? cleaned.replace(/\s+/g, " ").trim() : cleaned;
  }

  function getActiveWrite() {
    if (writeMode === "phrase") {
      return {
        stage: PHRASE_STAGES[phraseRun.stageIndex],
        run: phraseRun,
        current: currentPhrase,
        setCurrent: (v) => (currentPhrase = v),
        keepSpaces: true,
      };
    }
    return {
      stage: SPELL_STAGES[spellRun.stageIndex],
      run: spellRun,
      current: currentSpell,
      setCurrent: (v) => (currentSpell = v),
      keepSpaces: false,
    };
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
    // Esconde a palavra: o desafio é ouvir (áudio) + ver o ícone
    $("litQuestion").textContent = "Qual é a primeira letra?";

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
    const setText = (id, value) => {
      const el = $(id);
      if (el) el.textContent = value;
      return el;
    };

    setText("litResultCorrect", `${literacyRun.correct}/${total}`);
    setText("litResultAccuracy", `${Math.round(acc * 100)}%`);
    setText("litResultPoints", String(literacyRun.points));

    const titleEl = $("litResultTitle");
    const msgEl = $("litResultMessage");
    const primaryBtn = $("btnLitResultPrimary");
    const primaryHint = $("litResultPrimaryHint");
    const primaryLabel = $("litResultPrimaryLabel");
    if (!titleEl || !msgEl || !primaryBtn || !primaryHint || !primaryLabel) return;

    if (finishedAll) {
      titleEl.textContent = "Trilha concluída! 🎉";
      msgEl.textContent = "Agora vem um novo desafio: ouvir e ESCREVER a palavra escolhendo as letras!";
      primaryLabel.textContent = "Continuar";
      primaryHint.textContent = "escrita";
      primaryBtn.dataset.action = "spell";
    } else if (passed) {
      titleEl.textContent = "Muito bem! ✅";
      msgEl.textContent = `Você passou na ${stage.title}. Próxima sessão liberada!`;
      primaryLabel.textContent = "Continuar";
      primaryHint.textContent = "próxima sessão";
      primaryBtn.dataset.action = "next";
    } else {
      titleEl.textContent = "Vamos tentar de novo 💪";
      msgEl.textContent = `Você precisa de pelo menos ${Math.round(stage.pass * 100)}% de acertos para passar.`;
      primaryLabel.textContent = "Repetir sessão";
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
    return normalizeWriteText(word, { keepSpaces: false }).length;
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
    const w = normalizeWriteText(item?.word || "", { keepSpaces: false });
    if (w && w === spellRun.lastWord && spellRun.pool.length > 1) item = spellRun.pool[spellRun.poolIdx++ % spellRun.pool.length];
    spellRun.lastWord = normalizeWriteText(item?.word || "", { keepSpaces: false });
    return item;
  }

  function updateWriteStageBar() {
    const a = getActiveWrite();
    $("spellStageTitle").textContent = a.stage.title;
    $("spellStageProgress").textContent = `Questão ${Math.min(a.run.round + 1, a.run.roundsTotal)}/${a.run.roundsTotal}`;
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

    const cedilla = document.createElement("button");
    cedilla.type = "button";
    cedilla.className = "btn key-btn";
    cedilla.textContent = "Ç";
    cedilla.dataset.key = "Ç";
    el.appendChild(cedilla);

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
      onWriteKey(key);
    });

    spellKeyboardReady = true;
  }

  function renderWriteWordBoxes() {
    const el = $("spellWord");
    const a = getActiveWrite();
    if (!el || !a.current) return;
    el.innerHTML = "";
    const display = a.current.display;
    const typed = a.run.typed;
    let ti = 0; // índice em typed (ignora espaços do target)
    for (let i = 0; i < display.length; i++) {
      const ch = display[i];
      const box = document.createElement("div");
      if (ch === " ") {
        box.className = "spell-box space";
        box.textContent = "";
      } else if (ch === "-") {
        box.className = "spell-box hyphen";
        box.textContent = "-";
      } else {
        const t = typed[ti] || "";
        box.className = "spell-box" + (t ? " filled" : "");
        box.textContent = t;
        ti += 1;
      }
      el.appendChild(box);
    }
  }

  function renderSpell() {
    initSpellKeyboard();
    writeMode = "spell";
    updateWriteStageBar();
    spellLocked = false;

    const item = nextSpellItem();
    const display = normalizeDisplayText(item.word, { keepSpaces: false });
    currentSpell = {
      emoji: item.emoji,
      word: item.word,
      display,
      targetClean: normalizeWriteText(item.word, { keepSpaces: false }),
    };
    spellRun.typed = "";

    $("spellEmoji").textContent = item.emoji || "👂";
    $("spellQuestion").textContent = "Ouça e escreva a palavra";
    setFeedback($("spellFeedback"), "", null);
    renderWriteWordBoxes();
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
      renderWriteWordBoxes();
      return;
    }
    if (key === "CLEAR") {
      spellRun.typed = "";
      renderWriteWordBoxes();
      return;
    }
    if (key === "OK") {
      confirmSpellAnswer();
      return;
    }
    if (spellRun.typed.length >= currentSpell.targetClean.length) return;
    if (!/^[A-ZÇ]$/.test(key)) return;
    spellRun.typed += key;
    renderWriteWordBoxes();
  }

  function onWriteKey(key) {
    if (writeMode === "phrase") return onPhraseKey(key);
    return onSpellKey(key);
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
    const primaryLabel = $("spellResultPrimaryLabel");
    if (!title || !msg || !primaryBtn || !primaryHint || !primaryLabel) return;

    if (finishedAll) {
      const phrasePending = !state?.phrase?.completed;
      if (phrasePending) {
        title.textContent = "Muito bem! ✅";
        msg.textContent = "Novo desafio liberado: frases simples!";
        primaryLabel.textContent = "Continuar";
        primaryHint.textContent = "frases";
        primaryBtn.dataset.action = "phrase";
      } else {
        title.textContent = "Parabéns! Você concluiu tudo! 🎉";
        msg.textContent = `Pontuação total: ${state.points}.`;
        primaryLabel.textContent = "Continuar";
        primaryHint.textContent = "início";
        primaryBtn.dataset.action = "home";
      }
    } else if (passed) {
      title.textContent = "Excelente! ✅";
      msg.textContent = `Você passou na ${stage.title}. Próxima sessão liberada!`;
      primaryLabel.textContent = "Continuar";
      primaryHint.textContent = "próxima sessão";
      primaryBtn.dataset.action = "next";
    } else {
      title.textContent = "Quase lá 💪";
      msg.textContent = `Você precisa de pelo menos ${Math.round(stage.pass * 100)}% de acertos para passar.`;
      primaryLabel.textContent = "Repetir sessão";
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

    const target = currentSpell.targetClean;
    const typed = normalizeWriteText(spellRun.typed, { keepSpaces: false });

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

  // ----- Frases (sessão separada) -----

  function getNextPhraseStageToPlay() {
    const completedStages = Array.isArray(state?.phrase?.completedStages) ? state.phrase.completedStages : [false, false, false];
    const idx = completedStages.findIndex((x) => !x);
    return idx === -1 ? null : idx;
  }

  function countWords(str) {
    return String(str || "").trim().split(/\s+/).filter(Boolean).length;
  }

  function isPhraseAllowedByStage(text, stageIndex) {
    const wordCount = countWords(text);
    const hasHyphen = String(text).includes("-");
    if (stageIndex === 0) return wordCount <= 3 && !hasHyphen;
    if (stageIndex === 1) return wordCount >= 3 && wordCount <= 4;
    return wordCount === 4;
  }

  function buildPhrasePoolForStage(stageIndex) {
    const items = PHRASE_ITEMS.filter((it) => isPhraseAllowedByStage(it.word, stageIndex));
    phraseRun.pool = shuffle(items.length ? items : PHRASE_ITEMS);
    phraseRun.poolIdx = 0;
    phraseRun.lastWord = "";
  }

  function nextPhraseItem() {
    if (!phraseRun.pool.length || phraseRun.poolIdx >= phraseRun.pool.length) buildPhrasePoolForStage(phraseRun.stageIndex);
    let item = phraseRun.pool[phraseRun.poolIdx++];
    const w = normalizeWriteText(item?.word || "", { keepSpaces: true });
    if (w && w === phraseRun.lastWord && phraseRun.pool.length > 1) item = phraseRun.pool[phraseRun.poolIdx++ % phraseRun.pool.length];
    phraseRun.lastWord = normalizeWriteText(item?.word || "", { keepSpaces: true });
    return item;
  }

  function startPhraseStage(stageIndex) {
    phraseRun.stageIndex = stageIndex;
    phraseRun.roundsTotal = PHRASE_STAGES[stageIndex].rounds;
    phraseRun.round = 0;
    phraseRun.correct = 0;
    phraseRun.points = 0;
    buildPhrasePoolForStage(stageIndex);
    showScreen("spell"); // reutiliza a tela de escrita
    writeMode = "phrase";
    populateVoiceSelect("ttsVoiceSpell");
    renderPhrase();
  }

  function renderPhrase() {
    initSpellKeyboard();
    writeMode = "phrase";
    updateWriteStageBar();
    spellLocked = false;

    const item = nextPhraseItem();
    const display = normalizeDisplayText(item.word, { keepSpaces: true });
    currentPhrase = {
      emoji: item.emoji,
      word: item.word,
      display,
      targetClean: normalizeWriteText(item.word, { keepSpaces: false }),
    };
    phraseRun.typed = "";

    $("spellEmoji").textContent = item.emoji || "💬";
    $("spellQuestion").textContent = "Ouça e escreva a frase";
    setFeedback($("spellFeedback"), "", null);
    renderWriteWordBoxes();
    setTimeout(() => speakPtBr(item.word), 150);
  }

  function onPhraseKey(key) {
    if (spellLocked || !currentPhrase) return;
    ensureAudioCtx();

    if (key === "BACK") {
      phraseRun.typed = phraseRun.typed.slice(0, -1);
      renderWriteWordBoxes();
      return;
    }
    if (key === "CLEAR") {
      phraseRun.typed = "";
      renderWriteWordBoxes();
      return;
    }
    if (key === "OK") {
      confirmPhraseAnswer();
      return;
    }

    if (phraseRun.typed.length >= currentPhrase.targetClean.length) return;
    if (!/^[A-ZÇ]$/.test(key)) return;
    phraseRun.typed += key;
    renderWriteWordBoxes();
  }

  function showPhraseResult({ passed, finishedAll }) {
    const stage = PHRASE_STAGES[phraseRun.stageIndex];
    const total = phraseRun.roundsTotal;
    const acc = total ? phraseRun.correct / total : 0;

    $("spellResultCorrect").textContent = `${phraseRun.correct}/${total}`;
    $("spellResultAccuracy").textContent = `${Math.round(acc * 100)}%`;
    $("spellResultPoints").textContent = String(phraseRun.points);

    const title = $("spellResultTitle");
    const msg = $("spellResultMessage");
    const primaryBtn = $("btnSpellResultPrimary");
    const primaryHint = $("spellResultPrimaryHint");
    const primaryLabel = $("spellResultPrimaryLabel");
    if (!title || !msg || !primaryBtn || !primaryHint || !primaryLabel) return;

    if (finishedAll) {
      title.textContent = "Parabéns! 🎉";
      msg.textContent = `Você concluiu as frases. Pontuação total: ${state.points}.`;
      primaryLabel.textContent = "Continuar";
      primaryHint.textContent = "início";
      primaryBtn.dataset.action = "home";
    } else if (passed) {
      title.textContent = "Muito bem! ✅";
      msg.textContent = `Você passou na ${stage.title}.`;
      primaryLabel.textContent = "Continuar";
      primaryHint.textContent = "próxima frase";
      primaryBtn.dataset.action = "next_phrase";
    } else {
      title.textContent = "Quase lá 💪";
      msg.textContent = `Você precisa de pelo menos ${Math.round(stage.pass * 100)}% de acertos para passar.`;
      primaryLabel.textContent = "Repetir sessão";
      primaryHint.textContent = "treinar mais";
      primaryBtn.dataset.action = "retry_phrase";
    }

    showScreen("spellResult");
  }

  function finishPhraseStage() {
    const stage = PHRASE_STAGES[phraseRun.stageIndex];
    const acc = phraseRun.roundsTotal ? phraseRun.correct / phraseRun.roundsTotal : 0;
    const passed = acc >= stage.pass;

    if (!passed) return finishPhraseFailed();
    return finishPhrasePassed();
  }

  function finishPhraseFailed() {
    saveState();
    showPhraseResult({ passed: false, finishedAll: false });
  }

  function finishPhrasePassed() {
    state.phrase.completedStages[phraseRun.stageIndex] = true;
    state.phrase.unlockedStage = Math.max(state.phrase.unlockedStage, phraseRun.stageIndex + 1);

    const next = getNextPhraseStageToPlay();
    if (next !== null) return finishPhrasePassedAndContinue();
    return finishPhrasePassedAndCompleteAll();
  }

  function finishPhrasePassedAndContinue() {
    saveState();
    showPhraseResult({ passed: true, finishedAll: false });
  }

  function finishPhrasePassedAndCompleteAll() {
    state.phrase.completed = true;
    state.phrase.unlockedStage = PHRASE_STAGES.length - 1;
    saveState();
    showPhraseResult({ passed: true, finishedAll: true });
  }

  function confirmPhraseAnswer() {
    if (spellLocked || !currentPhrase) return;

    const target = currentPhrase.targetClean;
    const typed = normalizeWriteText(phraseRun.typed, { keepSpaces: false });

    if (typed.length < target.length) {
      setFeedback($("spellFeedback"), "Complete a frase antes de apertar OK.", "bad");
      return;
    }

    spellLocked = true;
    const ok = typed === target;

    if (ok) {
      setFeedback($("spellFeedback"), "Muito bem! ✅", "ok");
      addPoints(20);
      phraseRun.points += 20;
      phraseRun.correct += 1;
      playCorrectSound();
    } else {
      // Mostra a frase original (com espaços e acentuação) para não ficar "colado"
      setFeedback($("spellFeedback"), `A frase era: ${currentPhrase.word}`, "bad");
    }

    setTimeout(() => {
      phraseRun.round += 1;
      if (phraseRun.round >= phraseRun.roundsTotal) finishPhraseStage();
      else renderPhrase();
    }, ok ? 900 : 3000);
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

  function renderPhrasePath() {
    const el = $("phrasePath");
    if (!el) return;
    el.innerHTML = "";

    const spellDone = !!state?.spell?.completed;
    const next = spellDone ? getNextPhraseStageToPlay() : null;
    const unlockedMax = spellDone ? (typeof state?.phrase?.unlockedStage === "number" ? state.phrase.unlockedStage : 0) : -1;

    bindPhrasePathClick(el);

    PHRASE_STAGES.forEach((stage, i) => {
      const completed = !!state?.phrase?.completedStages?.[i];
      const locked = !spellDone || (!completed && i > unlockedMax);
      const current = spellDone && next !== null ? i === next : false;

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
      status.textContent = !spellDone
        ? "Bloqueada (conclua escrita)"
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

  function bindPhrasePathClick(el) {
    if (el.dataset.bound) return;
    el.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const item = target.closest(".path-item");
      if (!item) return;
      if (item.classList.contains("locked")) return;
      if (!state?.spell?.completed) return;

      const stageIndex = Number(item.dataset.stage);
      if (Number.isNaN(stageIndex)) return;

      startPhraseStage(stageIndex);
    });
    el.dataset.bound = "1";
  }

  function getHomeHint() {
    const nextLit = getNextLiteracyStageToPlay();
    const nextSpell = getNextSpellStageToPlay();
    const nextPhrase = getNextPhraseStageToPlay();
    if (nextLit !== null) return `próxima: ${LITERACY_STAGES[nextLit].title} (progressivo)`;
    if (nextSpell !== null) return `próxima: ${SPELL_STAGES[nextSpell].title} (escrita)`;
    if (!!state?.spell?.completed && nextPhrase !== null) return `próxima: ${PHRASE_STAGES[nextPhrase].title} (frases)`;
    return "tudo concluído — clique para recomeçar";
  }

  function renderHome() {
    renderLiteracyPath();
    renderSpellingPath();
    renderPhrasePath();
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

    const nextPhrase = getNextPhraseStageToPlay();
    if (!!state?.spell?.completed && nextPhrase !== null) {
      startPhraseStage(nextPhrase);
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
    const word = writeMode === "phrase" ? currentPhrase?.word : currentSpell?.word;
    if (word) speakPtBr(word);
  });
  $("btnSpellRestart")?.addEventListener("click", () => {
    if (writeMode === "phrase") return startPhraseStage(phraseRun.stageIndex);
    return startSpellStage(spellRun.stageIndex);
  });

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
    if (action === "phrase") {
      startPhraseStage(getNextPhraseStageToPlay() ?? 0);
      return;
    }
    if (action === "retry_phrase") {
      startPhraseStage(phraseRun.stageIndex);
      return;
    }
    if (action === "next_phrase") {
      startPhraseStage(getNextPhraseStageToPlay() ?? 0);
      return;
    }
    showScreen("home");
  });

  return { renderHome, getHomeHint, startFromHome };
}
