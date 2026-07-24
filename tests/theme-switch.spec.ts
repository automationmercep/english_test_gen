// spec: specs/gap-coverage.plan.md
// seed: seed.spec.ts
//
// Motyw aplikacji: panel z pięcioma wariantami (Las domyślny, Ocean, Zachód
// słońca, Lawenda, Noc). Wybór dodaje klasę `theme-<nazwa>` do <body> (forest =
// brak klasy) i zapisuje wybór w localStorage (trwałość po odświeżeniu). Klik
// poza panelem zamyka go bez zmiany motywu.

import { test, expect } from '@playwright/test';

test.describe('Motyw aplikacji', () => {
  test('Zmiana motywu aktualizuje <body> i jest trwała po odświeżeniu', async ({ page }) => {
    await page.goto('/');

    // Otwórz panel — pięć swatchy, Las (forest) aktywny domyślnie.
    await page.locator('#themeToggle').click();
    await expect(page.locator('#themePanel')).toBeVisible();
    await expect(page.locator('.theme-swatch')).toHaveCount(5);
    await expect(page.locator('.theme-swatch[data-theme="forest"]')).toHaveClass(/active/);

    // Wybierz Ocean — body dostaje klasę theme-ocean, panel się zamyka.
    await page.locator('.theme-swatch[data-theme="ocean"]').click();
    await expect(page.locator('body')).toHaveClass(/theme-ocean/);
    await expect(page.locator('#themePanel')).toBeHidden();

    // Trwałość: po odświeżeniu Ocean nadal aktywny.
    await page.reload();
    await expect(page.locator('body')).toHaveClass(/theme-ocean/);
    await page.locator('#themeToggle').click();
    await expect(page.locator('.theme-swatch[data-theme="ocean"]')).toHaveClass(/active/);

    // Powrót do Las (forest) usuwa niestandardową klasę motywu z body.
    await page.locator('.theme-swatch[data-theme="forest"]').click();
    await expect(page.locator('body')).not.toHaveClass(/theme-ocean/);
    await expect(page.locator('body')).not.toHaveClass(/theme-(ocean|sunset|lavender|night)/);
  });

  test('Klik poza panelem zamyka go bez zmiany motywu', async ({ page }) => {
    await page.goto('/');

    // Ustaw znany motyw (Noc), zamknij i ponownie otwórz panel.
    await page.locator('#themeToggle').click();
    await page.locator('.theme-swatch[data-theme="night"]').click();
    await expect(page.locator('body')).toHaveClass(/theme-night/);

    await page.locator('#themeToggle').click();
    await expect(page.locator('#themePanel')).toBeVisible();

    // Klik poza panelem (w treść strony) — panel się zamyka, motyw bez zmian.
    await page.locator('h1').first().click();
    await expect(page.locator('#themePanel')).toBeHidden();
    await expect(page.locator('body')).toHaveClass(/theme-night/);
  });
});
