// spec: specs/edit-quiz.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edycja istniejącego testu', () => {
  test('Zmiana tytułu istniejącego testu i zapisanie zmian', async ({ page }) => {
    // 1. Go to the home page ("Moje testy" view)
    await page.goto('/');

    // 2. Reveal the card's tools and click its "✎ Edytuj" button
    await page.getByRole('button', { name: 'Rozpocznij test Everyday' }).getByLabel('Edytuj test').click();

    // expect: the creator heading shows "Edytuj test"
    await expect(page.getByRole('heading', { name: 'Edytuj test' })).toBeVisible();
    // expect: the quiz title input has the value "Everyday English"
    const titleInput = page.getByRole('textbox', { name: 'Nazwa testu' });
    await expect(titleInput).toHaveValue('Everyday English');

    // 3. Clear the title input and type "Everyday English (poprawiony)"
    await titleInput.fill('Everyday English (poprawiony)');

    // 4. Click the save button (labeled "Zapisz zmiany →" in edit mode)
    await page.getByRole('button', { name: 'Zapisz zmiany →' }).click();

    // expect: the app navigates back to the home view (#homeView has class "active")
    await expect(page.locator('#homeView')).toHaveClass(/active/);
    // expect: a toast shows the text "Zmiany w teście zostały zapisane"
    await expect(page.getByText('Zmiany w teście zostały zapisane')).toBeVisible();
    // expect: a quiz card with the new title "Everyday English (poprawiony)" is visible in the grid
    await expect(page.getByRole('button', { name: 'Rozpocznij test Everyday English (poprawiony)' })).toBeVisible();
    // expect: there is no longer a quiz card with the exact old title "Everyday English"
    await expect(page.getByRole('heading', { name: 'Everyday English', exact: true })).not.toBeVisible();
  });
});
