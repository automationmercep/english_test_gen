// spec: specs/gap-coverage.plan.md
// seed: seed.spec.ts
//
// Widget "Słówko dnia" na stronie głównej i jego modal edycji ("Lista słówek").
// Słowo dnia jest losowane z listy, więc do deterministycznej weryfikacji edycji
// zapisujemy listę z JEDNYM słowem. Modal CSV pobiera tylko word,translation
// (bez wymowy), więc po własnej edycji wymowa jest ukryta.

import { test, expect, type Page } from '@playwright/test';

async function openDailyWordsModal(page: Page) {
  await page.locator('#dailyWordsSettings').click();
  await expect(page.locator('#dailyWordsModal')).toBeVisible();
}

test.describe('Słówko dnia', () => {
  test('Widget "Dzisiaj" pokazuje słowo i tłumaczenie z domyślnej listy', async ({ page }) => {
    await page.goto('/');
    // Widget istnieje i pokazuje niepuste słowo oraz tłumaczenie.
    await expect(page.locator('#dailyWord')).not.toBeEmpty();
    await expect(page.locator('#dailyTranslation')).not.toBeEmpty();
  });

  test('Edycja listy słówek — własne słowo trwałe po odświeżeniu, przywrócenie domyślnych', async ({ page }) => {
    await page.goto('/');

    // Zapisz listę z jednym własnym słowem (deterministyczny wybór).
    await openDailyWordsModal(page);
    await page.locator('#dailyWordsInput').fill('banana, banan');
    await page.getByRole('button', { name: 'Zapisz listę' }).click();
    await expect(page.locator('#dailyWordsModal')).toBeHidden();
    await expect(page.locator('#toast')).toHaveText(/Zapisano 1 s/);

    // Widget pokazuje własne słowo; wymowa ukryta (modal nie zbiera wymowy).
    await expect(page.locator('#dailyWord')).toHaveText('banana');
    await expect(page.locator('#dailyTranslation')).toHaveText('banan');
    await expect(page.locator('#dailyPronunciation')).toBeHidden();

    // Trwałość po odświeżeniu (jedno słowo => nadal "banana").
    await page.reload();
    await expect(page.locator('#dailyWord')).toHaveText('banana');

    // Przywróć domyślne i zapisz — widget wraca do słowa z domyślnej listy.
    await openDailyWordsModal(page);
    await page.getByRole('button', { name: 'Przywróć domyślne' }).click();
    await page.getByRole('button', { name: 'Zapisz listę' }).click();
    await expect(page.locator('#dailyWordsModal')).toBeHidden();
    await expect(page.locator('#dailyWord')).not.toHaveText('banana');
  });

  test('Pusta lub nieprawidłowa lista słówek jest obsłużona bez awarii', async ({ page }) => {
    await page.goto('/');
    await openDailyWordsModal(page);

    // Puste pole ma required => walidacja HTML5 blokuje submit, modal zostaje.
    await page.locator('#dailyWordsInput').fill('');
    await page.getByRole('button', { name: 'Zapisz listę' }).click();
    await expect(page.locator('#dailyWordsModal')).toBeVisible();
    const inputValid = await page.locator('#dailyWordsInput').evaluate((el: HTMLTextAreaElement) => el.checkValidity());
    expect(inputValid).toBe(false);

    // Zawartość bez poprawnych par (brak przecinka) => toast o braku słówek, brak awarii.
    await page.locator('#dailyWordsInput').fill('samoword_bez_tlumaczenia');
    await page.getByRole('button', { name: 'Zapisz listę' }).click();
    await expect(page.locator('#toast')).toHaveText('Nie znaleziono prawidłowych słówek');
    await expect(page.locator('#dailyWordsModal')).toBeVisible();
  });
});
