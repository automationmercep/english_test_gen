// spec: specs/cloze.md
// seed: seed.spec.ts
//
// Typ pytania "Uzupełnij luki" (cloze/gap-fill): autor wkleja tekst i otacza
// słowa do ukrycia nawiasami [słowo]; gracz wpisuje brakujące słowa w luki
// osadzone w tekście. Test buduje pytanie przez import CSV i rozgrywa je.

import { test, expect, type Page } from '@playwright/test';

const CLOZE_CSV =
  'Uzupełnij tekst o szkole, "I [go] to school every day. At school I [study] English. After class my friends [play] football.", cloze';

async function setupCloze(page: Page, title: string) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Stwórz test' }).click();
  await page.getByRole('textbox', { name: 'Nazwa testu' }).fill(title);
  await page.locator('#csvInput').fill(CLOZE_CSV);
  await page.locator('#importCsv').click();
  await expect(page.getByText(/Dodano 1 pytanie/)).toBeVisible();
  // Karta jest typu cloze, a textarea zawiera wklejony tekst z lukami.
  await expect(page.locator('.question-card').first()).toHaveAttribute('data-type', 'cloze');
  await expect(page.locator('.cloze-text')).toHaveValue(/\[go\].*\[study\].*\[play\]/);
  await page.locator('#saveQuizButton').click();
  await expect(page.locator('#homeView')).toHaveClass(/active/);
  await page.getByRole('button', { name: `Rozpocznij test ${title}` }).click();
  await expect(page.locator('#questionMeta')).toHaveText('Uzupełnij luki');
}

test.describe('Rozgrywka „Uzupełnij luki” (cloze)', () => {
  test('Wszystkie luki poprawne — pytanie zaliczone', async ({ page }) => {
    await setupCloze(page, 'Cloze — poprawnie');

    const gaps = page.locator('.cloze-gap');
    await expect(gaps).toHaveCount(3);
    // Luki są skalowane do długości słów (szerokość ustawiona w ch).
    for (let i = 0; i < 3; i++) await expect(gaps.nth(i)).toHaveAttribute('style', /width:\s*\d+ch/);

    // Dopóki któraś luka jest pusta, nie można sprawdzić.
    await expect(page.locator('#checkAnswer')).toBeDisabled();
    await gaps.nth(0).fill('go');
    await gaps.nth(1).fill('study');
    await expect(page.locator('#checkAnswer')).toBeDisabled();
    await gaps.nth(2).fill('play');
    await expect(page.locator('#checkAnswer')).toBeEnabled();

    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/good/);
    await expect(page.locator('.cloze-gap.correct')).toHaveCount(3);

    await page.locator('#checkAnswer').click();
    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await expect(page.locator('#reviewList .review-item.good')).toHaveCount(1);
  });

  test('Częściowo błędne odpowiedzi — pytanie odrzucone, luki oznaczone', async ({ page }) => {
    await setupCloze(page, 'Cloze — błędnie');

    const gaps = page.locator('.cloze-gap');
    await gaps.nth(0).fill('go');
    await gaps.nth(1).fill('study');
    await gaps.nth(2).fill('WRONG');
    await page.locator('#checkAnswer').click();

    await expect(page.locator('#feedback')).toHaveClass(/bad/);
    await expect(page.locator('.cloze-gap.correct')).toHaveCount(2);
    await expect(page.locator('.cloze-gap.wrong')).toHaveCount(1);
    // Poprawne odpowiedzi są pokazane w informacji zwrotnej.
    await expect(page.locator('#feedback strong')).toHaveText('go, study, play');
  });

  test('Dopasowanie ignoruje wielkość liter', async ({ page }) => {
    await setupCloze(page, 'Cloze — wielkość liter');

    const gaps = page.locator('.cloze-gap');
    await gaps.nth(0).fill('GO');
    await gaps.nth(1).fill('Study');
    await gaps.nth(2).fill('play');
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/good/);
    await expect(page.locator('.cloze-gap.correct')).toHaveCount(3);
  });
});
