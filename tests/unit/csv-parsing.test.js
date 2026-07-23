// Unit tests for CSV parsing/quoting helpers.
// Run: node --test "tests/unit/*.test.js"
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  parseCsvLine,
  csvQuoteField,
  formatDailyWordCsvField,
  dailyWordsToCsv,
} = require("../../lib/pure-logic.js");

test("parseCsvLine splits on commas and trims each field", () => {
  assert.deepEqual(parseCsvLine("a, b ,c"), ["a", "b", "c"]);
  assert.deepEqual(parseCsvLine(""), [""]);
});

test("parseCsvLine keeps commas inside quoted fields", () => {
  assert.deepEqual(parseCsvLine('"a,b", c'), ["a,b", "c"]);
  assert.deepEqual(parseCsvLine('"one, two, three"'), ["one, two, three"]);
});

test("parseCsvLine unescapes doubled quotes inside a quoted field", () => {
  assert.deepEqual(parseCsvLine('"say ""hi""", x'), ['say "hi"', "x"]);
});

test("parseCsvLine returns null on an unterminated quote", () => {
  assert.equal(parseCsvLine('"unclosed, field'), null);
});

test("csvQuoteField only quotes when comma/quote/newline present", () => {
  assert.equal(csvQuoteField("plain"), "plain");
  assert.equal(csvQuoteField("a,b"), '"a,b"');
  assert.equal(csvQuoteField('has"quote'), '"has""quote"');
  assert.equal(csvQuoteField("line\nbreak"), '"line\nbreak"');
  assert.equal(csvQuoteField(null), "");
});

test("parseCsvLine round-trips csvQuoteField output", () => {
  const original = 'value, with "quotes"';
  assert.deepEqual(parseCsvLine(csvQuoteField(original)), [original]);
});

test("formatDailyWordCsvField behaves like csvQuoteField", () => {
  assert.equal(formatDailyWordCsvField("dog"), "dog");
  assert.equal(formatDailyWordCsvField("a,b"), '"a,b"');
});

test("dailyWordsToCsv joins word/translation pairs, one row per word", () => {
  assert.equal(
    dailyWordsToCsv([{ word: "dog", translation: "pies" }, { word: "cat", translation: "kot" }]),
    "dog, pies\ncat, kot",
  );
});

test("dailyWordsToCsv quotes fields that contain commas", () => {
  assert.equal(
    dailyWordsToCsv([{ word: "well", translation: "cóż, dobrze" }]),
    'well, "cóż, dobrze"',
  );
});
