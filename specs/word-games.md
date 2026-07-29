### 1. Rozgrywka nowych typów pytań: Anagram i Wykreślanka

**Seed:** `seed.spec.ts`

Ten scenariusz weryfikuje, że dwa nowe typy pytań — `anagram` (układanie słowa z liter) oraz `wordsearch` (wykreślanka) — da się utworzyć przez import CSV, rozegrać w odtwarzaczu, a aplikacja poprawnie ocenia trafne i błędne odpowiedzi.

Wspólny zestaw 2 pytań (kolejność stała — losowanie wyłączone):
```
Ułóż słowo., cat, anagram
Znajdź zwierzęta., cat, dog, wordsearch
```

Wspólne kroki przygotowania:
1. Kliknij "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu w pole "Nazwa testu"
3. Odznacz przełącznik "Losuj pytania" (kolejność pytań ma być stała: najpierw anagram, potem wykreślanka)
4. Wklej wspólny zestaw 2 wierszy do pola CSV i kliknij "Wczytaj pytania"
5. Kliknij "Zapisz test"
6. Rozpocznij zapisany test

#### 1.1 Poprawne odpowiedzi na oba typy są zaliczane
**Steps:**
1. Wykonaj wspólne kroki przygotowania (nazwa testu "Gry słowne — poprawnie")
2. Pytanie 1 (anagram): odznacza się etykietą "Anagram"; klikaj litery `c`, `a`, `t` z banku liter, aby ułożyć słowo "cat", kliknij "Sprawdź odpowiedź", przejdź dalej
3. Pytanie 2 (wordsearch): odznacza się etykietą "Wykreślanka"; dla każdego szukanego słowa (CAT, DOG) kliknij pierwszą i ostatnią literę jego ścieżki w siatce; po znalezieniu obu słów kliknij "Sprawdź odpowiedź"

**Expected:**
- Pytanie anagram: po ułożeniu wszystkich liter przycisk "Sprawdź odpowiedź" jest aktywny; po sprawdzeniu informacja zwrotna ma stan „good"
- Pytanie wordsearch: siatka ma 8×8 = 64 komórki i listę 2 szukanych słów; po zaznaczeniu słowa jego pozycja na liście jest oznaczona jako znaleziona; po znalezieniu obu przycisk "Sprawdź odpowiedź" jest aktywny, a informacja zwrotna ma stan „good"
- Ekran wyniku pokazuje 2 poprawne odpowiedzi i 0 błędnych

#### 1.2 Błędne / niekompletne odpowiedzi są odrzucane
**Steps:**
1. Wykonaj wspólne kroki przygotowania (nazwa testu "Gry słowne — błędnie")
2. Pytanie 1 (anagram): ułóż litery w błędnej kolejności "tac" (klikaj `t`, `a`, `c`), kliknij "Sprawdź odpowiedź", przejdź dalej
3. Pytanie 2 (wordsearch): znajdź tylko jedno z dwóch słów (CAT), po czym — ponieważ nie da się sprawdzić niekompletnej wykreślanki — zaznacz drugą, dowolną (niepoprawną) parę komórek; upewnij się, że przycisk sprawdzania jest aktywny dopiero po znalezieniu obu słów

**Expected:**
- Pytanie anagram: po sprawdzeniu błędnej kolejności informacja zwrotna ma stan „bad", a poprawna odpowiedź "cat" jest pokazana
- Pytanie wordsearch: dopóki nie znaleziono wszystkich słów, przycisk "Sprawdź odpowiedź" pozostaje nieaktywny (zaznaczenie błędnej linii nie oznacza żadnego słowa)

### 2. Rozgrywka krzyżówki

**Seed:** `seed.spec.ts`

Ten scenariusz weryfikuje typ `crossword` (krzyżówka) — hasła (słowo + wskazówka) są automatycznie splatane w siatkę krzyżującą wspólne litery, gracz wypełnia kratki literami, a aplikacja ocenia całość.

Zestaw (1 pytanie):
```
Rozwiąż krzyżówkę., cat=meows, tiger=striped cat, rabbit=hops and has long ears, crossword
```

Wspólne kroki przygotowania:
1. Kliknij "Stwórz test", wpisz nazwę
2. Wklej wiersz CSV do pola CSV i kliknij "Wczytaj pytania"
3. Zapisz test i rozpocznij go

#### 2.1 Poprawnie wypełniona krzyżówka jest zaliczana
**Steps:**
1. Wykonaj kroki przygotowania (nazwa "Krzyżówka — poprawnie")
2. Odczytaj rozwiązanie z siatki i wpisz poprawną literę w każdą kratkę
3. Kliknij "Sprawdź odpowiedź", przejdź do wyniku

**Expected:**
- Etykieta pytania to "Krzyżówka"; wyświetlają się ponumerowane hasła (Poziomo / Pionowo)
- Przycisk "Sprawdź odpowiedź" jest nieaktywny, dopóki wszystkie kratki nie są wypełnione
- Po poprawnym wypełnieniu informacja zwrotna ma stan „good", wszystkie kratki są oznaczone jako poprawne, a ekran wyniku pokazuje 1 poprawną odpowiedź

#### 2.2 Błędnie wypełniona krzyżówka jest odrzucana
**Steps:**
1. Wykonaj kroki przygotowania (nazwa "Krzyżówka — błędnie")
2. Wpisz w każdą kratkę błędną literę, kliknij "Sprawdź odpowiedź"

**Expected:**
- Informacja zwrotna ma stan „bad", a wszystkie kratki są oznaczone jako błędne

#### 2.3 Fokus, skrzyżowania i sprawdzanie w pełnym ekranie działają także mobilnie
**Steps:**
1. Wpisz literę w kratce należącej do pionowego hasła
2. Kliknij skrzyżowanie i naciśnij Backspace w pustej kratce
3. Kliknij skrzyżowanie ponownie, aby przełączyć kierunek, i ponownie naciśnij Backspace
4. W mobilnym widoku 390×844 dotknij przycisku „Pełny ekran", a następnie wpisz literę z klawiatury ekranowej
5. Uzupełnij wszystkie kratki poprawnymi literami i dotknij „Sprawdź odpowiedź" bez zamykania pełnego ekranu
6. Zamknij pełny ekran przyciskiem

**Expected:**
- Po wpisaniu litery fokus przechodzi do następnej kratki tego samego pionowego hasła, a nie do następnego pola w kolejności HTML
- Pierwsze kliknięcie skrzyżowania wybiera hasło poziome, a ponowne kliknięcie przełącza kierunek na pionowy
- Krzyżówka zajmuje cały ekran urządzenia; dotyk i automatyczne przejście fokusu nadal działają
- Przycisk „Sprawdź odpowiedź" jest widoczny w pełnym ekranie, staje się aktywny po uzupełnieniu kratek i pokazuje poprawny wynik bez zamykania widoku
- Po sprawdzeniu krzyżówka pozostaje w pełnym ekranie, a przycisk zmienia się na „Zobacz wynik"
- Przycisk zamykania przywraca zwykły widok

### 3. Rozgrywka krzyżówki z pytaniami (quizcross)

**Seed:** `seed.spec.ts`

Ten scenariusz weryfikuje typ `quizcross` — odmianę krzyżówki bez splatania: każde hasło to osobny ponumerowany poziomy rząd kratek z pytaniem obok. Gracz wpisuje odpowiedzi literami.

Zestaw (1 pytanie):
```
Odpowiedz na pytania., cat=A pet that meows, dog=A pet that barks, fish=Lives in water, quizcross
```

Wspólne kroki przygotowania: jak wyżej (import CSV, zapis, start).

#### 3.1 Poprawne odpowiedzi są zaliczane
**Expected:**
- Etykieta pytania to "Krzyżówka z pytaniami"; jest tyle rzędów kratek, ile haseł (tu 3), każdy z własnym ponumerowanym pytaniem
- Przycisk "Sprawdź odpowiedź" jest nieaktywny, dopóki wszystkie kratki nie są wypełnione
- Po poprawnym wypełnieniu informacja zwrotna ma stan „good", wszystkie kratki są poprawne, wynik pokazuje 1 poprawną odpowiedź

#### 3.2 Błędne odpowiedzi są odrzucane
**Expected:**
- Po wpisaniu błędnych liter informacja zwrotna ma stan „bad", a wszystkie kratki są oznaczone jako błędne

#### 3.3 Fokus i pełny ekran
**Expected:**
- Po każdej literze fokus przechodzi do kolejnej kratki bieżącego hasła
- Po ostatniej literze w rzędzie fokus przechodzi do pierwszej kratki następnego pytania
- Przycisk „Pełny ekran” otwiera powiększony widok, który można zamknąć klawiszem Escape

#### 3.4 Układ na iPhonie 15 Pro Max
**Steps:**
1. Ustaw mobilny viewport 430×932 i rozpocznij krzyżówkę z pytaniami.

**Expected:**
- Każda odpowiedź, niezależnie od liczby liter, znajduje się pod swoim pytaniem.
- Wszystkie rzędy kratek zaczynają się w tej samej kolumnie i mieszczą się w ekranie.
- Przycisk „Pełny ekran” pozostaje dostępny.
- Po sprawdzeniu odpowiedzi komunikat i przycisk ponownego odtworzenia są widoczne
  nad stałą dolną nawigacją.

### 4. Rozgrywka krzyżówki z hasłem (keycross)

**Seed:** `seed.spec.ts`

Ten scenariusz weryfikuje typ `keycross` — krzyżówkę z hasłem czytanym w pionie z podświetlonej kolumny. Podaje się hasło i dla każdej jego litery słowo je zawierające; słowa układają się poziomo tak, że litery hasła trafiają w jedną kolumnę.

Zestaw (1 pytanie, hasło `KOT`):
```
Odgadnij hasło., KOT, milk=White drink, dog=A pet that barks, cat=A pet that meows, keycross
```

Wspólne kroki przygotowania: jak wyżej (import CSV, zapis, start).

#### 4.1 Poprawnie wpisane hasła są zaliczane
**Expected:**
- Etykieta pytania to "Krzyżówka z hasłem"; jest tyle rzędów, ile liter hasła (tu 3), a dokładnie 3 kratki (po jednej na rząd) są podświetlone jako kolumna hasła
- Przycisk "Sprawdź odpowiedź" jest nieaktywny, dopóki wszystkie kratki nie są wypełnione
- Po poprawnym wypełnieniu informacja zwrotna ma stan „good", wszystkie kratki są poprawne, wynik pokazuje 1 poprawną odpowiedź

#### 4.2 Błędne odpowiedzi są odrzucane
**Expected:**
- Po wpisaniu błędnych liter informacja zwrotna ma stan „bad", a wszystkie kratki są oznaczone jako błędne

#### 4.3 Fokus i pełny ekran
**Expected:**
- Po każdej literze fokus przechodzi do następnej faktycznej kratki hasła, pomijając puste komórki wyrównujące wiersze
- Po ostatniej literze hasła fokus przechodzi do pierwszej kratki następnego wiersza
- Przycisk „Pełny ekran" działa także dla krzyżówki z hasłem i pozwala wrócić do zwykłego widoku
