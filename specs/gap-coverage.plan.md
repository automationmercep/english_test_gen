# Bright English — plan testów E2E (luki w pokryciu)

## Application Overview

Bright English to jednostronicowa aplikacja webowa (PWA, UI w języku polskim) do tworzenia i rozwiązywania testów językowych z angielskiego. Aplikacja obsługuje wiele typów pytań (wybór, uzupełnianie, porządkowanie, dopasowywanie, fiszki, poprawianie błędów, anagramy, wykreślanki, krzyżówki), import/eksport CSV i całych danych, kategorie testów, motywy kolorystyczne, ustawienia dźwięku/muzyki/komunikatów głosowych, słówko dnia, generator odmiany czasowników oraz mechanizm spaced-repetition (powtórka błędnych pytań). Cały stan aplikacji trzymany jest w localStorage; opcjonalna synchronizacja w chmurze odbywa się przez Firebase/Google Sign-In.

Ten plan testów E2E celowo NIE powtarza scenariuszy już pokrytych istniejącymi plikami testowymi (tworzenie testu z pytaniem wyboru, pytania: uzupełnij/uporządkuj/fiszka/dopasuj/popraw błąd, gry słowne — budowanie i rozgrywka, import CSV wszystkich form, rozwiązywanie testów, edycja/usuwanie testu, zarządzanie kategoriami, opcjonalne polecenie nad pytaniem, responsywność mobilna, zbiorcza zmiana typu pytań). Skupia się wyłącznie na zidentyfikowanych lukach: panel "Dane" (eksport/import/scalanie), ustawienia dźwięku/muzyki/komunikatów, motywy kolorystyczne, słówko dnia, generator odmiany czasowników, funkcję odkrywania litery w krzyżówce, nawigację "Poprzednie pytanie", ekran wyników z powtórką błędnych pytań, licznik czasu na pytanie, automatyczne przechodzenie do następnego pytania oraz walidację pustego formularza kreatora.

## Test Scenarios

### 1. Eksport, import i scalanie danych

**Seed:** `seed.spec.ts`

#### 1.1. Eksport całych danych do pliku JSON

**File:** `tests/data-export-import.spec.ts`

**Steps:**
  1. Na stronie głównej otwórz panel „Dane” w topbarze.
    - expect: Panel rozwija się i pokazuje opcje: „Eksportuj dane”, „Importuj dane”, „Dodaj testy”.
  2. Kliknij „Eksportuj dane”.
    - expect: Przeglądarka pobiera plik JSON o nazwie zawierającej „bright-english-backup” i aktualną datę.
    - expect: Plik zawiera pola version, exported, quizzes (z co najmniej domyślnymi testami) oraz categories.

#### 1.2. Import danych z pliku JSON zastępuje istniejące testy

**File:** `tests/data-export-import.spec.ts`

**Steps:**
  1. Utwórz nowy, unikalnie nazwany test (np. „Import Test A”) przez kreator, aby mieć zmodyfikowany stan biblioteki.
    - expect: Test „Import Test A” pojawia się na liście testów.
  2. Wyeksportuj dane (patrz poprzedni scenariusz), zapisując plik jako referencję „stan A”.
    - expect: Pobrano plik JSON reprezentujący stan A.
  3. Usuń test „Import Test A” z biblioteki.
    - expect: Test „Import Test A” nie jest już widoczny na liście.
  4. Otwórz panel „Dane”, kliknij „Importuj dane” i wybierz plik zapisany w kroku 2 (stan A).
    - expect: Po imporcie biblioteka zawiera ponownie test „Import Test A” (import zastępuje/odtwarza cały zestaw danych).

#### 1.3. Dodaj testy (scalanie) importuje tylko nowe quizy bez usuwania istniejących

**File:** `tests/data-export-import.spec.ts`

**Steps:**
  1. Zanotuj listę aktualnych testów w bibliotece (np. 4 testy startowe).
    - expect: Lista testów jest widoczna i policzalna.
  2. Utwórz unikalny test „Merge Test B”, wyeksportuj dane do pliku, a następnie usuń „Merge Test B” z biblioteki.
    - expect: Plik JSON zawiera „Merge Test B”; biblioteka po usunięciu go nie zawiera.
  3. Otwórz panel „Dane”, kliknij „Dodaj testy” i wybierz plik z „Merge Test B”.
    - expect: Test „Merge Test B” zostaje dodany do biblioteki, a wszystkie testy, które były obecne przed scaleniem, pozostają niezmienione (brak duplikatów, brak utraty danych).

#### 1.4. Import nieprawidłowego/uszkodzonego pliku JSON jest bezpiecznie obsłużony

**File:** `tests/data-export-import.spec.ts`

**Steps:**
  1. Przygotuj plik tekstowy z niepoprawną zawartością JSON (np. losowy tekst) i zapisz go z rozszerzeniem .json.
    - expect: Plik istnieje lokalnie i jest gotowy do wgrania.
  2. Otwórz panel „Dane”, kliknij „Importuj dane” i wybierz przygotowany nieprawidłowy plik.
    - expect: Aplikacja nie zawiesza się i nie czyści localStorage w sposób niekontrolowany — wyświetla komunikat o błędzie importu (alert/komunikat) i biblioteka testów pozostaje w niezmienionym, poprawnym stanie.

### 2. Ustawienia dźwięku, muzyki i komunikatów głosowych

**Seed:** `seed.spec.ts`

#### 2.1. Przełączanie dźwięków efektów on/off zapisuje się w localStorage

**File:** `tests/sound-settings.spec.ts`

**Steps:**
  1. Na stronie głównej sprawdź stan przycisku „Dźwięk” w topbarze (domyślnie włączony, etykieta „Wyłącz dźwięki”).
    - expect: Przycisk ma etykietę/aria-label wskazującą, że dźwięk jest aktualnie włączony.
  2. Kliknij przycisk „Dźwięk”.
    - expect: Etykieta przycisku zmienia się na „Włącz dźwięki” (dźwięk wyłączony).
  3. Odśwież stronę (reload).
    - expect: Stan wyłączonego dźwięku jest zachowany po odświeżeniu (odczytany z localStorage).

#### 2.2. Przełączanie muzyki w tle on/off zapisuje się w localStorage

**File:** `tests/sound-settings.spec.ts`

**Steps:**
  1. Kliknij przycisk „Muzyka” w topbarze (domyślnie etykieta „Wyłącz muzykę w tle”).
    - expect: Etykieta zmienia się na „Włącz muzykę w tle”.
  2. Odśwież stronę.
    - expect: Stan wyłączonej muzyki jest zachowany po odświeżeniu.

#### 2.3. Konfiguracja komunikatów dźwiękowych — zapis niestandardowych tekstów

**File:** `tests/sound-settings.spec.ts`

**Steps:**
  1. Kliknij przycisk „Komunikaty” w topbarze.
    - expect: Otwiera się modal „Komunikaty dźwiękowe” z polami: Poprawna odpowiedź, Błędna odpowiedź, Wynik 100%, Wynik poniżej 100%, Automatyczne przejście (sekundy), Czas na pytanie (sekundy), checkbox „Czytaj poprawne zdanie”, oraz combobox „Głos lektora”.
  2. Zmień treść pola „Poprawna odpowiedź” na unikalny tekst (np. „Super odpowiedź!”) i kliknij „Zapisz komunikaty”.
    - expect: Modal zamyka się bez błędów.
  3. Ponownie otwórz modal „Komunikaty”.
    - expect: Pole „Poprawna odpowiedź” zawiera zapisaną wcześniej wartość „Super odpowiedź!”, potwierdzając trwały zapis w localStorage.
  4. Kliknij „Anuluj” po wprowadzeniu zmiany w innym polu (np. „Błędna odpowiedź”) bez klikania „Zapisz komunikaty”.
    - expect: Zmiana nie jest zapisana — po ponownym otwarciu modalu pole ma poprzednią wartość.

#### 2.4. Wyłączenie automatycznego przejścia (0 sekund) blokuje auto-advance po odpowiedzi

**File:** `tests/sound-settings.spec.ts`

**Steps:**
  1. Otwórz modal „Komunikaty”, ustaw „Automatyczne przejście (sekundy)” na 0 i zapisz.
    - expect: Ustawienie zostaje zapisane.
  2. Rozpocznij dowolny test z pytaniem typu wybór i udziel odpowiedzi, klikając „Sprawdź odpowiedź”.
    - expect: Po sprawdzeniu odpowiedzi NIE pojawia się licznik/countdown „Następne pytanie za X s” — przejście do kolejnego pytania wymaga ręcznego kliknięcia przycisku „Następne pytanie”.

#### 2.5. Włączenie licznika czasu na pytanie powoduje automatyczne oznaczenie jako błędne po upływie czasu

**File:** `tests/sound-settings.spec.ts`

**Steps:**
  1. Otwórz modal „Komunikaty”, ustaw „Czas na pytanie (sekundy)” na małą wartość (np. 3) i zapisz.
    - expect: Ustawienie zostaje zapisane.
  2. Rozpocznij dowolny test i na pierwszym pytaniu nie udzielaj odpowiedzi — poczekaj, aż widoczny licznik czasu dobiegnie do zera.
    - expect: Widoczny jest wizualny licznik/pasek czasu odliczający w dół.
    - expect: Po upływie ustawionego czasu pytanie jest automatycznie oznaczone jako błędne (bez interakcji użytkownika) i aplikacja przechodzi dalej lub pokazuje informację o błędnej odpowiedzi.
  3. Po teście przywróć „Czas na pytanie” do 0, aby nie wpływać na kolejne testy.
    - expect: Licznik czasu jest wyłączony dla kolejnych testów.

#### 2.6. Test głosu lektora („Przetestuj głos”) nie powoduje błędu

**File:** `tests/sound-settings.spec.ts`

**Steps:**
  1. Otwórz modal „Komunikaty”, wybierz inną opcję w comboboxie „Głos lektora” (jeśli dostępna) i kliknij „🔊 Przetestuj głos”.
    - expect: Aplikacja nie zgłasza błędu w konsoli/nie przerywa działania; przycisk pozostaje klikalny (dopuszczalne jest, że w środowisku testowym brak faktycznego dźwięku).

### 3. Motyw aplikacji

**Seed:** `seed.spec.ts`

#### 3.1. Zmiana motywu aplikacji i trwałość po odświeżeniu

**File:** `tests/theme-switch.spec.ts`

**Steps:**
  1. Kliknij przycisk „Motyw” w topbarze.
    - expect: Rozwija się panel z pięcioma kafelkami motywów: Las (domyślny, aktywny), Ocean, Zachód słońca, Lawenda, Noc.
  2. Kliknij kafelek „Motyw: Ocean”.
    - expect: Panel motywu zamyka się (lub kafelek Ocean staje się aktywny), a elementy strony (np. tło, kolor akcentu) zmieniają wygląd — klasa „theme-ocean” zostaje dodana do <body>.
  3. Odśwież stronę (reload).
    - expect: Motyw Ocean pozostaje zastosowany po odświeżeniu (odczytany z localStorage), a kafelek „Motyw: Ocean” jest oznaczony jako aktywny po ponownym otwarciu panelu motywu.
  4. Wybierz motyw „Noc”, a następnie „Las”, aby przywrócić domyślny motyw.
    - expect: Każda zmiana motywu natychmiast aktualizuje wygląd strony; wybór „Las” usuwa niestandardową klasę motywu z <body> (powrót do stylu domyślnego).

#### 3.2. Kliknięcie poza panelem motywu zamyka panel bez zmiany motywu

**File:** `tests/theme-switch.spec.ts`

**Steps:**
  1. Otwórz panel „Motyw”, a następnie kliknij gdziekolwiek poza panelem (np. na treść strony), nie wybierając żadnego kafelka.
    - expect: Panel motywu zamyka się.
    - expect: Aktualnie zastosowany motyw pozostaje niezmieniony.

### 4. Słówko dnia

**Seed:** `seed.spec.ts`

#### 4.1. Widget „Słówko dnia” wyświetla słowo, wymowę i tłumaczenie na stronie głównej

**File:** `tests/daily-word.spec.ts`

**Steps:**
  1. Przejdź na stronę główną (widok „Moje testy”).
    - expect: W górnej sekcji widoczny jest widget „Dzisiaj” z angielskim słowem (np. „thoughtful”), jego wymową w nawiasach ukośnych oraz polskim tłumaczeniem poniżej.

#### 4.2. Edycja listy słówek dnia przez ikonę koła zębatego

**File:** `tests/daily-word.spec.ts`

**Steps:**
  1. Kliknij ikonę koła zębatego (⚙) przy widgecie „Słówko dnia”.
    - expect: Otwiera się modal „Lista słówek” z instrukcją, polem tekstowym CSV (angielskie słowo, polskie tłumaczenie w każdym wierszu) wypełnionym domyślną listą, oraz przyciskami „Przywróć domyślne”, „Anuluj”, „Zapisz listę”.
  2. Zamień treść pola CSV na jedną własną linię, np. „banana, banan” i kliknij „Zapisz listę”.
    - expect: Modal zamyka się bez błędu, a lista słówek zostaje zapisana.
  3. Odśwież stronę.
    - expect: Widget „Dzisiaj” pokazuje słowo z zapisanej niestandardowej listy (np. „banana” / „banan”), potwierdzając trwały zapis.
  4. Otwórz modal ponownie i kliknij „Przywróć domyślne”, a następnie „Zapisz listę”.
    - expect: Lista wraca do oryginalnego zestawu domyślnych słówek (curious, brave, cheerful, itd.).

#### 4.3. Zapis pustej listy słówek dnia jest obsłużony bez awarii

**File:** `tests/daily-word.spec.ts`

**Steps:**
  1. Otwórz modal „Lista słówek”, wyczyść całe pole CSV i kliknij „Zapisz listę”.
    - expect: Aplikacja nie zawiesza się; wyświetla walidację/komunikat o wymaganej niepustej liście LUB zapisuje puste ustawienie i widget „Dzisiaj” degraduje się w sposób kontrolowany (np. pokazuje komunikat braku słowa) — zanotuj rzeczywiste zachowanie.
  2. Kliknij „Przywróć domyślne” i zapisz, aby odtworzyć stan wyjściowy dla kolejnych testów.
    - expect: Domyślna lista słówek jest ponownie aktywna.

### 5. Generator odmiany czasowników (kreator CSV)

**Seed:** `seed.spec.ts`

#### 5.1. Generowanie pytań typu „Uzupełnij zdanie” dla jednego czasownika i jednego czasu

**File:** `tests/verb-generator.spec.ts`

**Steps:**
  1. W kreatorze testu („Stwórz test”) kliknij przycisk „🧩 Generator odmiany”.
    - expect: Otwiera się modal „Odmiana czasownika” z checkboxami Czasu (Present Simple domyślnie zaznaczony, Past Simple), Formy zdania (Twierdzenie domyślnie zaznaczone, Pytanie), polem „Czasowniki”, checkboxami Podmiotów (I, You, He, She, We, They domyślnie zaznaczone; It odznaczony), i polem „Dodatkowe imiona”.
  2. Wpisz w pole „Czasowniki” jedną linię: „play, tennis on Sundays” i kliknij „Wygeneruj i wklej do CSV”.
    - expect: Modal zamyka się, a pole CSV kreatora zawiera 6 linii typu fill (jedna na każdy zaznaczony podmiot) w formacie „<Podmiot> ___ (play) tennis on Sundays., <forma>, fill”, z poprawną odmianą (play/plays).
  3. Kliknij „Wczytaj pytania”.
    - expect: 6 kart pytań typu „Uzupełnij zdanie” zostaje dodanych do edytora, każda z odpowiednią odmianą czasownika dla danego podmiotu (np. „He ___ (play) tennis on Sundays.” → plays).

#### 5.2. Generowanie z wieloma czasami i formami zdania (kombinacje) oraz nieregularny czasownik

**File:** `tests/verb-generator.spec.ts`

**Steps:**
  1. Otwórz „Generator odmiany”, zaznacz oba czasy (Present Simple i Past Simple) oraz obie formy zdania (Twierdzenie i Pytanie), wpisz czasownik nieregularny, np. „go, to school by bus”, i ogranicz podmioty do „I” i „She”.
    - expect: Formularz akceptuje wielokrotny wybór bez błędów.
  2. Kliknij „Wygeneruj i wklej do CSV”.
    - expect: Pole CSV zawiera pytania pokrywające wszystkie kombinacje czasu × formy zdania × podmiotu (dla 2 podmiotów, 2 czasów, 2 form = 8 linii), z poprawną nieregularną odmianą „go” → „goes”/„went” zaczerpniętą ze słownika.
  3. Zmień jedną linię w polu CSV, dodając własną formę po znaku „=” (np. „go=went” zgodnie z podpowiedzią w modalu), aby nadpisać automatyczną odmianę.
    - expect: Po wczytaniu pytań karta z nadpisaną formą używa wartości podanej przez użytkownika, a nie automatycznej.

#### 5.3. Generator z pustym polem czasowników nie generuje pytań

**File:** `tests/verb-generator.spec.ts`

**Steps:**
  1. Otwórz „Generator odmiany”, pozostaw pole „Czasowniki” puste i kliknij „Wygeneruj i wklej do CSV”.
    - expect: Aplikacja nie zawiesza się; nie dodaje żadnych nowych linii do pola CSV lub wyświetla komunikat informujący o braku czasowników do przetworzenia.

### 6. Rozgrywka — funkcje pomocnicze i nawigacja

**Seed:** `seed.spec.ts`

#### 6.1. Nawigacja „Poprzednie pytanie” zachowuje udzieloną odpowiedź i stan sprawdzenia

**File:** `tests/quiz-navigation.spec.ts`

**Steps:**
  1. Rozpocznij test z co najmniej dwoma pytaniami typu wybór (np. „Everyday English”).
    - expect: Wyświetla się pytanie 1/N z przyciskiem „← Poprzednie pytanie” wyłączonym (disabled).
  2. Wybierz błędną odpowiedź na pytaniu 1 i kliknij „Sprawdź odpowiedź”.
    - expect: Widoczny jest status „Wrong answer”/„Correct answer” oraz poprawna odpowiedź; wszystkie przyciski odpowiedzi są zablokowane (disabled).
  3. Kliknij „Następne pytanie” lub poczekaj na auto-advance, aby przejść do pytania 2, następnie kliknij „← Poprzednie pytanie”.
    - expect: Aplikacja wraca do pytania 1, pokazując dokładnie ten sam wybrany wariant odpowiedzi (podświetlony), status sprawdzenia (Wrong/Correct answer) oraz poprawną odpowiedź — bez możliwości ponownej zmiany odpowiedzi (przyciski odpowiedzi pozostają disabled).
  4. Z pytania 1 ponownie przejdź „Następne pytanie” do pytania 2.
    - expect: Pytanie 2 nie jest jeszcze odpowiedziane — przyciski odpowiedzi są aktywne, a „Sprawdź odpowiedź” jest disabled do momentu wyboru.

#### 6.2. Przedwczesne zakończenie testu przyciskiem „×” (Zakończ test) wraca do biblioteki bez ekranu wyniku

**File:** `tests/quiz-navigation.spec.ts`

**Steps:**
  1. Rozpocznij dowolny test wieloetapowy i odpowiedz na pierwsze pytanie.
    - expect: Test przechodzi do pytania 2.
  2. Kliknij przycisk „×” (Zakończ test) w nagłówku odtwarzacza pytań.
    - expect: Aplikacja natychmiast wraca do widoku biblioteki testów („Moje testy”), pomijając ekran wyniku.
  3. Rozpocznij ten sam test ponownie od początku.
    - expect: Test zaczyna się od pytania 1 (brak zapisanego stanu przerwanego podejścia), potwierdzając że przedwczesne zakończenie nie zapisuje częściowego wyniku.

#### 6.3. Ekran wyników pokazuje poprawny procent, podsumowanie i listę pytań

**File:** `tests/quiz-results.spec.ts`

**Steps:**
  1. Rozpocznij test 6-pytaniowy „Everyday English” i odpowiedz na wszystkie pytania: udziel jednej błędnej odpowiedzi (na pytaniu 1) i pięciu poprawnych.
    - expect: Po ostatnim pytaniu aplikacja przechodzi do ekranu wyniku „Świetna robota!” (lub odpowiednika przy niższym wyniku).
  2. Sprawdź nagłówek wyniku procentowego oraz trzy karty statystyk.
    - expect: Wynik procentowy odpowiada 5/6 ≈ 83%.
    - expect: Karta „Poprawne” pokazuje 5, karta „Do powtórki” pokazuje 1, karta „Łącznie” pokazuje 6.
  3. Przejrzyj sekcję „Każde pytanie” w podsumowaniu.
    - expect: Lista zawiera 6 wpisów w oryginalnym porządku pytań, każdy oznaczony ikoną ✓ (poprawne) lub × (błędne), z tekstem pytania, udzieloną odpowiedzią i poprawną odpowiedzią widoczną dla błędnych wpisów.
  4. Zweryfikuj obecność przycisków akcji na dole ekranu wyniku.
    - expect: Widoczne są przyciski „↺ Powtórz N błędne pytanie/pytania”, „↻ Spróbuj ponownie” i „Wróć do testów →”.

#### 6.4. Przycisk „Powtórz błędne pytania” rozpoczyna nowe podejście tylko z pytaniami odpowiedzianymi niepoprawnie

**File:** `tests/quiz-results.spec.ts`

**Steps:**
  1. Zakończ test „Everyday English” z co najmniej jedną błędną odpowiedzią (jak w poprzednim scenariuszu), aby dotrzeć do ekranu wyniku z przyciskiem „↺ Powtórz 1 błędne pytanie”.
    - expect: Przycisk „Powtórz” pokazuje liczbę błędnych pytań zgodną z wynikiem (np. „1”).
  2. Kliknij „↺ Powtórz 1 błędne pytanie”.
    - expect: Rozpoczyna się nowe podejście zawierające WYŁĄCZNIE pytania odpowiedziane niepoprawnie w poprzednim podejściu (licznik pytań pokazuje „1 / 1” w tym przypadku), a nie cały pierwotny test.
  3. Odpowiedz poprawnie na powtórzone pytanie i dokończ mini-podejście.
    - expect: Ekran wyniku pokazuje 100% dla tego skróconego podejścia.

#### 6.5. Przycisk „Spróbuj ponownie” restartuje cały test od pytania 1

**File:** `tests/quiz-results.spec.ts`

**Steps:**
  1. Zakończ dowolny test i dotrzyj do ekranu wyniku.
    - expect: Ekran wyniku jest widoczny z przyciskiem „↻ Spróbuj ponownie”.
  2. Kliknij „↻ Spróbuj ponownie”.
    - expect: Test zaczyna się od nowa od pytania 1, zawierając WSZYSTKIE oryginalne pytania testu (licznik pytań pokazuje „1 / N” z pełnym N, nie tylko błędne).

#### 6.6. Test z błędnymi odpowiedziami z poprzedniego podejścia jest oznaczony jako „trudny” na liście testów

**File:** `tests/quiz-results.spec.ts`

**Steps:**
  1. Zakończ test z co najmniej jedną błędną odpowiedzią i wróć do biblioteki testów (przycisk „Wróć do testów”).
    - expect: Powrót do widoku biblioteki testów.
  2. Sprawdź kartę tego testu na liście.
    - expect: Karta testu pokazuje odznakę „⚡ N trudne”/podobną, sygnalizującą pytania sprawiające trudność (spaced repetition), gdzie N odpowiada liczbie błędnych pytań z ostatniego podejścia.

### 7. Krzyżówka — funkcja odkrywania litery

**Seed:** `seed.spec.ts`

#### 7.1. Przycisk „Odkryj literę” (?) wypełnia poprawną literę i blokuje pole

**File:** `tests/crossword-reveal-letter.spec.ts`

**Steps:**
  1. Utwórz (lub użyj istniejącego z importu CSV) test z jednym pytaniem typu „Krzyżówka” zawierającym co najmniej 2 hasła, i rozpocznij ten test.
    - expect: Krzyżówka renderuje się z siatką komórek, każda z niewypełnionym polem input i przyciskiem „?” (aria-label „Odkryj literę”) w rogu.
  2. Kliknij przycisk „?” na jednej z komórek krzyżówki, bez wcześniejszego wpisywania litery.
    - expect: Pole input tej komórki wypełnia się poprawną literą rozwiązania.
    - expect: Przycisk „?” dla tej komórki staje się disabled (nie można odkryć jej ponownie).
  3. Odkryj litery dla wszystkich pozostałych komórek za pomocą przycisku „?”, aż cała krzyżówka będzie wypełniona.
    - expect: Przycisk „Sprawdź odpowiedź” staje się aktywny (nie disabled), ponieważ wszystkie komórki mają wartość.
  4. Kliknij „Sprawdź odpowiedź”.
    - expect: Wynik pytania jest oznaczony jako poprawny (100%), ponieważ wszystkie odkryte litery pochodzą z prawidłowego rozwiązania.

#### 7.2. Odkryta litera nie może być nadpisana błędną wartością

**File:** `tests/crossword-reveal-letter.spec.ts`

**Steps:**
  1. Rozpocznij test z pytaniem typu „Krzyżówka” i kliknij „?” na jednej komórce, aby odkryć jej literę.
    - expect: Komórka jest wypełniona poprawną literą, a pole input tej komórki jest disabled (zgodnie z zachowaniem odkrytych/zablokowanych pól).
  2. Spróbuj kliknąć na zablokowane pole input odkrytej komórki i wpisać inną literę.
    - expect: Nie da się zmienić wartości zablokowanej komórki — pole ignoruje próbę edycji, wartość pozostaje niezmieniona.

### 8. Walidacja formularza kreatora testu

**Seed:** `seed.spec.ts`

#### 8.1. Zapis testu z pustą nazwą testu jest blokowany przez walidację

**File:** `tests/create-quiz-validation.spec.ts`

**Steps:**
  1. Przejdź do „Stwórz test”, pozostaw pole „Nazwa testu” puste, wypełnij treść i odpowiedzi domyślnego pytania 1 typu wybór, i kliknij „Zapisz test →”.
    - expect: Formularz nie zostaje zapisany — przeglądarka podświetla/fokusuje pole „Nazwa testu” z komunikatem walidacji (pole wymagane), a użytkownik pozostaje w widoku kreatora.
  2. Sprawdź listę testów w bibliotece (np. otwierając ją w nowej karcie lub po nawigacji), aby upewnić się, że niekompletny test nie został zapisany.
    - expect: Żaden nowy test o pustej/niekompletnej nazwie nie pojawia się w bibliotece.

#### 8.2. Zapis testu z wypełnioną nazwą, ale bez treści pytania jest blokowany

**File:** `tests/create-quiz-validation.spec.ts`

**Steps:**
  1. Przejdź do „Stwórz test”, wpisz nazwę testu (np. „Test Walidacji”), pozostaw pole treści pytania 1 puste (oraz odpowiedzi domyślnego pytania), i kliknij „Zapisz test →”.
    - expect: Formularz nie zostaje zapisany — pole „Wpisz treść pytania…” jest podświetlone/zfokusowane jako wymagane, komunikat walidacji jest widoczny.
  2. Wypełnij treść pytania oraz przynajmniej dwie odpowiedzi (jedną oznaczoną jako poprawną), a resztę pól odpowiedzi pozostaw puste, i ponów zapis.
    - expect: Zależnie od implementacji: albo zapis się powiedzie z pominięciem puste odpowiedzi, albo pojawi się dalsza walidacja pól odpowiedzi — zanotuj rzeczywiste zachowanie i potwierdź, że aplikacja nie zapisuje pytania bez żadnej zaznaczonej poprawnej odpowiedzi.

#### 8.3. Usunięcie wszystkich pytań i próba zapisu testu bez żadnego pytania

**File:** `tests/create-quiz-validation.spec.ts`

**Steps:**
  1. Przejdź do „Stwórz test”, wypełnij nazwę testu, a następnie kliknij „Usuń” na obu domyślnych kartach pytań, aby usunąć wszystkie pytania.
    - expect: Kreator pozwala usunąć wszystkie karty pytań (lub blokuje usunięcie ostatniej — zanotuj rzeczywiste zachowanie).
  2. Jeśli usunięcie wszystkich pytań było możliwe, kliknij „Zapisz test →”.
    - expect: Aplikacja nie zapisuje testu bez żadnego pytania — wyświetla komunikat/alert informujący o konieczności dodania co najmniej jednego pytania, i pozostaje w widoku kreatora.
