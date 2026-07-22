const { chromium } = require('C:/Users/merce/AppData/Roaming/npm/node_modules/@executeautomation/playwright-mcp-server/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 650 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  // ── 1. Strona główna ──────────────────────────────────────────────────────
  await page.goto('http://localhost:4321');
  await page.waitForTimeout(1200);

  // ── 2. Utwórz test przez CSV ──────────────────────────────────────────────
  await page.click('[data-view="create"]');
  await page.waitForSelector('#createView.active');
  await page.waitForTimeout(600);

  await page.fill('#quizTitle', 'Stolice Europy');
  await page.waitForTimeout(400);

  const csv = [
    'What is the capital of England?, London, Berlin, Paris, Madrid, choice',
    'What is the capital of France?, Paris, Rome, Madrid, Vienna, choice',
    'I ___ to school every day., go, fill',
    'Ułóż poprawne zdanie., I like apples., order',
    'apple, jabłko, fiszka'
  ].join('\n');

  await page.fill('#csvInput', csv);
  await page.waitForTimeout(500);
  await page.click('#importCsv');
  await page.waitForTimeout(900);

  await page.locator('#saveQuizButton').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.click('#saveQuizButton');
  await page.waitForSelector('#homeView.active');
  await page.waitForTimeout(1200);

  // ── 3. Rozpocznij test ────────────────────────────────────────────────────
  await page.locator('.quiz-card').first().click();
  await page.waitForSelector('#playView.active');
  await page.waitForTimeout(1000);

  // ── 4. Rozwiązuj pytania ──────────────────────────────────────────────────
  let answered = 0;

  while (answered < 5) {
    // Sprawdź czy już na wynikach
    if (await page.locator('#resultsView.active').isVisible().catch(() => false)) break;

    await page.waitForTimeout(300);

    // Wykryj typ pytania na podstawie aktywnych (nie-disabled) elementów
    const qType = await page.locator('#answerArea').evaluate(el => {
      if (el.querySelector('.answer-option:not([disabled])'))    return 'choice';
      if (el.querySelector('#fillInput:not([disabled])'))        return 'fill';
      if (el.querySelector('.flashcard-back-hidden'))            return 'flashcard';
      if (el.querySelector('.order-bank .word-tile'))            return 'order';
      return 'transitioning';
    });

    if (qType === 'transitioning') {
      await page.waitForTimeout(600);
      continue;
    }

    const prompt = await page.locator('#questionText').textContent().catch(() => '');
    console.log(`Pytanie ${answered + 1} [${qType}]: "${prompt.trim().slice(0, 55)}"`);

    // ── Odpowiedz na pytanie ──
    if (qType === 'choice') {
      const options = await page.$$('.answer-option:not([disabled])');
      const idx = answered === 0 ? 0 : 1; // pierwsze poprawnie, drugie niekoniecznie
      await options[Math.min(idx, options.length - 1)].click();
      await page.waitForTimeout(500);

    } else if (qType === 'fill') {
      await page.click('#fillInput');
      const answers = { 0: 'go', 1: 'went', 2: 'drink', 3: 'has' };
      await page.type('#fillInput', answers[answered] || 'wrong', { delay: 110 });
      await page.waitForTimeout(400);

    } else if (qType === 'order') {
      // DOM przerysowuje się po każdym kliknięciu — pobieraj kafelki na nowo
      let remaining = await page.$$('.order-bank .word-tile');
      while (remaining.length > 0) {
        await remaining[0].click();
        await page.waitForTimeout(320);
        remaining = await page.$$('.order-bank .word-tile');
      }

    } else if (qType === 'flashcard') {
      await page.click('.flashcard-back-hidden');
      await page.waitForTimeout(1500);
      await page.locator('.flashcard-knew').click();
      await page.waitForTimeout(700);
      // Po ocenie flashcard #checkAnswer staje się "Następne pytanie" — obsłuży to kod poniżej
    }

    // ── Kliknij "Sprawdź" lub "Następne pytanie" ──
    await page.waitForSelector('#checkAnswer:not([disabled])', { timeout: 4000 }).catch(() => {});

    const btnVisible = await page.locator('#checkAnswer').isVisible().catch(() => false);
    const btnEnabled = await page.locator('#checkAnswer').isEnabled().catch(() => false);

    if (btnVisible && btnEnabled) {
      await page.click('#checkAnswer');
      await page.waitForTimeout(2000);
    }

    answered++;

    // Jeśli po sprawdzeniu pojawia się "Następne pytanie" — kliknij
    const btn2Visible = await page.locator('#checkAnswer').isVisible().catch(() => false);
    const btn2Enabled = await page.locator('#checkAnswer').isEnabled().catch(() => false);
    const btn2Text    = await page.locator('#checkAnswer').textContent().catch(() => '');
    if (btn2Visible && btn2Enabled && (btn2Text.includes('Następne') || btn2Text.includes('Zobacz'))) {
      await page.click('#checkAnswer');
      await page.waitForTimeout(800);
    }
  }

  // ── 5. Ekran wyników ──────────────────────────────────────────────────────
  await page.waitForSelector('#resultsView.active', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(500);

  const score   = await page.locator('#scorePercent').textContent().catch(() => '?');
  const correct = await page.locator('#correctCount').textContent().catch(() => '?');
  const total   = await page.locator('#totalCount').textContent().catch(() => '?');
  console.log(`\nWynik końcowy: ${score.trim()} (${correct.trim()}/${total.trim()} poprawnych)`);

  await page.waitForTimeout(14000);
  await browser.close();
})();
