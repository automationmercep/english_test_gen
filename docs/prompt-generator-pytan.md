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
Typy pytań i ile każdego: [np. 8x correct, 6x fill, 6x choice — dostępne typy: correct, fill, choice, cloze, order, match, flashcard, anagram, wordsearch, crossword, quizcross, keycross]

=== ZASADY OGÓLNE ===
1. Jeden wiersz = jedno pytanie. Bez nagłówka, bez numeracji, bez markdown, bez komentarzy.
2. Ostatnie pole każdego wiersza to token typu (po angielsku): correct / fill / choice / cloze / order / match / flashcard / anagram / wordsearch / crossword / quizcross / keycross.
3. Pola oddzielaj przecinkami. Jeśli w treści pytania jest przecinek, otocz całe pole cudzysłowem: "zdanie, z przecinkiem".
4. Każde wymagane słowo wykorzystaj co najmniej raz w znaczącym kontekście: w treści pytania albo poprawnej odpowiedzi, nie tylko w poleceniu lub błędnym dystraktorze. Możesz je odmieniać gramatycznie (walk → walks).
5. Zachowaj dokładnie podaną liczbę twierdzeń, pytań i przeczeń. Forma zdania jest niezależna od typu CSV.
6. Pisz naturalnym, idiomatycznym angielskim odpowiednim dla wskazanego poziomu CEFR. Unikaj sztucznych kontekstów, tłumaczeń słowo w słowo i niezgrabnych powtórzeń.
7. Opcjonalnie rozpocznij pierwsze pole od `[Polskie polecenie]`, np. `[Wpisz formę czasownika „do”] Elena ___ her homework.`. Tekst w nawiasach pojawi się nad pytaniem.

=== FORMATY TYPÓW ===

correct — zdanie zawierające DOKŁADNIE JEDEN błąd gramatyczny. Uczeń znajduje i poprawia błąd.
  Format: zdanie_z_błędem, błędne_słowo, poprawna_forma, correct
  KRYTYCZNE: błędne_słowo musi występować DOSŁOWNIE w zdaniu (identyczny zapis, ta sama forma).
  Przykład: She walk to school every morning.,walk,walks,correct

fill — zdanie z LUKĄ oznaczoną trzema podkreśleniami "___" w miejscu brakującego słowa.
  Format: zdanie z ___ , poprawna_odpowiedź, fill
  KRYTYCZNE: zdanie MUSI zawierać "___" i dopuszczać tylko jedną zwyczajną odpowiedź.
  Jeżeli sprawdzasz odmianę, podaj czasownik bazowy lub konstrukcję w prefiksie `[Polecenie]`.
  ŹLE: Elena ___ her homework after school.,does,fill  (pasuje też completes/finishes)
  DOBRZE: [Wpisz formę czasownika „do”] Elena ___ her homework after school.,does,fill

cloze — dłuższy tekst z KILKOMA lukami. Słowa do ukrycia otocz nawiasami [słowo].
  Każdy fragment [...] staje się luką; uczeń wpisuje brakujące słowa w tekście.
  Format: polecenie, tekst z [lukami], cloze
  KRYTYCZNE: cały tekst z lukami to JEDNO pole — jeśli zawiera przecinki (a zwykle
  zawiera), otocz to pole cudzysłowem. Użyj 2–5 luk w spójnym, powiązanym tekście.
  KRYTYCZNE: każda luka musi być JEDNOZNACZNIE odgadywalna z kontekstu (kolokacja,
  definicja lub gramatyka) — NIE ukrywaj słów zależnych od gustu/opinii.
  KRYTYCZNE: pierwsze pole jest widocznym tytułem. NIGDY nie umieszczaj w nim tekstu
  z `[odpowiedziami]` ani kompletnego zdania ujawniającego luki. Odpowiedzi w nawiasach
  kwadratowych mogą wystąpić wyłącznie w drugim polu CSV.
  ŹLE:  "My favourite subject is [Music]."   (ulubiony przedmiot to opinia — nie da się odgadnąć)
  DOBRZE: "In [Music] we sing and play instruments."   (definicja wskazuje odpowiedź)
  Przykład: Uzupełnij tekst.,"I [go] to school every day. At school I [study] English. After class my friends [play] football.",cloze

choice — pytanie z DOKŁADNIE 4 opcjami (1 poprawna + 3 błędne). Opcje to RÓŻNE FORMY
  GRAMATYCZNE lub sensowne odpowiedzi, NIGDY losowe słownictwo. Wszystkie 4 opcje muszą być
  tego samego rodzaju (np. same formy czasownika ALBO same Do/Does/Is/Are — nie mieszaj).
  Pierwsza opcja = poprawna.
  Format: pytanie, poprawna, błędna1, błędna2, błędna3, choice
  Przykład: He ___ English on weekends.,studies,study,studying,studys,choice
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
  KRYTYCZNE: każda para musi wynikać z wiedzy zawartej w zadaniu albo z jednoznacznej
  relacji (np. słowo–tłumaczenie). Nie każ dopasowywać osób do dowolnych czynności bez
  tekstu źródłowego. Sama zgodność `plays`/`play` nie rozstrzyga dwóch osób w liczbie pojedynczej.
  Przykład: Dopasuj słowo do tłumaczenia.,walk=spacerować,study=uczyć się,watch=oglądać,match

flashcard — odwracana karta: awers (słowo/pytanie) i rewers (tłumaczenie/odpowiedź).
  Format: awers, rewers, flashcard
  Przykład: football,piłka nożna,flashcard

anagram — jedno słowo do ułożenia z pomieszanych liter (min. 2 litery, spacje ignorowane).
  Format: polecenie, słowo, anagram
  Przykład: Ułóż nazwę zwierzęcia.,elephant,anagram

wordsearch — wykreślanka: lista słów ukrytych w siatce liter. Podaj słowa (każde min. 2 litery).
  Format: polecenie, słowo1, słowo2, słowo3, …, wordsearch
  Przykład: Znajdź zwierzęta.,cat,dog,bird,fish,wordsearch

crossword — krzyżówka splatająca hasła na wspólnych literach (min. 2 hasła). Każde hasło jako słowo=wskazówka.
  KRYTYCZNE: hasła muszą mieć wspólne litery, by dało się je skrzyżować — inaczej aplikacja pomija hasło.
  Dobierz słowa dzielące litery (np. cat/tiger/rabbit dzielą "t"/"a"/"r").
  Format: polecenie, słowo1=wskazówka1, słowo2=wskazówka2, słowo3=wskazówka3, crossword
  Przykład: Rozwiąż krzyżówkę.,cat=A pet that meows,tiger=Big striped cat,rabbit=Hops and has long ears,crossword

quizcross — krzyżówka z pytaniami: każde hasło to osobny rząd kratek z pytaniem obok (BEZ splatania).
  Odpowiedzi NIE muszą mieć wspólnych liter. Zapis taki sam jak crossword: odpowiedź=pytanie.
  Format: polecenie, odpowiedź1=pytanie1, odpowiedź2=pytanie2, …, quizcross
  Przykład: Odpowiedz na pytania.,cat=A pet that meows,dog=A pet that barks,fish=Lives in water,quizcross

keycross — krzyżówka z hasłem: hasło czytane w pionie z podświetlonej kolumny.
  PIERWSZE pole po poleceniu to HASŁO; potem po jednym słowie na każdą literę hasła (słowo=pytanie).
  KRYTYCZNE: i-te słowo musi zawierać i-tą literę hasła, i mieć min. 2 litery. Kolejność słów = kolejność liter hasła.
  Format: polecenie, HASŁO, słowo1=pytanie1, słowo2=pytanie2, …, keycross
  Przykład (hasło KOT → K,O,T): Odgadnij hasło.,KOT,milk=White drink,dog=A pet that barks,cat=A pet that meows,keycross

=== JEDNOZNACZNOŚĆ (sprawdź KAŻDE pytanie!) ===
Aplikacja zalicza tylko JEDNĄ poprawną odpowiedź / jedno poprawne słowo. Zanim
zapiszesz pytanie, sprawdź, czy nie istnieje DRUGA odpowiedź poprawna gramatycznie.
Jeśli istnieje — przerób pytanie tak, by poprawna była tylko jedna.

- fill/cloze: rozwiąż każdą lukę bez zaglądania do klucza. Jeżeli pasuje inne zwyczajne
  słowo lub forma, dodaj rozstrzygający kontekst albo podaj czasownik bazowy/konstrukcję.

- match: spróbuj zamienić miejscami każde dwie prawe odpowiedzi. Jeżeli po zamianie
  dopasowanie nadal jest logiczne lub gramatycznie możliwe, dodaj tekst źródłowy albo
  zmień pary na relacje o jednym obiektywnie poprawnym przyporządkowaniu.

- choice: żaden z 3 dystraktorów nie może tworzyć poprawnego zdania. Uwaga na CZAS:
  określenia typu "every day / every Saturday / every evening" pasują i do Present
  Simple, i do Past Simple — więc forma przeszła (studied, did) jako dystraktor jest
  RÓWNIEŻ poprawna. Nie używaj form przeszłych jako dystraktorów przy zdaniach o
  rutynie. Trzymaj wszystkie dystraktory w tym samym czasie co poprawna odpowiedź.
  ŹLE:  My friends ___ English every evening.,study,studies,studying,studied,choice   (studied też poprawne)
  DOBRZE: My friends ___ English every evening.,study,studies,studying,are,choice

- correct: błąd musi mieć TYLKO JEDNO sensowne miejsce naprawy. Uwaga na zgodę
  podmiot–orzeczenie: "My dictionary are..." można naprawić i przez are→is, i przez
  dictionary→dictionaries. Aby uniknąć dwuznaczności, użyj podmiotu, którego liczby
  nie da się zmienić w danym kontekście (np. jednoznacznie mnogi: "These books",
  "your parents"), tak by jedyną poprawką było słowo, które zaplanowałeś.
  ŹLE:  Is your friends always noisy?,Is,Are,correct   (można też friends→friend)
  DOBRZE: Are your parents always noisy? -> zapisz jako: Is your parents always noisy?,Is,Are,correct

=== NATURALNOŚĆ I KONTROLA KOŃCOWA ===
1. Odtwórz dokładnie ekran ucznia. Sprawdź, czy treść nie pokazuje odpowiedzi, szczególnie w `cloze`.
2. Rozwiąż każde pytanie bez korzystania z klucza i odrzuć każde z więcej niż jedną rozsądną odpowiedzią.
3. Wstaw poprawną odpowiedź i przeczytaj całe zdanie na głos. Sprawdź naturalne kolokacje,
   odniesienia zaimków, szyk i sens. Popraw zdania gramatyczne, ale sztuczne lub powtarzalne.
4. Sprawdź dokładne liczby typów i form zdań oraz użycie wszystkich wymaganych słów.

=== WYNIK ===
Zwróć WYŁĄCZNIE surowe wiersze CSV, każdy w osobnej linii, gotowe do skopiowania.
Nie dodawaj żadnego tekstu przed ani po.
```

## Ważne po wygenerowaniu

Zawsze przejrzyj wynik przed importem — AI potrafi się pomylić w pojedynczych
wierszach, najczęściej:

- **`fill` bez luki** — zdanie kompletne, brak `___` (aplikacja pokaże pełne zdanie i puste pole).
- **`cloze` bez nawiasów** — tekst bez żadnego `[słowo]` (aplikacja pominie wiersz), albo luka nieodgadywalna z kontekstu (opinia/gust) — uczeń nie ma jak trafić. Sprawdź też, czy pole z tekstem jest w cudzysłowach, jeśli ma przecinki.
- **`cloze` ujawniający odpowiedzi** — pierwsze pole zawiera skopiowany tekst z `[odpowiedziami]`; pierwsze pole ma być tylko krótkim poleceniem lub tytułem.
- **`choice` z losowymi słowami** zamiast form gramatycznych, albo z liczbą opcji inną niż 4.
- **`correct` z błędnym słowem, którego nie ma dosłownie w zdaniu** — taki wiersz aplikacja pomija przy imporcie.
- **dwuznaczność** — druga opcja w `choice` też poprawna, albo błąd w `correct` da się naprawić na dwa sposoby (patrz sekcja „JEDNOZNACZNOŚĆ"). Aplikacja zaliczy tylko jedną odpowiedź, więc druga poprawna = uczeń dostaje „źle" mimo dobrej gramatyki.
- **nienaturalne zdanie** — konstrukcja jest gramatyczna, ale brzmi sztucznie, powtarza to samo słowo lub nie pasuje do poziomu ucznia.
- **niejednoznaczny `match`** — kilka kafelków można logicznie przypisać do tego samego pola, bo brakuje tekstu źródłowego lub obiektywnej relacji.

Aplikacja i tak pomija nieprawidłowe wiersze i podsumowuje, ile pominęła, ale
najlepiej poprawić je od razu. Po imporcie każde pytanie można też ręcznie edytować.

## Przykład bezbłędnego zestawu

Wygenerowany tym promptem (Present Simple, słowa: listen, walk, study, watch,
karate, pottery, football), po weryfikacji — wszystkie 20 wierszy przechodzą import:

```csv
These students walks to school every morning.,walks,walk,correct
Emma don't listen to music after school because she prefers silence.,don't,doesn't,correct
Amy watch TV in the evening and she talks about the programmes at school.,watch,watches,correct
Both Tom and Lucas is interested in football.,is,are,correct
My two brothers studies English every day.,studies,study,correct
We doesn't play football because neither of us likes it.,doesn't,don't,correct
Both Tom and his sister walks to school together.,walks,walk,correct
Elena don't do karate because she prefers swimming.,don't,doesn't,correct
[Wpisz formę czasownika „listen”] I ___ to music every evening.,listen,fill
[Wpisz formę czasownika „walk”] He ___ to school with his sister.,walks,fill
[Wpisz formę czasownika „watch”] We don't ___ TV in the morning.,watch,fill
[Wpisz formę czasownika „study”] Amy ___ English every day.,studies,fill
[Wpisz formę „to be”] They ___ interested in pottery.,are,fill
[Wpisz formę czasownika „play”] My sister doesn't ___ football.,play,fill
He ___ English after school.,studies,study,studying,studys,choice
My friends ___ to music every day.,listen,listens,listening,is listen,choice
She ___ walk to school on Sundays.,doesn't,don't,isn't,aren't,choice
He ___ interested in karate.,is,are,do,does,choice
We ___ football after school.,play,plays,playing,is play,choice
Your friends ___ English at school.,study,studies,studying,studys,choice
```
