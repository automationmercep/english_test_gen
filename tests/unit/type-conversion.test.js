// Unit tests for bulk question-type conversion families (the "change all
// questions to type X" action). Run: npm run test:unit
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  QUESTION_TYPE_FAMILIES,
  questionTypeFamily,
  isLossyTypeConversion,
} = require("../../lib/pure-logic.js");

// ── questionTypeFamily ────────────────────────────────────────────────────────
test("questionTypeFamily groups the single-answer text types together", () => {
  for (const type of ["choice", "fill", "order", "flashcard", "anagram", "correct"]) {
    assert.equal(questionTypeFamily(type), "text", `${type} should be text family`);
  }
});

test("questionTypeFamily groups the three crossword variants together", () => {
  assert.equal(questionTypeFamily("crossword"), "crossword");
  assert.equal(questionTypeFamily("quizcross"), "crossword");
  assert.equal(questionTypeFamily("keycross"), "crossword");
});

test("questionTypeFamily keeps match and wordsearch in their own families", () => {
  assert.equal(questionTypeFamily("match"), "match");
  assert.equal(questionTypeFamily("wordsearch"), "wordsearch");
});

test("questionTypeFamily falls back to text for unknown / missing types", () => {
  assert.equal(questionTypeFamily("nonsense"), "text");
  assert.equal(questionTypeFamily(undefined), "text");
  assert.equal(questionTypeFamily(""), "text");
});

test("QUESTION_TYPE_FAMILIES covers every supported question type exactly once", () => {
  const allTypes = ["choice", "fill", "order", "flashcard", "anagram", "correct",
    "crossword", "quizcross", "keycross", "match", "wordsearch"];
  assert.deepEqual(Object.keys(QUESTION_TYPE_FAMILIES).sort(), [...allTypes].sort());
});

// ── isLossyTypeConversion ─────────────────────────────────────────────────────
test("isLossyTypeConversion is false when the type does not change", () => {
  assert.equal(isLossyTypeConversion("crossword", "crossword"), false);
  assert.equal(isLossyTypeConversion("fill", "fill"), false);
});

test("isLossyTypeConversion is false within the same family", () => {
  assert.equal(isLossyTypeConversion("fill", "choice"), false);
  assert.equal(isLossyTypeConversion("anagram", "order"), false);
  assert.equal(isLossyTypeConversion("crossword", "quizcross"), false);
  assert.equal(isLossyTypeConversion("quizcross", "keycross"), false);
});

test("isLossyTypeConversion is true across families", () => {
  // The case from the report: crossword ↔ single-answer text loses the clue list.
  assert.equal(isLossyTypeConversion("crossword", "fill"), true);
  assert.equal(isLossyTypeConversion("keycross", "choice"), true);
  assert.equal(isLossyTypeConversion("choice", "crossword"), true);
  // match / wordsearch are their own islands.
  assert.equal(isLossyTypeConversion("match", "fill"), true);
  assert.equal(isLossyTypeConversion("wordsearch", "crossword"), true);
  assert.equal(isLossyTypeConversion("match", "wordsearch"), true);
});
