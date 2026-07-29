// spec: specs/offline-mode.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Działanie bez Firebase', () => {
  test('Biblioteka i kreator działają po zablokowaniu Firebase CDN', async ({ page }) => {
    await page.route('https://www.gstatic.com/firebasejs/**', route => route.abort('internetdisconnected'));
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Wybierz test' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Everyday English' })).toBeVisible();
    await page.getByRole('button', { name: /Nowy test/ }).click();
    await expect(page.locator('#createView')).toHaveClass(/active/);
    await expect(page.getByRole('heading', { name: 'Stwórz nowy test' })).toBeVisible();
  });
});
