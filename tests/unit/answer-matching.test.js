// Unit tests for the text-answer matching logic (choice/fill question types).
// Run: node --test tests/unit/
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { normalize, acceptedAnswers, matchesTextAnswer } = require("../../lib/pure-logic.js");

test("normalize trims, lowercases and strips trailing sentence punctuation", () => {
  assert.equal(normalize("  Hello.  "), "hello");
  assert.equal(normalize("YES!"), "yes");
  assert.equal(normalize("Really?"), "really");
  assert.equal(normalize("blue"), "blue");
});

test("normalize only strips ONE trailing .!? (not mid-string, not repeated)", () => {
  assert.equal(normalize("a.b"), "a.b");
  assert.equal(normalize("what?!"), "what?");
  assert.equal(normalize("done..."), "done..");
});

test("acceptedAnswers splits on | and drops blank/whitespace variants", () => {
  assert.deepEqual(acceptedAnswers("a|b|c"), ["a", "b", "c"]);
  assert.deepEqual(acceptedAnswers(" colour | color "), ["colour", "color"]);
  assert.deepEqual(acceptedAnswers("a||b|  |c"), ["a", "b", "c"]);
  assert.deepEqual(acceptedAnswers(""), []);
  assert.deepEqual(acceptedAnswers(null), []);
  assert.deepEqual(acceptedAnswers(undefined), []);
});

test("matchesTextAnswer accepts any variant, case- and punctuation-insensitively", () => {
  assert.equal(matchesTextAnswer("Blue.", "blue"), true);
  assert.equal(matchesTextAnswer("COLOR", "colour|color"), true);
  assert.equal(matchesTextAnswer("colour", "colour|color"), true);
  assert.equal(matchesTextAnswer("  yes!  ", "yes"), true);
});

test("matchesTextAnswer rejects wrong answers and empty accepted set", () => {
  assert.equal(matchesTextAnswer("red", "blue"), false);
  assert.equal(matchesTextAnswer("anything", ""), false);
  assert.equal(matchesTextAnswer("", "blue"), false);
});
