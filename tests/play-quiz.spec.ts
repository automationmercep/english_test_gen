// spec: specs/play-quiz.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Rozwiązywanie testu', () => {
  test('Rozwiązanie testu "Everyday English" i sprawdzenie wyników', async ({ page }) => {
    await page.goto('/');

    // Wyłącz dźwięk, aby uniknąć syntezy mowy blokującej auto-przejście między pytaniami
    await page.locator('#soundToggle').click();

    // 1. Na stronie głównej kliknij kartę testu "Everyday English"
    await page.locator('.quiz-card', { hasText: 'Everyday English' }).click();
    await expect(page.locator('#playView')).toHaveClass(/active/);

    // 2. Odpowiadaj na kolejne pytania (typ i kolejność mogą być losowane), aż pojawi się ekran wyników
    for (let question = 0; question < 6; question++) {
      const choiceOption = page.locator('.answer-option').first();
      const fillInput = page.locator('#fillInput');

      if (await choiceOption.isVisible().catch(() => false)) {
        await choiceOption.click();
      } else if (await fillInput.isVisible().catch(() => false)) {
        await fillInput.fill('test');
      }

      const checkAnswer = page.locator('#checkAnswer');
      await expect(checkAnswer).toBeEnabled();
      await checkAnswer.click();

      // Po sprawdzeniu odpowiedzi przycisk zmienia etykietę na "Następne pytanie" / "Zobacz wynik"
      await expect(checkAnswer).toBeEnabled();
      await checkAnswer.click();
    }

    // 3. Ekran wyników
    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await expect(page.locator('#totalCount')).toHaveText('6');
    await expect(page.locator('#scorePercent')).toBeVisible();
    await expect(page.locator('#correctCount')).toBeVisible();
  });
});
