// spec: specs/play-imported-types.md
// seed: seed.spec.ts

import { test, expect, type Page } from '@playwright/test';

const CSV = [
  'Choose the verb., go, run, jump, sing, choice',
  'I ___ coffee every morning., drink, fill',
  'Ułóż zdanie., I love you., order',
  'Dopasuj słowa., cat=kot, dog=pies, match',
  'sunny, słoneczny, fiszka',
  'She go to school every day., go, goes, correct',
].join('\n');

// Import the shared 6-question set with shuffling disabled, save, and start playing.
async function setupAndStart(page: Page, title: string) {
  await page.goto('/');
  await page.locator('.nav-link[data-view="create"]').click();
  await page.locator('#quizTitle').fill(title);
  // The shuffle inputs are visually-hidden switches (pointer-events:none); click their
  // <label> to toggle. Both start checked, so one click each disables shuffling.
  await page.locator('label.switch-row', { hasText: 'Losuj pytania' }).click();
  await page.locator('label.switch-row', { hasText: 'Losuj odpowiedzi' }).click();
  await expect(page.locator('#shuffleQuestions')).not.toBeChecked();
  await expect(page.locator('#shuffleAnswers')).not.toBeChecked();
  await page.locator('#csvInput').fill(CSV);
  await page.locator('#importCsv').click();
  await expect(page.getByText('Dodano 6 pytań')).toBeVisible();
  await page.locator('#saveQuizButton').click();
  await expect(page.locator('#homeView')).toHaveClass(/active/);
  await page.getByRole('button', { name: `Rozpocznij test ${title}` }).click();
}

// Click "Sprawdź odpowiedź", assert the feedback state, then advance to the next question.
async function checkAndAdvance(page: Page, expectGood: boolean) {
  await page.locator('#checkAnswer').click();
  await expect(page.locator('#feedback')).toHaveClass(expectGood ? /good/ : /bad/);
  await page.locator('#checkAnswer').click(); // "Następne pytanie →" / "Zobacz wynik →"
}

test.describe('Rozgrywka pytań zaimportowanych z CSV (wszystkie typy)', () => {
  test('Poprawne odpowiedzi na każdy typ są zaliczane', async ({ page }) => {
    await setupAndStart(page, 'Rozgrywka typów — poprawnie');

    // 1. choice — click the correct option "go"
    await expect(page.locator('#questionMeta')).toHaveText('Wybierz odpowiedź');
    await page.locator('.answer-option', { hasText: 'go' }).click();
    await checkAndAdvance(page, true);

    // 2. fill — type "drink"
    await page.locator('#fillInput').fill('drink');
    await checkAndAdvance(page, true);

    // 3. order — assemble "I love you" by clicking bank tiles in order
    for (const word of ['I', 'love', 'you']) {
      await page.locator('.order-bank .word-tile', { hasText: word }).first().click();
    }
    await checkAndAdvance(page, true);

    // 4. match — pair cat→kot and dog→pies (click tile, then its target slot)
    await pairMatch(page, 'cat', 'kot');
    await pairMatch(page, 'dog', 'pies');
    await checkAndAdvance(page, true);

    // 5. flashcard — reveal, then "✓ Wiedziałem"
    await expect(page.locator('#questionMeta')).toHaveText('Fiszka');
    await page.locator('#checkAnswer').click(); // "Pokaż odpowiedź"
    await page.getByRole('button', { name: '✓ Wiedziałem' }).click();
    await page.locator('#checkAnswer').click(); // advance

    // 6. correct — click wrong word "go", type "goes"
    await expect(page.locator('#questionMeta')).toHaveText('Popraw błąd');
    const sentence = page.getByRole('group', { name: 'Zdanie z błędem' });
    await sentence.getByRole('button', { name: 'go' }).click();
    await page.getByRole('textbox', { name: 'Poprawna forma słowa' }).fill('goes');
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/good/);
    await page.locator('#checkAnswer').click(); // "Zobacz wynik →"

    // Results view with all six correct
    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await expect(page.locator('#reviewList .review-item.good')).toHaveCount(6);
    await expect(page.locator('#reviewList .review-item.bad')).toHaveCount(0);
  });

  test('Błędne odpowiedzi na każdy typ są odrzucane', async ({ page }) => {
    await setupAndStart(page, 'Rozgrywka typów — błędnie');

    // 1. choice — click a wrong option "sing"
    await page.locator('.answer-option', { hasText: 'sing' }).click();
    await checkAndAdvance(page, false);

    // 2. fill — type a wrong word
    await page.locator('#fillInput').fill('eat');
    await checkAndAdvance(page, false);

    // 3. order — assemble a wrong order "you love I"
    for (const word of ['you', 'love', 'I']) {
      await page.locator('.order-bank .word-tile', { hasText: word }).first().click();
    }
    await checkAndAdvance(page, false);

    // 4. match — pair incorrectly (cat→pies, dog→kot)
    await pairMatch(page, 'cat', 'pies');
    await pairMatch(page, 'dog', 'kot');
    await checkAndAdvance(page, false);

    // 5. flashcard — reveal, then "✗ Nie wiedziałem"
    await page.locator('#checkAnswer').click(); // "Pokaż odpowiedź"
    await page.getByRole('button', { name: '✗ Nie wiedziałem' }).click();
    await page.locator('#checkAnswer').click(); // advance

    // 6. correct — click the wrong word "school", type "schools"
    const sentence = page.getByRole('group', { name: 'Zdanie z błędem' });
    await sentence.getByRole('button', { name: 'school' }).click();
    await page.getByRole('textbox', { name: 'Poprawna forma słowa' }).fill('schools');
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/bad/);
    await page.locator('#checkAnswer').click(); // "Zobacz wynik →"

    // Results view with no correct answers
    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await expect(page.locator('#reviewList .review-item.good')).toHaveCount(0);
    await expect(page.locator('#reviewList .review-item.bad')).toHaveCount(6);
  });
});

// Pair a match tile (left label) onto the slot whose right label is given.
async function pairMatch(page: Page, tileLabel: string, slotLabel: string) {
  await page.locator('.match-bank .match-tile', { hasText: tileLabel }).click();
  const slot = page.locator('.match-slot', { hasText: slotLabel });
  await slot.locator('.match-slot-drop').click();
}
