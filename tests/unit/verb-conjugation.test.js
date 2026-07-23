// Unit tests for the verb-conjugation generator (Present/Past Simple).
// Run: node --test "tests/unit/*.test.js"
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  parseVerbToken,
  conjugatePresentSimple,
  conjugatePastSimple,
  questionAuxiliary,
} = require("../../lib/pure-logic.js");

test("parseVerbToken splits an optional `base=override` and trims both parts", () => {
  assert.deepEqual(parseVerbToken("go"), { verb: "go", override: null });
  assert.deepEqual(parseVerbToken(" go = went "), { verb: "go", override: "went" });
  assert.deepEqual(parseVerbToken("play="), { verb: "play", override: null });
});

test("conjugatePresentSimple leaves the base form for non-third-person", () => {
  assert.equal(conjugatePresentSimple("go", false), "go");
  assert.equal(conjugatePresentSimple("have", false), "have");
});

test("conjugatePresentSimple applies irregular third-person forms", () => {
  assert.equal(conjugatePresentSimple("have", true), "has");
  assert.equal(conjugatePresentSimple("be", true), "is");
});

test("conjugatePresentSimple adds -es after s/x/z/sh/ch", () => {
  assert.equal(conjugatePresentSimple("kiss", true), "kisses");
  assert.equal(conjugatePresentSimple("fix", true), "fixes");
  assert.equal(conjugatePresentSimple("watch", true), "watches");
  assert.equal(conjugatePresentSimple("wash", true), "washes");
});

test("conjugatePresentSimple turns consonant+y into -ies but keeps vowel+y", () => {
  assert.equal(conjugatePresentSimple("try", true), "tries");
  assert.equal(conjugatePresentSimple("study", true), "studies");
  assert.equal(conjugatePresentSimple("play", true), "plays");
});

test("conjugatePresentSimple adds -es after o, and -s otherwise", () => {
  assert.equal(conjugatePresentSimple("go", true), "goes");
  assert.equal(conjugatePresentSimple("do", true), "does");
  assert.equal(conjugatePresentSimple("run", true), "runs");
});

test("conjugatePastSimple uses the irregular table when available", () => {
  assert.equal(conjugatePastSimple("go"), "went");
  assert.equal(conjugatePastSimple("be"), "was");
  assert.equal(conjugatePastSimple("read"), "read");
  assert.equal(conjugatePastSimple("cut"), "cut");
});

test("conjugatePastSimple applies regular -ed rules for unknown verbs", () => {
  assert.equal(conjugatePastSimple("walk"), "walked");
  assert.equal(conjugatePastSimple("like"), "liked");   // ends in e → +d
  assert.equal(conjugatePastSimple("carry"), "carried"); // consonant+y → -ied
  assert.equal(conjugatePastSimple("play"), "played");   // vowel+y → +ed
});

test("conjugatePastSimple doubles a final consonant for short CVC verbs", () => {
  assert.equal(conjugatePastSimple("stop"), "stopped");
  assert.equal(conjugatePastSimple("plan"), "planned");
});

test("questionAuxiliary picks Did / Does / Do", () => {
  assert.equal(questionAuxiliary(true, false), "Did");
  assert.equal(questionAuxiliary(true, true), "Did");
  assert.equal(questionAuxiliary(false, true), "Does");
  assert.equal(questionAuxiliary(false, false), "Do");
});
