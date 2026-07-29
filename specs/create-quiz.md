### 1. Tworzenie nowego testu
**Seed:** `seed.spec.ts`

#### 1.1 Dodanie nowego testu z jednym pytaniem wyboru
**Steps:**
1. Kliknij przycisk "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu "Moja nowa nazwa" w pole "Nazwa testu"
3. Wybierz poziom "A1" w polu "Poziom"
4. Wpisz treść pytania "What color is the sky?" w pole treści pierwszego pytania
5. Wypełnij cztery odpowiedzi testu wyboru: "blue", "red", "green", "yellow", gdzie "blue" jest zaznaczone jako poprawna
6. Kliknij przycisk "Zapisz test"

**Expected:**
- Wyświetla się widok "Moje testy" (strona główna)
- Pojawia się komunikat (toast) "Test zapisany — możesz zaczynać!"
- Na liście testów widoczna jest karta z tytułem "Moja nowa nazwa"

#### 1.2 Zapis długiego testu z dowolnej pozycji na telefonie
**Steps:**
1. Ustaw widok iPhone 15 Pro Max (430×932) i otwórz kreator nowego testu.
2. Zaimportuj 15 poprawnych pytań i przewiń formularz do środka listy.
3. Kliknij pływający przycisk „Zapisz test”, bez przewijania na koniec formularza.

**Expected:**
- Przycisk zapisu pozostaje widoczny i mieści się w ekranie podczas przewijania.
- Kliknięcie uruchamia zwykłą walidację i zapis formularza.
- Po zapisie test „Długi test mobilny” jest widoczny w bibliotece.
