"use strict";

const fs = require("node:fs");
const path = require("node:path");

function findRepositoryRoot(startDirectory) {
  let current = path.resolve(startDirectory);
  while (true) {
    if (fs.existsSync(path.join(current, "lib", "pure-logic.js"))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error("Nie znaleziono katalogu repozytorium z lib/pure-logic.js.");
    current = parent;
  }
}

const repositoryRoot = findRepositoryRoot(__dirname);
const {
  anagramTiles,
  buildCrossword,
  buildKeyCrossword,
  buildQuizCrossword,
  clozeGapAnswers,
  correctWrongIndex,
  crosswordAnswerLetters,
  normalizeWordSearchWord,
  parseCsvLine,
} = require(path.join(repositoryRoot, "lib", "pure-logic.js"));

const TYPE_ALIASES = new Map();

function normalizeTypeToken(value) {
  return String(value || "")
    .toLocaleLowerCase("pl")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .trim();
}

function addAliases(type, aliases) {
  for (const alias of aliases) TYPE_ALIASES.set(normalizeTypeToken(alias), type);
}

addAliases("choice", ["choice", "wybór", "test wyboru", "multiple choice"]);
addAliases("fill", ["fill", "uzupełnij", "uzupełnianie", "uzupełnij zdanie"]);
addAliases("order", ["order", "uporządkuj", "uporządkuj zdanie", "kolejność"]);
addAliases("flashcard", ["flashcard", "fiszka", "fiszki"]);
addAliases("match", ["match", "dopasuj", "dopasowanie"]);
addAliases("correct", ["correct", "popraw", "popraw błąd", "poprawianie", "znajdź błąd"]);
addAliases("anagram", ["anagram", "anagramy"]);
addAliases("wordsearch", ["wordsearch", "wykreślanka", "wykreślanki", "szukaj słów"]);
addAliases("crossword", ["crossword", "krzyżówka", "krzyżówki"]);
addAliases("quizcross", ["quizcross", "krzyżówka z pytaniami", "krzyżówka pytania", "krzyżówka-pytania"]);
addAliases("keycross", ["keycross", "krzyżówka z hasłem", "krzyżówka hasło", "hasło"]);
addAliases("cloze", ["cloze", "luki", "uzupełnij luki", "gap fill", "gapfill"]);

function parsePair(field) {
  const separator = String(field || "").indexOf("=");
  if (separator < 1) return null;
  const left = field.slice(0, separator).trim();
  const right = field.slice(separator + 1).trim();
  return left && right ? { left, right } : null;
}

function seededRandom(seed) {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function normalizeVocabularyText(value) {
  return String(value || "")
    .toLocaleLowerCase("pl")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9']+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function containsVocabularyTerm(corpus, term) {
  const normalizedTerm = normalizeVocabularyText(term);
  if (!normalizedTerm) return false;
  return ` ${corpus} `.includes(` ${normalizedTerm} `);
}

function validateCsvText(csvText, options = {}) {
  const errors = [];
  const warnings = [];
  const counts = {};
  const parsedRows = [];
  const seenPrompts = new Map();
  const vocabularyParts = [];
  const sourceLines = String(csvText || "").replace(/^\uFEFF/, "").split(/\r?\n/);

  const error = (line, message) => errors.push({ line, message });
  const warning = (line, message) => warnings.push({ line, message });

  for (let index = 0; index < sourceLines.length; index++) {
    const lineNumber = index + 1;
    const source = sourceLines[index];
    if (!source.trim()) continue;

    const fields = parseCsvLine(source);
    if (!fields) {
      error(lineNumber, "Nieprawidłowo zamknięty cudzysłów CSV.");
      continue;
    }
    if (fields.length < 3 || !fields[0] || !fields[1]) {
      error(lineNumber, "Wiersz musi zawierać polecenie, dane odpowiedzi i token typu.");
      continue;
    }

    const rawType = fields.at(-1);
    const type = TYPE_ALIASES.get(normalizeTypeToken(rawType));
    if (!type) {
      error(lineNumber, `Nieznany lub brakujący token typu: "${rawType}".`);
      continue;
    }

    const content = fields.slice(0, -1);
    const rawPrompt = content[0];
    const instructionMatch = /^\[([^\]]+)\]\s*(.+)$/.exec(rawPrompt || "");
    const prompt = (instructionMatch ? instructionMatch[2] : rawPrompt).trim();
    const rest = content.slice(1);
    if (!prompt) {
      error(lineNumber, "Polecenie lub treść pytania jest pusta.");
      continue;
    }

    const promptKey = prompt.toLocaleLowerCase("pl");
    if (seenPrompts.has(promptKey)) warning(lineNumber, `Powtórzone polecenie z wiersza ${seenPrompts.get(promptKey)}.`);
    else seenPrompts.set(promptKey, lineNumber);

    counts[type] = (counts[type] || 0) + 1;
    parsedRows.push({ line: lineNumber, type, prompt });
    vocabularyParts.push(prompt);

    if (type === "choice") {
      const correct = (rest[0] || "").split("|").map(value => value.trim()).filter(Boolean);
      const incorrect = rest.slice(1).map(value => value.trim()).filter(Boolean);
      const answers = [...correct, ...incorrect];
      if (correct.length < 1) error(lineNumber, "Pytanie choice nie ma poprawnej odpowiedzi.");
      if (answers.length !== 4) error(lineNumber, `Pytanie choice musi mieć dokładnie 4 opcje; znaleziono ${answers.length}.`);
      const unique = new Set(answers.map(value => value.toLocaleLowerCase("pl")));
      if (unique.size !== answers.length) error(lineNumber, "Opcje choice muszą być różne.");
      vocabularyParts.push(...correct);
      continue;
    }

    if (type === "fill") {
      if (rest.length !== 1 || !rest[0]) error(lineNumber, "Fill wymaga dokładnie jednego pola z odpowiedzią.");
      if (!prompt.includes("___")) error(lineNumber, "Treść fill musi zawierać lukę oznaczoną ___.");
      vocabularyParts.push(rest[0]);
      continue;
    }

    if (type === "order" || type === "flashcard") {
      if (rest.length !== 1 || !rest[0]) error(lineNumber, `${type} wymaga dokładnie jednego pola z odpowiedzią.`);
      vocabularyParts.push(rest[0]);
      continue;
    }

    if (type === "match") {
      const pairs = rest.map(parsePair);
      if (pairs.length < 2 || pairs.some(pair => !pair)) error(lineNumber, "Match wymaga co najmniej dwóch pełnych par lewa=prawa.");
      vocabularyParts.push(...pairs.filter(Boolean).flatMap(pair => [pair.left, pair.right]));
      continue;
    }

    if (type === "correct") {
      const [wrong, fix] = rest;
      if (rest.length !== 2 || !wrong || !fix) {
        error(lineNumber, "Correct wymaga pól: zdanie, błędny token, poprawna forma, correct.");
      } else if (correctWrongIndex({ prompt, wrong: wrong.trim(), answer: fix.trim() }) === -1) {
        error(lineNumber, `Błędny token "${wrong}" nie występuje dosłownie w zdaniu.`);
      }
      vocabularyParts.push(fix);
      continue;
    }

    if (type === "anagram") {
      if (rest.length !== 1 || anagramTiles(rest[0]).length < 2) error(lineNumber, "Anagram wymaga jednego słowa mającego co najmniej 2 litery.");
      vocabularyParts.push(rest[0]);
      continue;
    }

    if (type === "wordsearch") {
      if (!rest.length || rest.some(word => normalizeWordSearchWord(word).length < 2)) {
        error(lineNumber, "Wordsearch wymaga co najmniej jednego słowa; każde musi mieć co najmniej 2 litery.");
      }
      vocabularyParts.push(...rest);
      continue;
    }

    if (type === "crossword" || type === "quizcross") {
      const pairs = rest.map(parsePair);
      if (pairs.length < 2 || pairs.some(pair => !pair)) {
        error(lineNumber, `${type} wymaga co najmniej dwóch pełnych par odpowiedź=wskazówka.`);
        continue;
      }
      const clues = pairs.map(pair => ({ answer: pair.left, clue: pair.right }));
      vocabularyParts.push(...pairs.flatMap(pair => [pair.left, pair.right]));
      if (clues.some(clue => crosswordAnswerLetters(clue.answer).length < 2)) {
        error(lineNumber, "Każda odpowiedź krzyżówki musi mieć co najmniej 2 litery.");
        continue;
      }
      const built = type === "crossword"
        ? buildCrossword(clues, { attempts: 200, rng: seededRandom(lineNumber) })
        : buildQuizCrossword(clues);
      if (built.entries.length !== clues.length) {
        error(lineNumber, `${type} układa ${built.entries.length} z ${clues.length} haseł; wszystkie hasła muszą znaleźć się w siatce.`);
      }
      continue;
    }

    if (type === "keycross") {
      const key = rest[0] || "";
      const keyLength = crosswordAnswerLetters(key).length;
      const pairs = rest.slice(1).map(parsePair);
      if (keyLength < 2) error(lineNumber, "Hasło keycross musi mieć co najmniej 2 litery.");
      if (pairs.some(pair => !pair)) {
        error(lineNumber, "Keycross zawiera niepełną parę odpowiedź=wskazówka.");
        continue;
      }
      if (pairs.length !== keyLength) error(lineNumber, `Keycross wymaga ${keyLength} par — po jednej na literę hasła; znaleziono ${pairs.length}.`);
      const clues = pairs.map(pair => ({ answer: pair.left, clue: pair.right }));
      vocabularyParts.push(key, ...pairs.flatMap(pair => [pair.left, pair.right]));
      const built = buildKeyCrossword(key, clues);
      if (built.entries.length !== keyLength) {
        error(lineNumber, `Keycross układa ${built.entries.length} z ${keyLength} wierszy; odpowiedzi nie zawierają właściwych liter hasła.`);
      }
      continue;
    }

    if (type === "cloze") {
      if (clozeGapAnswers(prompt).length > 0) {
        error(lineNumber, "Pole pytania cloze ujawnia odpowiedzi w nawiasach [ ]; odpowiedzi mogą występować tylko w drugim polu CSV.");
      }
      if (rest.length !== 1) {
        error(lineNumber, "Tekst cloze musi być jednym polem CSV; otocz go cudzysłowem, jeśli zawiera przecinki.");
        continue;
      }
      const gapCount = clozeGapAnswers(rest[0]).length;
      if (gapCount < 2 || gapCount > 5) error(lineNumber, `Cloze powinien zawierać 2–5 luk; znaleziono ${gapCount}.`);
      vocabularyParts.push(rest[0]);
    }
  }

  const total = parsedRows.length;
  if (options.expectTotal !== undefined && total !== options.expectTotal) {
    error(0, `Oczekiwano ${options.expectTotal} wierszy, znaleziono ${total}.`);
  }
  for (const [type, expected] of Object.entries(options.expectTypes || {})) {
    if ((counts[type] || 0) !== expected) error(0, `Oczekiwano ${expected} pytań typu ${type}, znaleziono ${counts[type] || 0}.`);
  }
  for (const type of options.requireTypes || []) {
    if (!counts[type]) error(0, `Brakuje wymaganego typu: ${type}.`);
  }
  const vocabularyCorpus = normalizeVocabularyText(vocabularyParts.join(" "));
  for (const alternatives of options.requireWords || []) {
    if (!alternatives.some(term => containsVocabularyTerm(vocabularyCorpus, term))) {
      error(0, `Brakuje wymaganego słowa lub formy: ${alternatives.join(" / ")}.`);
    }
  }

  return { valid: errors.length === 0, total, counts, errors, warnings, rows: parsedRows };
}

function parseTypeCounts(value) {
  const result = {};
  for (const item of String(value || "").split(",").filter(Boolean)) {
    const [rawType, rawCount] = item.split("=");
    const type = TYPE_ALIASES.get(normalizeTypeToken(rawType));
    const count = Number(rawCount);
    if (!type || !Number.isInteger(count) || count < 0) throw new Error(`Nieprawidłowe oczekiwanie typu: ${item}`);
    result[type] = count;
  }
  return result;
}

function parseRequiredWords(value) {
  return String(value || "").split(",").map(group => {
    const alternatives = group.split("|").map(word => word.trim()).filter(Boolean);
    if (!alternatives.length) throw new Error(`Nieprawidłowa grupa wymaganych słów: ${group}`);
    return alternatives;
  }).filter(group => group.length);
}

function parseArguments(argv) {
  const options = { expectTypes: {}, requireTypes: [], requireWords: [] };
  let file;
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === "--json") options.json = true;
    else if (argument === "--expect-total") options.expectTotal = Number(argv[++index]);
    else if (argument === "--expect-types") options.expectTypes = parseTypeCounts(argv[++index]);
    else if (argument === "--require-words") options.requireWords = parseRequiredWords(argv[++index]);
    else if (argument === "--require-types") {
      options.requireTypes = String(argv[++index] || "").split(",").filter(Boolean).map(rawType => {
        const type = TYPE_ALIASES.get(normalizeTypeToken(rawType));
        if (!type) throw new Error(`Nieznany wymagany typ: ${rawType}`);
        return type;
      });
    } else if (!file) file = argument;
    else throw new Error(`Nieznany argument: ${argument}`);
  }
  if (!file) throw new Error("Podaj ścieżkę do pliku CSV.");
  if (options.expectTotal !== undefined && (!Number.isInteger(options.expectTotal) || options.expectTotal < 0)) {
    throw new Error("--expect-total wymaga nieujemnej liczby całkowitej.");
  }
  return { file, options };
}

function printResult(result, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  for (const issue of result.errors) console.error(`BŁĄD${issue.line ? ` [wiersz ${issue.line}]` : ""}: ${issue.message}`);
  for (const issue of result.warnings) console.warn(`OSTRZEŻENIE${issue.line ? ` [wiersz ${issue.line}]` : ""}: ${issue.message}`);
  const counts = Object.entries(result.counts).map(([type, count]) => `${type}=${count}`).join(", ") || "brak";
  console.log(`${result.valid ? "OK" : "NIEPOPRAWNY"}: ${result.total} wierszy. Typy: ${counts}.`);
}

if (require.main === module) {
  try {
    const { file, options } = parseArguments(process.argv.slice(2));
    const csvText = fs.readFileSync(path.resolve(file), "utf8");
    const result = validateCsvText(csvText, options);
    printResult(result, options.json);
    process.exitCode = result.valid ? 0 : 1;
  } catch (error) {
    console.error(`BŁĄD: ${error.message}`);
    process.exitCode = 2;
  }
}

module.exports = { normalizeTypeToken, parseArguments, parseRequiredWords, parseTypeCounts, validateCsvText };
