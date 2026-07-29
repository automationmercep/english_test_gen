// spec: specs/word-games.md
// seed: seed.spec.ts

import { test, expect, type Page } from '@playwright/test';

const CSV = [
  'Ułóż słowo., cat, anagram',
  'Znajdź zwierzęta., cat, dog, wordsearch',
].join('\n');

// Import the 2-question set (anagram + wordsearch) with question shuffling
// disabled so order is fixed (anagram first), save, and start playing.
async function setupAndStart(page: Page, title: string) {
  await page.goto('/');
  await page.locator('.nav-link[data-view="create"]').click();
  await page.locator('#quizTitle').fill(title);
  // Visually-hidden switch — click its <label>. Only "Losuj pytania" matters here.
  await page.locator('label.switch-row', { hasText: 'Losuj pytania' }).click();
  await expect(page.locator('#shuffleQuestions')).not.toBeChecked();
  await page.locator('#csvInput').fill(CSV);
  await page.locator('#importCsv').click();
  await expect(page.getByText('Dodano 2 pytań')).toBeVisible();
  await page.locator('#saveQuizButton').click();
  await expect(page.locator('#homeView')).toHaveClass(/active/);
  await page.getByRole('button', { name: `Rozpocznij test ${title}` }).click();
}

// Click bank letter tiles in the given order to spell a word in the anagram builder.
async function spellAnagram(page: Page, letters: string[]) {
  for (const letter of letters) {
    await page.locator('.order-bank .letter-tile', { hasText: new RegExp(`^${letter}$`, 'i') }).first().click();
  }
}

// Locate each target word's start/end cell by scanning the rendered grid in all
// 8 directions (placement is random, so we can't hardcode coordinates).
async function findWordPaths(page: Page): Promise<{ word: string; start: [number, number]; end: [number, number] }[]> {
  return page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll<HTMLElement>('.ws-cell'));
    const size = Math.round(Math.sqrt(cells.length));
    const grid: string[][] = [];
    cells.forEach(cell => {
      const r = Number(cell.dataset.r);
      const c = Number(cell.dataset.c);
      (grid[r] ||= [])[c] = (cell.textContent || '').trim();
    });
    const words = Array.from(document.querySelectorAll('.ws-words li')).map(li => (li.textContent || '').trim());
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    const find = (word: string) => {
      for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) for (const [dr, dc] of dirs) {
        let ok = true;
        for (let i = 0; i < word.length; i++) {
          const rr = r + dr * i, cc = c + dc * i;
          if (rr < 0 || cc < 0 || rr >= size || cc >= size || grid[rr][cc] !== word[i]) { ok = false; break; }
        }
        if (ok) return { start: [r, c], end: [r + dr * (word.length - 1), c + dc * (word.length - 1)] };
      }
      return null;
    };
    return words.map(word => ({ word, ...(find(word) as { start: [number, number]; end: [number, number] }) }));
  });
}

async function clickCell(page: Page, [r, c]: [number, number]) {
  await page.locator(`.ws-cell[data-r="${r}"][data-c="${c}"]`).click();
}

test.describe('Rozgrywka nowych typów pytań (anagram, wykreślanka)', () => {
  test('Poprawne odpowiedzi na oba typy są zaliczane', async ({ page }) => {
    await setupAndStart(page, 'Gry słowne — poprawnie');

    // 1. anagram — spell "cat" from shuffled letters
    await expect(page.locator('#questionMeta')).toHaveText('Anagram');
    await spellAnagram(page, ['c', 'a', 't']);
    await expect(page.locator('#checkAnswer')).toBeEnabled();
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/good/);
    await page.locator('#checkAnswer').click(); // advance

    // 2. wordsearch — the grid is 8×8 with 2 target words
    await expect(page.locator('#questionMeta')).toHaveText('Wykreślanka');
    await expect(page.locator('.ws-cell')).toHaveCount(64);
    await expect(page.locator('.ws-words li')).toHaveCount(2);

    const paths = await findWordPaths(page);
    expect(paths.every(p => p.start && p.end)).toBe(true);
    for (const path of paths) {
      await clickCell(page, path.start);
      await clickCell(page, path.end);
    }
    await expect(page.locator('.ws-words li.found')).toHaveCount(2);
    await expect(page.locator('#checkAnswer')).toBeEnabled();
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/good/);
    await page.locator('#checkAnswer').click(); // "Zobacz wynik →"

    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await expect(page.locator('#reviewList .review-item.good')).toHaveCount(2);
    await expect(page.locator('#reviewList .review-item.bad')).toHaveCount(0);
  });

  test('Błędna kolejność anagramu jest odrzucana; wykreślanki nie da się sprawdzić bez kompletu', async ({ page }) => {
    await setupAndStart(page, 'Gry słowne — błędnie');

    // 1. anagram — spell the wrong order "tac"
    await expect(page.locator('#questionMeta')).toHaveText('Anagram');
    await spellAnagram(page, ['t', 'a', 'c']);
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/bad/);
    await expect(page.locator('#feedback')).toContainText('cat');
    await page.locator('#checkAnswer').click(); // advance

    // 2. wordsearch — find only one word, then confirm the check button stays
    // disabled until every word is found.
    await expect(page.locator('#questionMeta')).toHaveText('Wykreślanka');
    const paths = await findWordPaths(page);
    const [first] = paths;
    await clickCell(page, first.start);
    await clickCell(page, first.end);
    await expect(page.locator('.ws-words li.found')).toHaveCount(1);
    await expect(page.locator('#checkAnswer')).toBeDisabled();
  });
});

const CROSSWORD_CSV = 'Rozwiąż krzyżówkę., cat=meows, tiger=striped cat, rabbit=hops and has long ears, crossword';

async function setupCrossword(page: Page, title: string) {
  await page.goto('/');
  const createLink = page.locator('.nav-link[data-view="create"]');
  if (await createLink.isVisible()) await createLink.click();
  else await page.getByRole('button', { name: 'Nowy test' }).click();
  await page.locator('#quizTitle').fill(title);
  await page.locator('#csvInput').fill(CROSSWORD_CSV);
  await page.locator('#importCsv').click();
  await expect(page.getByText('Dodano 1 pytanie')).toBeVisible();
  await page.locator('#saveQuizButton').click();
  await expect(page.locator('#homeView')).toHaveClass(/active/);
  await page.getByRole('button', { name: `Rozpocznij test ${title}` }).click();
  await expect(page.locator('#questionMeta')).toHaveText('Krzyżówka');
}

// Read the solution letter for every filled grid cell from the live question model.
async function crosswordSolution(page: Page): Promise<[number, number, string][]> {
  return page.evaluate(() => {
    // `activeQuiz`/`questionIndex` are top-level lexical bindings in app.js,
    // reachable by bare name from evaluate's global scope chain.
    // @ts-expect-error - app.js globals
    const q = activeQuiz.questions[questionIndex];
    const out: [number, number, string][] = [];
    q.crossword.grid.forEach((row: any[], r: number) => row.forEach((cell: any, c: number) => {
      if (cell) out.push([r, c, cell.solution]);
    }));
    return out;
  });
}

async function focusedCrosswordCell(page: Page): Promise<[number, number]> {
  return page.locator('.cw-input:focus').evaluate(input => [
    Number((input as HTMLInputElement).dataset.r),
    Number((input as HTMLInputElement).dataset.c),
  ] as [number, number]);
}

async function crosswordFocusCases(page: Page) {
  return page.evaluate(() => {
    // @ts-expect-error - app.js globals
    const entries = activeQuiz.questions[questionIndex].crossword.entries;
    const uses = (row: number, col: number) => entries.filter((entry: any) =>
      entry.cells.some(([r, c]: [number, number]) => r === row && c === col));
    let vertical = null;
    for (let entryIndex = 0; entryIndex < entries.length && !vertical; entryIndex++) {
      const entry = entries[entryIndex];
      if (entry.dir !== 'down') continue;
      for (let i = 0; i < entry.cells.length - 1; i++) {
        const [row, col] = entry.cells[i];
        if (uses(row, col).length === 1) {
          vertical = { current: entry.cells[i], next: entry.cells[i + 1] };
          break;
        }
      }
    }
    let crossing = null;
    for (const down of entries.filter((entry: any) => entry.dir === 'down')) {
      for (const across of entries.filter((entry: any) => entry.dir === 'across')) {
        const downCellIndex = down.cells.findIndex(([r, c]: [number, number]) =>
          across.cells.some(([ar, ac]: [number, number]) => ar === r && ac === c));
        if (downCellIndex <= 0) continue;
        const [row, col] = down.cells[downCellIndex];
        const acrossCellIndex = across.cells.findIndex(([r, c]: [number, number]) => r === row && c === col);
        if (acrossCellIndex > 0) {
          crossing = {
            cell: [row, col],
            acrossPrevious: across.cells[acrossCellIndex - 1],
            downPrevious: down.cells[downCellIndex - 1],
          };
          break;
        }
      }
      if (crossing) break;
    }
    return { vertical, crossing };
  });
}

test.describe('Rozgrywka krzyżówki', () => {
  test('Fokus podąża za pionowym hasłem i poprawnie wybiera kierunek na skrzyżowaniu', async ({ page }) => {
    await setupCrossword(page, 'Krzyżówka — fokus');
    const cases = await crosswordFocusCases(page);
    expect(cases.vertical).not.toBeNull();
    expect(cases.crossing).not.toBeNull();

    const vertical = cases.vertical!;
    const current = page.locator(`.cw-input[data-r="${vertical.current[0]}"][data-c="${vertical.current[1]}"]`);
    await current.click();
    await current.fill('X');
    expect(await focusedCrosswordCell(page)).toEqual(vertical.next);

    const crossing = cases.crossing!;
    const crossingInput = page.locator(`.cw-input[data-r="${crossing.cell[0]}"][data-c="${crossing.cell[1]}"]`);
    await current.click();
    await crossingInput.click();
    await crossingInput.press('Backspace');
    expect(await focusedCrosswordCell(page)).toEqual(crossing.acrossPrevious);

    await current.click();
    await crossingInput.click();
    await crossingInput.click();
    await crossingInput.press('Backspace');
    expect(await focusedCrosswordCell(page)).toEqual(crossing.downPrevious);
  });

  test('Fokus i sprawdzanie w pełnym ekranie działają dotykowo w widoku mobilnym', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    try {
      await setupCrossword(page, 'Krzyżówka — mobile');
      await page.getByRole('button', { name: 'Pełny ekran' }).tap();
      await expect(page.locator('#answerArea')).toHaveClass(/crossword-fullscreen/);
      await expect(page.locator('.quiz-stage')).toHaveClass(/crossword-fullscreen/);
      const box = await page.locator('.quiz-stage').boundingBox();
      expect(box?.width).toBe(390);
      expect(box?.height).toBe(844);

      const cases = await crosswordFocusCases(page);
      expect(cases.vertical).not.toBeNull();
      const vertical = cases.vertical!;
      const current = page.locator(`.cw-input[data-r="${vertical.current[0]}"][data-c="${vertical.current[1]}"]`);
      await current.tap();
      await current.fill('X');
      expect(await focusedCrosswordCell(page)).toEqual(vertical.next);

      const solution = await crosswordSolution(page);
      for (const [r, c, letter] of solution) {
        await page.locator(`.cw-input[data-r="${r}"][data-c="${c}"]`).fill(letter);
      }
      const check = page.getByRole('button', { name: 'Sprawdź odpowiedź' });
      await expect(check).toBeVisible();
      await expect(check).toBeEnabled();
      await check.tap();
      await expect(page.locator('#answerArea')).toHaveClass(/crossword-fullscreen/);
      await expect(page.locator('#feedback')).toHaveClass(/good/);
      await expect(page.locator('#feedback')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Zobacz wynik' })).toBeVisible();

      await page.getByRole('button', { name: 'Zamknij pełny ekran' }).tap();
      await expect(page.locator('#answerArea')).not.toHaveClass(/crossword-fullscreen/);
      await expect(page.locator('.quiz-stage')).not.toHaveClass(/crossword-fullscreen/);
    } finally {
      await context.close();
    }
  });

  test('Poprawnie wypełniona krzyżówka jest zaliczana', async ({ page }) => {
    await setupCrossword(page, 'Krzyżówka — poprawnie');

    // Every crossword answer's letters interlock; at least two words must have been placed.
    await expect(page.locator('.cw-clues li')).not.toHaveCount(0);
    const solution = await crosswordSolution(page);
    expect(solution.length).toBeGreaterThanOrEqual(6);

    // Check stays disabled until every cell is filled.
    await expect(page.locator('#checkAnswer')).toBeDisabled();
    for (const [r, c, letter] of solution) {
      await page.locator(`.cw-input[data-r="${r}"][data-c="${c}"]`).fill(letter);
    }
    await expect(page.locator('#checkAnswer')).toBeEnabled();
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/good/);
    await expect(page.locator('.cw-cell.correct')).toHaveCount(solution.length);
    await page.locator('#checkAnswer').click(); // "Zobacz wynik →"

    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await expect(page.locator('#reviewList .review-item.good')).toHaveCount(1);
  });

  test('Błędnie wypełniona krzyżówka jest odrzucana', async ({ page }) => {
    await setupCrossword(page, 'Krzyżówka — błędnie');

    const solution = await crosswordSolution(page);
    // Fill every cell with a deliberately wrong letter (shift within the alphabet).
    for (const [r, c, letter] of solution) {
      const wrong = letter === 'Z' ? 'A' : String.fromCharCode(letter.charCodeAt(0) + 1);
      await page.locator(`.cw-input[data-r="${r}"][data-c="${c}"]`).fill(wrong);
    }
    await expect(page.locator('#checkAnswer')).toBeEnabled();
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/bad/);
    await expect(page.locator('.cw-cell.wrong')).toHaveCount(solution.length);
  });
});

const QUIZCROSS_CSV = 'Odpowiedz na pytania., cat=A pet that meows, dog=A pet that barks, fish=Lives in water, quizcross';

async function setupQuizCross(page: Page, title: string) {
  await page.goto('/');
  const createLink = page.locator('.nav-link[data-view="create"]');
  if (await createLink.isVisible()) await createLink.click();
  else await page.getByRole('button', { name: 'Nowy test' }).click();
  await page.locator('#quizTitle').fill(title);
  await page.locator('#csvInput').fill(QUIZCROSS_CSV);
  await page.locator('#importCsv').click();
  await expect(page.getByText('Dodano 1 pytanie')).toBeVisible();
  await page.locator('#saveQuizButton').click();
  await expect(page.locator('#homeView')).toHaveClass(/active/);
  await page.getByRole('button', { name: `Rozpocznij test ${title}` }).click();
  await expect(page.locator('#questionMeta')).toHaveText('Krzyżówka z pytaniami');
}

test.describe('Rozgrywka krzyżówki z pytaniami', () => {
  test('Na iPhonie wszystkie pytania mają ten sam pionowy układ i nie wychodzą poza ekran', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    try {
      await setupQuizCross(page, 'Krzyżówka pytania — iPhone');
      const rows = page.locator('.cw-row');
      await expect(rows).toHaveCount(3);

      const geometry = await rows.evaluateAll(elements => elements.map(row => {
        const clue = row.querySelector('.cw-clue')!.getBoundingClientRect();
        const cells = row.querySelector('.cw-cells')!.getBoundingClientRect();
        return { clueBottom: clue.bottom, cellsTop: cells.top, cellsLeft: cells.left, cellsRight: cells.right };
      }));
      for (const row of geometry) {
        expect(row.cellsTop, 'kratki powinny być pod pytaniem').toBeGreaterThanOrEqual(row.clueBottom - 1);
        expect(row.cellsLeft, 'kratki nie mogą wychodzić poza lewą krawędź').toBeGreaterThanOrEqual(0);
        expect(row.cellsRight, 'kratki nie mogą wychodzić poza prawą krawędź').toBeLessThanOrEqual(431);
      }
      expect(new Set(geometry.map(row => Math.round(row.cellsLeft))).size, 'wszystkie odpowiedzi powinny zaczynać się w tej samej kolumnie').toBe(1);
      await expect(page.getByRole('button', { name: 'Pełny ekran' })).toBeVisible();

      const solution = await crosswordSolution(page);
      for (const [r, c, letter] of solution) {
        await page.locator(`.cw-input[data-r="${r}"][data-c="${c}"]`).fill(letter);
      }
      await page.locator('#checkAnswer').click();
      await expect(page.locator('#feedback')).toHaveClass(/good/);
      await expect.poll(async () => {
        const replay = await page.locator('.replay-sentence').boundingBox();
        const navigation = await page.locator('.question-navigation').boundingBox();
        return Boolean(replay && navigation && replay.y + replay.height <= navigation.y + 1);
      }, { message: 'komunikat i odtwarzanie nie mogą być zasłonięte przez dolną nawigację' }).toBe(true);
    } finally {
      await context.close();
    }
  });

  test('Fokus przechodzi do kolejnej kratki, następnego hasła i działa w pełnym ekranie', async ({ page }) => {
    await setupQuizCross(page, 'Krzyżówka pytania — fokus');
    await page.getByRole('button', { name: 'Pełny ekran' }).click();
    await expect(page.locator('#answerArea')).toHaveClass(/crossword-fullscreen/);

    const first = page.locator('.cw-input[data-r="0"]').first();
    await first.fill('C');
    expect(await focusedCrosswordCell(page)).toEqual([0, 1]);
    const lastInRow = page.locator('.cw-input[data-r="0"]').last();
    await lastInRow.fill('T');
    expect(await focusedCrosswordCell(page)).toEqual([1, 0]);

    await page.keyboard.press('Escape');
    await expect(page.locator('#answerArea')).not.toHaveClass(/crossword-fullscreen/);
  });

  test('Poprawne odpowiedzi na wszystkie pytania są zaliczane', async ({ page }) => {
    await setupQuizCross(page, 'Krzyżówka pytania — poprawnie');

    // One numbered question row per answer (3 answers → 3 rows, 3 clues).
    await expect(page.locator('.cw-row')).toHaveCount(3);
    await expect(page.locator('.cw-clue')).toHaveCount(3);
    const solution = await crosswordSolution(page);
    expect(solution.length).toBe('cat'.length + 'dog'.length + 'fish'.length);

    await expect(page.locator('#checkAnswer')).toBeDisabled();
    for (const [r, c, letter] of solution) {
      await page.locator(`.cw-input[data-r="${r}"][data-c="${c}"]`).fill(letter);
    }
    await expect(page.locator('#checkAnswer')).toBeEnabled();
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/good/);
    await expect(page.locator('.cw-cell.correct')).toHaveCount(solution.length);
    await page.locator('#checkAnswer').click();

    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await expect(page.locator('#reviewList .review-item.good')).toHaveCount(1);
  });

  test('Błędne odpowiedzi są odrzucane', async ({ page }) => {
    await setupQuizCross(page, 'Krzyżówka pytania — błędnie');
    const solution = await crosswordSolution(page);
    for (const [r, c, letter] of solution) {
      const wrong = letter === 'Z' ? 'A' : String.fromCharCode(letter.charCodeAt(0) + 1);
      await page.locator(`.cw-input[data-r="${r}"][data-c="${c}"]`).fill(wrong);
    }
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/bad/);
    await expect(page.locator('.cw-cell.wrong')).toHaveCount(solution.length);
  });
});

const KEYCROSS_CSV = 'Odgadnij hasło., KOT, milk=White drink, dog=A pet that barks, cat=A pet that meows, keycross';

async function setupKeyCross(page: Page, title: string) {
  await page.goto('/');
  await page.locator('.nav-link[data-view="create"]').click();
  await page.locator('#quizTitle').fill(title);
  await page.locator('#csvInput').fill(KEYCROSS_CSV);
  await page.locator('#importCsv').click();
  await expect(page.getByText('Dodano 1 pytanie')).toBeVisible();
  await page.locator('#saveQuizButton').click();
  await expect(page.locator('#homeView')).toHaveClass(/active/);
  await page.getByRole('button', { name: `Rozpocznij test ${title}` }).click();
  await expect(page.locator('#questionMeta')).toHaveText('Krzyżówka z hasłem');
}

test.describe('Rozgrywka krzyżówki z hasłem', () => {
  test('Fokus pomija puste komórki i działa w pełnym ekranie', async ({ page }) => {
    await setupKeyCross(page, 'Krzyżówka hasło — fokus');
    await page.getByRole('button', { name: 'Pełny ekran' }).click();
    await expect(page.locator('#answerArea')).toHaveClass(/crossword-fullscreen/);

    const entries = await page.evaluate(() => {
      // @ts-expect-error - app.js globals
      return activeQuiz.questions[questionIndex].crossword.entries.map((entry: any) => entry.cells);
    });
    const first = page.locator(`.cw-input[data-r="${entries[0][0][0]}"][data-c="${entries[0][0][1]}"]`);
    await first.fill('M');
    expect(await focusedCrosswordCell(page)).toEqual(entries[0][1]);
    const last = entries[0][entries[0].length - 1];
    await page.locator(`.cw-input[data-r="${last[0]}"][data-c="${last[1]}"]`).fill('K');
    expect(await focusedCrosswordCell(page)).toEqual(entries[1][0]);

    await page.getByRole('button', { name: 'Zamknij pełny ekran' }).click();
    await expect(page.locator('#answerArea')).not.toHaveClass(/crossword-fullscreen/);
  });

  test('Poprawnie wpisane hasła są zaliczane, a klucz jest podświetlony', async ({ page }) => {
    await setupKeyCross(page, 'Krzyżówka hasło — poprawnie');

    // 3 key letters (KOT) => 3 rows and exactly 3 highlighted key cells.
    await expect(page.locator('.keycross-row')).toHaveCount(3);
    await expect(page.locator('.cw-keycell')).toHaveCount(3);
    const solution = await crosswordSolution(page);
    expect(solution.length).toBe('milk'.length + 'dog'.length + 'cat'.length);

    await expect(page.locator('#checkAnswer')).toBeDisabled();
    for (const [r, c, letter] of solution) {
      await page.locator(`.cw-input[data-r="${r}"][data-c="${c}"]`).fill(letter);
    }
    await expect(page.locator('#checkAnswer')).toBeEnabled();
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/good/);
    await expect(page.locator('.cw-cell.correct')).toHaveCount(solution.length);
    await page.locator('#checkAnswer').click();

    await expect(page.locator('#resultsView')).toHaveClass(/active/);
    await expect(page.locator('#reviewList .review-item.good')).toHaveCount(1);
  });

  test('Błędne odpowiedzi są odrzucane', async ({ page }) => {
    await setupKeyCross(page, 'Krzyżówka hasło — błędnie');
    const solution = await crosswordSolution(page);
    for (const [r, c, letter] of solution) {
      const wrong = letter === 'Z' ? 'A' : String.fromCharCode(letter.charCodeAt(0) + 1);
      await page.locator(`.cw-input[data-r="${r}"][data-c="${c}"]`).fill(wrong);
    }
    await page.locator('#checkAnswer').click();
    await expect(page.locator('#feedback')).toHaveClass(/bad/);
    await expect(page.locator('.cw-cell.wrong')).toHaveCount(solution.length);
  });
});
