### 1. Pytanie typu „Popraw błąd"
**Seed:** `seed.spec.ts`

#### 1.1 Utworzenie i rozegranie pytania „Popraw błąd" z poprawną odpowiedzią
**Steps:**
1. Kliknij przycisk "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu "Test poprawiania błędu" w pole "Nazwa testu"
3. W pierwszej karcie pytania kliknij przycisk typu "Popraw błąd"
4. Wpisz treść pytania (zdanie z błędem) "She go to school every day."
5. Wpisz błędne słowo "go" w pole "Błędne słowo, np. go"
6. Wpisz poprawną formę "goes" w pole "Poprawna forma, np. goes"
7. Usuń domyślne drugie pytanie utworzone automatycznie przy starcie kreatora, jeśli nadal jest puste
8. Kliknij przycisk "Zapisz test"
9. Rozpocznij zapisany test "Test poprawiania błędu"
10. W widoku gry kliknij błędne słowo "go" w zdaniu
11. Wpisz "goes" w pole "Poprawna forma słowa", które się pojawi
12. Kliknij przycisk "Sprawdź odpowiedź"

**Expected:**
- Po zapisaniu testu wyświetla się widok "Moje testy" z komunikatem "Test zapisany — możesz zaczynać!"
- Na liście testów widoczna jest karta z tytułem "Test poprawiania błędu"
- Po rozpoczęciu testu etykieta typu nad pytaniem to "Popraw błąd", a podpowiedź informuje "Kliknij błędne słowo w zdaniu, a następnie wpisz jego poprawną formę."
- Zdanie jest rozbite na klikalne słowa: "She", "go", "to", "school", "every", "day."
- Pole "Poprawna forma słowa" jest ukryte, dopóki nie kliknie się żadnego słowa
- Po kliknięciu słowa "go" pojawia się pole tekstowe z etykietą "Wpisz poprawną formę:"
- Po sprawdzeniu odpowiedzi wyświetla się informacja zwrotna o poprawnej odpowiedzi ("To jest prawidłowa odpowiedź.")

#### 1.2 Zła odpowiedź w pytaniu „Popraw błąd" — złe słowo lub zła forma
**Steps:**
1. Kliknij przycisk "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu "Popraw błąd — negatywny" w pole "Nazwa testu"
3. W pierwszej karcie pytania kliknij przycisk typu "Popraw błąd"
4. Wpisz treść pytania "She go to school every day."
5. Wpisz błędne słowo "go" oraz poprawną formę "goes"
6. Usuń domyślne drugie pytanie
7. Kliknij "Zapisz test", a następnie rozpocznij zapisany test
8. Kliknij niewłaściwe słowo "school" w zdaniu
9. Wpisz "schools" w pole "Poprawna forma słowa"
10. Kliknij przycisk "Sprawdź odpowiedź"

**Expected:**
- Odpowiedź jest oznaczona jako błędna (informacja zwrotna z komunikatem o błędzie)
- W informacji zwrotnej pokazana jest poprawna odpowiedź w formacie "go → goes"
