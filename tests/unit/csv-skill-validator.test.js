"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseArguments,
  validateCsvText,
} = require("../../.agents/skills/english-test-csv-authoring/scripts/validate-question-csv");

test("CSV skill validator accepts the three crossword variants", () => {
  const csv = [
    "Rozwiąż krzyżówkę.,cat=A pet that meows,tiger=A striped cat,rabbit=It has long ears,crossword",
    "Odpowiedz na pytania.,cat=A pet that meows,dog=A pet that barks,quizcross",
    "Odgadnij hasło.,KOT,milk=A white drink,dog=A pet that barks,cat=A pet that meows,keycross",
  ].join("\n");

  const result = validateCsvText(csv, {
    expectTotal: 3,
    expectTypes: { crossword: 1, quizcross: 1, keycross: 1 },
  });

  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.deepEqual(result.counts, { crossword: 1, quizcross: 1, keycross: 1 });
});

test("CSV skill validator reports authoring errors that the importer would not catch", () => {
  const csv = [
    "I drink tea every day.,tea,fill",
    "Choose one.,yes,no,choice",
    "Complete the text.,I [go] home.,cloze",
  ].join("\n");

  const result = validateCsvText(csv);

  assert.equal(result.valid, false);
  assert.deepEqual(
    result.errors.map(issue => issue.message),
    [
      "Treść fill musi zawierać lukę oznaczoną ___.",
      "Pytanie choice musi mieć dokładnie 4 opcje; znaleziono 2.",
      "Cloze powinien zawierać 2–5 luk; znaleziono 1.",
    ],
  );
});

test("CSV skill validator parses expected totals and type requirements", () => {
  const { file, options } = parseArguments([
    "examples/questions.csv",
    "--expect-total", "4",
    "--expect-types", "choice=2,uzupełnij=2",
    "--require-types", "choice,fill",
    "--require-words", "journey,book|booked",
  ]);

  assert.equal(file, "examples/questions.csv");
  assert.equal(options.expectTotal, 4);
  assert.deepEqual(options.expectTypes, { choice: 2, fill: 2 });
  assert.deepEqual(options.requireTypes, ["choice", "fill"]);
  assert.deepEqual(options.requireWords, [["journey"], ["book", "booked"]]);
});

test("CSV skill validator checks required vocabulary and accepted forms", () => {
  const csv = "We ___ our hotel online yesterday.,booked,fill";

  const accepted = validateCsvText(csv, { requireWords: [["book", "booked"]] });
  const missing = validateCsvText(csv, { requireWords: [["luggage"]] });

  assert.equal(accepted.valid, true);
  assert.equal(missing.valid, false);
  assert.equal(missing.errors.at(-1).message, "Brakuje wymaganego słowa lub formy: luggage.");
});
