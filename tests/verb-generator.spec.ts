// spec: specs/gap-coverage.plan.md
// seed: seed.spec.ts
//
// Generator odmiany czasowników (modal "Odmiana czasownika" w kreatorze). Bierze
// czasowniki + wybrane czasy/formy/podmioty i wkleja do pola CSV wiersze typu
// `<Podmiot> ___ (verb) reszta., <forma>, fill`, po jednym na kombinację
// czas × forma × podmiot. Nieregularne czasowniki odmienia ze słownika; formę
// można nadpisać przez `=`. Testy ograniczają podmioty dla deterministycznego
// wyniku i weryfikują faktyczną odmianę wklejoną do #csvInput.

import { test, expect, type Page } from '@playwright/test';

async function openGenerator(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Stwórz test' }).click();
  await page.locator('#openVerbGenerator').click();
  await expect(page.locator('#verbGeneratorModal')).toBeVisible();
}

// Zaznacz dokładnie podane podmioty (odznaczając resztę), aby wynik był deterministyczny.
async function setSubjects(page: Page, wanted: string[]) {
  const boxes = page.locator('#verbGeneratorSubjects input[type="checkbox"]');
  const count = await boxes.count();
  for (let i = 0; i < count; i++) {
    const box = boxes.nth(i);
    const value = await box.getAttribute('value');
    if (wanted.includes(value!)) await box.check(); else await box.uncheck();
  }
}

test.describe('Generator odmiany czasowników', () => {
  test('Jeden czasownik, jeden czas — poprawna odmiana dla wybranych podmiotów', async ({ page }) => {
    await openGenerator(page);
    // Domyślnie Present Simple + Twierdzenie. Ogranicz do I i He.
    await setSubjects(page, ['I', 'He']);
    await page.locator('#verbGeneratorVerbs').fill('play, tennis on Sundays');
    await page.getByRole('button', { name: 'Wygeneruj i wklej do CSV' }).click();

    await expect(page.locator('#verbGeneratorModal')).toBeHidden();
    const csv = await page.locator('#csvInput').inputValue();
    const lines = csv.split('\n').filter(Boolean);
    expect(lines).toHaveLength(2); // I + He
    // Odmiana: I -> play, He -> plays.
    expect(csv).toContain('I ___ (play) tennis on Sundays., play, fill');
    expect(csv).toContain('He ___ (play) tennis on Sundays., plays, fill');

    // Wczytaj pytania — powstają 2 karty typu "Uzupełnij zdanie".
    // Uwaga: import używa formy "pytań" także dla 2 (N===1 ? "pytanie" : "pytań").
    await page.locator('#importCsv').click();
    await expect(page.getByText('Dodano 2 pytań')).toBeVisible();
    const cards = page.locator('#questionList .question-card');
    const types = await cards.evaluateAll(nodes => nodes.map(n => (n as HTMLElement).dataset.type));
    expect(types.filter(t => t === 'fill')).toHaveLength(2);
  });

  test('Wiele czasów i form + nieregularny czasownik + nadpisanie formy przez "="', async ({ page }) => {
    await openGenerator(page);

    // Zaznacz oba czasy i obie formy zdania.
    await page.locator('#verbGeneratorTense input[value="past"]').check();
    await page.locator('#verbGeneratorFormType input[value="question"]').check();
    // Ogranicz podmioty do I i She (2 podmioty).
    await setSubjects(page, ['I', 'She']);
    // Nieregularny "go" — Present 3.os. => goes, Past => went (ze słownika).
    await page.locator('#verbGeneratorVerbs').fill('go, to school by bus');
    await page.getByRole('button', { name: 'Wygeneruj i wklej do CSV' }).click();

    const csv = await page.locator('#csvInput').inputValue();
    const lines = csv.split('\n').filter(Boolean);
    // 2 czasy × 2 formy × 2 podmioty = 8 wierszy.
    expect(lines).toHaveLength(8);
    // Twierdzenie: She w Present => goes; w Past => went (nieregularne ze słownika).
    expect(csv).toContain('She ___ (go) to school by bus., goes, fill');
    expect(csv).toContain('She ___ (go) to school by bus., went, fill');

    // Nadpisanie automatycznej odmiany: "go=poszła" wymusza własną formę.
    await page.locator('#openVerbGenerator').click();
    await expect(page.locator('#verbGeneratorModal')).toBeVisible();
    await page.locator('#verbGeneratorTense input[value="past"]').uncheck();       // tylko Present
    await page.locator('#verbGeneratorFormType input[value="question"]').uncheck(); // tylko Twierdzenie
    await setSubjects(page, ['I']);
    await page.locator('#verbGeneratorVerbs').fill('go=CUSTOMFORM, home');
    await page.getByRole('button', { name: 'Wygeneruj i wklej do CSV' }).click();

    const csv2 = await page.locator('#csvInput').inputValue();
    // Nowo dodany wiersz używa nadpisanej formy zamiast automatycznej.
    expect(csv2).toContain('I ___ (go) home., CUSTOMFORM, fill');
  });

  test('Puste pole czasowników nie generuje pytań', async ({ page }) => {
    await openGenerator(page);
    await page.locator('#verbGeneratorVerbs').fill('');
    await page.getByRole('button', { name: 'Wygeneruj i wklej do CSV' }).click();

    // Modal zostaje otwarty, pojawia się komunikat, pole CSV puste.
    await expect(page.locator('#toast')).toHaveText('Wpisz co najmniej jeden czasownik');
    await expect(page.locator('#verbGeneratorModal')).toBeVisible();
    await expect(page.locator('#csvInput')).toHaveValue('');
  });
});
