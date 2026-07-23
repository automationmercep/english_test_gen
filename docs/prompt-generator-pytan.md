# Prompt do generowania pytań przez AI

Gotowy prompt do wklejenia w dowolny model AI (ChatGPT, Claude, Gemini), który
generuje pytania od razu w formacie CSV zgodnym z importem aplikacji (sekcja
**Wklej pytania z CSV** w kreatorze). Wypełnij pola w `[...]` i wklej całość.

Pełny opis formatu CSV znajdziesz w [README.md](../README.md#import-pytań-z-csv).

## Prompt

```
Jesteś generatorem pytań do nauki angielskiego. Wygeneruj pytania w formacie CSV
zgodnym z aplikacją do importu.

=== PARAMETRY (wypełnij) ===
Liczba pytań: [np. 20]
Gramatyka/temat: [np. Present Simple]
Poziom: [np. A2]
Słowa do użycia: [np. listen, walk, study, watch, karate, pottery, football]
Formy do rozłożenia równo: twierdzenia, pytania (Do/Does/Is/Are), przeczenia (don't/doesn't/isn't)
Typy pytań i ile każdego: [np. 8x correct, 6x fill, 6x choice — dostępne typy: correct, fill, choice, order, match, flashcard]

=== ZASADY OGÓLNE ===
1. Jeden wiersz = jedno pytanie. Bez nagłówka, bez numeracji, bez markdown, bez komentarzy.
2. Ostatnie pole każdego wiersza to token typu (po angielsku): correct / fill / choice / order / match / flashcard.
3. Pola oddzielaj przecinkami. Jeśli w treści pytania jest przecinek, otocz całe pole cudzysłowem: "zdanie, z przecinkiem".
4. Słowa z listy są TEMATEM zdań (czynność/podmiot), NIGDY nie są opcjami do wyboru.
5. Każde słowo z listy wykorzystaj co najmniej raz. Możesz je odmieniać gramatycznie (walk → walks).

=== FORMATY TYPÓW ===

correct — zdanie zawierające DOKŁADNIE JEDEN błąd gramatyczny. Uczeń znajduje i poprawia błąd.
  Format: zdanie_z_błędem, błędne_słowo, poprawna_forma, correct
  KRYTYCZNE: błędne_słowo musi występować DOSŁOWNIE w zdaniu (identyczny zapis, ta sama forma).
  Przykład: She walk to school every morning.,walk,walks,correct

fill — zdanie z LUKĄ oznaczoną trzema podkreśleniami "___" w miejscu brakującego słowa.
  Format: zdanie z ___ , poprawna_odpowiedź, fill
  KRYTYCZNE: zdanie MUSI zawierać "___". Odpowiedź to słowo pasujące w lukę.
  Przykład: We don't ___ to music in the library.,listen,fill

choice — pytanie z DOKŁADNIE 4 opcjami (1 poprawna + 3 błędne). Opcje to RÓŻNE FORMY
  GRAMATYCZNE lub sensowne odpowiedzi, NIGDY losowe słownictwo. Wszystkie 4 opcje muszą być
  tego samego rodzaju (np. same formy czasownika ALBO same Do/Does/Is/Are — nie mieszaj).
  Pierwsza opcja = poprawna.
  Format: pytanie, poprawna, błędna1, błędna2, błędna3, choice
  Przykład: He ___ English on weekends.,studies,study,studying,studied,choice
  Przykład: ___ she interested in pottery?,Is,Are,Do,Does,choice

choice (kilka poprawnych) — kilka poprawnych odpowiedzi rozdziel znakiem "|" w drugim polu.
  Format: pytanie, poprawna1|poprawna2, błędna1, błędna2, choice
  Przykład: Which animals can be pets?,dog|cat,table,quickly,choice

order — układanie pomieszanych słów w poprawne zdanie.
  Format: polecenie, całe_poprawne_zdanie, order
  Pierwsze pole to polecenie nad pytaniem, drugie to całe zdanie (aplikacja miesza słowa).
  Przykład: Ułóż zdanie.,She walks to school every day.,order

match — łączenie par (lewa=prawa), minimum dwie pary.
  Format: polecenie, lewa1=prawa1, lewa2=prawa2, lewa3=prawa3, match
  Przykład: Dopasuj słowo do tłumaczenia.,walk=spacerować,study=uczyć się,watch=oglądać,match

flashcard — odwracana karta: awers (słowo/pytanie) i rewers (tłumaczenie/odpowiedź).
  Format: awers, rewers, flashcard
  Przykład: football,piłka nożna,flashcard

=== WYNIK ===
Zwróć WYŁĄCZNIE surowe wiersze CSV, każdy w osobnej linii, gotowe do skopiowania.
Nie dodawaj żadnego tekstu przed ani po.
```

## Ważne po wygenerowaniu

Zawsze przejrzyj wynik przed importem — AI potrafi się pomylić w pojedynczych
wierszach, najczęściej:

- **`fill` bez luki** — zdanie kompletne, brak `___` (aplikacja pokaże pełne zdanie i puste pole).
- **`choice` z losowymi słowami** zamiast form gramatycznych, albo z liczbą opcji inną niż 4.
- **`correct` z błędnym słowem, którego nie ma dosłownie w zdaniu** — taki wiersz aplikacja pomija przy imporcie.

Aplikacja i tak pomija nieprawidłowe wiersze i podsumowuje, ile pominęła, ale
najlepiej poprawić je od razu. Po imporcie każde pytanie można też ręcznie edytować.

## Przykład bezbłędnego zestawu

Wygenerowany tym promptem (Present Simple, słowa: listen, walk, study, watch,
karate, pottery, football), po weryfikacji — wszystkie 20 wierszy przechodzą import:

```csv
She walk to school every morning.,walk,walks,correct
He don't listen to music after school.,don't,doesn't,correct
Does she watches TV in the evening?,watches,watch,correct
They is interested in football.,is,are,correct
My brother study English every day.,study,studies,correct
We doesn't play football on Mondays.,doesn't,don't,correct
Do Tom walk to school every day?,Do,Does,correct
She don't do karate at school.,don't,doesn't,correct
I ___ to music every evening.,listen,fill
He ___ to school with his sister.,walks,fill
We don't ___ TV in the morning.,watch,fill
___ she study English every day?,Does,fill
They ___ interested in pottery.,are,fill
My sister doesn't ___ football.,play,fill
He ___ English after school.,studies,study,studying,studied,choice
___ they listen to music every day?,Do,Does,Is,Are,choice
She ___ walk to school on Sundays.,doesn't,don't,isn't,aren't,choice
___ he interested in karate?,Is,Are,Do,Does,choice
We ___ football after school.,play,plays,playing,played,choice
___ your friends study English at school?,Do,Does,Is,Are,choice
```
