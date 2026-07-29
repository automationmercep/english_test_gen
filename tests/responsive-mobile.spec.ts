// spec: specs/responsive-mobile.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const TABLET = { width: 768, height: 1024 };

// A page should never scroll horizontally on a small screen; allow 1px for rounding.
async function expectNoHorizontalScroll(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'strona nie powinna przewijać się w poziomie').toBeLessThanOrEqual(1);
}

test.describe('Responsywność na telefonie i tablecie', () => {
  test('Telefon: ukryta nawigacja, brak poziomego scrolla, dostęp do kreatora', async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/');

    // 1. Nawigacja górna jest ukryta na telefonie (media query max-width: 800px).
    await expect(page.locator('nav[aria-label="Główna nawigacja"]')).toBeHidden();
    await expect(page.locator('#loginButton')).toBeHidden();
    await expect(page.locator('#logoutButton')).toBeHidden();
    await expect(page.locator('#mobileMenuToggle')).toBeVisible();
    await expectNoHorizontalScroll(page);

    // Sekcja hero i alternatywny przycisk wejścia do kreatora są widoczne.
    const newQuizButton = page.getByRole('button', { name: /Nowy test/ });
    await expect(newQuizButton).toBeVisible();

    // 2. „Nowy test" otwiera kreator (droga dostępna zamiast ukrytego nav).
    await newQuizButton.click();
    await expect(page.locator('#createView')).toHaveClass(/active/);
    await expectNoHorizontalScroll(page);

    // Przycisk zapisu jest widoczny i mieści się w szerokości ekranu.
    const saveButton = page.locator('#saveQuizButton');
    await expect(saveButton).toBeVisible();
    const box = await saveButton.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width, 'przycisk „Zapisz test" nie może wystawać poza ekran').toBeLessThanOrEqual(PHONE.width + 1);

    // 3. Powrót do biblioteki przyciskiem wstecz.
    await page.locator('.back-button').click();
    await expect(page.locator('#homeView')).toHaveClass(/active/);
  });

  test('Telefon: panel wyboru motywu mieści się na ekranie', async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/');

    // Otwórz panel motywu (na mobile topbar się zawija, więc panel nie może
    // rozwijać się poza lewą krawędź — regresja wykryta na urządzeniu mobilnym).
    await page.locator('#mobileMenuToggle').click();
    await expect(page.locator('#topbarTools')).toHaveClass(/open/);
    await expect(page.getByText('Ustawienia', { exact: true })).toBeVisible();
    await expect(page.locator('#loginButton')).toBeVisible();
    await expect(page.locator('#logoutButton')).toBeHidden();
    const menuActions = page.locator('#themeToggle, #soundToggle, #musicToggle, #soundSettings');
    const actionBoxes = await menuActions.evaluateAll(elements => elements.map(element => {
      const box = element.getBoundingClientRect();
      return { width: box.width, height: box.height };
    }));
    expect(new Set(actionBoxes.map(box => Math.round(box.width))).size, 'przyciski w siatce powinny mieć równą szerokość').toBe(1);
    expect(new Set(actionBoxes.map(box => Math.round(box.height))).size, 'przyciski w siatce powinny mieć równą wysokość').toBe(1);
    await page.locator('#themeToggle').click();
    const panel = page.locator('#themePanel');
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x, 'lewa krawędź panelu motywu musi być na ekranie').toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, 'prawa krawędź panelu motywu musi mieścić się na ekranie').toBeLessThanOrEqual(PHONE.width + 1);

    // Swatch koloru jest widoczny i klikalny (nie ukryty poza ekranem).
    const swatch = page.locator('.theme-swatch[data-theme="ocean"]');
    await expect(swatch).toBeVisible();
    await swatch.click();
    await expect(page.locator('body')).toHaveClass(/theme-ocean/);
  });

  test('Tablet: brak poziomego scrolla i modal ustawień mieści się na ekranie', async ({ page }) => {
    await page.setViewportSize(TABLET);
    await page.goto('/');

    // 4. Na granicy media query (768 ≤ 800) nav nadal ukryte, brak scrolla.
    await expect(page.locator('nav[aria-label="Główna nawigacja"]')).toBeHidden();
    await expectNoHorizontalScroll(page);
    await expect(page.getByRole('button', { name: /Nowy test/ })).toBeVisible();

    // 5. Modal ustawień dźwięku otwiera się i mieści w szerokości ekranu.
    await page.locator('#mobileMenuToggle').click();
    await page.locator('#soundSettings').click();
    const modal = page.locator('#soundMessagesModal');
    await expect(modal).toBeVisible();
    const form = page.locator('#soundMessagesForm');
    const box = await form.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x, 'lewa krawędź modala musi być na ekranie').toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, 'prawa krawędź modala musi mieścić się na ekranie').toBeLessThanOrEqual(TABLET.width + 1);
  });

  test('Telefon: tryb testu ukrywa narzędzia i utrzymuje akcje w ekranie', async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/');
    await page.locator('.quiz-card', { hasText: 'Everyday English' }).click();

    await expect(page.locator('body')).toHaveClass(/quiz-mode/);
    await expect(page.locator('#topbarTools')).toBeHidden();
    await expect(page.locator('#mobileMenuToggle')).toBeHidden();
    await expect(page.locator('.brand')).toBeVisible();

    const actions = page.locator('.question-navigation');
    await expect(actions).toBeVisible();
    const box = await actions.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(PHONE.height + 1);
    await expectNoHorizontalScroll(page);
  });
});
