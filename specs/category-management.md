### 1. Zarządzanie kategoriami
**Seed:** `seed.spec.ts`

#### 1.1 Utworzenie nowej, puste kategorii i przypisanie do niej testu
**Steps:**
1. Na stronie głównej kliknij przycisk "▱ Nowa kategoria"
2. W polu "Nazwa kategorii" wpisz "Słownictwo testowe"
3. Kliknij przycisk "Dodaj kategorię"
4. Sprawdź, że pojawiła się nowa zakładka kategorii "Słownictwo testowe" z licznikiem "0 testów"
5. Kliknij przycisk "Stwórz test", wpisz nazwę testu "Test w nowej kategorii", w polu "Kategoria" wybierz/wpisz "Słownictwo testowe"
6. Wypełnij pierwsze pytanie testu wyboru (treść i cztery odpowiedzi, jedna zaznaczona jako poprawna), usuń drugie domyślne pytanie
7. Zapisz test

**Expected:**
- Po dodaniu kategorii pojawia się komunikat (toast) "Dodano kategorię „Słownictwo testowe”"
- Po zapisaniu testu, po przejściu na zakładkę kategorii "Słownictwo testowe" widoczna jest karta "Test w nowej kategorii"

#### 1.2 Usunięcie kategorii wraz z przypisanymi testami
**Steps:**
1. Powtórz kroki 1.1, aby mieć kategorię "Słownictwo testowe" z jednym testem
2. Kliknij przycisk "×" przy zakładce kategorii "Słownictwo testowe", aby otworzyć modal usuwania
3. Sprawdź treść ostrzeżenia — powinna wskazywać liczbę testów do usunięcia (1)
4. Kliknij przycisk "Usuń kategorię i testy"

**Expected:**
- Zakładka kategorii "Słownictwo testowe" nie jest już widoczna w liście kategorii
- Pojawia się komunikat (toast) "Usunięto kategorię „Słownictwo testowe” wraz z jej testami"
- Test "Test w nowej kategorii" nie jest już widoczny na żadnej liście testów
