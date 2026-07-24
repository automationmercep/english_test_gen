# Bright English

Lekka aplikacja webowa do tworzenia i rozwiązywania testów języka angielskiego.

## Uruchomienie

Otwórz `index.html` w przeglądarce lub uruchom lokalny serwer:

```powershell
python -m http.server 8000
```

Następnie przejdź do `http://localhost:8000`.

## Funkcje

### Typy pytań

- testy jednokrotnego wyboru i uzupełnianie zdań,
- pytania wielokrotnego wyboru z dowolną liczbą poprawnych odpowiedzi, także w imporcie CSV przez separator `|`,
- typ pytania „Uporządkuj zdanie” — układanie pomieszanych kafelków słów klikaniem lub przeciąganiem,
- typ **Fiszka** — odwracana karta z samooceną „Wiedziałem / Nie wiedziałem", dostępna w kreatorze, w imporcie CSV (`fiszka`) i w zmianie zbiorczej,
- typ **Popraw błąd** — zdanie z jednym błędnym słowem; uczący się klika błędne słowo i wpisuje jego poprawną formę (dopuszczalnych form może być kilka, oddzielonych `|`), dostępny w kreatorze, w imporcie CSV (`correct`) i w zmianie zbiorczej,
- typ **Anagram** — jedno słowo, którego litery trzeba ułożyć w poprawnej kolejności klikaniem lub przeciąganiem kafelków (spacje ignorowane), dostępny w kreatorze i imporcie CSV (`anagram`),
- typ **Wykreślanka** — kwadratowa siatka liter z ukrytymi słowami (poziomo, pionowo i na ukos, także wspak); uczący się zaznacza każde słowo, klikając jego pierwszą i ostatnią literę, dostępny w kreatorze i imporcie CSV (`wordsearch`),
- typ **Krzyżówka** — hasła splatające się na wspólnych literach w jednej siatce, z ponumerowanymi wskazówkami poziomo/pionowo; uczący się wpisuje litery w kratki, dostępny w kreatorze i imporcie CSV (`crossword`),
- typ **Krzyżówka z pytaniami** — każde hasło to osobny ponumerowany poziomy rząd kratek z pytaniem obok (bez splatania); uczący się wpisuje odpowiedzi literami, dostępny w kreatorze i imporcie CSV (`quizcross`),
- typ **Krzyżówka z hasłem** — podajesz hasło (np. `KOT`) i dla każdej jego litery jedno słowo je zawierające wraz z pytaniem; słowa układają się poziomo tak, że litery hasła trafiają w jedną podświetloną kolumnę, którą czyta się z góry na dół, dostępny w kreatorze i imporcie CSV (`keycross`),
- opcjonalne polecenie wyświetlane nad treścią pytania (np. „Complete the sentence”), ustawiane w kreatorze lub przez import CSV.

### Kreator i edycja testów

- kreator własnych testów,
- edycja własnych testów po ich utworzeniu, w tym edycja i usuwanie testów wbudowanych,
- zbiorcza zmiana typu wszystkich pytań w kreatorze — przyciski pogrupowane w rodziny (Tekstowe / Krzyżówki / Inne); zmiana w obrębie rodziny zachowuje treść odpowiedzi, a zmiana między rodzinami, która usunęłaby treść, wymaga potwierdzenia (treść pytań zawsze pozostaje),
- osobne ustawienia losowania kolejności pytań i odpowiedzi,
- obrazek wyświetlany pod przyciskiem odpowiedzi, dodawany z pliku lub adresu URL; większe obrazki wyświetlane w pełnych proporcjach bez przycinania,
- gotowy 24-pytaniowy test `Grammar Power Pack` z konstrukcjami `to be`, `have/has got` i `can`,
- nowe warianty pytań i przetasowane odpowiedzi przy każdym rozpoczęciu testu.

### Import z CSV

- import wielu pytań z wklejonej struktury CSV, z typem pytania (`choice`, `fill`, `order`, `fiszka`, `match`, `correct`, `anagram`, `wordsearch`, `crossword`, `quizcross`, `keycross`) w ostatnim polu importowanego wiersza (szczegóły w sekcji [Import pytań z CSV](#import-pytań-z-csv)).

### Kategorie i organizacja

- tematyczne zakładki-foldery tworzone automatycznie na podstawie kategorii testów,
- rozwijana lista istniejących kategorii w kreatorze z możliwością wpisania nowej,
- przeciąganie testów pomiędzy folderami kategorii,
- tworzenie pustych kategorii bezpośrednio z biblioteki testów,
- usuwanie całej kategorii razem ze wszystkimi przypisanymi testami.

### Rozwiązywanie testu

- szczegółowe podsumowanie każdego pytania,
- podczas testu można wracać do poprzednich pytań bez utraty zaznaczonych odpowiedzi i wyniku,
- animacja celebracyjna po poprawnej odpowiedzi oraz animacja serduszek po ukończeniu testu z wynikiem 100%.

### Dźwięk i komunikaty głosowe

- dźwiękowa informacja o poprawnej i błędnej odpowiedzi,
- głosowy komunikat „Brawo Lila” po ukończeniu testu z wynikiem 100%,
- konfigurowalne komunikaty głosowe dla poprawnej i błędnej odpowiedzi oraz wyniku 100% i poniżej 100%,
- możliwość wyłączenia dowolnego komunikatu dźwiękowego przez pozostawienie pustego pola,
- dynamiczne odczytywanie całego poprawnego zdania po każdej odpowiedzi — prawidłowej i błędnej — niezależnie od dodatkowego komunikatu „Correct answer”, z możliwością ponownego odtworzenia,
- po odczytaniu poprawnego zdania aplikacja automatycznie przechodzi dalej (domyślnie po 5 sekundach); czas można ustawić od 0 do 60 sekund w ustawieniach komunikatów, a wartość 0 wyłącza tę funkcję; podczas oczekiwania na ekranie widać licznik pozostałych sekund.

### Słówko dnia

- losowane słówko dnia z tłumaczeniem przy każdym odświeżeniu strony,
- edytowalna lista słówek dnia z masowym importem CSV: słowo i tłumaczenie.

### Ogólne

- lokalny zapis testów w przeglądarce,
- responsywny interfejs na komputer i telefon.

## Import pytań z CSV

W kreatorze testu znajduje się sekcja **Wklej pytania z CSV**. Każdy wiersz tworzy jedno pytanie. Pola rozdziela się przecinkami.

Po wklejeniu danych kliknij **Wczytaj pytania**, sprawdź utworzone pytania w edytorze, a następnie zapisz test.

### Test wyboru z jedną poprawną odpowiedzią

Układ pól:

```text
pytanie, poprawna odpowiedź, błędna odpowiedź 1, błędna odpowiedź 2, błędna odpowiedź 3, choice
```

Drugie pole jest odpowiedzią prawidłową. Kolejne pola zawierają odpowiedzi błędne.

Przykład:

```csv
What ___ your name?, is, are, am, can, choice
She ___ got a dog., has, have, is, can, choice
```

### Test wyboru z kilkoma poprawnymi odpowiedziami

Kilka prawidłowych odpowiedzi wpisuje się w drugim polu i rozdziela znakiem `|`.

Układ pól:

```text
pytanie, poprawna 1|poprawna 2, błędna 1, błędna 2, choice
```

Przykład:

```csv
Kolory flagi Polski?, biały|czerwony, niebieski, zielony, choice
Which animals can be pets?, dog|cat, table, quickly, choice
```

Podczas rozwiązywania testu aplikacja pokaże, ile odpowiedzi należy zaznaczyć. Pytanie zostanie zaliczone tylko wtedy, gdy wybrany zostanie cały prawidłowy zestaw.

### Uzupełnianie zdania

Układ pól:

```text
zdanie z luką, poprawne uzupełnienie, fill
```

Przykład:

```csv
I ___ coffee every morning., drink, fill
She ___ dinner yesterday., cooked, fill
Cats ___ fly., can't, fill
```

Wielkość liter w odpowiedzi użytkownika nie ma znaczenia.

### Uporządkuj zdanie

Układ pól:

```text
polecenie, zdanie do ułożenia, order
```

Przykład:

```csv
Ułóż zdanie., I love you., order
```

Pierwsze pole to polecenie widoczne nad pytaniem, drugie to całe poprawne zdanie — aplikacja rozbija je na słowa i miesza kafelki.

### Dopasuj

Pytanie typu „Dopasuj" łączy kafelki z lewej kolumny z polami w prawej. Każdą parę zapisuje się jako `lewa=prawa`, a par musi być co najmniej dwie.

Układ pól:

```text
polecenie, lewa 1=prawa 1, lewa 2=prawa 2, lewa 3=prawa 3, match
```

Przykład:

```csv
Dopasuj słowa., ruler=linijka, pencil case=piórnik, scissors=nożyczki, match
Dopasuj kraj do stolicy., Poland=Warsaw, France=Paris, match
```

Podczas testu uczący się przeciąga kolorowe kafelki (lewa kolumna) na właściwe pola (prawa kolumna) lub klika kafelek, a potem pole. Importer przyjmuje jako typ: `match`, `dopasuj` lub `dopasowanie`.

### Fiszki

Fiszka to odwracana karta: awers to pytanie lub słowo, rewers to tłumaczenie lub definicja.

Układ pól:

```text
awers (słowo / pytanie), rewers (tłumaczenie / odpowiedź), fiszka
```

Przykład:

```csv
curious, ciekawy, fiszka
brave, odważny, fiszka
patient, cierpliwy, fiszka
```

Podczas testu kliknięcie karty lub przycisku **Pokaż odpowiedź** odwraca fiszkę. Następnie użytkownik ocenia się sam przyciskami **✓ Wiedziałem** lub **✗ Nie wiedziałem**.

Importer przyjmuje jako typ: `fiszka`, `fiszki` lub `flashcard`.

### Popraw błąd

Pytanie typu „Popraw błąd" to zdanie zawierające jedno błędne słowo. Podczas testu uczący się klika błędne słowo (podświetla się), a następnie wpisuje jego poprawną formę.

Układ pól:

```text
zdanie z błędem, błędne słowo, poprawna forma, correct
```

Przykład:

```csv
She go to school every day., go, goes, correct
He don't like coffee., don't, doesn't, correct
```

Błędne słowo (drugie pole) musi występować w treści zdania — w przeciwnym razie wiersz jest pomijany przy imporcie. Poprawną formę można podać w kilku akceptowanych wariantach oddzielonych `|`, np. `goes|does go`. Importer przyjmuje jako typ: `correct`, `popraw` lub `popraw blad`.

### Anagram

Pytanie typu „Anagram" to jedno słowo, którego litery uczący się układa w poprawnej kolejności (klikając lub przeciągając kafelki). Spacje w odpowiedzi są ignorowane, wielkość liter nie ma znaczenia.

Układ pól:

```text
polecenie, słowo do ułożenia, anagram
```

Przykład:

```csv
Ułóż nazwę zwierzęcia., elephant, anagram
Ułóż słowo., rainbow, anagram
```

Pierwsze pole to polecenie widoczne nad pytaniem, drugie to poprawne słowo (co najmniej dwie litery). Importer przyjmuje jako typ: `anagram` lub `anagramy`.

### Wykreślanka

Pytanie typu „Wykreślanka" ukrywa listę słów w kwadratowej siatce liter (poziomo, pionowo lub na ukos; słowo można też odczytać wspak). Uczący się zaznacza każde słowo, klikając jego pierwszą i ostatnią literę.

Układ pól:

```text
polecenie, słowo 1, słowo 2, słowo 3, …, wordsearch
```

Przykład:

```csv
Znajdź zwierzęta., cat, dog, bird, fish, wordsearch
Find the colours., red, blue, green, wordsearch
```

Pierwsze pole to polecenie, kolejne to słowa do ukrycia (każde co najmniej dwie litery). Aplikacja generuje siatkę i wypełnia puste pola losowymi literami. Importer przyjmuje jako typ: `wordsearch`, `wykreslanka` lub `szukaj slow`.

### Krzyżówka

Pytanie typu „Krzyżówka" splata hasła na wspólnych literach w jednej siatce. Każde hasło zapisuje się jako `słowo=wskazówka`, a haseł musi być co najmniej dwa. Aplikacja układa je w krzyżówkę i numeruje wskazówki poziomo/pionowo; uczący się wpisuje litery w kratki.

Układ pól:

```text
polecenie, słowo 1=wskazówka 1, słowo 2=wskazówka 2, słowo 3=wskazówka 3, crossword
```

Przykład:

```csv
Rozwiąż krzyżówkę., cat=A pet that meows, tiger=Big striped cat, rabbit=Hops and has long ears, crossword
```

Aplikacja układa hasła automatycznie: przeszukuje wiele losowych wariantów rozmieszczenia i wybiera najlepszy (najwięcej ułożonych haseł, potem najwięcej skrzyżowań, potem najzwartsza siatka), więc dobrze dobrany zestaw układa się w całości. Hasła muszą mieć wspólne litery, żeby dało się je skrzyżować — hasło, którego nie da się połączyć z żadnym innym, zostanie pominięte. Importer przyjmuje jako typ: `crossword`, `krzyzowka` lub `krzyzowki`.

### Krzyżówka z pytaniami

Pytanie typu „Krzyżówka z pytaniami" to odmiana krzyżówki bez splatania: każde hasło pojawia się jako osobny ponumerowany poziomy rząd kratek, a wskazówka jest widocznym pytaniem obok. Uczący się wpisuje odpowiedzi literami. Format zapisu jest taki sam jak w krzyżówce (`odpowiedź=pytanie`).

Układ pól:

```text
polecenie, odpowiedź 1=pytanie 1, odpowiedź 2=pytanie 2, odpowiedź 3=pytanie 3, quizcross
```

Przykład:

```csv
Odpowiedz na pytania., cat=A pet that meows, dog=A pet that barks, fish=Lives in water, quizcross
```

W odróżnieniu od zwykłej krzyżówki odpowiedzi nie muszą mieć wspólnych liter — każda trafia do własnego rzędu. Importer przyjmuje jako typ: `quizcross` lub `krzyzowka z pytaniami`.

### Krzyżówka z hasłem

Pytanie typu „Krzyżówka z hasłem" ma ukryte hasło, które czyta się w pionie z podświetlonej kolumny. Podajesz hasło, a następnie dla każdej jego litery jedno słowo zawierające tę literę wraz z pytaniem. Aplikacja układa słowa poziomo tak, by wskazana litera każdego słowa trafiła w jedną kolumnę.

Układ pól — **pierwsze pole po poleceniu to hasło**, kolejne to pary `słowo=pytanie` (jedna na każdą literę hasła, w tej samej kolejności):

```text
polecenie, HASŁO, słowo1=pytanie1, słowo2=pytanie2, słowo3=pytanie3, keycross
```

Przykład (hasło `KOT` — litery K, O, T):

```csv
Odgadnij hasło., KOT, milk=White drink, dog=A pet that barks, cat=A pet that meows, keycross
```

Tutaj `milk` zawiera **K**, `dog` zawiera **O**, `cat` zawiera **T** — te litery ustawią się w jednej kolumnie i utworzą hasło KOT. Każde słowo musi zawierać odpowiednią literę hasła (i mieć co najmniej dwie litery), inaczej wiersz jest pomijany. Importer przyjmuje jako typ: `keycross` lub `krzyzowka z haslem`.

### Mieszanie różnych typów pytań

W jednym imporcie można łączyć wszystkie typy pytań — jednokrotny i wielokrotny wybór, uzupełnianie zdań, układanie, dopasowywanie, fiszki i poprawianie błędu:

```csv
What ___ your name?, is, are, am, can, choice
Kolory flagi Polski?, biały|czerwony, niebieski, zielony, choice
I ___ coffee every morning., drink, fill
Ułóż zdanie., I love you., order
Dopasuj słowa., ruler=linijka, pencil case=piórnik, match
curious, ciekawy, fiszka
She go to school every day., go, goes, correct
```

Typ każdego pytania określa ostatnie pole:

- `choice` — test wyboru,
- `fill` — uzupełnianie zdania,
- `order` — układanie zdania z kafelków,
- `match` — dopasowywanie par,
- `fiszka` — odwracana fiszka,
- `correct` — poprawianie błędnego słowa w zdaniu,
- `anagram` — układanie słowa z liter,
- `wordsearch` — wykreślanka,
- `crossword` — krzyżówka ze splatającymi się hasłami,
- `quizcross` — krzyżówka z pytaniami (rząd na hasło),
- `keycross` — krzyżówka z hasłem czytanym w pionie z podświetlonej kolumny.

Oznaczenie typu jest odporne na wielkość liter i polskie znaki diakrytyczne (`uzupełnij` = `uzupelnij`). Każdy typ ma kilka dozwolonych form:

| Typ | Dozwolone oznaczenia (ostatnie pole) |
| --- | --- |
| Test wyboru | `choice`, `wybor`, `test wyboru`, `multiple choice` |
| Uzupełnianie zdania | `fill`, `uzupelnij`, `uzupelnianie`, `uzupelnij zdanie` |
| Uporządkuj zdanie | `order`, `uporzadkuj`, `uporzadkuj zdanie`, `kolejnosc` |
| Dopasuj | `match`, `dopasuj`, `dopasowanie` |
| Fiszka | `flashcard`, `fiszka`, `fiszki` |
| Popraw błąd | `correct`, `popraw`, `popraw blad`, `poprawianie`, `znajdz blad` |
| Anagram | `anagram`, `anagramy` |
| Wykreślanka | `wordsearch`, `wykreslanka`, `wykreslanki`, `szukaj slow` |
| Krzyżówka | `crossword`, `krzyzowka`, `krzyzowki` |
| Krzyżówka z pytaniami | `quizcross`, `krzyzowka z pytaniami` |
| Krzyżówka z hasłem | `keycross`, `krzyzowka z haslem` |

Najbardziej jednoznaczne są angielskie oznaczenia `choice`, `fill`, `order`, `match`, `fiszka`, `correct`, `anagram`, `wordsearch`, `crossword`, `quizcross` i `keycross`.

Przykład wykorzystujący wszystkie dozwolone formy (po jednym wierszu na każdą):

```csv
What ___ your name?, is, are, am, can, choice
___ she your teacher?, Is, Are, Am, Do, wybór
Kolory flagi Polski?, biały|czerwony, niebieski, zielony, test wyboru
Which animals can be pets?, dog|cat, table, quickly, multiple choice
I ___ coffee every morning., drink, fill
She ___ dinner yesterday., cooked, uzupełnij
We ___ from Poland., are, uzupełnianie
Cats ___ fly., can't, uzupełnij zdanie
Ułóż zdanie., I love you., order
Ułóż zdanie., She is happy., uporządkuj
Ułóż zdanie., They play football., uporządkuj zdanie
Ułóż zdanie., We go home., kolejność
Dopasuj słowa., ruler=linijka, pencil case=piórnik, match
Dopasuj kraj do stolicy., Poland=Warsaw, France=Paris, dopasuj
Dopasuj przeciwieństwa., big=small, hot=cold, dopasowanie
curious, ciekawy, flashcard
brave, odważny, fiszka
patient, cierpliwy, fiszki
She go to school every day., go, goes, correct
He don't like coffee., don't, doesn't, popraw
My brother watch TV., watch, watches, popraw błąd
They plays football., plays, play, poprawianie
Anna have three cats., have, has, znajdź błąd
Ułóż słowo., elephant, anagram
Ułóż słowo., rainbow, anagramy
Znajdź zwierzęta., cat, dog, bird, wordsearch
Znajdź kolory., red, blue, green, wykreślanka
Rozwiąż krzyżówkę., cat=meows, tiger=striped cat, rabbit=hops here, crossword
Rozwiąż krzyżówkę., cat=meows, tea=a hot drink, krzyżówka
Odpowiedz na pytania., cat=A pet that meows, dog=A pet that barks, quizcross
Odpowiedz na pytania., cat=meows, fish=swims, krzyżówka z pytaniami
Odgadnij hasło., KOT, milk=White drink, dog=A pet that barks, cat=A pet that meows, keycross
Odgadnij hasło., DOM, mydło=soap, okno=window, komin=chimney, krzyżówka z hasłem
```

### Polecenie nad pytaniem (opcjonalnie)

Domyślnie nad treścią pytania wyświetla się etykieta typu (np. „Wybierz odpowiedź”, „Uzupełnij zdanie”). Można ją zastąpić własnym poleceniem — w kreatorze wpisz je w polu nad treścią pytania, a w imporcie CSV dodaj je w nawiasach kwadratowych na początku pierwszego pola:

```text
[Complete the sentence] zdanie z luką, poprawne uzupełnienie, fill
```

Przykład:

```csv
[Complete the sentence] Anna ___ karate usually in the morning., plays, do, does, play, choice
[Choose the correct answer] What ___ your name?, is, are, am, can, choice
[Znajdź i popraw błąd] She go to school every day., go, goes, correct
```

Polecenie działa dla każdego typu pytania — wystarczy dodać `[...]` na początku pierwszego pola. Jeśli pole nie zaczyna się od nawiasu kwadratowego, aplikacja użyje domyślnej etykiety typu pytania.

### Przecinki wewnątrz pytania lub odpowiedzi

Jeśli treść pola zawiera przecinek, całe pole należy ująć w cudzysłów:

```csv
"Choose the correct sentence, please.", "Yes, I can.", "No, I am.", "Yes, I do.", choice
"Complete the sentence: Yes, ___ can.", I, fill
```

Jeśli w treści potrzebny jest sam znak cudzysłowu, należy zapisać go podwójnie, np. `"She said ""hello""."`.

### Ważne zasady

- jeden wiersz oznacza jedno pytanie,
- maksymalnie cztery odpowiedzi są wyświetlane w pytaniu wyboru,
- puste wiersze są pomijane,
- białe znaki przed i po polach są automatycznie usuwane,
- nieprawidłowe wiersze są pomijane i uwzględniane w komunikacie podsumowującym import,
- po imporcie każde pytanie można nadal ręcznie edytować.

## Generowanie pytań przez AI

Pytania w formacie CSV można wygenerować dowolnym modelem AI (ChatGPT, Claude, Gemini) i wkleić prosto do importu. W pliku [docs/prompt-generator-pytan.md](docs/prompt-generator-pytan.md) znajduje się gotowy prompt — wystarczy wypełnić pola (temat gramatyczny, poziom, lista słów, liczba i typy pytań) i wkleić do AI.

Prompt wymusza reguły, które najczęściej myli AI:

- pytania `fill` muszą zawierać lukę `___`,
- opcje w `choice` to formy gramatyczne, a nie losowe słownictwo (dokładnie 4 opcje),
- w `correct` błędne słowo musi występować dosłownie w zdaniu (inaczej aplikacja pomija wiersz),
- w `crossword` hasła muszą mieć wspólne litery, żeby dało się je skrzyżować (w `quizcross` nie jest to wymagane),
- podane słownictwo jest tematem zdań, nie opcjami do wyboru.

Zawsze przejrzyj wynik przed importem — aplikacja pomija nieprawidłowe wiersze i podsumowuje, ile pominęła, a każde pytanie można potem ręcznie edytować.

## Import listy słówek dnia

Lista słówek dnia korzysta z prostszego, dwukolumnowego formatu:

```csv
apple, jabłko
window, okno
brave, odważny
```

Każdy wiersz zawiera angielskie słowo i polskie tłumaczenie. Edytor listy otwiera się ikoną ⚙ na karcie słówka dnia.
