// spec: specs/question-types.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Różne typy pytań w kreatorze', () => {
  test('Utworzenie testu z pytaniami typu Uzupełnij zdanie, Uporządkuj i Fiszka', async ({ page }) => {
    await page.goto('/');

    // 1. Click "Stwórz test" in the main nav to open the creator
    await page.getByRole('button', { name: 'Stwórz test' }).click();

    // 2. Type "Test mieszanych typów" into the quiz title field ("Nazwa testu")
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Test mieszanych typów');

    // 3. In the first question card, click the type button "Uzupełnij zdanie", type the prompt and correct answer
    await page.getByRole('button', { name: 'Uzupełnij zdanie' }).nth(1).click();
    const question1 = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
    await question1.getByPlaceholder('Wpisz treść pytania…').fill('I ___ tea every day.');
    await question1.getByPlaceholder('Prawidłowa odpowiedź…').fill('drink');

    // 4. Remove the default second question card via its "Usuń pytanie" button
    await page.getByRole('article').filter({ hasText: 'Pytanie 2' }).getByLabel('Usuń pytanie').click();

    // 5. Click "Dodaj kolejne pytanie" to add a new card. In this new card click the type button "Uporządkuj", type the prompt and correct sentence
    await page.getByRole('button', { name: '＋ Dodaj kolejne pytanie' }).click();
    await page.getByRole('button', { name: 'Uporządkuj' }).nth(2).click();
    const question2 = page.getByRole('article').filter({ hasText: 'Pytanie 2' });
    await question2.getByPlaceholder('Wpisz treść pytania…').fill('Ułóż zdanie.');
    await question2.getByPlaceholder('Np. I love you.').fill('I love learning English.');

    // 6. Click "Dodaj kolejne pytanie" again. In this newest card click the type button "Fiszka", type the prompt and answer
    await page.getByRole('button', { name: '＋ Dodaj kolejne pytanie' }).click();
    await page.getByRole('button', { name: 'Fiszka' }).nth(3).click();
    const question3 = page.getByRole('article').filter({ hasText: 'Pytanie 3' });
    await question3.getByPlaceholder('Wpisz treść pytania…').fill('brave');
    await question3.getByPlaceholder('Np. ciekawy').fill('odważny');

    // 7. Click the save button ("Zapisz test")
    await page.getByRole('button', { name: 'Zapisz test →' }).click();

    // Expected
    await expect(page.locator('#homeView')).toHaveClass(/active/);
    await expect(page.locator('#toast')).toHaveText('Test zapisany — możesz zaczynać!');
    const savedCard = page.getByRole('button', { name: 'Rozpocznij test Test mieszanych typów' });
    await expect(savedCard).toBeVisible();
    await expect(savedCard.locator('p', { hasText: 'pytań' })).toHaveText('3 pytań');
  });

  test('Pytanie wyboru z kilkoma poprawnymi odpowiedziami', async ({ page }) => {
    await page.goto('/');

    // 1. Click "Stwórz test" in the main nav to open the creator
    await page.getByRole('button', { name: 'Stwórz test' }).click();

    // 2. Type "Wielokrotny wybór" into the quiz title field ("Nazwa testu")
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Wielokrotny wybór');

    // 3. In the first question card (type "Test wyboru" is the default), type the prompt and fill the four answer text inputs
    const question1 = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
    await question1.getByPlaceholder('Wpisz treść pytania…').fill('Kolory flagi Polski?');
    await page.getByRole('textbox', { name: 'Odpowiedź A' }).fill('biały');
    await page.getByRole('textbox', { name: 'Odpowiedź B' }).fill('czerwony');
    await page.getByRole('textbox', { name: 'Odpowiedź C' }).fill('niebieski');
    await page.getByRole('textbox', { name: 'Odpowiedź D' }).fill('zielony');

    // 4. Answer A ("biały") is checked as correct by default. Also check the checkbox for answer B ("czerwony") so two answers are marked correct
    await expect(page.getByRole('checkbox', { name: 'biały' })).toBeChecked();
    await page.getByRole('checkbox', { name: 'czerwony' }).click();

    // 5. Verify the "Liczba prawidłowych odpowiedzi" counter in that card shows 2
    await expect(page.getByText('Liczba prawidłowych')).toBeVisible();
    await expect(question1.locator('strong')).toHaveText('2');

    // 6. Remove the default second question card via its "Usuń pytanie" button
    await page.getByRole('article').filter({ hasText: 'Pytanie 2' }).getByLabel('Usuń pytanie').click();

    // 7. Click the save button ("Zapisz test"), then click the newly saved quiz card "Wielokrotny wybór" to start playing it
    await page.getByRole('button', { name: 'Zapisz test →' }).click();
    await page.getByRole('button', { name: 'Rozpocznij test Wielokrotny' }).click();

    // Expected: the hint text below the question reads exactly "Zaznacz 2 prawidłowe odpowiedzi."
    await expect(page.locator('#questionHint')).toHaveText('Zaznacz 2 prawidłowe odpowiedzi.');
  });
});
