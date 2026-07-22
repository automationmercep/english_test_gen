### 1. Pytanie typu Dopasuj
**Seed:** `seed.spec.ts`

#### 1.1 Dodanie pytania typu Dopasuj z parami słów
**Steps:**
1. Kliknij przycisk "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu "Słówka — dopasuj" w pole "Nazwa testu"
3. W pierwszej karcie pytania kliknij przycisk typu "Dopasuj"
4. Wpisz treść pytania "Dopasuj słowa do tłumaczeń" w pole treści pytania
5. Wypełnij trzy pary: "always" → "zawsze", "usually" → "zazwyczaj", "often" → "często"
6. Usuń drugie domyślne pytanie (typu "Uzupełnij zdanie"), aby test zawierał tylko jedno pytanie
7. Kliknij przycisk "Zapisz test"

**Expected:**
- Po kliknięciu przycisku "Dopasuj" karta pytania przełącza się w edytor par (lewa/prawa kolumna)
- Po zapisaniu testu wyświetla się widok "Moje testy" z komunikatem "Test zapisany — możesz zaczynać!"
- Na liście testów widoczna jest karta z tytułem "Słówka — dopasuj"
