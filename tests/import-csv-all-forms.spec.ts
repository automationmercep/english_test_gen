// spec: specs/import-csv-all-forms.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Import CSV — wszystkie dozwolone oznaczenia typów', () => {
  test('Import zestawu używającego wszystkich form daje poprawne typy pytań', async ({ page }) => {
    await page.goto('/');

    // 1. Otwórz kreator testu
    await page.locator('.nav-link[data-view="create"]').click();

    // 2. Nazwa testu
    await page.locator('#quizTitle').fill('Wszystkie formy CSV');

    // 3. Wklej 23 wiersze — po jednym na każde dozwolone oznaczenie typu
    const csv = [
      'What ___ your name?, is, are, am, can, choice',
      '___ she your teacher?, Is, Are, Am, Do, wybór',
      'Kolory flagi Polski?, biały|czerwony, niebieski, zielony, test wyboru',
      'Which animals can be pets?, dog|cat, table, quickly, multiple choice',
      'I ___ coffee every morning., drink, fill',
      'She ___ dinner yesterday., cooked, uzupełnij',
      'We ___ from Poland., are, uzupełnianie',
      "Cats ___ fly., can't, uzupełnij zdanie",
      'Ułóż zdanie., I love you., order',
      'Ułóż zdanie., She is happy., uporządkuj',
      'Ułóż zdanie., They play football., uporządkuj zdanie',
      'Ułóż zdanie., We go home., kolejność',
      'Dopasuj słowa., ruler=linijka, pencil case=piórnik, match',
      'Dopasuj kraj do stolicy., Poland=Warsaw, France=Paris, dopasuj',
      'Dopasuj przeciwieństwa., big=small, hot=cold, dopasowanie',
      'curious, ciekawy, flashcard',
      'brave, odważny, fiszka',
      'patient, cierpliwy, fiszki',
      'She go to school every day., go, goes, correct',
      "He don't like coffee., don't, doesn't, popraw",
      'My brother watch TV., watch, watches, popraw błąd',
      'They plays football., plays, play, poprawianie',
      'Anna have three cats., have, has, znajdź błąd',
      'Ułóż słowo., elephant, anagram',
      'Ułóż słowo., cat, anagramy',
      'Znajdź zwierzęta., cat, dog, bird, wordsearch',
      'Znajdź zwierzęta., cat, dog, wykreślanka',
      'Rozwiąż krzyżówkę., cat=meows, tiger=striped cat, rabbit=hops here, crossword',
      'Rozwiąż krzyżówkę., cat=meows, tea=a hot drink, krzyżówka',
      'Odpowiedz., cat=A pet that meows, dog=A pet that barks, quizcross',
      'Odpowiedz., cat=meows, fish=swims, krzyżówka z pytaniami',
    ].join('\n');
    await page.locator('#csvInput').fill(csv);

    // 4. Wczytaj pytania
    await page.locator('#importCsv').click();

    // Toast: dodano 31 pytań, bez pominięć
    await expect(page.getByText('Dodano 31 pytań')).toBeVisible();
    await expect(page.locator('#toast')).not.toContainText('Pominięto');

    // Dokładnie 31 kart pytań
    const cards = page.locator('#questionList .question-card');
    await expect(cards).toHaveCount(31);

    // Typy kart w kolejności odpowiadają oznaczeniom (w tym polskie formy z „ł")
    const expectedTypes = [
      'choice', 'choice', 'choice', 'choice',
      'fill', 'fill', 'fill', 'fill',
      'order', 'order', 'order', 'order',
      'match', 'match', 'match',
      'flashcard', 'flashcard', 'flashcard',
      'correct', 'correct', 'correct', 'correct', 'correct',
      'anagram', 'anagram',
      'wordsearch', 'wordsearch',
      'crossword', 'crossword',
      'quizcross', 'quizcross',
    ];
    const actualTypes = await cards.evaluateAll(nodes => nodes.map(n => (n as HTMLElement).dataset.type));
    expect(actualTypes).toEqual(expectedTypes);
  });
});
