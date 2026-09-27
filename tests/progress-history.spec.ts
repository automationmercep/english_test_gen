// spec: specs/progress-history.md
// seed: seed.spec.ts

import { test, expect, type Locator, type Page } from '@playwright/test';

async function createSingleQuestionQuiz(page: Page, title: string) {
  await page.getByRole('button', { name: 'Stwórz test' }).click();
  await page.getByRole('textbox', { name: 'Nazwa testu' }).fill(title);

  const firstQuestion = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
  await firstQuestion.getByPlaceholder('Wpisz treść pytania…').fill('What color is the sky?');
  await firstQuestion.getByRole('textbox', { name: 'Odpowiedź A' }).fill('blue');
  await firstQuestion.getByRole('textbox', { name: 'Odpowiedź B' }).fill('red');
  await firstQuestion.getByRole('textbox', { name: 'Odpowiedź C' }).fill('green');
  await firstQuestion.getByRole('textbox', { name: 'Odpowiedź D' }).fill('yellow');
  await expect(firstQuestion.getByRole('checkbox', { name: 'blue' })).toBeChecked();

  await page.getByRole('article').filter({ hasText: 'Pytanie 2' }).getByLabel('Usuń pytanie').click();
  await page.getByRole('button', { name: 'Zapisz test →' }).click();
  await expect(page.getByRole('button', { name: `Rozpocznij test ${title}` })).toBeVisible();
}

async function completeQuiz(page: Page, title: string, answer: 'blue' | 'red') {
  await page.getByRole('button', { name: `Rozpocznij test ${title}` }).click();
  await expect(page.locator('#playView')).toHaveClass(/active/);

  await page.locator('.answer-option').filter({ hasText: answer }).click();
  await page.locator('#checkAnswer').click();
  await page.locator('#checkAnswer').click();
  await expect(page.locator('#resultsView')).toHaveClass(/active/);
}

function summaryItem(dialog: Locator, label: string) {
  return dialog.locator('.progress-stat', { hasText: label });
}

test.describe('Historia wyników i panel postępów', () => {
  test('Zapisuje, eksportuje, importuje i czyści historię wyników', async ({ page }, testInfo) => {
    const title = `Historia wyników UI ${testInfo.workerIndex}-${Date.now()}`;
    await page.addInitScript(() => localStorage.setItem('bright-english-auto-advance-v1', '0'));
    await page.goto('/');
    await createSingleQuestionQuiz(page, title);

    await completeQuiz(page, title, 'blue');
    await expect(page.locator('#scorePercent')).toHaveText('100%');
    await page.getByRole('button', { name: 'Wróć do testów →' }).click();

    await completeQuiz(page, title, 'red');
    await expect(page.locator('#scorePercent')).toHaveText('0%');
    await page.getByRole('button', { name: 'Wróć do testów →' }).click();

    const quizCard = page.locator('.quiz-card', {
      has: page.getByRole('button', { name: `Rozpocznij test ${title}` }),
    });
    const progressButton = quizCard.getByRole('button', {
      name: `Pokaż postępy testu ${title}`,
    });
    await expect(progressButton).toBeVisible();
    await expect(progressButton).toContainText('Postępy');
    await progressButton.click();

    let dialog = page.getByRole('dialog', { name: `Postępy — ${title}` });
    await expect(dialog).toBeVisible();
    await expect(summaryItem(dialog, 'Ostatni wynik')).toContainText('0%');
    await expect(summaryItem(dialog, 'Najlepszy wynik')).toContainText('100%');
    await expect(summaryItem(dialog, 'Średnia')).toContainText('50%');
    await expect(summaryItem(dialog, 'Liczba podejść')).toContainText('2');
    await expect(dialog.locator('.progress-history-item')).toHaveCount(2);
    await expect(dialog.locator('.progress-history-item').first()).toContainText('0%');
    await expect(dialog.locator('.progress-history-item').last()).toContainText('100%');

    await page.reload();
    const reloadedCard = page.locator('.quiz-card', {
      has: page.getByRole('button', { name: `Rozpocznij test ${title}` }),
    });
    await reloadedCard.getByRole('button', { name: `Pokaż postępy testu ${title}` }).click();
    dialog = page.getByRole('dialog', { name: `Postępy — ${title}` });
    await expect(summaryItem(dialog, 'Ostatni wynik')).toContainText('0%');
    await expect(summaryItem(dialog, 'Najlepszy wynik')).toContainText('100%');
    await expect(summaryItem(dialog, 'Średnia')).toContainText('50%');
    await expect(summaryItem(dialog, 'Liczba podejść')).toContainText('2');
    await expect(dialog.locator('.progress-history-item')).toHaveCount(2);

    await dialog.getByRole('button', { name: 'Zamknij' }).click();
    await page.getByRole('button', { name: 'Dane' }).click();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Eksportuj dane' }).click(),
    ]);
    const backupPath = testInfo.outputPath('progress-backup.json');
    await download.saveAs(backupPath);
    const backupStream = await download.createReadStream();
    backupStream.setEncoding('utf-8');
    let backupText = '';
    for await (const chunk of backupStream) backupText += chunk;
    const backup = JSON.parse(backupText) as {
      version: number;
      quizzes: Array<{ id: string; title: string }>;
      progress: Record<string, Array<{ percent: number }>>;
    };
    const exportedQuiz = backup.quizzes.find(quiz => quiz.title === title);
    expect(exportedQuiz).toBeDefined();
    expect(backup.version).toBe(2);
    expect(backup.progress[exportedQuiz!.id]).toHaveLength(2);
    expect(backup.progress[exportedQuiz!.id].map(attempt => attempt.percent)).toEqual([100, 0]);

    await reloadedCard.getByRole('button', { name: `Pokaż postępy testu ${title}` }).click();
    dialog = page.getByRole('dialog', { name: `Postępy — ${title}` });
    page.once('dialog', confirmation => confirmation.accept());
    await dialog.getByRole('button', { name: 'Wyczyść historię' }).click();
    await expect(summaryItem(dialog, 'Ostatni wynik')).toContainText('—');
    await expect(summaryItem(dialog, 'Najlepszy wynik')).toContainText('—');
    await expect(summaryItem(dialog, 'Średnia')).toContainText('—');
    await expect(summaryItem(dialog, 'Liczba podejść')).toContainText('0');
    await expect(dialog.getByText('Brak zapisanych wyników.')).toBeVisible();
    await expect(dialog.locator('.progress-history-item')).toHaveCount(0);

    await dialog.getByRole('button', { name: 'Zamknij' }).click();
    page.once('dialog', confirmation => confirmation.accept());
    await page.locator('#importDataFile').setInputFiles(backupPath);
    await expect(page.getByText(/Zaimportowano \d+ test/)).toBeVisible();

    await reloadedCard.getByRole('button', { name: `Pokaż postępy testu ${title}` }).click();
    dialog = page.getByRole('dialog', { name: `Postępy — ${title}` });
    await expect(summaryItem(dialog, 'Ostatni wynik')).toContainText('0%');
    await expect(summaryItem(dialog, 'Najlepszy wynik')).toContainText('100%');
    await expect(summaryItem(dialog, 'Średnia')).toContainText('50%');
    await expect(summaryItem(dialog, 'Liczba podejść')).toContainText('2');
    await expect(dialog.locator('.progress-history-item')).toHaveCount(2);

    await dialog.getByRole('button', { name: 'Zamknij' }).click();

    page.once('dialog', confirmation => confirmation.accept());
    await quizCard.getByLabel('Usuń test').click();
    await expect(page.getByRole('button', { name: `Rozpocznij test ${title}` })).not.toBeVisible();
    const progressAfterDelete = await page.evaluate(quizId => {
      const progress = JSON.parse(localStorage.getItem('bright-english-progress-v1') || '{}');
      return progress[quizId];
    }, exportedQuiz!.id);
    expect(progressAfterDelete).toBeUndefined();
  });

  test('Odrzuca backup z nieprawidłowym schematem quizów bez nadpisania biblioteki', async ({ page }) => {
    await page.goto('/');
    const cardsBefore = await page.locator('.quiz-card').count();
    const storageBefore = await page.evaluate(() => localStorage.getItem('bright-english-quizzes-v1'));

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toContain('nie udało się wczytać pliku');
      await dialog.accept();
    });
    await page.locator('#importDataFile').setInputFiles({
      name: 'invalid-schema.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({ version: 2, quizzes: [null], categories: [], progress: {} })),
    });

    await expect(page.locator('.quiz-card')).toHaveCount(cardsBefore);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('bright-english-quizzes-v1'))).toBe(storageBefore);
  });

  test('Nie zapisuje korekcyjnej powtórki błędnych pytań jako pełnego podejścia', async ({ page }, testInfo) => {
    const title = `Historia korekty ${testInfo.workerIndex}-${Date.now()}`;
    await page.addInitScript(() => localStorage.setItem('bright-english-auto-advance-v1', '0'));
    await page.goto('/');
    await createSingleQuestionQuiz(page, title);

    await completeQuiz(page, title, 'red');
    await page.getByRole('button', { name: /Powtórz 1 błędne pytanie/ }).click();
    await page.locator('.answer-option').filter({ hasText: 'blue' }).click();
    await page.locator('#checkAnswer').click();
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#scorePercent')).toHaveText('100%');
    await page.getByRole('button', { name: 'Wróć do testów →' }).click();

    const quizCard = page.locator('.quiz-card', {
      has: page.getByRole('button', { name: `Rozpocznij test ${title}` }),
    });
    await quizCard.getByRole('button', { name: `Pokaż postępy testu ${title}` }).click();
    const dialog = page.getByRole('dialog', { name: `Postępy — ${title}` });
    await expect(summaryItem(dialog, 'Ostatni wynik')).toContainText('0%');
    await expect(summaryItem(dialog, 'Liczba podejść')).toContainText('1');
    await expect(dialog.locator('.progress-history-item')).toHaveCount(1);

    await dialog.getByRole('button', { name: 'Zamknij' }).click();
    page.once('dialog', confirmation => confirmation.accept());
    await quizCard.getByLabel('Usuń test').click();
  });
});
