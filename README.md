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
- opcjonalne polecenie wyświetlane nad treścią pytania (np. „Complete the sentence”), ustawiane w kreatorze lub przez import CSV.

### Kreator i edycja testów

- kreator własnych testów,
- edycja własnych testów po ich utworzeniu, w tym edycja i usuwanie testów wbudowanych,
- zbiorcza zmiana typu wszystkich pytań w kreatorze,
- osobne ustawienia losowania kolejności pytań i odpowiedzi,
- obrazek wyświetlany pod przyciskiem odpowiedzi, dodawany z pliku lub adresu URL; większe obrazki wyświetlane w pełnych proporcjach bez przycinania,
- gotowy 24-pytaniowy test `Grammar Power Pack` z konstrukcjami `to be`, `have/has got` i `can`,
- nowe warianty pytań i przetasowane odpowiedzi przy każdym rozpoczęciu testu.

### Import z CSV

- import wielu pytań z wklejonej struktury CSV, z typem pytania (`choice`, `fill`, `order`, `fiszka`, `match`, `correct`) w ostatnim polu importowanego wiersza (szczegóły w sekcji [Import pytań z CSV](#import-pytań-z-csv)).

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
- `correct` — poprawianie błędnego słowa w zdaniu.

Oznaczenie typu jest odporne na wielkość liter i polskie znaki diakrytyczne (`uzupełnij` = `uzupelnij`). Każdy typ ma kilka dozwolonych form:

| Typ | Dozwolone oznaczenia (ostatnie pole) |
| --- | --- |
| Test wyboru | `choice`, `wybor`, `test wyboru`, `multiple choice` |
| Uzupełnianie zdania | `fill`, `uzupelnij`, `uzupelnianie`, `uzupelnij zdanie` |
| Uporządkuj zdanie | `order`, `uporzadkuj`, `uporzadkuj zdanie`, `kolejnosc` |
| Dopasuj | `match`, `dopasuj`, `dopasowanie` |
| Fiszka | `flashcard`, `fiszka`, `fiszki` |
| Popraw błąd | `correct`, `popraw`, `popraw blad`, `poprawianie`, `znajdz blad` |

Najbardziej jednoznaczne są angielskie oznaczenia `choice`, `fill`, `order`, `match`, `fiszka` i `correct`.

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
