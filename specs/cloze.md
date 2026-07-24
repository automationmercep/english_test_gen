### Typ pytania „Uzupełnij luki" (cloze / gap-fill)

**Seed:** `seed.spec.ts`

Nowy typ pytania, w którym autor wkleja dowolny tekst i otacza słowa do ukrycia nawiasami kwadratowymi `[słowo]`. Każdy taki fragment staje się luką do uzupełnienia. W grze tekst wyświetla się w całości, z osadzonymi w nim polami do wpisania — szerokość każdej luki jest dopasowana do długości poprawnego słowa (żeby się zmieściło i dawało wskazówkę). Sprawdzanie ignoruje wielkość liter (jak w typie „Uzupełnij zdanie").

- **Model danych:** `{ type: "cloze", prompt, text, instruction? }`, gdzie `text` zawiera znaczniki `[...]`.
- **Składnia luk:** `[słowo]` → luka; `\[`, `\]`, `[[`, `]]` → dosłowne nawiasy; puste `[]` i niesparowane `[` traktowane są jako zwykły tekst.
- **Import CSV:** `prompt, tekst z [lukami], cloze` (synonimy tokena: `cloze`, `luki`, `uzupelnij luki`, `gap fill`). Tekst z przecinkami należy ująć w cudzysłowy.
- Walidacja wymaga co najmniej jednej luki. Konwersja zbiorcza z/do tego typu ostrzega o utracie treści (cloze to osobna „rodzina" danych).

#### 1. Wszystkie luki poprawne — pytanie zaliczone
**Steps:**
1. Utwórz test, zaimportuj wiersz CSV z tekstem zawierającym trzy luki `[go]`, `[study]`, `[play]`, zapisz i rozpocznij.
2. Zweryfikuj, że pytanie ma etykietę „Uzupełnij luki", trzy luki, a każda ma szerokość ustawioną w jednostkach `ch`.
3. Wypełnij luki poprawnymi słowami; przycisk „Sprawdź odpowiedź" jest aktywny dopiero po wypełnieniu wszystkich.
4. Kliknij „Sprawdź odpowiedź".

**Expected:**
- Dopóki którakolwiek luka jest pusta, „Sprawdź odpowiedź" jest nieaktywny.
- Po sprawdzeniu informacja zwrotna ma stan „good", wszystkie trzy luki są oznaczone jako poprawne.
- Ekran wyniku pokazuje pytanie jako zaliczone.

#### 2. Częściowo błędne odpowiedzi — pytanie odrzucone
**Steps:**
1. Rozpocznij ten sam test, wypełnij dwie luki poprawnie, jedną błędnie i sprawdź.

**Expected:**
- Informacja zwrotna ma stan „bad"; dwie luki oznaczone jako poprawne, jedna jako błędna.
- W informacji zwrotnej widoczne są poprawne odpowiedzi (np. „go, study, play").

#### 3. Dopasowanie ignoruje wielkość liter
**Steps:**
1. Rozpocznij test i wpisz poprawne słowa różną wielkością liter (np. „GO", „Study", „play"), sprawdź.

**Expected:**
- Wszystkie luki oznaczone jako poprawne, informacja zwrotna „good".
