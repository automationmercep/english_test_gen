// spec: specs/bulk-type-conversion.md
// seed: seed.spec.ts
//
// The "Typ wszystkich pytań" bar changes every question card to one type at
// once. Converting across data-shape families (e.g. crossword → fill) would
// discard the answer content, so the app groups the buttons by family and shows
// a confirm() dialog before any lossy conversion. These tests cover the grouped
// UI, the warning + cancel (content preserved), and a safe in-family switch.

import { test, expect, type Page } from '@playwright/test';

// A bulk-type button in the top bar (distinct from the per-card .type-option
// buttons that share the same data-type attribute).
function bulkButton(page: Page, type: string) {
  return page.locator(`.bulk-type-bar button[data-bulk-type="${type}"]`);
}

// Build a two-question crossword quiz in the creator (unsaved), returning the page
// sitting in the editor with both cards filled. The creator opens with exactly two
// cards (choice + fill), so we convert those two rather than adding more.
async function seedTwoCrosswordCards(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Stwórz test' }).click();
  await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Bulk konwersja — test');
  await expect(page.locator('#questionList .question-card')).toHaveCount(2);

  const q1 = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
  await q1.locator('.type-option[data-type="crossword"]').click();
  await q1.getByPlaceholder('Wpisz treść pytania…').fill('Rozwiąż krzyżówkę.');
  const r1 = q1.locator('.crossword-entry-row');
  await r1.nth(0).locator('.crossword-answer').fill('cat');
  await r1.nth(0).locator('.crossword-clue').fill('meows');
  await r1.nth(1).locator('.crossword-answer').fill('tiger');
  await r1.nth(1).locator('.crossword-clue').fill('striped cat');

  const q2 = page.getByRole('article').filter({ hasText: 'Pytanie 2' });
  await q2.locator('.type-option[data-type="crossword"]').click();
  await q2.getByPlaceholder('Wpisz treść pytania…').fill('Druga krzyżówka.');
  const r2 = q2.locator('.crossword-entry-row');
  await r2.nth(0).locator('.crossword-answer').fill('dog');
  await r2.nth(0).locator('.crossword-clue').fill('barks');
  await r2.nth(1).locator('.crossword-answer').fill('bird');
  await r2.nth(1).locator('.crossword-clue').fill('flies');
}

test.describe('Zbiorcza zmiana typu pytań', () => {
  test('Przyciski typów są pogrupowane w rodziny (Tekstowe / Krzyżówki / Inne)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Stwórz test' }).click();

    const groups = page.locator('.bulk-type-group');
    await expect(groups).toHaveCount(3);
    await expect(groups.nth(0).locator('.bulk-type-group-label')).toHaveText('Tekstowe');
    await expect(groups.nth(1).locator('.bulk-type-group-label')).toHaveText('Krzyżówki');
    await expect(groups.nth(2).locator('.bulk-type-group-label')).toHaveText('Inne');

    // The three crossword variants live together in the "Krzyżówki" group.
    await expect(groups.nth(1).locator('button')).toHaveCount(3);
    await expect(bulkButton(page, 'crossword')).toBeVisible();
    await expect(bulkButton(page, 'quizcross')).toBeVisible();
    await expect(bulkButton(page, 'keycross')).toBeVisible();
  });

  test('Konwersja między rodzinami ostrzega i po anulowaniu zachowuje treść', async ({ page }) => {
    await seedTwoCrosswordCards(page);

    // Reject the confirm() — the conversion must not happen.
    let dialogMessage = '';
    page.once('dialog', dialog => { dialogMessage = dialog.message(); dialog.dismiss(); });
    await bulkButton(page, 'fill').click();

    expect(dialogMessage).toContain('2 pytania');
    // Cards stayed as crosswords and their clues are intact.
    const cards = page.locator('#questionList .question-card');
    const types = await cards.evaluateAll(nodes => nodes.map(n => (n as HTMLElement).dataset.type));
    expect(types).toEqual(['crossword', 'crossword']);
    await expect(cards.nth(0).locator('.crossword-answer').first()).toHaveValue('cat');
  });

  test('Konwersja między rodzinami po potwierdzeniu zmienia typ', async ({ page }) => {
    await seedTwoCrosswordCards(page);

    page.once('dialog', dialog => dialog.accept());
    await bulkButton(page, 'fill').click();

    const cards = page.locator('#questionList .question-card');
    const types = await cards.evaluateAll(nodes => nodes.map(n => (n as HTMLElement).dataset.type));
    expect(types).toEqual(['fill', 'fill']);
    // Prompts survive the switch (only the answer content is dropped).
    await expect(cards.nth(0).getByPlaceholder('Wpisz treść pytania…')).toHaveValue('Rozwiąż krzyżówkę.');
  });

  test('Konwersja w obrębie rodziny krzyżówek nie ostrzega i zachowuje hasła', async ({ page }) => {
    await seedTwoCrosswordCards(page);

    // crossword → quizcross is same-family: no dialog should appear. Fail loudly
    // if one does by auto-dismissing and asserting it never fired.
    let dialogFired = false;
    page.on('dialog', dialog => { dialogFired = true; dialog.dismiss(); });
    await bulkButton(page, 'quizcross').click();

    const cards = page.locator('#questionList .question-card');
    const types = await cards.evaluateAll(nodes => nodes.map(n => (n as HTMLElement).dataset.type));
    expect(types).toEqual(['quizcross', 'quizcross']);
    expect(dialogFired).toBe(false);
    // Clues carried over into the new type.
    await expect(cards.nth(0).locator('.crossword-answer').first()).toHaveValue('cat');
  });
});
