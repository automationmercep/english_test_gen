// spec: specs/word-games.md
// seed: seed.spec.ts
//
// Building the four word-game types by hand in the creator (not via CSV import):
// anagram, wordsearch, crossword, quizcross. Verifies each card's editor renders
// the right inputs, the quiz saves, and each type is playable end to end.

import { test, expect, type Page } from '@playwright/test';

// Click a type-option button inside a specific question card by its data-type
// (robust against the identically-labelled CSV bulk buttons and the
// "Krzyżówka" / "Krzyżówka z pytaniami" prefix overlap).
async function setCardType(card: ReturnType<Page['locator']>, type: string) {
  await card.locator(`.type-option[data-type="${type}"]`).click();
}

test.describe('Tworzenie gier słownych w kreatorze', () => {
  test('Ręczne zbudowanie testu z anagramem, wykreślanką, krzyżówką, krzyżówką z pytaniami i krzyżówką z hasłem', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Stwórz test' }).click();
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Gry słowne — kreator');

    // Question 1 — anagram
    const q1 = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
    await setCardType(q1, 'anagram');
    await q1.getByPlaceholder('Wpisz treść pytania…').fill('Ułóż słowo (zwierzę).');
    await q1.getByPlaceholder('Np. elephant').fill('elephant');

    // Question 2 — wordsearch (comma/newline separated words)
    const q2 = page.getByRole('article').filter({ hasText: 'Pytanie 2' });
    await setCardType(q2, 'wordsearch');
    await q2.getByPlaceholder('Wpisz treść pytania…').fill('Znajdź zwierzęta.');
    await q2.locator('.wordsearch-words').fill('cat\ndog\nbird');

    // Question 3 — crossword (interlocking). Add via the "Dodaj kolejne pytanie" button.
    await page.getByRole('button', { name: '＋ Dodaj kolejne pytanie' }).click();
    const q3 = page.getByRole('article').filter({ hasText: 'Pytanie 3' });
    await setCardType(q3, 'crossword');
    await q3.getByPlaceholder('Wpisz treść pytania…').fill('Rozwiąż krzyżówkę.');
    // Default 3 entry rows; cat / tiger / rabbit interlock on shared letters.
    const cwRows = q3.locator('.crossword-entry-row');
    await cwRows.nth(0).locator('.crossword-answer').fill('cat');
    await cwRows.nth(0).locator('.crossword-clue').fill('meows');
    await cwRows.nth(1).locator('.crossword-answer').fill('tiger');
    await cwRows.nth(1).locator('.crossword-clue').fill('striped cat');
    await cwRows.nth(2).locator('.crossword-answer').fill('rabbit');
    await cwRows.nth(2).locator('.crossword-clue').fill('hops and has long ears');

    // Question 4 — quizcross (row-per-answer, no interlocking)
    await page.getByRole('button', { name: '＋ Dodaj kolejne pytanie' }).click();
    const q4 = page.getByRole('article').filter({ hasText: 'Pytanie 4' });
    await setCardType(q4, 'quizcross');
    await q4.getByPlaceholder('Wpisz treść pytania…').fill('Odpowiedz na pytania.');
    const qcRows = q4.locator('.crossword-entry-row');
    await qcRows.nth(0).locator('.crossword-answer').fill('cat');
    await qcRows.nth(0).locator('.crossword-clue').fill('A pet that meows');
    await qcRows.nth(1).locator('.crossword-answer').fill('dog');
    await qcRows.nth(1).locator('.crossword-clue').fill('A pet that barks');
    await qcRows.nth(2).locator('.crossword-answer').fill('fish');
    await qcRows.nth(2).locator('.crossword-clue').fill('Lives in water');

    // Question 5 — keycross (key word read down a highlighted column)
    await page.getByRole('button', { name: '＋ Dodaj kolejne pytanie' }).click();
    const q5 = page.getByRole('article').filter({ hasText: 'Pytanie 5' });
    await setCardType(q5, 'keycross');
    await q5.getByPlaceholder('Wpisz treść pytania…').fill('Odgadnij hasło.');
    await q5.locator('.keycross-key').fill('KOT');
    const kcRows = q5.locator('.crossword-entry-row');
    await kcRows.nth(0).locator('.crossword-answer').fill('milk');
    await kcRows.nth(0).locator('.crossword-clue').fill('White drink');
    await kcRows.nth(1).locator('.crossword-answer').fill('dog');
    await kcRows.nth(1).locator('.crossword-clue').fill('A pet that barks');
    await kcRows.nth(2).locator('.crossword-answer').fill('cat');
    await kcRows.nth(2).locator('.crossword-clue').fill('A pet that meows');

    // Save
    await page.getByRole('button', { name: 'Zapisz test →' }).click();
    await expect(page.locator('#homeView')).toHaveClass(/active/);
    await expect(page.locator('#toast')).toHaveText('Test zapisany — możesz zaczynać!');
    const savedCard = page.getByRole('button', { name: 'Rozpocznij test Gry słowne — kreator' });
    await expect(savedCard).toBeVisible();
    await expect(savedCard.locator('p', { hasText: 'pytań' })).toHaveText('5 pytań');

    // Re-open the quiz in the editor and confirm the five cards round-tripped with
    // the correct types and that their answers/clues were persisted.
    await savedCard.getByLabel('Edytuj test').click();
    await expect(page.getByRole('heading', { name: 'Edytuj test' })).toBeVisible();
    const cards = page.locator('#questionList .question-card');
    await expect(cards).toHaveCount(5);
    const types = await cards.evaluateAll(nodes => nodes.map(n => (n as HTMLElement).dataset.type));
    expect(types).toEqual(['anagram', 'wordsearch', 'crossword', 'quizcross', 'keycross']);

    // Spot-check that editor fields survived the round trip.
    await expect(cards.nth(0).getByPlaceholder('Np. elephant')).toHaveValue('elephant');
    await expect(cards.nth(1).locator('.wordsearch-words')).toHaveValue('cat\ndog\nbird');
    await expect(cards.nth(2).locator('.crossword-entry-row')).toHaveCount(3);
    await expect(cards.nth(2).locator('.crossword-entry-row').first().locator('.crossword-answer')).toHaveValue('cat');
    await expect(cards.nth(3).locator('.crossword-entry-row')).toHaveCount(3);
    await expect(cards.nth(3).locator('.crossword-entry-row').first().locator('.crossword-clue')).toHaveValue('A pet that meows');
    await expect(cards.nth(4).locator('.keycross-key')).toHaveValue('KOT');
    await expect(cards.nth(4).locator('.crossword-entry-row').first().locator('.crossword-answer')).toHaveValue('milk');
  });
});
