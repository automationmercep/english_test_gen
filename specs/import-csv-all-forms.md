### 1. Import CSV — wszystkie dozwolone oznaczenia typów
**Seed:** `seed.spec.ts`

Ten scenariusz weryfikuje, że importer CSV rozpoznaje każde dozwolone oznaczenie typu (angielskie i polskie, także z polskimi znakami diakrytycznymi) i tworzy pytanie właściwego typu.

#### 1.1 Import zestawu używającego wszystkich form daje poprawne typy pytań
**Steps:**
1. Kliknij przycisk "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu "Wszystkie formy CSV" w pole "Nazwa testu"
3. Wklej do pola tekstowego CSV (`#csvInput`) następujące 23 wiersze:
   ```
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
4. Kliknij przycisk "Wczytaj pytania"

**Expected:**
- Pojawia się komunikat (toast) "Dodano 23 pytań"
- W edytorze powstają dokładnie 23 karty pytań (`.question-card`)
- Typy kart (`data-type`), w kolejności, to:
  - 4× `choice` (wiersze `choice`, `wybór`, `test wyboru`, `multiple choice`)
  - 4× `fill` (wiersze `fill`, `uzupełnij`, `uzupełnianie`, `uzupełnij zdanie`)
  - 4× `order` (wiersze `order`, `uporządkuj`, `uporządkuj zdanie`, `kolejność`)
  - 3× `match` (wiersze `match`, `dopasuj`, `dopasowanie`)
  - 3× `flashcard` (wiersze `flashcard`, `fiszka`, `fiszki`)
  - 5× `correct` (wiersze `correct`, `popraw`, `popraw błąd`, `poprawianie`, `znajdź błąd`)
- Żaden wiersz nie zostaje pominięty (0 pominięć — brak fragmentu "Pominięto" w komunikacie)
- W szczególności wiersze z polskimi oznaczeniami zawierającymi literę „ł" (`uzupełnij`, `uzupełnij zdanie`, `popraw błąd`, `znajdź błąd`) są rozpoznawane jako właściwy typ, a nie jako domyślny `choice`
