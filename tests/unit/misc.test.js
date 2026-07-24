// Unit tests for small helpers: HTML escaping, capitalization, Polish
// pluralization, and choice correct-index resolution.
// Run: node --test "tests/unit/*.test.js"
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  escapeHtml,
  capitalize,
  testCountLabel,
  questionCountLabel,
  getCorrectIndexes,
} = require("../../lib/pure-logic.js");

test("escapeHtml escapes all five HTML-sensitive characters", () => {
  assert.equal(escapeHtml('<a href="x">Tom & Jerry\'s</a>'),
    "&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;");
  assert.equal(escapeHtml("plain text"), "plain text");
  assert.equal(escapeHtml(), "");
});

test("capitalize uppercases only the first character", () => {
  assert.equal(capitalize("hello"), "Hello");
  assert.equal(capitalize("a"), "A");
  assert.equal(capitalize(""), "");
});

test("testCountLabel handles the Polish singular", () => {
  assert.equal(testCountLabel(1), "test");
});

test("testCountLabel returns 'testy' for 2-4 (but not the teens)", () => {
  assert.equal(testCountLabel(2), "testy");
  assert.equal(testCountLabel(3), "testy");
  assert.equal(testCountLabel(4), "testy");
  assert.equal(testCountLabel(22), "testy");
  assert.equal(testCountLabel(24), "testy");
});

test("testCountLabel returns 'testów' for 0, 5-21, and the teens", () => {
  assert.equal(testCountLabel(0), "testów");
  assert.equal(testCountLabel(5), "testów");
  assert.equal(testCountLabel(11), "testów");
  assert.equal(testCountLabel(12), "testów");
  assert.equal(testCountLabel(13), "testów");
  assert.equal(testCountLabel(14), "testów");
  assert.equal(testCountLabel(25), "testów");
});

test("questionCountLabel handles the Polish singular", () => {
  assert.equal(questionCountLabel(1), "pytanie");
});

test("questionCountLabel returns 'pytania' for 2-4 (but not the teens)", () => {
  assert.equal(questionCountLabel(2), "pytania");
  assert.equal(questionCountLabel(3), "pytania");
  assert.equal(questionCountLabel(4), "pytania");
  assert.equal(questionCountLabel(22), "pytania");
  assert.equal(questionCountLabel(24), "pytania");
});

test("questionCountLabel returns 'pytań' for 0, 5-21, and the teens", () => {
  assert.equal(questionCountLabel(0), "pytań");
  assert.equal(questionCountLabel(5), "pytań");
  assert.equal(questionCountLabel(12), "pytań");
  assert.equal(questionCountLabel(13), "pytań");
  assert.equal(questionCountLabel(14), "pytań");
  assert.equal(questionCountLabel(25), "pytań");
});

test("getCorrectIndexes reads a single `correct` index", () => {
  assert.deepEqual(getCorrectIndexes({ correct: 2, answers: ["a", "b", "c", "d"] }), [2]);
});

test("getCorrectIndexes reads a `correctAnswers` array, deduped", () => {
  assert.deepEqual(
    getCorrectIndexes({ correctAnswers: [0, 2, 2], answers: ["a", "b", "c"] }),
    [0, 2],
  );
});

test("getCorrectIndexes drops out-of-range and non-integer indexes", () => {
  assert.deepEqual(
    getCorrectIndexes({ correctAnswers: [0, 5, -1, 1.5, 1], answers: ["a", "b", "c"] }),
    [0, 1],
  );
});
