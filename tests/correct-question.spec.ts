// spec: specs/correct-question.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Pytanie typu „Popraw błąd"', () => {
  test('Utworzenie i rozegranie pytania „Popraw błąd" z poprawną odpowiedzią', async ({ page }) => {
    await page.goto('/');

    // 1. Click "Stwórz test" in the main nav to open the creator.
    await page.getByRole('button', { name: 'Stwórz test' }).click();

    // 2. Fill the quiz title field ("Nazwa testu") with "Test poprawiania błędu".
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Test poprawiania błędu');

    // 3. In the first question card ("Pytanie 1"), click the type button "Popraw błąd".
    await page.getByRole('button', { name: 'Popraw błąd' }).nth(1).click();
    const question1 = page.getByRole('article').filter({ hasText: 'Pytanie 1' });

    // 4. Fill that card's prompt field (placeholder "Wpisz treść pytania…") with "She go to school every day.".
    await question1.getByPlaceholder('Wpisz treść pytania…').fill('She go to school every day.');

    // 5. Fill the wrong-word input (placeholder "Błędne słowo, np. go") with "go".
    await question1.getByPlaceholder('Błędne słowo, np. go').fill('go');

    // 6. Fill the correct-form input (placeholder "Poprawna forma, np. goes") with "goes".
    await question1.getByPlaceholder('Poprawna forma, np. goes').fill('goes');

    // 7. Remove the default second question card ("Pytanie 2") via its "Usuń pytanie" button.
    await page.getByRole('article').filter({ hasText: 'Pytanie 2' }).getByLabel('Usuń pytanie').click();

    // 8. Click "Zapisz test →".
    await page.getByRole('button', { name: 'Zapisz test →' }).click();

    // Expected: saved test view shows toast confirmation
    await expect(page.locator('#homeView')).toHaveClass(/active/);
    await expect(page.locator('#toast')).toHaveText('Test zapisany — możesz zaczynać!');
    const savedCard = page.getByRole('button', { name: 'Rozpocznij test Test poprawiania błędu' });
    await expect(savedCard).toBeVisible();

    // 9. On the home view, click "Rozpocznij test Test poprawiania błędu".
    await savedCard.click();

    // Expected: question meta/hint for the "Popraw błąd" type
    await expect(page.locator('#questionMeta')).toHaveText('Popraw błąd');
    await expect(page.locator('#questionHint')).toHaveText('Kliknij błędne słowo w zdaniu, a następnie wpisz jego poprawną formę.');

    // Expected: the sentence renders 6 clickable word buttons
    const sentence = page.getByRole('group', { name: 'Zdanie z błędem' });
    await expect(sentence.getByRole('button')).toHaveText(['She', 'go', 'to', 'school', 'every', 'day.']);

    // Expected: the correct-fix input is hidden until a word is clicked
    await expect(page.locator('.correct-fix')).toHaveClass(/hidden/);

    // 10. In the player, click the word button "go" in the sentence.
    await sentence.getByRole('button', { name: 'go' }).click();

    // Expected: after clicking "go", the input with label "Wpisz poprawną formę:" appears
    await expect(page.locator('.correct-fix')).not.toHaveClass(/hidden/);
    await expect(page.locator('.correct-fix label')).toHaveText('Wpisz poprawną formę:');

    // 11. Fill the input labelled "Poprawna forma słowa" with "goes".
    await page.getByRole('textbox', { name: 'Poprawna forma słowa' }).fill('goes');

    // 12. Click "Sprawdź odpowiedź".
    await page.getByRole('button', { name: 'Sprawdź odpowiedź' }).click();

    // Expected: feedback shows the correct-answer state
    await expect(page.locator('#feedback')).toHaveClass(/good/);
    await expect(page.locator('#feedback')).toContainText('To jest prawidłowa odpowiedź.');
  });

  test('Zła odpowiedź w pytaniu „Popraw błąd" — złe słowo lub zła forma', async ({ page }) => {
    await page.goto('/');

    // 1. Click "Stwórz test" in the main nav to open the creator.
    await page.getByRole('button', { name: 'Stwórz test' }).click();

    // 2. Fill "Nazwa testu" with "Popraw błąd — negatywny".
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Popraw błąd — negatywny');

    // 3. In the first question card ("Pytanie 1"), click the type button "Popraw błąd".
    await page.getByRole('button', { name: 'Popraw błąd' }).nth(1).click();
    const question1 = page.getByRole('article').filter({ hasText: 'Pytanie 1' });

    // 4. Fill the prompt (placeholder "Wpisz treść pytania…") with "She go to school every day.".
    await question1.getByPlaceholder('Wpisz treść pytania…').fill('She go to school every day.');

    // 5. Fill the wrong-word input (placeholder "Błędne słowo, np. go") with "go".
    await question1.getByPlaceholder('Błędne słowo, np. go').fill('go');

    // 6. Fill the correct-form input (placeholder "Poprawna forma, np. goes") with "goes".
    await question1.getByPlaceholder('Poprawna forma, np. goes').fill('goes');

    // 7. Remove the default second question card ("Pytanie 2") via "Usuń pytanie".
    await page.getByRole('article').filter({ hasText: 'Pytanie 2' }).getByLabel('Usuń pytanie').click();

    // 8. Click "Zapisz test →".
    await page.getByRole('button', { name: 'Zapisz test →' }).click();

    // 9. Click "Rozpocznij test Popraw błąd — negatywny".
    await page.getByRole('button', { name: 'Rozpocznij test Popraw błąd' }).click();

    // 10. Click the WRONG word "school" in the sentence (not the actual error).
    const sentence = page.getByRole('group', { name: 'Zdanie z błędem' });
    await sentence.getByRole('button', { name: 'school' }).click();

    // 11. Fill the "Poprawna forma słowa" input with "schools".
    await page.getByRole('textbox', { name: 'Poprawna forma słowa' }).fill('schools');

    // 12. Click "Sprawdź odpowiedź".
    await page.getByRole('button', { name: 'Sprawdź odpowiedź' }).click();

    // Expected: feedback shows the incorrect-answer state with the correct answer "go → goes"
    await expect(page.locator('#feedback')).toHaveClass(/bad/);
    await expect(page.locator('#feedback')).toContainText('Poprawna odpowiedź:');
    await expect(page.locator('#feedback strong')).toHaveText('go → goes');
  });
});
