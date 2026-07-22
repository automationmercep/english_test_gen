### 1. Rozgrywka pytań zaimportowanych z CSV (wszystkie typy)
**Seed:** `seed.spec.ts`

Ten scenariusz weryfikuje, że po zaimportowaniu z CSV po jednym pytaniu każdego typu, zapisaniu i rozpoczęciu testu, każdy typ da się rozegrać, a aplikacja poprawnie ocenia trafne i błędne odpowiedzi.

Wspólny zestaw 6 pytań (kolejność stała — losowanie wyłączone):
```
Choose the verb., go, run, jump, sing, choice
I ___ coffee every morning., drink, fill
Ułóż zdanie., I love you., order
Dopasuj słowa., cat=kot, dog=pies, match
sunny, słoneczny, fiszka
She go to school every day., go, goes, correct
```

Wspólne kroki przygotowania (dla obu podscenariuszy):
1. Kliknij "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu w pole "Nazwa testu"
3. Odznacz przełączniki "Losuj pytania" i "Losuj odpowiedzi" (kolejność pytań i odpowiedzi ma być stała)
4. Wklej wspólny zestaw 6 wierszy do pola CSV i kliknij "Wczytaj pytania"
5. Kliknij "Zapisz test"
6. Rozpocznij zapisany test

#### 1.1 Poprawne odpowiedzi na każdy typ są zaliczane
**Steps:**
1. Wykonaj wspólne kroki przygotowania (nazwa testu "Rozgrywka typów — poprawnie")
2. Pytanie 1 (choice): kliknij poprawną odpowiedź "go", kliknij "Sprawdź odpowiedź", przejdź dalej
3. Pytanie 2 (fill): wpisz "drink", kliknij "Sprawdź odpowiedź", przejdź dalej
4. Pytanie 3 (order): ułóż słowa w kolejności "I love you", kliknij "Sprawdź odpowiedź", przejdź dalej
5. Pytanie 4 (match): dopasuj cat→kot i dog→pies, kliknij "Sprawdź odpowiedź", przejdź dalej
6. Pytanie 5 (fiszka): kliknij "Pokaż odpowiedź", następnie kliknij "✓ Wiedziałem", przejdź dalej
7. Pytanie 6 (correct): kliknij błędne słowo "go", wpisz "goes", kliknij "Sprawdź odpowiedź"

**Expected:**
- Dla pytań choice, fill, order, match, correct informacja zwrotna po sprawdzeniu jest pozytywna (element informacji zwrotnej ma stan „good"/poprawny)
- Fiszka po kliknięciu "✓ Wiedziałem" jest liczona jako znana
- Po ostatnim pytaniu wyświetla się ekran wyniku z kompletem poprawnych odpowiedzi

#### 1.2 Błędne odpowiedzi na każdy typ są odrzucane
**Steps:**
1. Wykonaj wspólne kroki przygotowania (nazwa testu "Rozgrywka typów — błędnie")
2. Pytanie 1 (choice): kliknij błędną odpowiedź "sing", kliknij "Sprawdź odpowiedź", przejdź dalej
3. Pytanie 2 (fill): wpisz "eat", kliknij "Sprawdź odpowiedź", przejdź dalej
4. Pytanie 3 (order): ułóż słowa w złej kolejności (np. "you love I"), kliknij "Sprawdź odpowiedź", przejdź dalej
5. Pytanie 4 (match): dopasuj błędnie (cat→pies, dog→kot), kliknij "Sprawdź odpowiedź", przejdź dalej
6. Pytanie 5 (fiszka): kliknij "Pokaż odpowiedź", następnie kliknij "✗ Nie wiedziałem", przejdź dalej
7. Pytanie 6 (correct): kliknij niewłaściwe słowo "school", wpisz "schools", kliknij "Sprawdź odpowiedź"

**Expected:**
- Dla pytań choice, fill, order, match, correct informacja zwrotna po sprawdzeniu jest negatywna (element informacji zwrotnej ma stan „bad"/błędny)
- Fiszka po kliknięciu "✗ Nie wiedziałem" jest liczona jako nieznana
- Po ostatnim pytaniu ekran wyniku pokazuje brak poprawnych odpowiedzi
