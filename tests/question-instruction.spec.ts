// spec: specs/question-instruction.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Polecenie nad pytaniem', () => {
  test('Dodanie własnego polecenia w kreatorze i weryfikacja podczas rozwiązywania testu', async ({ page }) => {
    await page.goto('/');

    // 1. Click "Stwórz test" in the main nav to open the creator.
    await page.getByRole('button', { name: 'Stwórz test' }).click();

    // 2. Type "Test polecenia" into the quiz title field ("Nazwa testu").
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Test polecenia');

    // 3. In the first question card, type "Complete the sentence" into the instruction field.
    const firstCard = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
    await firstCard.getByPlaceholder('Polecenie nad pytaniem (').fill('Complete the sentence');

    // 4. Type the question prompt and fill the four answer inputs; verify Answer A is checked correct by default.
    await firstCard.getByPlaceholder('Wpisz treść pytania…').fill('Anna ___ karate usually in the morning.');
    await page.getByRole('textbox', { name: 'Odpowiedź A' }).fill('does');
    await page.getByRole('textbox', { name: 'Odpowiedź B' }).fill('plays');
    await page.getByRole('textbox', { name: 'Odpowiedź C' }).fill('play');
    await page.getByRole('textbox', { name: 'Odpowiedź D' }).fill('do');
    await expect(page.getByRole('checkbox', { name: 'does' })).toBeChecked();

    // 5. Remove the default second question card via its "Usuń pytanie" button.
    await page.getByRole('article').filter({ hasText: 'Pytanie 2' }).getByLabel('Usuń pytanie').click();

    // 6. Click the save button ("Zapisz test").
    await page.getByRole('button', { name: 'Zapisz test →' }).click();
    await expect(page.getByRole('button', { name: 'Rozpocznij test Test polecenia' })).toBeVisible();

    // 7. Click that quiz card to start playing it.
    await page.getByRole('button', { name: 'Rozpocznij test Test polecenia' }).click();

    // Expected: the badge above the question (#questionMeta) shows exactly "Complete the sentence".
    await expect(page.locator('#questionMeta')).toHaveText('Complete the sentence');
  });

  test('Import CSV z opcjonalnym poleceniem w nawiasach kwadratowych', async ({ page }) => {
    await page.goto('/');

    // 1. Click "Stwórz test" in the main nav to open the creator.
    await page.getByRole('button', { name: 'Stwórz test' }).click();

    // 2. Type "Import z poleceniem" into the quiz title field ("Nazwa testu").
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Import z poleceniem');

    // 3. Paste this into the CSV textarea (#csvInput): "[Choose the correct answer] What ___ your name?, is, are, am, can, choice"
    await page.locator('#csvInput').fill(
      '[Choose the correct answer] What ___ your name?, is, are, am, can, choice'
    );

    // 4. Click the "Wczytaj pytania" button (#importCsv) to import it.
    await page.getByRole('button', { name: 'Wczytaj pytania' }).click();

    // Expected: the resulting question card's prompt/instruction fields, and that the default
    // empty cards were replaced entirely (only 1 card remains, not 2).
    const importedCard = page.locator('.question-card');
    await expect(importedCard).toHaveCount(1);
    await expect(importedCard.locator('.question-prompt')).toHaveValue('What ___ your name?');
    await expect(importedCard.locator('.question-instruction')).toHaveValue('Choose the correct answer');

    // 5. Click the save button ("Zapisz test").
    await page.getByRole('button', { name: 'Zapisz test →' }).click();

    // 6. Click the newly saved quiz card "Import z poleceniem" to start playing it.
    await page.getByRole('button', { name: 'Rozpocznij test Import z' }).click();

    // Expected: the badge above the question (#questionMeta) shows exactly "Choose the correct answer".
    await expect(page.locator('#questionMeta')).toHaveText('Choose the correct answer');
  });
});
