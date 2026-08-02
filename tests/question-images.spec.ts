// spec: specs/question-images.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Obrazki przypisane do pytań', () => {
  test('Obrazek jednego pytania nie pojawia się w pozostałych pytaniach', async ({ page }) => {
    const imageUrl = 'http://127.0.0.1:8000/tests/fixtures/question-image.svg';

    await page.goto('/');
    await page.getByRole('button', { name: 'Stwórz test' }).click();
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Test obrazków pytań');
    await page.locator('#quizImageUrl').fill(imageUrl);
    await page.locator('.switch-row', { hasText: 'Losuj pytania' }).click();
    await page.locator('.switch-row', { hasText: 'Losuj odpowiedzi' }).click();

    const firstQuestion = page.locator('.question-card').nth(0);
    await firstQuestion.getByPlaceholder('Wpisz treść pytania…').fill('Pytanie z obrazkiem');
    await firstQuestion.getByPlaceholder('Odpowiedź A').fill('poprawna');
    await firstQuestion.getByPlaceholder('Odpowiedź B').fill('błędna 1');
    await firstQuestion.getByPlaceholder('Odpowiedź C').fill('błędna 2');
    await firstQuestion.getByPlaceholder('Odpowiedź D').fill('błędna 3');
    await firstQuestion.locator('.question-image-url').fill(imageUrl);

    const secondQuestion = page.locator('.question-card').nth(1);
    await secondQuestion.getByPlaceholder('Wpisz treść pytania…').fill('Pytanie bez obrazka');
    await secondQuestion.locator('.fill-correct').fill('odpowiedź');

    await page.getByRole('button', { name: 'Zapisz test →' }).click();
    await page.getByRole('button', { name: 'Rozpocznij test Test obrazków pytań' }).click();

    const playImage = page.locator('#playQuizImage');
    await expect(page.getByRole('heading', { name: 'Pytanie z obrazkiem' })).toBeVisible();
    await expect(playImage).toBeVisible();
    await expect(playImage).toHaveAttribute('src', imageUrl);

    await page.getByRole('button', { name: 'Pomiń pytanie' }).click();

    await expect(page.getByRole('heading', { name: 'Pytanie bez obrazka' })).toBeVisible();
    await expect(playImage).toBeHidden();
    await expect(page.locator('.quiz-stage')).not.toHaveClass(/picture-mode/);
  });
});
