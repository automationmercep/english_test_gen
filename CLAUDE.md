# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Bright English" (Polish UI) — a single-page, no-build web app for creating and taking English-learning quizzes. No framework, no bundler: `index.html` + `app.js` (vanilla JS, ~2100 lines) + `styles.css`, plus `lib/pure-logic.js` (side-effect-free logic shared by the app and the unit tests). All app UI strings are in Polish.

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
Then open `http://localhost:8000`. There's no build step — edit `app.js`/`styles.css`/`index.html`/`lib/pure-logic.js` and reload.

For Playwright tests specifically, `.codex-server.cjs` (a small static file server, port 8000) is started automatically by `playwright.config.ts`'s `webServer` — no need to run it manually.

## Testing

There are two independent test layers: **unit tests** (Node, pure logic) and **Playwright E2E tests** (real browser, full UI).

### Unit tests

Pure functions live in `lib/pure-logic.js` (answer matching, error-correction sentence building, verb conjugation, CSV parsing/quoting, Polish pluralization, HTML escaping, etc.) precisely so they can be tested in isolation. `app.js` can't be `require()`d from Node — it runs DOM/`localStorage` code at load time — so these functions are extracted into `lib/pure-logic.js`, which is loaded as a classic `<script>` **before** `app.js` in `index.html` (functions become globals `app.js` calls unchanged) and dual-exported via a `typeof module !== "undefined"` guard for Node. Keep `lib/pure-logic.js` free of DOM, `localStorage`, timers, and app-level state. To add a testable function, move it there (delete the duplicate from `app.js`, leaving a one-line pointer comment) and add it to the `module.exports` block.

Tests use the built-in `node:test` runner (zero new dependencies), live in `tests/unit/*.test.js`, and run via:

```bash
npm run test:unit                                    # node --test "tests/unit/*.test.js"
```

Note: `node --test tests/unit/` (a bare directory) fails on the installed Node — the glob form the npm script uses is required.

### Playwright E2E tests

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

### Code layout

- `app.js` — the bulk of the app: state, persistence, rendering, event wiring, question generators, and gameplay. Loaded as a classic deferred `<script>`.
- `lib/pure-logic.js` — side-effect-free helpers extracted from `app.js` so they're unit-testable in Node (see Testing). Loaded (also deferred) **before** `app.js`; both share the global scope, so `app.js` references these functions directly.
- `firebase.js` — the only ES module (`<script type="module">`), kept separate because it's the optional cloud-sync layer.

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

A quiz is `{ id, title, level, category, image, shuffleQuestions, shuffleAnswers, questions[] }`. Each question has a `type` — `choice`, `fill`, `order`, `match`, `flashcard`, `correct`, `anagram`, `wordsearch`, `crossword`, `quizcross`, or `keycross` — and type-specific fields (e.g. `answers`/`correctAnswers` for `choice`, `pairs` for `match`, `answer`/`words` for `order`, `wrong`/`answer` for `correct`, `answer` for `anagram`, `words[]` for `wordsearch`, `clues[]` of `{answer, clue}` for `crossword`/`quizcross`/`keycross`, plus a `key` string for `keycross`). An optional `instruction` field, if set, overrides the default type-label badge shown above the question during play (e.g. "Complete the sentence" instead of "Wybierz odpowiedź").

- **`anagram`** — the stored answer is one word (spaces ignored); `prepareQuestions()` shuffles per-letter `letterTiles`, and the player reuses the `order` tile builder (click/drag) to spell it back. Matching is case/punctuation/space-insensitive (`checkAnagram` in `lib/pure-logic.js`).
- **`wordsearch`** — stores a `words[]` list; `prepareQuestions()` calls `buildWordSearchGrid()` (pure-logic) to hide each word once in a square letter grid (horizontal/vertical/diagonal, forward placement but the player may read backward). The player clicks the first + last cell of each word; `wordSearchLineCells`/`matchWordSearchSelection` validate the line and match it (forward or reversed). Correct when every hidden word is found. Print/answer-key regenerate a fresh grid per print.
- **`crossword`** — stores `clues[]` of `{answer, clue}`; `prepareQuestions()` calls `buildCrossword()` (pure-logic). Layout is an interlocking greedy placement (`crosswordAttempt`: first word across, each next crosses a placed word on a shared letter, with repeated passes to re-try words that didn't fit yet), wrapped in a **multi-attempt search** (default 40 randomized word orders) that keeps the best by `crosswordScore` — most words placed, then most crossings, then most compact. This makes placement reliable where a single greedy pass would sometimes drop a word; a seeded `options.rng` keeps it deterministic for tests, `options.attempts` caps the tries. Returns a tight `grid` (each filled cell `{solution, number?}`) plus numbered across/down `entries`. The player types one letter per cell (`selectedAnswer` is a `"r,c" -> letter` map); correct when every cell matches (`checkCrosswordCell`, case-insensitive). Because the grid is regenerated per play/print, tests read solutions from the live `activeQuiz` grid rather than hardcoding coordinates.
- **`quizcross`** — same `clues[]` data as `crossword`, but `buildQuizCrossword()` does NOT interlock: each answer becomes its own numbered, left-aligned horizontal row (`rows` = entries, `cols` = longest answer), and the clue is the on-screen question. Same `crossword` play-time field, `selectedAnswer` map, scoring, and `checkCrosswordCell`; only the layout generator and the player renderer differ (`renderQuizCrosswordAnswer` vs `renderCrosswordAnswer`, both sharing `bindCrosswordInputs`). CSV synonyms: `quizcross` / `krzyzowka z pytaniami`.
- **`keycross`** — a `key` word plus `clues[]` where the i-th answer must contain the i-th key letter. `buildKeyCrossword(key, clues)` lays each answer on its own row shifted so the matching key letter lands in one shared column (`keyCol`), flagging those cells (`cell.key`); reading the column top-to-bottom spells the key. Reuses the `crossword` play-time field, `selectedAnswer` map, scoring, and `checkCrosswordCell`; `renderKeyCrosswordAnswer` highlights the key column. Rows whose answer lacks the key letter are dropped, so validation requires `entries.length === key letter count`. CSV row is `prompt, KEY, word1=clue1, …, keycross`; synonyms `keycross` / `krzyzowka z haslem`.

- **Creator** (`#createView`): each question is a `.question-card` DOM element built by `addQuestion()`/`renderEditor()`; switching a card's type (`switchQuestionType`) caches the previous type's inputs on the card element itself (`card.choiceCache`, `card.fillCache`, etc.) so data isn't lost when toggling between types. `saveCreatedQuiz()` reads all `.question-card` elements back into the quiz's `questions[]` array on submit.
- **CSV import** (`importCsvQuestions()`): pastes multi-row CSV into the creator, one row per question, last field is the type token (`choice`/`fill`/`order`/`match`/`fiszka`/`correct`/`anagram`/`wordsearch`/`crossword`, with Polish synonyms also recognized — e.g. `wykreslanka` for word search, `krzyzowka` for crossword). `anagram` rows are `prompt, word, anagram`; `wordsearch` rows are `prompt, word1, word2, …, wordsearch`; `crossword` and `quizcross` rows are `prompt, answer1=clue1, answer2=clue2, …, <type>` (reusing the `=` field separator from `match`); `keycross` rows put the key word first: `prompt, KEY, word1=clue1, …, keycross`. An optional `[Instruction text]` prefix on the first field sets that question's `instruction`. This is a convenience path into the same `.question-card` DOM the manual creator uses — imported rows call `addQuestion()` + `renderEditor()` just like manual entry.
- A separate **verb-conjugation generator** modal (`generateVerbGeneratorCsv()`) produces CSV text and drops it into the same `#csvInput` textarea rather than writing questions directly — it's CSV-in, CSV-out, reusing the same import path.
- **Player** (`#playView`): `startQuiz()` calls `prepareQuestions()` to snapshot+shuffle a quiz's questions (per-quiz `shuffleQuestions`/`shuffleAnswers` flags) into ephemeral play-time question objects (adds `wordTiles`/`matchTiles`/`letterTiles` with shuffled order, or a generated `grid` for `wordsearch` / `crossword` layout) — the original stored quiz questions are never mutated. `renderQuestion()`/`checkOrNext()` drive one question at a time; per-question results accumulate in `results[]`, keyed by index, so `goToPreviousQuestion()` can restore prior answers without re-answering.
- A lightweight per-quiz spaced-repetition score (`srData`, `applySpacedRepetition`) reorders questions on replay to surface previously-missed ones first; it's heuristic (wrong-minus-correct count keyed by truncated prompt text), not a full SRS algorithm.

### Rendering approach

No virtual DOM/diffing — screens are rebuilt via template-string `innerHTML` assignment (e.g. `renderQuizGrid()`, `renderQuestion()`) and event listeners are reattached after each render. Views are toggled by adding/removing an `active` class on `.view` sections (`showView()`), not client-side routing.
