// spec: specs/create-quiz.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Tworzenie nowego testu', () => {
  test('Dodanie nowego testu z jednym pytaniem wyboru', async ({ page }) => {
    await page.goto('/');

    // 1. Kliknij przycisk "Stwórz test" w głównej nawigacji
    await page.click('.nav-link[data-view="create"]');
    await expect(page.locator('#createView')).toHaveClass(/active/);

    // 2. Wpisz nazwę testu
    await page.fill('#quizTitle', 'Kolory po angielsku');

    // 3. Wybierz poziom "A1"
    await page.selectOption('#quizLevel', 'A1');

    // 4. Wpisz treść pytania
    const firstCard = page.locator('.question-card').first();
    await firstCard.locator('.question-prompt').fill('What color is the sky?');

    // 5. Wypełnij odpowiedzi testu wyboru, "blue" jako poprawna
    const answers = ['blue', 'red', 'green', 'yellow'];
    const answerRows = firstCard.locator('.answer-editor-row');
    for (let i = 0; i < answers.length; i++) {
      await answerRows.nth(i).locator('input[type="text"]').fill(answers[i]);
    }
    await answerRows.nth(0).locator('input[type="checkbox"]').check();

    // Usuń domyślnie dodane drugie pytanie, aby zapisać test z jednym pytaniem
    await page.locator('.question-card').nth(1).locator('.remove-question').click();

    // 6. Zapisz test
    await page.click('#saveQuizButton');

    // Expected: powrót do widoku "Moje testy" z komunikatem i nową kartą
    await expect(page.locator('#homeView')).toHaveClass(/active/);
    await expect(page.locator('#toast')).toHaveText('Test zapisany — możesz zaczynać!');
    await expect(page.locator('.quiz-card', { hasText: 'Kolory po angielsku' })).toBeVisible();
  });
});
