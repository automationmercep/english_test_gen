// spec: specs/gap-coverage.plan.md
// seed: seed.spec.ts
//
// Nawigacja w trakcie rozwiązywania testu: powrót "← Poprzednie pytanie"
// zachowujący udzieloną odpowiedź i stan sprawdzenia, oraz przedwczesne
// zakończenie przyciskiem "×" (bez ekranu wyniku i bez zapisu postępu).
// Używamy wbudowanego "Everyday English"; auto-advance zerujemy, by w pełni
// kontrolować przejścia. Asercje opierają się na niezmiennikach (a nie na
// treści konkretnego pytania), więc są odporne na losowanie kolejności.

import { test, expect, type Page } from '@playwright/test';

async function openEverydayEnglish(page: Page) {
  await page.addInitScript(() => localStorage.setItem('bright-english-auto-advance-v1', '0'));
  await page.goto('/');
  await page.locator('#soundToggle').click();
  await page.locator('.quiz-card', { hasText: 'Everyday English' }).click();
  await expect(page.locator('#playView')).toHaveClass(/active/);
}

// Udziel jakiejkolwiek odpowiedzi na bieżące pytanie (wybór lub uzupełnienie),
// bez klikania "Sprawdź". Zwraca opis udzielonej odpowiedzi do późniejszej weryfikacji.
async function answerCurrent(page: Page): Promise<{ kind: 'choice' | 'fill'; value: string }> {
  const fillInput = page.locator('#fillInput');
  if (await fillInput.isVisible().catch(() => false)) {
    await fillInput.fill('nawigacja-test');
    return { kind: 'fill', value: 'nawigacja-test' };
  }
  const first = page.locator('.answer-option').first();
  await first.click();
  return { kind: 'choice', value: (await first.textContent()) || '' };
}

test.describe('Nawigacja w trakcie rozwiązywania testu', () => {
  test('„Poprzednie pytanie” zachowuje udzieloną odpowiedź i stan sprawdzenia', async ({ page }) => {
    await openEverydayEnglish(page);

    // Na pytaniu 1 przycisk „Poprzednie pytanie” jest wyłączony.
    await expect(page.locator('#progressText')).toHaveText('1 / 6');
    await expect(page.locator('#previousQuestion')).toBeDisabled();

    // Odpowiedz na pytanie 1 i sprawdź.
    const answered = await answerCurrent(page);
    const checkAnswer = page.locator('#checkAnswer');
    await checkAnswer.click();
    // Po sprawdzeniu widoczny jest feedback; kontrolki odpowiedzi są zablokowane.
    await expect(page.locator('#feedback')).toHaveClass(/good|bad/);
    if (answered.kind === 'choice') {
      await expect(page.locator('.answer-option').first()).toBeDisabled();
    } else {
      await expect(page.locator('#fillInput')).toBeDisabled();
    }

    // Przejdź do pytania 2 (przycisk zmienił etykietę na „Następne pytanie”).
    await checkAnswer.click();
    await expect(page.locator('#progressText')).toHaveText('2 / 6');
    await expect(page.locator('#previousQuestion')).toBeEnabled();

    // Wróć do pytania 1.
    await page.locator('#previousQuestion').click();
    await expect(page.locator('#progressText')).toHaveText('1 / 6');

    // Stan sprawdzenia jest odtworzony: feedback nadal widoczny, kontrolki zablokowane,
    // a udzielona wcześniej odpowiedź zachowana (bez możliwości zmiany).
    await expect(page.locator('#feedback')).toHaveClass(/good|bad/);
    if (answered.kind === 'choice') {
      await expect(page.locator('.answer-option').first()).toBeDisabled();
      // Któraś z opcji jest oznaczona jako wybrana/poprawna/błędna (klasa stanu).
      await expect(page.locator('.answer-option.correct, .answer-option.wrong, .answer-option.selected').first()).toBeVisible();
    } else {
      await expect(page.locator('#fillInput')).toBeDisabled();
      await expect(page.locator('#fillInput')).toHaveValue(answered.value);
    }

    // Ponownie w przód: pytanie 2 nie jest jeszcze odpowiedziane — „Sprawdź” disabled do wyboru.
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#progressText')).toHaveText('2 / 6');
  });

  test('Zakończenie testu przyciskiem „×” wraca do biblioteki bez ekranu wyniku i bez zapisu postępu', async ({ page }) => {
    await openEverydayEnglish(page);

    // Odpowiedz na pierwsze pytanie i przejdź do drugiego.
    await answerCurrent(page);
    const checkAnswer = page.locator('#checkAnswer');
    await checkAnswer.click();
    await checkAnswer.click();
    await expect(page.locator('#progressText')).toHaveText('2 / 6');

    // Kliknij „×” (Zakończ test) — pojawia się confirm(), akceptujemy.
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#exitQuiz').click();

    // Wracamy do biblioteki, ekran wyniku NIE jest pokazany.
    await expect(page.locator('#homeView')).toHaveClass(/active/);
    await expect(page.locator('#resultsView')).not.toHaveClass(/active/);

    // Ponowny start tego samego testu zaczyna się od pytania 1 (brak zapisanego postępu).
    await page.locator('.quiz-card', { hasText: 'Everyday English' }).click();
    await expect(page.locator('#playView')).toHaveClass(/active/);
    await expect(page.locator('#progressText')).toHaveText('1 / 6');
  });
});
