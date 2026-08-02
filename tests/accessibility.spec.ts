// spec: specs/accessibility.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dostępność kluczowych interakcji', () => {
  test('Karta testu ma osobne, niezagnieżdżone przyciski', async ({ page }) => {
    await page.goto('/');

    const card = page.locator('.quiz-card', { hasText: 'Everyday English' });
    await expect(card).not.toHaveAttribute('role', 'button');
    await expect(card.locator('[role="button"] button, button button')).toHaveCount(0);

    const startButton = card.getByRole('button', { name: 'Rozpocznij test Everyday English' });
    await startButton.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#playView')).toHaveClass(/active/);
  });

  test('Pola wyszukiwania zdjęcia i importu CSV mają trwałe etykiety', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Nowy test/ }).click();

    await expect(page.getByLabel('Szukaj zdjęcia', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Szukaj zdjęcia do pytania', { exact: true })).toHaveCount(2);
    await expect(page.getByLabel('Pytania w formacie CSV')).toBeVisible();
  });
});
