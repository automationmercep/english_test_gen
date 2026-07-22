// spec: specs/create-quiz.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Tworzenie nowego testu', () => {
  test('Dodanie nowego testu z jednym pytaniem wyboru', async ({ page }) => {
    await page.goto('/');

    // 1. Kliknij przycisk "Stwórz test" w głównej nawigacji
    await page.getByRole('button', { name: 'Stwórz test' }).click();

    // 2. Wpisz nazwę testu "Moja nowa nazwa" w pole "Nazwa testu"
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Moja nowa nazwa');

    // 3. Wybierz poziom "A1" w polu "Poziom"
    await page.getByLabel('Poziom').selectOption(['A1']);

    // 4. Wpisz treść pytania "What color is the sky?" w pole treści pierwszego pytania
    const firstQuestionCard = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
    await firstQuestionCard.getByPlaceholder('Wpisz treść pytania…').fill('What color is the sky?');

    // 5. Wypełnij cztery odpowiedzi testu wyboru: "blue", "red", "green", "yellow", gdzie "blue" jest zaznaczone jako poprawna
    await page.getByRole('textbox', { name: 'Odpowiedź A' }).fill('blue');
    await page.getByRole('textbox', { name: 'Odpowiedź B' }).fill('red');
    await page.getByRole('textbox', { name: 'Odpowiedź C' }).fill('green');
    await page.getByRole('textbox', { name: 'Odpowiedź D' }).fill('yellow');
    await expect(page.getByRole('checkbox', { name: 'blue' })).toBeChecked();

    // Usuń domyślnie dodane drugie pytanie, aby test zawierał tylko jedno pytanie wyboru zgodnie ze scenariuszem
    const secondQuestionCard = page.getByRole('article').filter({ hasText: 'Pytanie 2' });
    await secondQuestionCard.getByLabel('Usuń pytanie').click();

    // 6. Kliknij przycisk "Zapisz test"
    await page.getByRole('button', { name: 'Zapisz test →' }).click();

    // Expected: powrót do widoku "Moje testy" z komunikatem i nową kartą
    await expect(page.locator('#homeView')).toHaveClass(/active/);
    await expect(page.locator('#toast')).toHaveText('Test zapisany — możesz zaczynać!');
    await expect(page.getByRole('button', { name: /Rozpocznij test Moja nowa nazwa/ })).toBeVisible();
  });
});
