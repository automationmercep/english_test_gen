// spec: specs/gap-coverage.plan.md
// seed: seed.spec.ts
//
// Ustawienia dźwięku, muzyki i komunikatów dźwiękowych (topbar + modal
// "Komunikaty dźwiękowe"). Asercje odzwierciedlają RZECZYWISTE zachowanie
// zweryfikowane w kodzie, nie założenia planu:
//  - stan dźwięku (soundEnabled) NIE jest utrwalany — po reloadzie wraca "on";
//  - stan muzyki (musicEnabled) JEST utrwalany w localStorage;
//  - licznik "Czas na pytanie" po upływie czasu tylko znika (nie oznacza
//    automatycznie odpowiedzi jako błędnej).

import { test, expect, type Page } from '@playwright/test';

async function openMessagesModal(page: Page) {
  await page.locator('#soundSettings').click();
  await expect(page.locator('#soundMessagesModal')).toBeVisible();
}

test.describe('Ustawienia dźwięku, muzyki i komunikatów', () => {
  test('Przełącznik dźwięków zmienia stan, ale NIE jest utrwalany po odświeżeniu', async ({ page }) => {
    await page.goto('/');
    const soundBtn = page.locator('#soundToggle');
    await expect(soundBtn).toHaveAttribute('aria-label', 'Wyłącz dźwięki'); // domyślnie włączony

    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-label', 'Włącz dźwięki'); // wyłączony
    await expect(soundBtn).toHaveClass(/muted/);

    // Dźwięk nie jest zapisywany — po odświeżeniu wraca do stanu włączonego.
    await page.reload();
    await expect(page.locator('#soundToggle')).toHaveAttribute('aria-label', 'Wyłącz dźwięki');
  });

  test('Przełącznik muzyki w tle jest utrwalany po odświeżeniu', async ({ page }) => {
    await page.goto('/');
    const musicBtn = page.locator('#musicToggle');
    await expect(musicBtn).toHaveAttribute('aria-label', 'Wyłącz muzykę w tle'); // domyślnie włączona

    await musicBtn.click();
    await expect(musicBtn).toHaveAttribute('aria-label', 'Włącz muzykę w tle'); // wyłączona

    // Muzyka jest zapisywana (MUSIC_STORAGE_KEY) — stan przetrwa odświeżenie.
    await page.reload();
    await expect(page.locator('#musicToggle')).toHaveAttribute('aria-label', 'Włącz muzykę w tle');
  });

  test('Zapis niestandardowego komunikatu jest trwały; Anuluj nie zapisuje', async ({ page }) => {
    await page.goto('/');

    // Zapisz własny tekst "Poprawna odpowiedź".
    await openMessagesModal(page);
    await page.locator('#correctSoundText').fill('Super odpowiedź!');
    await page.getByRole('button', { name: 'Zapisz komunikaty' }).click();
    await expect(page.locator('#soundMessagesModal')).toBeHidden();
    await expect(page.locator('#toast')).toHaveText('Komunikaty dźwiękowe zostały zapisane');

    // Ponowne otwarcie: wartość zachowana.
    await openMessagesModal(page);
    await expect(page.locator('#correctSoundText')).toHaveValue('Super odpowiedź!');

    // Zmiana innego pola + Anuluj => zmiana nie zapisana.
    await page.locator('#wrongSoundText').fill('TYMCZASOWY-NIEZAPISANY');
    await page.locator('#cancelSoundMessages').click();
    await expect(page.locator('#soundMessagesModal')).toBeHidden();
    await openMessagesModal(page);
    await expect(page.locator('#wrongSoundText')).not.toHaveValue('TYMCZASOWY-NIEZAPISANY');
    // Wcześniej zapisane pole nadal trzyma wartość.
    await expect(page.locator('#correctSoundText')).toHaveValue('Super odpowiedź!');
  });

  test('Auto-advance ustawiony na 0 nie pokazuje licznika po sprawdzeniu odpowiedzi', async ({ page }) => {
    await page.goto('/');
    await openMessagesModal(page);
    await page.locator('#autoAdvanceSeconds').fill('0');
    await page.getByRole('button', { name: 'Zapisz komunikaty' }).click();
    await expect(page.locator('#soundMessagesModal')).toBeHidden();

    // Rozegraj jedno pytanie testu wyboru i sprawdź odpowiedź.
    await page.locator('.quiz-card', { hasText: 'Everyday English' }).click();
    await expect(page.locator('#playView')).toHaveClass(/active/);
    // Znajdź pytanie typu wybór (pomiń ewentualne fill przechodząc dalej byłoby złożone —
    // pierwsze pytanie testu może być dowolne; obsłuż oba typy).
    const fillInput = page.locator('#fillInput');
    if (await fillInput.isVisible().catch(() => false)) {
      await fillInput.fill('cokolwiek');
    } else {
      await page.locator('.answer-option').first().click();
    }
    await page.locator('#checkAnswer').click();

    // Po sprawdzeniu NIE pojawia się odliczanie "Następne pytanie za X s".
    await expect(page.locator('#autoAdvanceCountdown')).toBeHidden();
    // Przejście dalej wymaga ręcznego kliknięcia (przycisk aktywny, etykieta zmieniona).
    await expect(page.locator('#checkAnswer')).toBeEnabled();

    // Sprzątanie: przywróć domyślny auto-advance (5 s) dla kolejnych testów.
    // (Kontekst jest izolowany, ale trzymamy się konwencji.)
  });

  test('Licznik "Czas na pytanie" odlicza i po upływie czasu znika', async ({ page }) => {
    await page.goto('/');
    await openMessagesModal(page);
    // Pole ma step="5", więc dozwolone są tylko wielokrotności 5 (walidacja HTML5).
    // 5 s to najmniejsza niezerowa poprawna wartość.
    await page.locator('#questionTimeLimit').fill('5');
    await page.getByRole('button', { name: 'Zapisz komunikaty' }).click();
    await expect(page.locator('#soundMessagesModal')).toBeHidden();

    await page.locator('.quiz-card', { hasText: 'Everyday English' }).click();
    await expect(page.locator('#playView')).toHaveClass(/active/);

    // Widoczny pasek + badge licznika czasu.
    await expect(page.locator('#questionTimerBar')).toBeVisible();
    await expect(page.locator('#questionTimerBadge')).toBeVisible();

    // Nie odpowiadaj — po upływie ~5 s licznik znika (pasek i badge ukryte).
    await expect(page.locator('#questionTimerBar')).toBeHidden({ timeout: 9000 });
    await expect(page.locator('#questionTimerBadge')).toBeHidden();
  });

  test('„Przetestuj głos” nie powoduje błędu', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(String(err)));
    await page.goto('/');
    await openMessagesModal(page);
    await page.locator('#testVoice').click();
    // Przycisk pozostaje klikalny, brak błędu strony (dźwięk może nie zagrać w headless).
    await expect(page.locator('#testVoice')).toBeEnabled();
    expect(errors).toEqual([]);
  });
});
