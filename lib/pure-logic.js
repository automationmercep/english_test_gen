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
