// Unit tests for the "Popraw błąd" (error-correction) question type and the
// fill-in corrected-sentence builder.
// Run: node --test tests/unit/
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  correctTokens,
  normalizeToken,
  correctWrongIndex,
  buildCorrectedSentence,
  buildCorrectSentence,
} = require("../../lib/pure-logic.js");

test("correctTokens splits on any whitespace run, dropping empties", () => {
  assert.deepEqual(correctTokens("She go to school."), ["She", "go", "to", "school."]);
  assert.deepEqual(correctTokens("  a   b\t c "), ["a", "b", "c"]);
  assert.deepEqual(correctTokens(""), []);
  assert.deepEqual(correctTokens(null), []);
});

test("normalizeToken strips edge punctuation but keeps inner apostrophes", () => {
  assert.equal(normalizeToken("school."), "school");
  assert.equal(normalizeToken('"Hello!"'), "hello");
  assert.equal(normalizeToken("don't"), "don't");
  assert.equal(normalizeToken("(word),"), "word");
});

test("correctWrongIndex finds the flagged word ignoring case and punctuation", () => {
  assert.equal(correctWrongIndex({ prompt: "She go to school.", wrong: "go" }), 1);
  assert.equal(correctWrongIndex({ prompt: "He don't know.", wrong: "don't" }), 1);
  assert.equal(correctWrongIndex({ prompt: "GO home now", wrong: "go" }), 0);
});

test("correctWrongIndex returns -1 when the flagged word is absent", () => {
  assert.equal(correctWrongIndex({ prompt: "She goes home", wrong: "run" }), -1);
});

test("buildCorrectedSentence swaps only the wrong word, preserving the rest", () => {
  assert.equal(
    buildCorrectedSentence({ prompt: "She go to school.", wrong: "go", answer: "goes" }),
    "She goes to school.",
  );
  assert.equal(
    buildCorrectedSentence({ prompt: "He don't know.", wrong: "don't", answer: "doesn't" }),
    "He doesn't know.",
  );
});

test("buildCorrectedSentence uses the first accepted answer variant", () => {
  assert.equal(
    buildCorrectedSentence({ prompt: "I has a cat", wrong: "has", answer: "have|'ve got" }),
    "I have a cat",
  );
});

test("buildCorrectedSentence returns the prompt unchanged when word not found", () => {
  assert.equal(
    buildCorrectedSentence({ prompt: "She goes home", wrong: "run", answer: "x" }),
    "She goes home",
  );
});

test("buildCorrectSentence fills a blank and capitalizes the result", () => {
  assert.equal(buildCorrectSentence({ prompt: "she ___ home" }, "goes"), "She goes home");
  assert.equal(
    buildCorrectSentence({ prompt: "Uzupełnij zdanie: She ___ to school" }, "goes"),
    "She goes to school",
  );
});

test("buildCorrectSentence without a blank just returns the trimmed answer", () => {
  assert.equal(buildCorrectSentence({ prompt: "What colour is the sky?" }, "  blue  "), "blue");
});
