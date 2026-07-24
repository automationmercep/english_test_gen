// spec: specs/gap-coverage.plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Eksport, import i scalanie danych', () => {
  test('Eksport całych danych do pliku JSON', async ({ page }) => {
    await page.goto('/');

    // 1. Na stronie głównej otwórz panel „Dane” w topbarze.
    await page.getByRole('button', { name: 'Dane' }).click();

    // expect: Panel rozwija się i pokazuje opcje: „Eksportuj dane”, „Importuj dane”, „Dodaj testy”.
    await expect(page.getByRole('button', { name: 'Eksportuj dane' })).toBeVisible();
    await expect(page.getByText('Importuj dane')).toBeVisible();
    await expect(page.getByText('Dodaj testy')).toBeVisible();

    // 2. Kliknij „Eksportuj dane”.
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Eksportuj dane' }).click(),
    ]);

    // expect: Przeglądarka pobiera plik JSON o nazwie zawierającej „bright-english-backup” i aktualną datę.
    const today = new Date().toISOString().slice(0, 10);
    expect(download.suggestedFilename()).toContain('bright-english-backup');
    expect(download.suggestedFilename()).toContain(today);

    // expect: Plik zawiera pola version, exported, quizzes (z co najmniej domyślnymi testami) oraz categories.
    const stream = await download.createReadStream();
    stream.setEncoding('utf-8');
    let text = '';
    for await (const chunk of stream) text += chunk;
    const data = JSON.parse(text);
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('exported');
    expect(Array.isArray(data.quizzes)).toBe(true);
    expect(data.quizzes.length).toBeGreaterThanOrEqual(4);
    expect(data).toHaveProperty('categories');
  });

  test('Import danych z pliku JSON zastępuje istniejące testy', async ({ page }) => {
    await page.goto('/');

    // 1. Utwórz nowy, unikalnie nazwany test „Import Test A” przez kreator.
    await page.getByRole('button', { name: 'Stwórz test' }).click();
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Import Test A');
    const firstQuestionCard = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
    await firstQuestionCard.getByPlaceholder('Wpisz treść pytania…').fill('What color is the sky?');
    await page.getByRole('textbox', { name: 'Odpowiedź A' }).fill('blue');
    await page.getByRole('textbox', { name: 'Odpowiedź B' }).fill('red');
    await page.getByRole('textbox', { name: 'Odpowiedź C' }).fill('green');
    await page.getByRole('textbox', { name: 'Odpowiedź D' }).fill('yellow');
    await page.getByRole('article').filter({ hasText: 'Pytanie 2' }).getByLabel('Usuń pytanie').click();
    await page.getByRole('button', { name: 'Zapisz test →' }).click();

    // expect: Test „Import Test A” pojawia się na liście testów.
    const importTestACard = page.getByRole('button', { name: 'Rozpocznij test Import Test A' });
    await expect(importTestACard).toBeVisible();
    await page.getByRole('tab', { name: 'Wszystkie, testów:' }).click();

    // 2. Wyeksportuj dane (patrz poprzedni scenariusz), zapisując plik jako referencję „stan A”.
    await page.getByRole('button', { name: 'Dane' }).click();
    const [downloadA] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Eksportuj dane' }).click(),
    ]);
    // Ścieżka pobranego pliku posłuży za wejście do importu; osobno czytamy
    // jego treść, by potwierdzić, że reprezentuje stan A.
    const stateAPath = await downloadA.path();
    const streamA = await downloadA.createReadStream();
    streamA.setEncoding('utf-8');
    let stateAText = '';
    for await (const chunk of streamA) stateAText += chunk;

    // expect: Pobrano plik JSON reprezentujący stan A.
    expect(stateAText).toContain('Import Test A');

    // 3. Usuń test „Import Test A” z biblioteki.
    page.once('dialog', dialog => dialog.accept());
    await importTestACard.getByLabel('Usuń test').click();

    // expect: Test „Import Test A” nie jest już widoczny na liście.
    await expect(importTestACard).not.toBeVisible();

    // 4. Otwórz panel „Dane”, kliknij „Importuj dane” i wybierz plik zapisany w kroku 2 (stan A).
    await page.getByRole('button', { name: 'Dane' }).click();
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#importDataFile').setInputFiles(stateAPath);

    // expect: Po imporcie biblioteka zawiera ponownie test „Import Test A”.
    await expect(page.getByRole('button', { name: 'Rozpocznij test Import Test A' })).toBeVisible();

    // Sprzątanie: usuń "Import Test A" z biblioteki na końcu testu.
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Rozpocznij test Import Test A' }).getByLabel('Usuń test').click();
    await expect(page.getByRole('button', { name: 'Rozpocznij test Import Test A' })).not.toBeVisible();
  });

  test('Dodaj testy (scalanie) importuje tylko nowe quizy bez usuwania istniejących', async ({ page }) => {
    await page.goto('/');

    // 1. Zanotuj listę aktualnych testów w bibliotece (np. 4 testy startowe).
    const allTab = page.getByRole('tab', { name: 'Wszystkie, testów:' });
    await expect(allTab).toBeVisible();
    const initialCountLabel = await allTab.getAttribute('aria-label');
    const initialCount = Number(initialCountLabel?.match(/(\d+)/)?.[1]);
    expect(initialCount).toBeGreaterThan(0);

    // 2. Utwórz unikalny test „Merge Test B”, wyeksportuj dane do pliku, a następnie usuń „Merge Test B” z biblioteki.
    await page.getByRole('button', { name: 'Stwórz test' }).click();
    await page.getByRole('textbox', { name: 'Nazwa testu' }).fill('Merge Test B');
    const firstQuestionCard = page.getByRole('article').filter({ hasText: 'Pytanie 1' });
    await firstQuestionCard.getByPlaceholder('Wpisz treść pytania…').fill('What color is the sky?');
    await page.getByRole('textbox', { name: 'Odpowiedź A' }).fill('blue');
    await page.getByRole('textbox', { name: 'Odpowiedź B' }).fill('red');
    await page.getByRole('textbox', { name: 'Odpowiedź C' }).fill('green');
    await page.getByRole('textbox', { name: 'Odpowiedź D' }).fill('yellow');
    await page.getByRole('article').filter({ hasText: 'Pytanie 2' }).getByLabel('Usuń pytanie').click();
    await page.getByRole('button', { name: 'Zapisz test →' }).click();

    const mergeTestBCard = page.getByRole('button', { name: 'Rozpocznij test Merge Test B' });
    await expect(mergeTestBCard).toBeVisible();
    await page.getByRole('tab', { name: 'Wszystkie, testów:' }).click();

    await page.getByRole('button', { name: 'Dane' }).click();
    const [downloadB] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Eksportuj dane' }).click(),
    ]);
    const stateBPath = await downloadB.path();
    const streamB = await downloadB.createReadStream();
    streamB.setEncoding('utf-8');
    let stateBText = '';
    for await (const chunk of streamB) stateBText += chunk;

    // expect: Plik JSON zawiera „Merge Test B”.
    expect(stateBText).toContain('Merge Test B');

    page.once('dialog', dialog => dialog.accept());
    await mergeTestBCard.getByLabel('Usuń test').click();

    // expect: biblioteka po usunięciu go nie zawiera „Merge Test B”, a liczba testów wraca do liczby startowej.
    await expect(mergeTestBCard).not.toBeVisible();
    await expect(allTab).toHaveAttribute('aria-label', `Wszystkie, testów: ${initialCount}`);

    // 3. Otwórz panel „Dane”, kliknij „Dodaj testy” i wybierz plik z „Merge Test B”.
    await page.getByRole('button', { name: 'Dane' }).click();
    await page.locator('#mergeQuizzesFile').setInputFiles(stateBPath);

    // expect: Test „Merge Test B” zostaje dodany do biblioteki, a wszystkie testy, które były obecne przed
    // scaleniem, pozostają niezmienione (brak duplikatów, brak utraty danych).
    await expect(page.getByText('Dodano 1 nowe test do biblioteki')).toBeVisible();
    await expect(mergeTestBCard).toBeVisible();
    await expect(allTab).toHaveAttribute('aria-label', `Wszystkie, testów: ${initialCount + 1}`);

    // Sprzątanie: usuń "Merge Test B" z biblioteki na końcu testu.
    page.once('dialog', dialog => dialog.accept());
    await mergeTestBCard.getByLabel('Usuń test').click();
    await expect(mergeTestBCard).not.toBeVisible();
    await expect(allTab).toHaveAttribute('aria-label', `Wszystkie, testów: ${initialCount}`);
  });
});
