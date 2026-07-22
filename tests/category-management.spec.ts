// spec: specs/category-management.md
// seed: seed.spec.ts

import { test, expect, type Page } from '@playwright/test';

async function createCategoryWithQuiz(page: Page) {
  // 1. Click "▱ Nowa kategoria" button on the home page to open the new-category modal
  await page.getByRole('button', { name: 'Nowa kategoria' }).click();

  // 2. Type "Słownictwo testowe" into the category name field ("Nazwa kategorii")
  await page.getByRole('textbox', { name: 'Nazwa kategorii' }).fill('Słownictwo testowe');

  // 3. Click the submit button in that modal ("Dodaj kategorię")
  await page.getByRole('button', { name: 'Dodaj kategorię' }).click();

  // expect: a new category tab "Słownictwo testowe" appears showing "0 testów"
  await expect(page.getByRole('tab', { name: 'Słownictwo testowe, testów: 0' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Słownictwo testowe, testów: 0' })).toContainText('0 testów');

  // 4. Click "Stwórz test" to open the creator. Type "Test w nowej kategorii" into "Nazwa testu". Set the quiz category field ("Kategoria") to "Słownictwo testowe"
  await page.getByRole('button', { name: 'Stwórz test' }).click();
  await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Test w nowej kategorii');
  await page.getByRole('combobox', { name: 'Kategoria' }).fill('Słownictwo testowe');

  // 5. In the first question card, fill the prompt and the four answer inputs (leave "blue" as the correct answer)
  const firstQuestionCard = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
  await firstQuestionCard.getByPlaceholder('Wpisz treść pytania…').fill('What color is the sky?');
  await page.getByRole('textbox', { name: 'Odpowiedź A' }).fill('blue');
  await page.getByRole('textbox', { name: 'Odpowiedź B' }).fill('red');
  await page.getByRole('textbox', { name: 'Odpowiedź C' }).fill('green');
  await page.getByRole('textbox', { name: 'Odpowiedź D' }).fill('yellow');

  // 6. Remove the default second question card via its "Usuń pytanie" button
  await page.getByRole('article').filter({ hasText: 'Pytanie 2' }).getByLabel('Usuń pytanie').click();

  // 7. Click the save button ("Zapisz test")
  await page.getByRole('button', { name: 'Zapisz test →' }).click();
}

test.describe('Zarządzanie kategoriami', () => {
  test('Utworzenie nowej, pustej kategorii i przypisanie do niej testu', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');

    await createCategoryWithQuiz(page);

    // After saving, click the category tab "Słownictwo testowe" to filter to it
    await page.getByRole('tab', { name: 'Słownictwo testowe, testów:' }).click();

    // expect: the quiz card "Test w nowej kategorii" is visible in that filtered view
    await expect(page.getByRole('button', { name: 'Rozpocznij test Test w nowej kategorii' })).toBeVisible();
  });

  test('Usunięcie kategorii wraz z przypisanymi testami', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000');

    await createCategoryWithQuiz(page);

    // Find the category folder/tab for "Słownictwo testowe" and click its delete "×" button (not the tab itself)
    await page.getByRole('button', { name: 'Usuń kategorię Słownictwo testowe' }).click();

    // expect: a confirmation modal appears with a description mentioning the number of quizzes that will be deleted
    await expect(page.getByText('Liczba testów, które zostaną trwale usunięte: 1.')).toBeVisible();

    // Click the confirm-delete button ("Usuń kategorię i testy")
    await page.getByRole('button', { name: 'Usuń kategorię i testy' }).click();

    // expect: the category tab "Słownictwo testowe" no longer exists
    await expect(page.getByRole('tab', { name: 'Słownictwo testowe, testów:' })).toHaveCount(0);

    // expect: a toast appears confirming the category and its quizzes were deleted
    await expect(page.getByText('Usunięto kategorię „Słownictwo testowe” wraz z jej testami')).toBeVisible();

    // expect: the quiz card "Test w nowej kategorii" is no longer visible anywhere
    await expect(page.getByRole('button', { name: 'Rozpocznij test Test w nowej kategorii' })).toHaveCount(0);
  });
});
