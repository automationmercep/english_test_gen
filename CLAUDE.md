# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Bright English" (Polish UI) — a single-page, no-build web app for creating and taking English-learning quizzes. No framework, no bundler: `index.html` + `app.js` (vanilla JS, ~2100 lines) + `styles.css`. All app UI strings are in Polish.

## Repo and deployment

- Source lives at https://github.com/automationmercep/english_test_gen (public repo, default branch `main`).
- The live app is deployed via GitHub Pages directly from `main` (root folder) at https://automationmercep.github.io/english_test_gen/ — no build step; GitHub serves the static files as-is on every push to `main`.
- `.github/workflows/tests.yml` runs the Playwright suite on every push/PR to `main`. On push to `main`, it also commits the generated HTML report to `test-reports/latest/` and pushes it back — since Pages already serves `main`/root, the latest report (with per-test video and failure screenshots) is viewable at https://automationmercep.github.io/english_test_gen/test-reports/latest/. That workflow-triggered commit is `[skip ci]` and the workflow ignores `test-reports/**` pushes, so publishing the report doesn't re-trigger itself.
- `firebase.json`/`firestore.rules`/`.firebaserc` configure Firebase Hosting + Firestore as an *alternative* deploy target that exists but isn't the one currently in use — don't assume `firebase deploy` is how the live site gets updated.
- Google sign-in requires the serving domain to be in Firebase Authentication's "Authorized domains" list; `automationmercep.github.io` has been added there alongside `localhost`.

## Running it

```powershell
python -m http.server 8000
```
Then open `http://localhost:8000`. There's no build step — edit `app.js`/`styles.css`/`index.html` and reload.

For Playwright tests specifically, `.codex-server.cjs` (a small static file server, port 8000) is started automatically by `playwright.config.ts`'s `webServer` — no need to run it manually.

## Testing

Playwright tests live in `tests/*.spec.ts`, each backed by a human-readable scenario doc in `specs/*.md` (steps + expected outcomes). These are two independent files — editing a `specs/*.md` scenario does **not** regenerate or change its `tests/*.spec.ts` file; that has to be done manually or via the `playwright-test-generator` agent (see below).

```bash
npx playwright test                                  # full suite, headed (headless: false), fullyParallel
npx playwright test tests/edit-quiz.spec.ts           # single file
npx playwright test tests/edit-quiz.spec.ts:7         # single test by line
```

- `seed.spec.ts` is the shared seed test every scenario conceptually starts from (fresh state).
- Every `tests/*.spec.ts` file starts with `// spec: specs/<name>.md` and `// seed: seed.spec.ts` header comments pointing back to its scenario doc.
- All app state lives in `localStorage`, so tests interact with the real UI (no fixtures/mocking layer) — quizzes created by one test can appear in another if run against the same browser storage; the existing tests each create/clean up their own uniquely-named quiz/category to stay isolated.
- Three specialized agents exist for the test-writing workflow (`.claude/agents/`): `playwright-test-planner` (explore app → write `specs/*.md`), `playwright-test-generator` (spec scenario → drive a **live** browser via the `playwright-test` MCP server → write `tests/*.spec.ts`), `playwright-test-healer` (diagnose + fix a failing test against the live app). The MCP server is defined in `.mcp.json` (`npx playwright run-test-mcp-server`) — it must be connected via `/mcp` in a given Claude Code session before these agents' browser tools are usable; without it they only have read-only file tools.
- Prefer generating/healing tests through that live-browser pipeline over hand-writing assertions from reading `app.js` — hand-written assertions have been wrong in practice (e.g. guessing Polish pluralization, or assuming a leftover empty question card after CSV import when the app actually clears it).

## Architecture

Everything runs client-side; there is no backend other than optional Firebase sync.

### State and persistence

- All app state (quizzes, categories, sound settings, daily words, theme, spaced-repetition data, etc.) is plain JS variables in `app.js`, persisted to `localStorage` under versioned keys (`bright-english-*-v1`, defined as constants at the top of the file). Each piece of state has a `load*`/`save*` pair.
- `starterQuizzes` (top of `app.js`) is the built-in seed data used the first time `loadQuizzes()` finds nothing in `localStorage`.
- One built-in quiz (`dynamic: true`) has no fixed `questions` array — its questions are procedurally generated fresh each play/print via `generateGrammarQuestions()`.
- Export/import (`exportData`/`importData`/`mergeQuizzes`) round-trip the entire `localStorage` state as one JSON blob; "merge" adds only quizzes with unseen ids.

### Optional cloud sync (Firebase)

- `firebase.js` (loaded as an ES module, separate from `app.js`) handles Google sign-in and Firestore sync, and exposes a `window.firebaseDB` object (`saveQuiz`/`deleteQuiz`/`saveAllQuizzes`/`getCurrentUser`) that `app.js` calls opportunistically (`if (window.firebaseDB) ...`) after local mutations.
- On auth state change, `firebase.js` calls `window.__onCloudQuizzesLoaded(cloudQuizzes)` (defined in `app.js`), which either replaces local quizzes with the cloud copy or, on first login with no cloud data, pushes local quizzes up.
- The app must work fully offline/without login — Firebase is an enhancement layered on top of the localStorage model, never the source of truth by itself.
- Firestore security rules (`firestore.rules`) scope each user to `users/{uid}/quizzes/*`. Firebase project id is `selftestgenerator` (`.firebaserc`, `firebase.js`).

### Question model and the creator/player split

A quiz is `{ id, title, level, category, image, shuffleQuestions, shuffleAnswers, questions[] }`. Each question has a `type` — `choice`, `fill`, `order`, `match`, or `flashcard` — and type-specific fields (e.g. `answers`/`correctAnswers` for `choice`, `pairs` for `match`, `answer`/`words` for `order`). An optional `instruction` field, if set, overrides the default type-label badge shown above the question during play (e.g. "Complete the sentence" instead of "Wybierz odpowiedź").

- **Creator** (`#createView`): each question is a `.question-card` DOM element built by `addQuestion()`/`renderEditor()`; switching a card's type (`switchQuestionType`) caches the previous type's inputs on the card element itself (`card.choiceCache`, `card.fillCache`, etc.) so data isn't lost when toggling between types. `saveCreatedQuiz()` reads all `.question-card` elements back into the quiz's `questions[]` array on submit.
- **CSV import** (`importCsvQuestions()`): pastes multi-row CSV into the creator, one row per question, last field is the type token (`choice`/`fill`/`order`/`match`/`fiszka`, with Polish synonyms also recognized). An optional `[Instruction text]` prefix on the first field sets that question's `instruction`. This is a convenience path into the same `.question-card` DOM the manual creator uses — imported rows call `addQuestion()` + `renderEditor()` just like manual entry.
- A separate **verb-conjugation generator** modal (`generateVerbGeneratorCsv()`) produces CSV text and drops it into the same `#csvInput` textarea rather than writing questions directly — it's CSV-in, CSV-out, reusing the same import path.
- **Player** (`#playView`): `startQuiz()` calls `prepareQuestions()` to snapshot+shuffle a quiz's questions (per-quiz `shuffleQuestions`/`shuffleAnswers` flags) into ephemeral play-time question objects (adds `wordTiles`/`matchTiles` with shuffled order) — the original stored quiz questions are never mutated. `renderQuestion()`/`checkOrNext()` drive one question at a time; per-question results accumulate in `results[]`, keyed by index, so `goToPreviousQuestion()` can restore prior answers without re-answering.
- A lightweight per-quiz spaced-repetition score (`srData`, `applySpacedRepetition`) reorders questions on replay to surface previously-missed ones first; it's heuristic (wrong-minus-correct count keyed by truncated prompt text), not a full SRS algorithm.

### Rendering approach

No virtual DOM/diffing — screens are rebuilt via template-string `innerHTML` assignment (e.g. `renderQuizGrid()`, `renderQuestion()`) and event listeners are reattached after each render. Views are toggled by adding/removing an `active` class on `.view` sections (`showView()`), not client-side routing.
