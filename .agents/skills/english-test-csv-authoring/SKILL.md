---
name: english-test-csv-authoring
description: Generate, review, and validate CSV question sets for the Bright English application from written requirements, vocabulary lists, or photos and screenshots of English textbook exercises. Use when Codex needs to read an attached school exercise, turn its grammar and vocabulary into importable questions, target specified English tenses, balance affirmative statements, questions, and negatives, cover selected or all supported question types, enforce required words, create crossword variants, audit the AI question-generation prompt, or diagnose why an authored CSV row would be skipped or altered by the importer.
---

# English Test CSV Authoring

## Workflow

1. Read the relevant import contract before authoring:
   - Always read `../../../CLAUDE.md`, especially "Question model and the creator/player split".
   - Read the relevant type sections in `../../../README.md` under "Import pytań z CSV".
   - When generating or reviewing AI instructions, also read `../../../docs/prompt-generator-pytan.md`.
2. Treat the current importer in `../../../app.js` and builders in `../../../lib/pure-logic.js` as the final authority if documentation differs from code.
3. Establish the requested topic, CEFR level, target tense or tense contrast, question count, CSV type distribution, sentence-form distribution, required vocabulary, permitted inflected forms, and output destination. Infer sensible values when the user leaves non-critical details open. If a requested vocabulary list is missing and choosing it would materially determine the test content, ask for the list before generating.
4. Generate raw CSV without a header, numbering, Markdown fences, or commentary. Keep interface-facing instructions in Polish and learning content in the language requested by the user.
5. Use every required vocabulary item at least once in a meaningful prompt or correct answer. Distribute the words across the requested question types; do not satisfy the requirement only through instructions or incorrect distractors. Preserve the requested form unless the user permits inflection. When inflection is allowed, record accepted alternatives as `base|form1|form2` for validation.
6. Make every answer unambiguous. For `choice`, use exactly four distinct options in total. For `correct`, ensure the declared wrong token occurs literally in the sentence. For `cloze`, use 2–5 contextually unambiguous gaps.
   - Audit from the learner's visible screen, not from the intended answer. A bare sentence such as `Carla ___ got a coat` does not establish whether `has` or `hasn't` is required. Add decisive semantic context, or name the base verb/construction in the Polish instruction.
   - For free-text `fill` and `cloze` gaps, reject an item whenever another ordinary word or grammatical form also fits. When testing conjugation rather than vocabulary recall, show the base verb in parentheses or specify it in the instruction.
   - Keep `cloze` answers only in the second CSV field containing the gap text. The first field is a visible prompt: never copy bracketed answers or the completed gap text into it.
   - Require natural, idiomatic English appropriate to the target CEFR level. Reject sentences that are technically grammatical but sound translated, contrived, overly repetitive, or unlike something a speaker would normally say. Do not repeat the same content word merely to force a target form, such as `likes to listen ... and listens ...`, when a simpler natural context is available.
   - Read every completed sentence aloud with its correct answer inserted. Check normal collocations, pronoun reference, word order, punctuation, and whether the surrounding context has a believable meaning. Rewrite anything that sounds awkward even when it is grammatically valid.
7. For `crossword`, require every clue answer to appear in the generated interlocking grid. For `keycross`, provide exactly one clue answer per key letter and ensure the corresponding answer contains that letter. Do not impose interlocking requirements on `quizcross`.
8. Save a requested reusable set under `../../../examples/<descriptive-name>.csv`. Do not overwrite an existing example unless the user asked to update it.
9. Validate the final CSV from the repository root:

   ```powershell
   node .agents/skills/english-test-csv-authoring/scripts/validate-question-csv.js examples/<file>.csv
   ```

   Add `--expect-total N`, `--expect-types type=count,...`, and `--require-words "word1,word2,base|inflected"` whenever those requirements are known. Fix every error and rerun until validation succeeds.
10. Report the file path, total rows, CSV type counts, target-tense coverage, sentence-form counts, required-word coverage, and validation result. Leave importing through the application to the user unless they explicitly ask for browser verification.

## Grammar controls

1. Accept one tense, several tenses, or an explicit contrast such as `Present Simple vs Present Continuous`. Keep every question within the requested grammar scope.
2. Treat `twierdzenia`, `pytania`, and `przeczenia` as sentence forms independent of CSV question types. Any CSV type may exercise any of those forms.
3. Honor exact requested counts. When the user asks for an even split and the total is not divisible by three, keep the difference between form counts at most one and report the chosen split.
4. When no form split is supplied, distribute the three forms as evenly as the content and selected CSV types allow.
5. Use clear time expressions and context that make the target tense uniquely correct. Do not introduce another grammatically valid tense unless the requested task is a tense contrast.
6. For questions, test both auxiliary selection and word order where appropriate. For negatives, include the correct auxiliary and verb form. For third-person Present Simple, deliberately cover `-s/-es`, `does/doesn't`, and the return to the base verb after the auxiliary.
7. Audit the completed set with a tense-by-form checklist. Count the target sentence being answered or corrected, not the Polish instruction or an incorrect distractor.
8. Perform a final answer-leak, ambiguity, and naturalness pass before validation: reconstruct what the player sees for every row, verify that no prompt reveals a correct answer, and independently solve each gap without consulting the answer field. Then insert the correct answer and read the complete item as ordinary English. Rewrite every item that admits more than one reasonable answer or sounds unnatural, repetitive, artificial, or needlessly complex for the stated CEFR level.

## Textbook photos

1. Inspect every attached image before generating questions. For a local image path, use `view_image` with original detail when small text requires it. Preserve the page order when several images belong to one exercise.
2. Extract internally:
   - the printed exercise instruction,
   - grammar topic, target tense or contrast, sentence forms, and apparent CEFR level,
   - vocabulary or word bank,
   - example items and exercise sentences,
   - any visible answer key.
3. Distinguish printed content from handwriting, highlights, crossed-out text, and annotations. Do not treat a learner's handwritten answer as correct unless the user asks to preserve it; solve and verify the exercise independently.
4. Never guess unreadable words. Identify uncertain fragments and ask for a clearer, straighter, or closer photo only when the missing text would materially affect the generated questions. Continue with clearly readable sections when possible.
5. Default to creating new questions that practice the same grammar and vocabulary instead of copying the photographed exercises word for word. Use faithful conversion only when the user explicitly requests it.
6. Treat an extracted word bank as required vocabulary. Merge it with an explicit user list, giving the user's spellings and requested inflections priority. Do not count page titles, publisher text, or exercise numbering as vocabulary.
7. Keep the source image outside the repository unless the user asks to save it. Save only the derived CSV and validate it with the normal workflow.
8. Before reporting completion, summarize what was recognized from the image: topic, level, vocabulary, selected question types, and any uncertain or intentionally omitted fragment.

## Request format

Accept natural-language parameters. A complete request can look like:

```text
Użyj $english-test-csv-authoring. Poziom: B1. Temat: podróże.
Słowa: journey, luggage, book|booked, miss|missed.
Pytania: 5 choice, 5 fill, 5 correct, 5 cloze.
Czas: Present Simple. Formy: 7 twierdzeń, 7 pytań, 6 przeczeń.
```

Treat alternatives joined with `|` as equivalent forms of one required vocabulary item.

For a textbook photo, accept a request such as:

```text
Użyj $english-test-csv-authoring na załączonym zdjęciu.
Przygotuj 20 nowych pytań na podstawie ćwiczenia: 5 choice, 5 fill,
5 correct i 5 cloze. Użyj całej listy słów oraz czasu gramatycznego
widocznego na stronie. Rozłóż równo twierdzenia, pytania i przeczenia.
```

## Prompt audits

- Compare the prompt against all currently supported type tokens and the actual field validation in `importCsvQuestions()`.
- Flag rules that are weaker than the importer, stricter than the importer without a pedagogical reason, or likely to produce ambiguous questions.
- Update the prompt and validator together when the application's CSV contract changes.

## Validator options

```text
node validate-question-csv.js <file.csv> [--expect-total N]
  [--expect-types choice=2,fill=3] [--require-types choice,fill]
  [--require-words "journey,luggage,book|booked"] [--json]
```

The validator deliberately applies the authoring quality rules above in addition to checking whether the application can import each row.
