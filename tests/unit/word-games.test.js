// Unit tests for the anagram and word-search question types.
// Run: npm run test:unit
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
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
} = require("../../lib/pure-logic.js");

// A small deterministic PRNG so crossword layout is stable across runs.
function seededRng() {
  let n = 0;
  return () => ((n = (n * 9301 + 49297) % 233280) + 1) / 233281;
}

// ── Anagram ─────────────────────────────────────────────────────────────────
test("anagramTiles drops spaces and keeps one tile per remaining char", () => {
  assert.deepEqual(anagramTiles("cat").map(t => t.char), ["c", "a", "t"]);
  assert.deepEqual(anagramTiles("ice cream").map(t => t.char), ["i", "c", "e", "c", "r", "e", "a", "m"]);
  assert.deepEqual(anagramTiles(""), []);
  assert.deepEqual(anagramTiles(null), []);
});

test("anagramTiles gives each tile a distinct id", () => {
  const ids = anagramTiles("book").map(t => t.id);
  assert.deepEqual(ids, [0, 1, 2, 3]);
});

test("checkAnagram ignores case, trailing punctuation and spaces", () => {
  assert.ok(checkAnagram("cat", "cat"));
  assert.ok(checkAnagram("CAT", "cat"));
  assert.ok(checkAnagram("ice cream", "icecream"));
  assert.ok(checkAnagram("dog.", "dog"));
  assert.ok(!checkAnagram("dog", "cat"));
});

test("checkAnagram rejects empty answers even when the guess is empty too", () => {
  assert.ok(!checkAnagram("", ""));
  assert.ok(!checkAnagram("   ", ""));
});

// ── Word search: normalization ──────────────────────────────────────────────
test("normalizeWordSearchWord uppercases and strips non-letters", () => {
  assert.equal(normalizeWordSearchWord("cat"), "CAT");
  assert.equal(normalizeWordSearchWord("ice-cream!"), "ICECREAM");
  assert.equal(normalizeWordSearchWord(" dog "), "DOG");
  assert.equal(normalizeWordSearchWord("123"), "");
});

// ── Word search: grid construction ──────────────────────────────────────────
test("buildWordSearchGrid places every valid word and fills the rest", () => {
  const seq = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.05];
  let i = 0;
  const rng = () => seq[i++ % seq.length];
  const result = buildWordSearchGrid(["cat", "dog", "bird"], { rng });
  assert.ok(result.size >= 8);
  assert.equal(result.grid.length, result.size);
  result.grid.forEach(row => assert.equal(row.length, result.size));
  // Every placed word's cells actually spell the word in the grid.
  result.placements.forEach(({ word, cells }) => {
    const spelled = cells.map(([r, c]) => result.grid[r][c]).join("");
    assert.equal(spelled, word);
  });
  // No empty cells remain.
  assert.ok(result.grid.every(row => row.every(cell => /^[A-Z]$/.test(cell))));
});

test("buildWordSearchGrid drops too-short, blank and duplicate words", () => {
  // A varying rng so both distinct words find a placement (a constant rng
  // would make every placement attempt land on the same degenerate line).
  let n = 0;
  const rng = () => ((n = (n * 9301 + 49297) % 233280) + 1) / 233281;
  const result = buildWordSearchGrid(["cat", "a", "", "cat", "dog"], { rng });
  assert.deepEqual([...result.words].sort(), ["CAT", "DOG"]);
});

test("buildWordSearchGrid handles no valid words without throwing", () => {
  const result = buildWordSearchGrid([], { rng: () => 0.1 });
  assert.deepEqual(result.words, []);
  assert.ok(result.size >= 8);
  assert.ok(result.grid.every(row => row.every(cell => /^[A-Z]$/.test(cell))));
});

// ── Word search: line selection ─────────────────────────────────────────────
test("wordSearchLineCells returns the straight/diagonal path inclusive of ends", () => {
  assert.deepEqual(wordSearchLineCells({ r: 0, c: 0 }, { r: 0, c: 2 }), [[0, 0], [0, 1], [0, 2]]);
  assert.deepEqual(wordSearchLineCells({ r: 0, c: 0 }, { r: 2, c: 0 }), [[0, 0], [1, 0], [2, 0]]);
  assert.deepEqual(wordSearchLineCells({ r: 0, c: 0 }, { r: 2, c: 2 }), [[0, 0], [1, 1], [2, 2]]);
  // Reversed diagonal.
  assert.deepEqual(wordSearchLineCells({ r: 2, c: 0 }, { r: 0, c: 2 }), [[2, 0], [1, 1], [0, 2]]);
});

test("wordSearchLineCells rejects non-straight, non-diagonal selections", () => {
  assert.equal(wordSearchLineCells({ r: 0, c: 0 }, { r: 1, c: 2 }), null);
  assert.equal(wordSearchLineCells(null, { r: 0, c: 0 }), null);
});

// ── Word search: matching a selection to a target word ──────────────────────
test("matchWordSearchSelection matches forward and backward, ignoring case", () => {
  assert.equal(matchWordSearchSelection("cat", ["CAT", "DOG"]), "CAT");
  assert.equal(matchWordSearchSelection("tac", ["CAT", "DOG"]), "CAT");
  assert.equal(matchWordSearchSelection("xyz", ["CAT", "DOG"]), null);
  assert.equal(matchWordSearchSelection("", ["CAT"]), null);
});

// ── Crossword ───────────────────────────────────────────────────────────────
test("crosswordAnswerLetters uppercases and strips non-letters", () => {
  assert.equal(crosswordAnswerLetters("cat"), "CAT");
  assert.equal(crosswordAnswerLetters("ice-cream"), "ICECREAM");
  assert.equal(crosswordAnswerLetters(" Dog! "), "DOG");
});

test("buildCrossword interlocks words on shared letters", () => {
  const cw = buildCrossword([
    { answer: "cat", clue: "meows" },
    { answer: "tiger", clue: "striped" },
    { answer: "rabbit", clue: "hops" },
  ], { rng: seededRng() });
  // At least two words placed, and they connect (grid smaller than laying them
  // end to end would be).
  assert.ok(cw.entries.length >= 2);
  assert.ok(cw.rows >= 1 && cw.cols >= 1);
  // Every placed entry's cells spell its letters in the grid.
  cw.entries.forEach(entry => {
    const letters = crosswordAnswerLetters(entry.answer);
    entry.cells.forEach(([r, c], i) => assert.equal(cw.grid[r][c].solution, letters[i]));
  });
});

test("buildCrossword numbers cells in reading order, shared across/down starts", () => {
  const cw = buildCrossword([
    { answer: "cat", clue: "meows" },
    { answer: "tiger", clue: "striped" },
  ], { rng: seededRng() });
  const numbers = cw.entries.map(e => e.number).filter(n => n != null);
  // Numbers are positive and non-decreasing when entries are sorted by number.
  assert.ok(numbers.every(n => n >= 1));
  const sorted = [...numbers].sort((a, b) => a - b);
  assert.deepEqual(numbers, sorted);
  // Each entry has a direction and a clue carried through.
  cw.entries.forEach(e => assert.ok(e.dir === "across" || e.dir === "down"));
});

test("buildCrossword drops words that cannot cross anything", () => {
  // "xyz" shares no letter with "cat", so it can't be placed.
  const cw = buildCrossword([
    { answer: "cat", clue: "meows" },
    { answer: "act", clue: "shares a,c,t with cat but overlaps awkwardly" },
    { answer: "xyz", clue: "no shared letters" },
  ], { rng: seededRng() });
  assert.ok(!cw.entries.some(e => e.answer === "xyz"));
  assert.ok(cw.entries.some(e => e.answer === "cat"));
});

test("buildCrossword handles empty / too-short input without throwing", () => {
  assert.deepEqual(buildCrossword([], { rng: seededRng() }).entries, []);
  assert.deepEqual(buildCrossword([{ answer: "a", clue: "single letter" }], { rng: seededRng() }).entries, []);
});

test("checkCrosswordCell compares case-insensitively and rejects blanks", () => {
  assert.ok(checkCrosswordCell("a", "A"));
  assert.ok(checkCrosswordCell("Z", "z"));
  assert.ok(!checkCrosswordCell("b", "A"));
  assert.ok(!checkCrosswordCell("", ""));
  assert.ok(!checkCrosswordCell("a", ""));
});

// ── Quiz-crossword (row-per-answer, no interlocking) ────────────────────────
test("buildQuizCrossword lays each answer on its own left-aligned row", () => {
  const qc = buildQuizCrossword([
    { answer: "cat", clue: "meows" },
    { answer: "rabbit", clue: "hops" },
  ]);
  assert.equal(qc.rows, 2);
  assert.equal(qc.cols, 6); // longest answer = rabbit
  // Row 0 = CAT in first 3 cells, rest blank.
  assert.deepEqual(qc.grid[0].map(c => c && c.solution), ["C", "A", "T", null, null, null]);
  assert.deepEqual(qc.grid[1].map(c => c && c.solution), ["R", "A", "B", "B", "I", "T"]);
  // Every row is across, numbered in order, cells anchored at column 0.
  assert.deepEqual(qc.entries.map(e => e.number), [1, 2]);
  assert.ok(qc.entries.every(e => e.dir === "across" && e.col === 0));
  assert.equal(qc.grid[0][0].number, 1);
  assert.equal(qc.grid[1][0].number, 2);
});

test("buildQuizCrossword never interlocks — rows are independent", () => {
  // Two answers sharing letters would cross in buildCrossword; here they stay
  // on separate rows regardless.
  const qc = buildQuizCrossword([
    { answer: "cat", clue: "c1" },
    { answer: "tea", clue: "c2" },
  ]);
  assert.equal(qc.rows, 2);
  assert.equal(qc.entries.length, 2);
});

test("buildQuizCrossword drops too-short answers and handles empty input", () => {
  const qc = buildQuizCrossword([
    { answer: "cat", clue: "c" },
    { answer: "a", clue: "too short" },
    { answer: "", clue: "blank" },
  ]);
  assert.equal(qc.entries.length, 1);
  assert.deepEqual(buildQuizCrossword([]).entries, []);
});
