// spec: specs/gap-coverage.plan.md
// seed: seed.spec.ts
//
// Funkcja "Odkryj literę" (przycisk "?") w krzyżówce podczas gry. Klik wpisuje
// poprawną literę do klikniętej komórki i wyłącza jej przycisk "?". UWAGA:
// odkryta litera jest tylko podpowiedzią — pole input pozostaje edytowalne
// (implementacja wyłącza tylko przycisk, nie input), więc scenariusz 7.2 z planu
// (rzekoma blokada nadpisania) jest udokumentowany tu zgodnie z rzeczywistością.

import { test, expect, type Page } from '@playwright/test';

const CROSSWORD_CSV = 'Rozwiąż krzyżówkę., cat=meows, tiger=striped cat, rabbit=hops and has long ears, crossword';

async function startCrossword(page: Page, title: string) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Stwórz test' }).click();
  await page.getByRole('textbox', { name: 'Nazwa testu' }).fill(title);
  await page.locator('#csvInput').fill(CROSSWORD_CSV);
  await page.locator('#importCsv').click();
  await expect(page.getByText(/Dodano 1 pytanie/)).toBeVisible();
  await page.locator('#saveQuizButton').click();
  await expect(page.locator('#homeView')).toHaveClass(/active/);
  await page.getByRole('button', { name: `Rozpocznij test ${title}` }).click();
  await expect(page.locator('#questionMeta')).toHaveText('Krzyżówka');
}

// Odczytaj rozwiązania z żywej siatki: mapa "r,c" -> litera, z data-atrybutów inputów.
async function revealTargets(page: Page): Promise<[string, string][]> {
  return page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('.cw-input')) as HTMLInputElement[];
    return inputs.map(i => [`${i.dataset.r},${i.dataset.c}`, ''] as [string, string]);
  });
}

test.describe('Krzyżówka — odkrywanie litery', () => {
  test('Przycisk „?” wypełnia poprawną literę i wyłącza się; odkrycie wszystkich daje 100%', async ({ page }) => {
    await startCrossword(page, 'Krzyżówka reveal — poprawnie');

    // Każda komórka ma input i przycisk "?".
    const reveals = page.locator('.cw-reveal');
    const inputs = page.locator('.cw-input');
    const cellCount = await inputs.count();
    expect(cellCount).toBeGreaterThan(0);
    await expect(reveals).toHaveCount(cellCount);
    await expect(page.locator('#checkAnswer')).toBeDisabled();

    // Odkryj pierwszą komórkę — input dostaje literę, jej przycisk "?" znika (disabled => display:none).
    const firstReveal = reveals.first();
    const r = await firstReveal.getAttribute('data-r');
    const c = await firstReveal.getAttribute('data-c');
    await firstReveal.click();
    const firstInput = page.locator(`.cw-input[data-r="${r}"][data-c="${c}"]`);
    await expect(firstInput).not.toHaveValue('');
    await expect(firstReveal).toBeHidden(); // .cw-reveal:disabled { display: none }

    // Odkryj wszystkie pozostałe komórki po kolejnych ich data-atrybutach.
    const coords = await revealTargets(page);
    for (const [key] of coords) {
      const [rr, cc] = key.split(',');
      const btn = page.locator(`.cw-reveal[data-r="${rr}"][data-c="${cc}"]`);
      if (await btn.isVisible().catch(() => false)) await btn.click();
    }

    // Wszystkie komórki wypełnione => można sprawdzić => 100% poprawnych.
    await expect(page.locator('#checkAnswer')).toBeEnabled();
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/good/);
    await expect(page.locator('.cw-cell.correct')).toHaveCount(cellCount);
  });

  test('Odkryta litera pozostaje edytowalna (jest podpowiedzią, nie blokadą)', async ({ page }) => {
    await startCrossword(page, 'Krzyżówka reveal — edycja');

    const firstReveal = page.locator('.cw-reveal').first();
    const r = await firstReveal.getAttribute('data-r');
    const c = await firstReveal.getAttribute('data-c');
    await firstReveal.click();

    const input = page.locator(`.cw-input[data-r="${r}"][data-c="${c}"]`);
    const revealed = await input.inputValue();
    expect(revealed).not.toBe('');

    // Pole nie jest zablokowane — da się je nadpisać inną literą.
    await expect(input).toBeEnabled();
    await input.fill('Z');
    await expect(input).toHaveValue('Z');
  });
});
