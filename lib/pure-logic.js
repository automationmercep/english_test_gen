// Pure, side-effect-free logic shared by the app and the unit tests.
//
// Why this file exists: app.js runs DOM/localStorage code at load time, so it
// can't be `require()`d from Node. These functions have no such dependencies,
// so they live here where both worlds can reach them:
//   - In the browser, this is a classic <script> loaded BEFORE app.js, so the
//     functions become globals that app.js calls unchanged.
//   - In Node (unit tests), the guard at the bottom exports them via CommonJS.
// Keep this file free of DOM, localStorage, timers, and app-level state.

// ── Answer matching (choice/fill text answers) ──────────────────────────────
function normalize(value) {
  return String(value).trim().toLocaleLowerCase("en").replace(/[.!?]$/, "");
}
function acceptedAnswers(answer) {
  return String(answer || "").split("|").map(part => part.trim()).filter(Boolean);
}
function matchesTextAnswer(userValue, answer) {
  const norm = normalize(userValue);
  return acceptedAnswers(answer).some(variant => normalize(variant) === norm);
}

// ── Error-correction question type ("Popraw błąd") ──────────────────────────
function correctTokens(prompt) {
  return String(prompt || "").split(/\s+/).filter(Boolean);
}
function normalizeToken(token) {
  return String(token).replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, "").toLocaleLowerCase("en");
}
function correctWrongIndex(question) {
  const target = normalizeToken(question.wrong || "");
  return correctTokens(question.prompt).findIndex(token => normalizeToken(token) === target);
}
function buildCorrectedSentence(question) {
  const tokens = correctTokens(question.prompt);
  const index = correctWrongIndex(question);
  const fix = acceptedAnswers(question.answer)[0] || "";
  if (index >= 0) tokens[index] = tokens[index].replace(/\p{L}[\p{L}\p{N}']*/u, fix);
  return tokens.join(" ");
}
function buildCorrectSentence(question, correctText) {
  const prompt = String(question.prompt || "").trim();
  const answer = String(correctText || "").trim();
  if (/_{2,}/.test(prompt)) {
    const completedSentence = prompt
      .replace(/^(?:uzupełnij|complete)[^:]*:\s*/i, "")
      .replace(/_{2,}/, answer)
      .trim();
    return completedSentence.charAt(0).toUpperCase() + completedSentence.slice(1);
  }
  return answer;
}

// ── Small string/HTML helpers ───────────────────────────────────────────────
function escapeHtml(value = "") {
  return value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// ── Polish pluralization for the word "test" (1 test / 2 testy / 5 testów) ──
function testCountLabel(count) {
  if (count === 1) return "test";
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14)) return "testy";
  return "testów";
}

// ── Choice question: which answer indexes are correct ───────────────────────
function getCorrectIndexes(question) {
  const indexes = Array.isArray(question.correctAnswers) ? question.correctAnswers : [question.correct];
  return [...new Set(indexes.map(Number).filter(index => Number.isInteger(index) && index >= 0 && index < question.answers.length))];
}

// ── CSV parsing/quoting ─────────────────────────────────────────────────────
function parseCsvLine(line) {
  const fields = [];
  let value = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { value += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(value.trim());
      value = "";
    } else value += char;
  }
  if (inQuotes) return null;
  fields.push(value.trim());
  return fields;
}
function csvQuoteField(value) {
  const text = String(value || "");
  return /[,"\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}
function formatDailyWordCsvField(value) {
  const text = String(value || "");
  return /[,"\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}
function dailyWordsToCsv(words) {
  return words.map(item => [
    formatDailyWordCsvField(item.word),
    formatDailyWordCsvField(item.translation),
  ].join(", ")).join("\n");
}

// ── Verb-conjugation generator (Present/Past Simple) ────────────────────────
const VERB_GENERATOR_THIRD_PERSON_SUBJECTS = new Set(["he", "she", "it"]);
const VERB_GENERATOR_PRESENT_IRREGULAR_FORMS = { have: "has", be: "is" };
// Past Simple form is the same for every subject, so this list only needs the base → past mapping.
const VERB_GENERATOR_PAST_IRREGULAR_FORMS = {
  be: "was", have: "had", go: "went", do: "did", make: "made", get: "got", know: "knew",
  think: "thought", take: "took", see: "saw", come: "came", want: "wanted", look: "looked",
  give: "gave", use: "used", find: "found", tell: "told", ask: "asked", work: "worked",
  seem: "seemed", feel: "felt", try: "tried", leave: "left", call: "called", say: "said",
  become: "became", show: "showed", bring: "brought", write: "wrote", sit: "sat",
  stand: "stood", lose: "lost", pay: "paid", meet: "met", let: "let", begin: "began",
  keep: "kept", hold: "held", speak: "spoke", run: "ran", read: "read", grow: "grew",
  win: "won", teach: "taught", eat: "ate", drink: "drank", buy: "bought", send: "sent",
  build: "built", spend: "spent", set: "set", learn: "learnt", understand: "understood",
  hear: "heard", drive: "drove", break: "broke", catch: "caught",
  choose: "chose", cut: "cut", draw: "drew", fall: "fell", feed: "fed", fight: "fought",
  fly: "flew", forget: "forgot", forgive: "forgave", freeze: "froze", hide: "hid", hit: "hit",
  hurt: "hurt", lay: "laid", lead: "led", lend: "lent", lie: "lay", light: "lit",
  put: "put", ride: "rode", ring: "rang", rise: "rose", sell: "sold", shine: "shone",
  shoot: "shot", shut: "shut", sing: "sang", sink: "sank", sleep: "slept", smell: "smelt",
  speed: "sped", spell: "spelt", spill: "spilt", spread: "spread", swim: "swam",
  swing: "swung", throw: "threw", wake: "woke", wear: "wore", cost: "cost",
};

function parseVerbToken(token) {
  const [base, override] = token.split("=").map(part => part.trim());
  return { verb: base, override: override || null };
}
function conjugatePresentSimple(verb, thirdPersonSingular) {
  const trimmed = verb.trim();
  if (!thirdPersonSingular) return trimmed;
  const lower = trimmed.toLowerCase();
  if (VERB_GENERATOR_PRESENT_IRREGULAR_FORMS[lower]) return VERB_GENERATOR_PRESENT_IRREGULAR_FORMS[lower];
  if (/(?:s|x|z|sh|ch)$/i.test(trimmed)) return trimmed + "es";
  if (/[^aeiou]y$/i.test(trimmed)) return trimmed.slice(0, -1) + "ies";
  if (/o$/i.test(trimmed)) return trimmed + "es";
  return trimmed + "s";
}
function conjugatePastSimple(verb) {
  const trimmed = verb.trim();
  const lower = trimmed.toLowerCase();
  if (VERB_GENERATOR_PAST_IRREGULAR_FORMS[lower]) return VERB_GENERATOR_PAST_IRREGULAR_FORMS[lower];
  if (/e$/i.test(trimmed)) return trimmed + "d";
  if (/[^aeiou]y$/i.test(trimmed)) return trimmed.slice(0, -1) + "ied";
  if (/[^aeiou][aeiou][bcdfgklmnprtvz]$/i.test(trimmed) && trimmed.length <= 4) return trimmed + trimmed.slice(-1) + "ed";
  return trimmed + "ed";
}
function questionAuxiliary(isPast, thirdPersonSingular) {
  if (isPast) return "Did";
  return thirdPersonSingular ? "Does" : "Do";
}

// ── Text-to-speech voice selection ─────────────────────────────────────────
// The Web Speech API exposes no gender field, so we heuristically flag a voice
// as female by well-known name fragments (Windows/macOS/Google/Polish voices).
// Male-only names (David, Mark, George, Daniel, Alex, Adam, ...) match nothing
// here and fall through. Note "male" is a substring of "female" — do NOT add a
// bare "male" hint or every male voice would match.
const FEMALE_VOICE_HINTS = [
  "female", "zira", "hazel", "susan", "linda", "heera", "samantha", "victoria",
  "karen", "moira", "tessa", "fiona", "serena", "catherine", "eva", "aria",
  "jenny", "michelle", "sonia", "paulina", "zosia", "ewa", "agata", "maja", "kasia",
];
function isFemaleVoiceName(name) {
  const lower = String(name || "").toLowerCase();
  return FEMALE_VOICE_HINTS.some(hint => lower.includes(hint));
}

// ── Anagram question type ("Anagram") ──────────────────────────────────────
// The player rearranges letter tiles to spell the answer. Spaces are dropped
// (so a multi-word answer becomes one bag of letters); matching ignores case,
// trailing punctuation and any spaces on either side.
function anagramTiles(answer) {
  return String(answer || "").replace(/\s+/g, "").split("").map((char, id) => ({ char, id }));
}
function checkAnagram(selected, answer) {
  const strip = value => normalize(String(value || "").replace(/\s+/g, ""));
  return strip(selected) === strip(answer) && strip(answer) !== "";
}

// ── Word-search question type ("Wykreślanka") ───────────────────────────────
// A square grid of letters hiding each target word once, placed horizontally,
// vertically or diagonally (forward direction only — the player may still read
// a word backwards, which `matchWordSearchSelection` accepts). Empty cells are
// filled with random letters. `options.rng` (default Math.random) makes the
// placement/fill deterministic in tests.
function normalizeWordSearchWord(word) {
  return String(word || "").toLocaleUpperCase("en").replace(/[^\p{L}]/gu, "");
}
const WORD_SEARCH_DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1]];
const WORD_SEARCH_FILLER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function buildWordSearchGrid(words, options = {}) {
  const rng = typeof options.rng === "function" ? options.rng : Math.random;
  const randInt = bound => Math.floor(rng() * bound);
  const cleaned = [];
  const seen = new Set();
  (Array.isArray(words) ? words : []).forEach(word => {
    const clean = normalizeWordSearchWord(word);
    if (clean && clean.length >= 2 && !seen.has(clean)) { seen.add(clean); cleaned.push(clean); }
  });
  const longest = cleaned.reduce((max, word) => Math.max(max, word.length), 0);
  const totalLetters = cleaned.reduce((sum, word) => sum + word.length, 0);
  const size = Math.max(options.size || 0, longest, Math.ceil(Math.sqrt(totalLetters * 1.8)), 8);
  const grid = Array.from({ length: size }, () => Array(size).fill(""));
  const placements = [];
  const fits = (word, row, col, dr, dc) => {
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) return false;
      const existing = grid[r][c];
      if (existing && existing !== word[i]) return false;
    }
    return true;
  };
  cleaned.forEach(word => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const [dr, dc] = WORD_SEARCH_DIRECTIONS[randInt(WORD_SEARCH_DIRECTIONS.length)];
      const row = randInt(size);
      const col = randInt(size);
      if (!fits(word, row, col, dr, dc)) continue;
      const cells = [];
      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        grid[r][c] = word[i];
        cells.push([r, c]);
      }
      placements.push({ word, cells });
      return;
    }
  });
  const placed = placements.map(placement => placement.word);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = WORD_SEARCH_FILLER[randInt(WORD_SEARCH_FILLER.length)];
    }
  }
  return { size, grid, placements, words: placed };
}
function wordSearchLineCells(start, end) {
  if (!start || !end) return null;
  const dr = end.r - start.r;
  const dc = end.c - start.c;
  const adr = Math.abs(dr);
  const adc = Math.abs(dc);
  if (!(dr === 0 || dc === 0 || adr === adc)) return null;
  const steps = Math.max(adr, adc);
  const sr = Math.sign(dr);
  const sc = Math.sign(dc);
  const cells = [];
  for (let i = 0; i <= steps; i++) cells.push([start.r + sr * i, start.c + sc * i]);
  return cells;
}
function matchWordSearchSelection(letters, words) {
  const forward = normalizeWordSearchWord(letters);
  if (!forward) return null;
  const backward = forward.split("").reverse().join("");
  return (Array.isArray(words) ? words : [])
    .map(normalizeWordSearchWord)
    .find(word => word && (word === forward || word === backward)) || null;
}

// ── Crossword question type ("Krzyżówka") ───────────────────────────────────
// A crossword is a list of { answer, clue } entries. buildCrossword interlocks
// the answers into a compact grid: the first word goes across, each subsequent
// word is placed crossing an already-placed word at a shared letter (words that
// can't cross anything are dropped). The result is normalized to a tight grid
// with standard across/down numbering. `options.rng` (default Math.random) only
// affects the try-order of candidate crossings, keeping tests deterministic.
function crosswordAnswerLetters(answer) {
  return String(answer || "").toLocaleUpperCase("en").replace(/[^\p{L}]/gu, "");
}
function buildCrossword(entries, options = {}) {
  const rng = typeof options.rng === "function" ? options.rng : Math.random;
  const prepared = (Array.isArray(entries) ? entries : [])
    .map(entry => ({ letters: crosswordAnswerLetters(entry.answer), clue: String(entry.clue || "").trim(), answer: String(entry.answer || "").trim() }))
    .filter(entry => entry.letters.length >= 2);
  // Longest first tends to produce a denser, more connected grid.
  prepared.sort((a, b) => b.letters.length - a.letters.length);

  const placed = [];
  const cellMap = new Map(); // "r,c" -> letter
  const key = (r, c) => `${r},${c}`;
  const canPlace = (letters, row, col, dr, dc) => {
    let crossings = 0;
    for (let i = 0; i < letters.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      const existing = cellMap.get(key(r, c));
      if (existing !== undefined) {
        if (existing !== letters[i]) return -1;
        crossings++;
      } else {
        // A new (non-crossing) cell must not touch other words on its sides,
        // nor bump another word head-to-tail, or letters would run together.
        const [sr, sc] = [dc, dr]; // perpendicular unit
        if (cellMap.has(key(r + sr, c + sc)) || cellMap.has(key(r - sr, c - sc))) return -1;
      }
    }
    // Cells immediately before the start and after the end must be empty.
    if (cellMap.has(key(row - dr, col - dc))) return -1;
    if (cellMap.has(key(row + dr * letters.length, col + dc * letters.length))) return -1;
    return crossings;
  };
  const commit = (entry, row, col, dr, dc) => {
    const cells = [];
    for (let i = 0; i < entry.letters.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      cellMap.set(key(r, c), entry.letters[i]);
      cells.push([r, c]);
    }
    placed.push({ ...entry, row, col, dir: dr === 0 ? "across" : "down", cells });
  };

  prepared.forEach((entry, index) => {
    if (index === 0) { commit(entry, 0, 0, 0, 1); return; }
    const candidates = [];
    placed.forEach(existing => {
      existing.cells.forEach(([er, ec], ei) => {
        for (let li = 0; li < entry.letters.length; li++) {
          if (entry.letters[li] !== existing.letters[ei]) continue;
          // Cross perpendicular to the existing word.
          const [dr, dc] = existing.dir === "across" ? [1, 0] : [0, 1];
          const row = er - dr * li;
          const col = ec - dc * li;
          const score = canPlace(entry.letters, row, col, dr, dc);
          if (score > 0) candidates.push({ row, col, dr, dc, score });
        }
      });
    });
    if (!candidates.length) return; // unplaceable — dropped
    // Prefer more crossings; break ties with rng for layout variety.
    candidates.sort((a, b) => b.score - a.score || (rng() - 0.5));
    const best = candidates[0];
    commit(entry, best.row, best.col, best.dr, best.dc);
  });

  // Normalize to a tight grid starting at (0,0).
  let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
  cellMap.forEach((_, k) => {
    const [r, c] = k.split(",").map(Number);
    minR = Math.min(minR, r); minC = Math.min(minC, c);
    maxR = Math.max(maxR, r); maxC = Math.max(maxC, c);
  });
  if (!isFinite(minR)) return { rows: 0, cols: 0, grid: [], entries: [] };
  const rows = maxR - minR + 1;
  const cols = maxC - minC + 1;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  const shifted = placed.map(entry => ({
    ...entry,
    row: entry.row - minR,
    col: entry.col - minC,
    cells: entry.cells.map(([r, c]) => [r - minR, c - minC]),
  }));
  shifted.forEach(entry => entry.cells.forEach(([r, c], i) => { grid[r][c] = { solution: entry.letters[i] }; }));

  // Standard numbering: scan top-to-bottom, left-to-right; a cell gets a number
  // when it starts an across and/or down word. Assign that number to both.
  let number = 0;
  const numberAt = new Map();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c]) continue;
      const startsAcross = (c === 0 || !grid[r][c - 1]) && c + 1 < cols && grid[r][c + 1];
      const startsDown = (r === 0 || !grid[r - 1][c]) && r + 1 < rows && grid[r + 1][c];
      if (startsAcross || startsDown) { number++; numberAt.set(`${r},${c}`, number); grid[r][c].number = number; }
    }
  }
  const outEntries = shifted.map(entry => ({
    answer: entry.answer,
    clue: entry.clue,
    dir: entry.dir,
    row: entry.row,
    col: entry.col,
    cells: entry.cells,
    number: numberAt.get(`${entry.row},${entry.col}`),
  })).sort((a, b) => a.number - b.number || (a.dir === b.dir ? 0 : a.dir === "across" ? -1 : 1));

  return { rows, cols, grid, entries: outEntries };
}

// ── Quiz-crossword question type ("Krzyżówka z pytaniami") ───────────────────
// Same { answer, clue } entries, but answers do NOT interlock: each is laid out
// as its own numbered horizontal row of one letter-cell per answer letter, and
// the clue is the question. buildQuizCrossword returns a grid (rows = entries,
// cols = longest answer, left-aligned) of { solution, number? } / null cells,
// plus a numbered `entries` list. The player types one letter per cell.
function buildQuizCrossword(entries) {
  const prepared = (Array.isArray(entries) ? entries : [])
    .map(entry => ({ letters: crosswordAnswerLetters(entry.answer), clue: String(entry.clue || "").trim(), answer: String(entry.answer || "").trim() }))
    .filter(entry => entry.letters.length >= 2);
  if (!prepared.length) return { rows: 0, cols: 0, grid: [], entries: [] };

  const rows = prepared.length;
  const cols = prepared.reduce((max, entry) => Math.max(max, entry.letters.length), 0);
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  const outEntries = prepared.map((entry, r) => {
    const cells = [];
    for (let c = 0; c < entry.letters.length; c++) {
      grid[r][c] = { solution: entry.letters[c] };
      cells.push([r, c]);
    }
    grid[r][0].number = r + 1;
    return { answer: entry.answer, clue: entry.clue, dir: "across", row: r, col: 0, cells, number: r + 1 };
  });
  return { rows, cols, grid, entries: outEntries };
}
function checkCrosswordCell(value, solution) {
  return normalizeToken(String(value || "")) === normalizeToken(String(solution || "")) && String(solution || "") !== "";
}

// Node (unit tests) only; ignored in the browser where `module` is undefined.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    isFemaleVoiceName,
    FEMALE_VOICE_HINTS,
    normalize,
    acceptedAnswers,
    matchesTextAnswer,
    correctTokens,
    normalizeToken,
    correctWrongIndex,
    buildCorrectedSentence,
    buildCorrectSentence,
    anagramTiles,
    checkAnagram,
    normalizeWordSearchWord,
    buildWordSearchGrid,
    wordSearchLineCells,
    matchWordSearchSelection,
    crosswordAnswerLetters,
    buildCrossword,
    buildQuizCrossword,
    checkCrosswordCell,
    escapeHtml,
    capitalize,
    testCountLabel,
    getCorrectIndexes,
    parseCsvLine,
    csvQuoteField,
    formatDailyWordCsvField,
    dailyWordsToCsv,
    parseVerbToken,
    conjugatePresentSimple,
    conjugatePastSimple,
    questionAuxiliary,
    VERB_GENERATOR_THIRD_PERSON_SUBJECTS,
    VERB_GENERATOR_PRESENT_IRREGULAR_FORMS,
    VERB_GENERATOR_PAST_IRREGULAR_FORMS,
  };
}
