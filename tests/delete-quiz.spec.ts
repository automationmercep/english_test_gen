// spec: specs/delete-quiz.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Usuwanie testu', () => {
  test('Usunięcie testu z biblioteki po potwierdzeniu', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/');

    // 1. On the home page, find the quiz card titled "Travel Essentials" and click its "Usuń" button.
    const travelCard = page.getByRole('button', { name: 'Rozpocznij test Travel Essentials' });
    await expect(travelCard).toBeVisible();
    page.once('dialog', dialog => dialog.accept());
    await travelCard.getByLabel('Usuń test').click();

    // 2. A native browser confirm() dialog appears asking to delete the quiz — accept it (handled above).
    // expect: the quiz card titled "Travel Essentials" is no longer visible
    await expect(travelCard).not.toBeVisible();
    // expect: a toast shows the text "Test usunięty z biblioteki"
    await expect(page.getByText('Test usunięty z biblioteki')).toBeVisible();
  });
});
