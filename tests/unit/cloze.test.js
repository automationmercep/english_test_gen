// Unit tests for the cloze (gap-fill) question type parsing.
// Run: npm run test:unit
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseClozeSegments, clozeGapAnswers } = require("../../lib/pure-logic.js");

test("parseClozeSegments splits text and gaps in order", () => {
  const segs = parseClozeSegments("I [go] to school and [play] football");
  assert.deepEqual(segs, [
    { type: "text", value: "I " },
    { type: "gap", answer: "go" },
    { type: "text", value: " to school and " },
    { type: "gap", answer: "play" },
    { type: "text", value: " football" },
  ]);
});

test("parseClozeSegments keeps a leading/trailing text run", () => {
  const segs = parseClozeSegments("The [cat] sat");
  assert.deepEqual(segs, [
    { type: "text", value: "The " },
    { type: "gap", answer: "cat" },
    { type: "text", value: " sat" },
  ]);
});

test("parseClozeSegments trims whitespace inside gaps", () => {
  assert.deepEqual(parseClozeSegments("a [ big ] cat"), [
    { type: "text", value: "a " },
    { type: "gap", answer: "big" },
    { type: "text", value: " cat" },
  ]);
});

test("parseClozeSegments treats an empty [] as literal text, not a gap", () => {
  const segs = parseClozeSegments("nothing [] here");
  assert.equal(segs.filter(s => s.type === "gap").length, 0);
  assert.equal(segs.map(s => s.value).join(""), "nothing [] here");
});

test("parseClozeSegments treats an unmatched [ as literal", () => {
  const segs = parseClozeSegments("open [ bracket");
  assert.equal(segs.filter(s => s.type === "gap").length, 0);
  assert.equal(segs.map(s => s.value).join(""), "open [ bracket");
});

test("parseClozeSegments supports escaped and doubled brackets as literals", () => {
  assert.equal(parseClozeSegments("a \\[b\\] c").map(s => s.value || "").join(""), "a [b] c");
  assert.equal(parseClozeSegments("x [[y]] z").map(s => s.value || "").join(""), "x [y] z");
});

test("parseClozeSegments handles empty / non-string input", () => {
  assert.deepEqual(parseClozeSegments(""), []);
  assert.deepEqual(parseClozeSegments(null), []);
  assert.deepEqual(parseClozeSegments(undefined), []);
});

test("clozeGapAnswers returns only the gap answers in order", () => {
  assert.deepEqual(clozeGapAnswers("I [go] to [school] by [bus]"), ["go", "school", "bus"]);
  assert.deepEqual(clozeGapAnswers("no gaps here"), []);
});

test("clozeGapAnswers ignores empty/unmatched brackets", () => {
  assert.deepEqual(clozeGapAnswers("a [] b [c] d ["), ["c"]);
});
