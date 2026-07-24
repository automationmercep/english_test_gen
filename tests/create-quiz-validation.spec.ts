// spec: specs/gap-coverage.plan.md
// seed: seed.spec.ts
//
// Walidacja formularza kreatora. Pola "Nazwa testu", treść pytania i odpowiedzi
// wyboru mają atrybut HTML `required`, a przycisk zapisu to type="submit" w
// <form>, więc przeglądarka blokuje wysłanie niekompletnego formularza natywną
// walidacją (pole staje się :invalid i dostaje focus) — użytkownik zostaje w
// kreatorze. Usunięcie ostatniego pytania jest blokowane komunikatem, więc nie
// da się zapisać testu bez żadnego pytania.

import { test, expect, type Page } from '@playwright/test';

async function openCreator(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Stwórz test' }).click();
  await expect(page.getByRole('heading', { name: 'Stwórz nowy test' })).toBeVisible();
}

test.describe('Walidacja formularza kreatora testu', () => {
  test('Zapis z pustą nazwą testu jest blokowany walidacją (pozostajemy w kreatorze)', async ({ page }) => {
    await openCreator(page);

    // Wypełnij treść i odpowiedzi pytania 1, ale zostaw nazwę testu pustą.
    const q1 = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
    await q1.getByPlaceholder('Wpisz treść pytania…').fill('What color is the sky?');
    await page.getByRole('textbox', { name: 'Odpowiedź A' }).fill('blue');
    await page.getByRole('textbox', { name: 'Odpowiedź B' }).fill('red');

    await page.getByRole('button', { name: 'Zapisz test →' }).click();

    // Formularz nie został zapisany — wciąż jesteśmy w kreatorze, a pole nazwy
    // jest nieprawidłowe (natywna walidacja HTML `required`).
    await expect(page.getByRole('heading', { name: 'Stwórz nowy test' })).toBeVisible();
    const titleInput = page.getByRole('textbox', { name: 'Nazwa testu' });
    const titleValid = await titleInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(titleValid).toBe(false);
  });

  test('Zapis z pustą treścią pytania jest blokowany walidacją', async ({ page }) => {
    await openCreator(page);

    // Wpisz nazwę, ale zostaw treść pytania 1 pustą.
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Test Walidacji');
    await page.getByRole('button', { name: 'Zapisz test →' }).click();

    // Nadal w kreatorze; pole treści pytania jest nieprawidłowe.
    await expect(page.getByRole('heading', { name: 'Stwórz nowy test' })).toBeVisible();
    const promptInput = page.getByPlaceholder('Wpisz treść pytania…').first();
    const promptValid = await promptInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(promptValid).toBe(false);
  });

  test('Nie można usunąć ostatniego pytania — kreator wymusza co najmniej jedno', async ({ page }) => {
    await openCreator(page);

    // Kreator startuje z dwoma kartami. Usuń jedną — druga zostaje.
    await expect(page.locator('#questionList .question-card')).toHaveCount(2);
    await page.getByRole('article').filter({ hasText: 'Pytanie 2' }).getByLabel('Usuń pytanie').click();
    await expect(page.locator('#questionList .question-card')).toHaveCount(1);

    // Próba usunięcia ostatniej karty jest blokowana komunikatem — karta zostaje.
    await page.getByRole('article').filter({ hasText: 'Pytanie 1' }).getByLabel('Usuń pytanie').click();
    await expect(page.locator('#toast')).toHaveText('Test musi mieć co najmniej jedno pytanie');
    await expect(page.locator('#questionList .question-card')).toHaveCount(1);
  });
});
