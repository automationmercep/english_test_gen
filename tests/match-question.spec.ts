// spec: specs/match-question.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Pytanie typu Dopasuj', () => {
  test('Dodanie pytania typu Dopasuj z parami słów', async ({ page }) => {
    await page.goto('/');

    // 1. Kliknij przycisk "Stwórz test" w głównej nawigacji
    await page.locator('.nav-link[data-view="create"]').click();

    // 2. Wpisz nazwę testu "Słówka — dopasuj" w pole #quizTitle
    await page.locator('#quizTitle').fill('Słówka — dopasuj');

    // 3. W pierwszej karcie pytania kliknij przycisk typu "Dopasuj"
    const firstQuestionCard = page.locator('.question-card').first();
    await firstQuestionCard.locator('.type-option[data-type="match"]').click();

    // Po kliknięciu przycisku "Dopasuj" karta pytania przełącza edytor w widok par
    const matchPairRows = firstQuestionCard.locator('.match-pair-row');
    await expect(matchPairRows.first().locator('.match-pair-left')).toBeVisible();
    await expect(matchPairRows.first().locator('.match-pair-right')).toBeVisible();

    // 4. Wpisz treść pytania "Dopasuj słowa do tłumaczeń" w pole treści pytania
    await firstQuestionCard.locator('.question-prompt').fill('Dopasuj słowa do tłumaczeń');

    // 5. Wypełnij trzy pary w edytorze par: "always" → "zawsze", "usually" → "zazwyczaj", "often" → "często"
    await matchPairRows.nth(0).locator('.match-pair-left').fill('always');
    await matchPairRows.nth(0).locator('.match-pair-right').fill('zawsze');
    await matchPairRows.nth(1).locator('.match-pair-left').fill('usually');
    await matchPairRows.nth(1).locator('.match-pair-right').fill('zazwyczaj');
    await matchPairRows.nth(2).locator('.match-pair-left').fill('often');
    await matchPairRows.nth(2).locator('.match-pair-right').fill('często');

    // 6. Usuń drugie domyślne pytanie (typu "Uzupełnij zdanie"), aby test zawierał tylko jedno pytanie
    await page.locator('.question-card').nth(1).locator('.remove-question').click();

    // 7. Kliknij przycisk #saveQuizButton ("Zapisz test")
    await page.locator('#saveQuizButton').click();

    // Po zapisaniu testu wyświetla się widok #homeView z klasą "active" i toast z treścią "Test zapisany — możesz zaczynać!"
    await expect(page.locator('#homeView')).toHaveClass(/active/);
    await expect(page.locator('#toast')).toHaveText('Test zapisany — możesz zaczynać!');

    // Na liście testów widoczna jest karta .quiz-card z tekstem "Słówka — dopasuj"
    await expect(page.locator('.quiz-card', { hasText: 'Słówka — dopasuj' })).toBeVisible();
  });
});
