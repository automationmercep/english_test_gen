### 1. Polecenie nad pytaniem
**Seed:** `seed.spec.ts`

#### 1.1 Dodanie własnego polecenia w kreatorze i weryfikacja podczas rozwiązywania testu
**Steps:**
1. Kliknij przycisk "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu "Test polecenia" w pole "Nazwa testu"
3. W pierwszej karcie pytania wpisz w polu "Polecenie nad pytaniem" tekst "Complete the sentence"
4. Wpisz treść pytania "Anna ___ karate usually in the morning." oraz cztery odpowiedzi testu wyboru: "does" (poprawna), "plays", "play", "do"
5. Usuń drugie domyślne pytanie, aby test zawierał tylko jedno pytanie
6. Kliknij przycisk "Zapisz test"
7. Rozpocznij zapisany test "Test polecenia"

**Expected:**
- Po zapisaniu testu widoczna jest karta "Test polecenia" na liście testów
- Po rozpoczęciu testu etykieta nad treścią pytania (#questionMeta) wyświetla "Complete the sentence" (a nie domyślną etykietę "Wybierz odpowiedź")

#### 1.2 Import CSV z opcjonalnym poleceniem w nawiasach kwadratowych
**Steps:**
1. Kliknij przycisk "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu "Import z poleceniem" w pole "Nazwa testu"
3. Wklej w pole CSV wiersz: `[Choose the correct answer] What ___ your name?, is, are, am, can, choice`
4. Kliknij przycisk "Wczytaj pytania"
5. Kliknij przycisk "Zapisz test"
6. Rozpocznij zapisany test "Import z poleceniem"

**Expected:**
- Import zastępuje domyślne puste karty pytań, w kreatorze zostaje tylko jedna, zaimportowana karta
- Treść pytania w kreatorze to "What ___ your name?" (bez fragmentu w nawiasach kwadratowych)
- Po rozpoczęciu testu etykieta nad pytaniem wyświetla "Choose the correct answer"
