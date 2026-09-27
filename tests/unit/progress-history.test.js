const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeQuizAttempt,
  sanitizeQuizProgress,
  summarizeQuizProgress,
  isValidImportedQuizCollection,
} = require("../../lib/pure-logic.js");

const validQuiz = {
  id: "quiz-1",
  title: "Import test",
  level: "A1",
  questions: [{ type: "fill", prompt: "I ___ here.", answer: "live" }],
};

test("isValidImportedQuizCollection accepts a well-formed collection", () => {
  assert.equal(isValidImportedQuizCollection([validQuiz]), true);
});

test("isValidImportedQuizCollection rejects entries that can break the library", () => {
  assert.equal(isValidImportedQuizCollection([null]), false);
  assert.equal(isValidImportedQuizCollection([{ ...validQuiz, id: "" }]), false);
  assert.equal(isValidImportedQuizCollection([{ ...validQuiz, questions: null }]), false);
  assert.equal(isValidImportedQuizCollection([{ ...validQuiz, questions: [{ type: "choice", prompt: "Bad", answers: null }] }]), false);
  assert.equal(isValidImportedQuizCollection([validQuiz, { ...validQuiz }]), false);
  assert.equal(isValidImportedQuizCollection([{ ...validQuiz, id: 'x"><img src=x onerror=alert(1)>' }]), false);
  assert.equal(isValidImportedQuizCollection([{ ...validQuiz, level: null }]), false);
  assert.equal(isValidImportedQuizCollection([{ ...validQuiz, category: {} }]), false);
  assert.equal(isValidImportedQuizCollection([{ ...validQuiz, questions: [{ ...validQuiz.questions[0], instruction: {} }] }]), false);
});

test("normalizeQuizAttempt validates counts and recomputes percent", () => {
  assert.deepEqual(normalizeQuizAttempt({
    completedAt: "2026-09-27T10:00:00.000Z",
    correct: 2,
    total: 3,
    percent: 1,
  }), {
    completedAt: "2026-09-27T10:00:00.000Z",
    correct: 2,
    total: 3,
    percent: 67,
  });
});

test("normalizeQuizAttempt rejects malformed attempts", () => {
  assert.equal(normalizeQuizAttempt({ completedAt: "bad", correct: 1, total: 2 }), null);
  assert.equal(normalizeQuizAttempt({ completedAt: "2026-09-27", correct: "1", total: 2 }), null);
  assert.equal(normalizeQuizAttempt({ completedAt: "2026-09-27", correct: -1, total: 2 }), null);
  assert.equal(normalizeQuizAttempt({ completedAt: "2026-09-27", correct: 3, total: 2 }), null);
  assert.equal(normalizeQuizAttempt({ completedAt: "2026-09-27", correct: 0, total: 0 }), null);
});

test("sanitizeQuizProgress sorts attempts, drops invalid data, and applies the cap", () => {
  const result = sanitizeQuizProgress({
    quiz: [
      { completedAt: "2026-09-03T10:00:00Z", correct: 3, total: 3 },
      { completedAt: "invalid", correct: 1, total: 3 },
      { completedAt: "2026-09-01T10:00:00Z", correct: 1, total: 3 },
      { completedAt: "2026-09-02T10:00:00Z", correct: 2, total: 3 },
    ],
    broken: "not an array",
  }, 2);
  assert.deepEqual(result, {
    quiz: [
      { completedAt: "2026-09-02T10:00:00.000Z", correct: 2, total: 3, percent: 67 },
      { completedAt: "2026-09-03T10:00:00.000Z", correct: 3, total: 3, percent: 100 },
    ],
  });
});

test("sanitizeQuizProgress ignores prototype-related quiz ids", () => {
  const payload = JSON.parse('{"__proto__":[{"completedAt":"2026-09-27T10:00:00Z","correct":1,"total":1}]}');
  assert.deepEqual(sanitizeQuizProgress(payload), {});
  assert.equal(Object.getPrototypeOf(sanitizeQuizProgress(payload)), Object.prototype);
});

test("summarizeQuizProgress returns the latest, best, and rounded average", () => {
  const summary = summarizeQuizProgress([
    { completedAt: "2026-09-02T10:00:00Z", correct: 1, total: 3 },
    { completedAt: "2026-09-01T10:00:00Z", correct: 1, total: 2 },
    { completedAt: "2026-09-03T10:00:00Z", correct: 3, total: 4 },
  ]);
  assert.equal(summary.count, 3);
  assert.equal(summary.last.percent, 75);
  assert.equal(summary.best, 75);
  assert.equal(summary.average, 53);
});

test("summarizeQuizProgress handles an empty history", () => {
  assert.deepEqual(summarizeQuizProgress([]), { count: 0, last: null, best: null, average: null });
});
