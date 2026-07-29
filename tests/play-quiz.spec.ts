// spec: specs/play-quiz.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Rozwiązywanie testu', () => {
  test('Pytania pojawiają się kaskadowo, także na mobile, z obsługą reduced motion', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem('bright-english-quizzes-v1', JSON.stringify([{
        id: 'animation-preview',
        title: 'Animacja pytań',
        level: 'A2',
        category: 'Testy',
        shuffleQuestions: false,
        shuffleAnswers: false,
        questions: [
          { type: 'choice', prompt: 'Choose the correct answer: one', answers: ['A', 'B', 'C', 'D'], correct: 0 },
          { type: 'choice', prompt: 'Choose the correct answer: two', answers: ['A', 'B', 'C', 'D'], correct: 1 },
        ],
      }]));
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Rozpocznij test Animacja pytań' }).click();

    const stage = page.locator('.quiz-stage');
    const title = page.locator('#questionText');
    const answers = page.locator('#answerArea > *');
    await expect(stage).toHaveClass(/question-enter/);
    await expect(title).toHaveCSS('animation-name', 'question-rise-in');
    await expect(answers.first()).toHaveCSS('animation-name', 'answer-rise-in');
    await expect(answers.nth(1)).toHaveCSS('animation-delay', '0.21s');

    const firstPrompt = await title.textContent();
    const choice = page.locator('.answer-option').first();
    const fill = page.locator('#fillInput');
    if (await choice.isVisible().catch(() => false)) await choice.click();
    else await fill.fill('test');
    await page.locator('#checkAnswer').click();
    await page.locator('#checkAnswer').click();

    await expect(title).not.toHaveText(firstPrompt || '');
    await expect(stage).toHaveClass(/question-enter/);
    await expect(title).toHaveCSS('animation-name', 'question-rise-in');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.getByRole('button', { name: 'Rozpocznij test Animacja pytań' }).click();
    await expect(title).toHaveCSS('animation-name', 'none');
    await expect(page.locator('#answerArea > *').first()).toHaveCSS('animation-name', 'none');
  });

  test('Rozwiązanie testu "Everyday English" i sprawdzenie wyników', async ({ page }) => {
    await page.goto('/');

    // Wyłącz dźwięk, aby uniknąć syntezy mowy blokującej auto-przejście między pytaniami
    await page.locator('#soundToggle').click();

    // 1. Na stronie głównej kliknij kartę testu "Everyday English"
    await page.locator('.quiz-card', { hasText: 'Everyday English' }).click();
    await expect(page.locator('#playView')).toHaveClass(/active/);

    // 2. Odpowiadaj na kolejne pytania (typ i kolejność mogą być losowane), aż pojawi się ekran wyników
    for (let question = 0; question < 6; question++) {
      // Licznik postępu ("X / Y") musi pokazywać rzeczywistą łączną liczbę pytań (6), nie zawyżoną wartość
      await expect(page.locator('#progressText')).toHaveText(`${question + 1} / 6`);

      const choiceOption = page.locator('.answer-option').first();
      const fillInput = page.locator('#fillInput');

      if (await choiceOption.isVisible().catch(() => false)) {
        await choiceOption.click();
      } else if (await fillInput.isVisible().catch(() => false)) {
        await fillInput.fill('test');
      }

      const checkAnswer = page.locator('#checkAnswer');
      await expect(checkAnswer).toBeEnabled();
      await checkAnswer.click();

      // Po sprawdzeniu odpowiedzi przycisk zmienia etykietę na "Następne pytanie" / "Zobacz wynik"
      await expect(checkAnswer).toBeEnabled();
      await checkAnswer.click();
    }

    // 3. Ekran wyników
    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await expect(page.locator('#totalCount')).toHaveText('6');
    await expect(page.locator('#scorePercent')).toBeVisible();
    await expect(page.locator('#correctCount')).toBeVisible();
  });
});
