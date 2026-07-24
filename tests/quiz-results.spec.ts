// spec: specs/gap-coverage.plan.md
// seed: seed.spec.ts
//
// Ekran wyników i powtórki dla wbudowanego testu "Everyday English" (6 pytań).
// Test domyślnie losuje kolejność pytań/odpowiedzi i stosuje spaced-repetition,
// więc zamiast zakładać sztywny wynik, rozgrywamy test sterując odpowiedziami
// przez treść pytania (mapa correctAnswers) i celowo mylimy DOKŁADNIE jedno
// pytanie — dając deterministyczne 5/6 poprawnych. Auto-advance ustawiamy na 0,
// aby przejścia między pytaniami były w pełni pod kontrolą testu.

import { test, expect, type Page } from '@playwright/test';

// Dokładne dopasowanie treści opcji: krótkie odpowiedzi bywają swoimi podłańcuchami
// (np. "do" ⊂ "does"), więc kotwiczymy na końcu accessible-name przycisku.
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Poprawne odpowiedzi wszystkich 6 pytań "Everyday English" (ze starterQuizzes
// w app.js). Klucz to fragment treści pytania — odporny na losowanie kolejności.
const CORRECT: { match: string; answer: string; wrong: string }[] = [
  { match: 'How ___ you today?', answer: 'are', wrong: 'is' },
  { match: 'I ___ coffee every morning', answer: 'drink', wrong: 'xxx' },
  { match: 'Mam dwie siostry', answer: 'I have two sisters.', wrong: 'I has two sisters.' },
  { match: 'What time ___ the shop open?', answer: 'does', wrong: 'do' },
  { match: 'She is good ___ cooking', answer: 'at', wrong: 'xxx' },
  { match: 'Które zdanie jest poprawne?', answer: "He doesn't like rain.", wrong: "He don't like rain." },
];

// Wyłącz dźwięk (blokuje auto-advance przez syntezę mowy) i zeruj auto-advance,
// aby przejście dalej wymagało jawnego kliknięcia — deterministycznie.
async function openEverydayEnglish(page: Page) {
  await page.addInitScript(() => localStorage.setItem('bright-english-auto-advance-v1', '0'));
  await page.goto('/');
  await page.locator('#soundToggle').click();
  await page.locator('.quiz-card', { hasText: 'Everyday English' }).click();
  await expect(page.locator('#playView')).toHaveClass(/active/);
}

// Rozegraj cały test. `wrongCount` = ile pytań świadomie pomylić (od pierwszego).
// Zwraca liczbę pytań (6). Nie klika ostatniego "Zobacz wynik" — to robi caller,
// bo część testów chce najpierw sprawdzić stan ostatniego pytania.
async function playQuiz(page: Page, wrongCount: number): Promise<number> {
  const total = Number((await page.locator('#progressText').textContent())!.split('/')[1].trim());
  let wrongsMade = 0;
  for (let i = 0; i < total; i++) {
    await expect(page.locator('#progressText')).toHaveText(`${i + 1} / ${total}`);
    const promptText = (await page.locator('#questionText').textContent()) || '';
    const entry = CORRECT.find(c => promptText.includes(c.match));
    if (!entry) throw new Error(`Nie rozpoznano pytania: "${promptText}"`);
    const makeWrong = wrongsMade < wrongCount;
    if (makeWrong) wrongsMade++;
    const value = makeWrong ? entry.wrong : entry.answer;

    const choiceOption = page.locator('.answer-option');
    const fillInput = page.locator('#fillInput');
    if (await fillInput.isVisible().catch(() => false)) {
      await fillInput.fill(value);
    } else {
      // Wybór: kliknij opcję kończącą się dokładnie tą treścią (patrz escapeRegExp).
      await choiceOption.filter({ hasText: new RegExp(escapeRegExp(value) + '$') }).first().click();
    }

    const checkAnswer = page.locator('#checkAnswer');
    await expect(checkAnswer).toBeEnabled();
    await checkAnswer.click();           // sprawdź
    await expect(checkAnswer).toBeEnabled();
    await checkAnswer.click();           // następne pytanie / zobacz wynik
  }
  return total;
}

test.describe('Ekran wyników i powtórki', () => {
  test('Ekran wyników pokazuje poprawny procent, podsumowanie i listę pytań', async ({ page }) => {
    await openEverydayEnglish(page);
    const total = await playQuiz(page, 1); // dokładnie 1 błąd => 5/6

    await expect(page.locator('#resultsView')).toHaveClass(/active/);

    // Statystyki: 5 poprawnych, 1 do powtórki, 6 łącznie; procent = round(5/6*100) = 83.
    await expect(page.locator('#correctCount')).toHaveText(String(total - 1));
    await expect(page.locator('#wrongCount')).toHaveText('1');
    await expect(page.locator('#totalCount')).toHaveText(String(total));
    await expect(page.locator('#scorePercent')).toHaveText(`${Math.round((total - 1) / total * 100)}%`);

    // Lista pytań: po jednym wpisie na pytanie, dokładnie jeden błędny (klasa .bad).
    await expect(page.locator('#reviewList .review-item')).toHaveCount(total);
    await expect(page.locator('#reviewList .review-item.bad')).toHaveCount(1);
    await expect(page.locator('#reviewList .review-item.good')).toHaveCount(total - 1);
    // Każdy wpis pokazuje poprawną odpowiedź.
    await expect(page.locator('#reviewList .review-item.bad .review-answer strong')).toBeVisible();

    // Przyciski akcji na dole.
    await expect(page.locator('#retryWrong')).toBeVisible();
    await expect(page.locator('#retryWrong')).toHaveText(/Powtórz 1 błędne pytanie/);
    await expect(page.locator('#retryQuiz')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Wróć do testów →' })).toBeVisible();
  });

  test('Powtórz błędne pytania — nowe podejście zawiera tylko pytania błędne', async ({ page }) => {
    await openEverydayEnglish(page);
    const total = await playQuiz(page, 1);

    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await page.locator('#retryWrong').click();

    // Skrócone podejście: tylko 1 pytanie (to błędne), nie pełne 6.
    await expect(page.locator('#playView')).toHaveClass(/active/);
    await expect(page.locator('#progressText')).toHaveText('1 / 1');
    expect(1).toBeLessThan(total);

    // Odpowiedz poprawnie na to jedno pytanie i zakończ => 100%.
    await playQuiz(page, 0);
    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await expect(page.locator('#scorePercent')).toHaveText('100%');
    await expect(page.locator('#totalCount')).toHaveText('1');
  });

  test('Spróbuj ponownie — restart całego testu od pytania 1', async ({ page }) => {
    await openEverydayEnglish(page);
    const total = await playQuiz(page, 1);

    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await page.locator('#retryQuiz').click();

    // Pełny restart: pytanie 1 z pełną liczbą pytań (nie tylko błędne).
    await expect(page.locator('#playView')).toHaveClass(/active/);
    await expect(page.locator('#progressText')).toHaveText(`1 / ${total}`);
  });
});
