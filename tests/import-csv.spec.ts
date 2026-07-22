// spec: specs/import-csv.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Import pytań z CSV', () => {
  test('Import kilku pytań różnych typów z CSV', async ({ page }) => {
    await page.goto('/');

    // 1. Kliknij przycisk "Stwórz test" w głównej nawigacji (selector: .nav-link[data-view="create"])
    await page.locator('.nav-link[data-view="create"]').click();

    // 2. Wpisz nazwę testu "Import CSV — test" w pole #quizTitle
    await page.locator('#quizTitle').fill('Import CSV — test');

    // 3. Wklej w pole #csvInput następującą treść (multi-line)
    await page.locator('#csvInput').fill(
      'What is the capital of France?, Paris, London, Berlin, Madrid, choice\n' +
      'I ___ to school every day., go, fill\n' +
      'Ułóż poprawne zdanie., I love you., order\n' +
      'curious, ciekawy, fiszka'
    );

    // 4. Kliknij przycisk #importCsv ("Wczytaj pytania")
    await page.locator('#importCsv').click();

    // Po kliknięciu "Wczytaj pytania" pojawia się komunikat (toast) informujący o liczbie dodanych pytań
    await expect(page.getByText('Dodano 4 pytań')).toBeVisible();

    // Lista pytań w kreatorze (#questionList) zawiera co najmniej 4 karty pytań (.question-card) odpowiadające wierszom CSV
    await expect(page.locator('#questionList .question-card')).toHaveCount(4);

    // 5. Kliknij przycisk #saveQuizButton ("Zapisz test")
    await page.locator('#saveQuizButton').click();

    // Po zapisaniu testu wyświetla się widok "Moje testy" (#homeView, class "active") z komunikatem (#toast) "Test zapisany — możesz zaczynać!"
    await expect(page.getByText('Test zapisany — możesz zaczynać!')).toBeVisible();
    await expect(page.locator('#homeView')).toHaveClass(/active/);

    // Na liście testów widoczna jest karta (.quiz-card) z tytułem "Import CSV — test"
    await expect(page.locator('.quiz-card', { hasText: 'Import CSV — test' })).toBeVisible();
  });
});
