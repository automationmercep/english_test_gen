### 1. Historia wyników i panel postępów
**Seed:** `seed.spec.ts`

#### 1.1 Zapis, trwałość, eksport i import historii wyników
**Steps:**
1. Utwórz przez interfejs unikalnie nazwany test z jednym pytaniem wyboru i zapisz go.
2. Rozwiąż test poprawnie, aby uzyskać wynik 100%, po czym wróć do biblioteki.
3. Rozwiąż ten sam test błędnie, aby uzyskać wynik 0%, po czym wróć do biblioteki.
4. Na karcie utworzonego testu kliknij przycisk „Postępy”.
5. Sprawdź podsumowanie oraz listę podejść w otwartym oknie dialogowym.
6. Odśwież stronę, ponownie otwórz „Postępy” dla tego testu i sprawdź zapisane dane.
7. Zamknij panel, otwórz panel „Dane” i pobierz plik przez „Eksportuj dane”.
8. Sprawdź, czy backup ma wersję 2 oraz zawiera dwa wpisy historii dla utworzonego testu.
9. Ponownie otwórz „Postępy”, kliknij „Wyczyść historię” i potwierdź operację w oknie przeglądarki.
10. Zamknij panel i zaimportuj pobrany backup przez pole importu danych, akceptując zastąpienie istniejących danych.
11. Otwórz „Postępy” i sprawdź, czy historia oraz statystyki zostały przywrócone.
12. Zamknij panel i usuń utworzony test bez wcześniejszego czyszczenia, aby sprawdzić lifecycle danych i posprzątać stan.

**Expected:**
- Po ukończeniu każdego podejścia wynik zostaje zapisany dla właściwego testu.
- Karta testu udostępnia przycisk „Postępy” z nazwą dostępną dla technologii asystujących.
- Dialog „Postępy — <nazwa testu>” pokazuje ostatni wynik 0%, najlepszy wynik 100%, średnią 50% i liczbę podejść 2.
- Lista historii zawiera oba podejścia i ich wyniki.
- Po odświeżeniu strony podsumowanie oraz oba podejścia pozostają dostępne.
- Eksportowany JSON ma `version: 2`, a pole `progress` zawiera dwa podejścia przypisane do identyfikatora utworzonego testu.
- Po potwierdzonym wyczyszczeniu liczba podejść wynosi 0, pozostałe statystyki pokazują „—”, a dialog zawiera komunikat „Brak zapisanych wyników.”.
- Import backupu przywraca oba podejścia oraz podsumowanie: ostatni wynik 0%, najlepszy wynik 100% i średnią 50%.
- Usunięcie testu z biblioteki usuwa również przypisaną do niego historię.

#### 1.2 Nieprawidłowy schemat quizów nie nadpisuje biblioteki
**Steps:**
1. Otwórz bibliotekę i zapamiętaj zapisane testy.
2. Spróbuj zaimportować poprawny składniowo JSON, którego pole `quizzes` zawiera `null` zamiast quizu.
3. Zaakceptuj komunikat o błędzie.

**Expected:**
- Aplikacja odrzuca plik przed pytaniem o zastąpienie danych.
- Biblioteka i jej zapis w `localStorage` pozostają niezmienione.

#### 1.3 Powtórka błędnego pytania nie zmienia statystyk pełnych podejść
**Steps:**
1. Utwórz test z jednym pytaniem i ukończ go z błędną odpowiedzią.
2. Na ekranie wyniku wybierz „Powtórz 1 błędne pytanie” i tym razem odpowiedz poprawnie.
3. Wróć do biblioteki i otwórz panel „Postępy” tego testu.

**Expected:**
- Historia zawiera tylko jedno pełne podejście z wynikiem 0%.
- Korekcyjna powtórka pojedynczego błędu nie zawyża liczby podejść ani średniej.
