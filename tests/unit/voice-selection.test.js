// Unit tests for the female-voice-name heuristic used by the voice picker.
// Run: node --test "tests/unit/*.test.js"
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { isFemaleVoiceName } = require("../../lib/pure-logic.js");

test("flags well-known female voice names (case-insensitive, substring)", () => {
  assert.equal(isFemaleVoiceName("Microsoft Zira - English (United States)"), true);
  assert.equal(isFemaleVoiceName("Google UK English Female"), true);
  assert.equal(isFemaleVoiceName("Samantha"), true);
  assert.equal(isFemaleVoiceName("Microsoft Paulina - Polish (Poland)"), true);
  assert.equal(isFemaleVoiceName("ZOSIA"), true);
});

test("does NOT flag male voice names", () => {
  assert.equal(isFemaleVoiceName("Microsoft David - English (United States)"), false);
  assert.equal(isFemaleVoiceName("Google UK English Male"), false);
  assert.equal(isFemaleVoiceName("Daniel"), false);
  assert.equal(isFemaleVoiceName("Microsoft Adam - Polish (Poland)"), false);
});

test("handles empty / nullish input safely", () => {
  assert.equal(isFemaleVoiceName(""), false);
  assert.equal(isFemaleVoiceName(null), false);
  assert.equal(isFemaleVoiceName(undefined), false);
});

test("does not treat the 'male' inside 'female' as a male match", () => {
  // Regression guard: "female".includes("male") is true, so a bare "male"
  // hint would wrongly flag female voices. Ensure "... Female" stays female.
  assert.equal(isFemaleVoiceName("Some Voice Female"), true);
});
