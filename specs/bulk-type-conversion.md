### Zbiorcza zmiana typu pytań ("Typ wszystkich pytań")

**Seed:** `seed.spec.ts`

Pasek "Typ wszystkich pytań" w kreatorze zmienia typ wszystkich kart pytań naraz. Typy dzielą się na rodziny o zgodnym kształcie danych:

- **Tekstowe** (jedna odpowiedź): `choice`, `fill`, `order`, `flashcard`, `anagram`, `correct`
- **Krzyżówki** (lista haseł): `crossword`, `quizcross`, `keycross`
- **Inne**: `match` (pary), `wordsearch` (słowa)

Zmiana typu **w obrębie jednej rodziny** zachowuje treść odpowiedzi. Zmiana **między rodzinami** może usunąć treść odpowiedzi (np. lista haseł krzyżówki nie ma odpowiednika w pojedynczym pytaniu „uzupełnij zdanie"). Treść samych pytań (`prompt`) przetrwa każdą zmianę.

Aby chronić przed przypadkową utratą pracy, aplikacja:
1. Grupuje przyciski typów wizualnie w trzy rodziny (z etykietami "Tekstowe" / "Krzyżówki" / "Inne").
2. Pokazuje okno potwierdzenia (`confirm`) przed każdą stratną konwersją, informując, z ilu pytań treść odpowiedzi zostanie usunięta. Puste karty nie liczą się (nie ma z nich czego stracić).

#### 1. Przyciski typów są pogrupowane w rodziny
**Steps:**
1. Kliknij "Stwórz test" w głównej nawigacji

**Expected:**
- Pasek "Typ wszystkich pytań" zawiera trzy grupy z etykietami "Tekstowe", "Krzyżówki", "Inne"
- Grupa "Krzyżówki" zawiera dokładnie 3 przyciski: Krzyżówka, Krzyżówka z pytaniami, Krzyżówka z hasłem

#### 2. Konwersja między rodzinami ostrzega i po anulowaniu zachowuje treść
**Steps:**
1. Kliknij "Stwórz test", nadaj nazwę
2. Ustaw pytanie 1 na typ Krzyżówka, wpisz treść pytania oraz dwa hasła z wskazówkami (np. cat=meows, tiger=striped cat)
3. Dodaj pytanie 2, również typu Krzyżówka, z dwoma hasłami (np. dog=barks, bird=flies)
4. Kliknij przycisk "Uzupełnij zdanie" na pasku "Typ wszystkich pytań"
5. W oknie potwierdzenia wybierz "Anuluj"

**Expected:**
- Pojawia się okno potwierdzenia z informacją, że zmiana usunie treść z 2 pytań
- Po anulowaniu obie karty pozostają typu Krzyżówka
- Hasła w kartach są nienaruszone (pierwsze hasło pytania 1 to nadal "cat")

#### 3. Konwersja między rodzinami po potwierdzeniu zmienia typ
**Steps:**
1. Przygotuj dwie krzyżówki jak w scenariuszu 2
2. Kliknij "Uzupełnij zdanie" na pasku
3. W oknie potwierdzenia wybierz "OK"

**Expected:**
- Obie karty zmieniają typ na "uzupełnij zdanie" (`fill`)
- Treść pytań pozostaje (pytanie 1 to nadal "Rozwiąż krzyżówkę.")

#### 4. Konwersja w obrębie rodziny krzyżówek nie ostrzega i zachowuje hasła
**Steps:**
1. Przygotuj dwie krzyżówki jak w scenariuszu 2
2. Kliknij "Krzyżówka z pytaniami" na pasku

**Expected:**
- Nie pojawia się żadne okno potwierdzenia
- Obie karty zmieniają typ na `quizcross`
- Hasła przenoszą się do nowego typu (pierwsze hasło pytania 1 to nadal "cat")
