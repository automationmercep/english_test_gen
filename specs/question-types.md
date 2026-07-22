### 1. Różne typy pytań w kreatorze
**Seed:** `seed.spec.ts`

#### 1.1 Utworzenie testu z pytaniami typu Uzupełnij zdanie, Uporządkuj i Fiszka
**Steps:**
1. Kliknij przycisk "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu "Test mieszanych typów" w pole "Nazwa testu"
3. W pierwszej karcie pytania kliknij przycisk typu "Uzupełnij zdanie", wpisz treść "I ___ tea every day." i poprawną odpowiedź "drink"
4. Kliknij "Dodaj kolejne pytanie", w nowej karcie wybierz typ "Uporządkuj", wpisz treść "Ułóż zdanie." i poprawne zdanie "I love learning English."
5. Kliknij "Dodaj kolejne pytanie", w nowej karcie wybierz typ "Fiszka", wpisz treść (awers) "brave" i odpowiedź (rewers) "odważny"
6. Usuń domyślne drugie pytanie utworzone automatycznie przy starcie kreatora (typu "Uzupełnij zdanie"), jeśli nadal jest puste
7. Kliknij przycisk "Zapisz test"

**Expected:**
- Po zapisaniu testu wyświetla się widok "Moje testy" z komunikatem "Test zapisany — możesz zaczynać!"
- Na liście testów widoczna jest karta z tytułem "Test mieszanych typów" i informacją o liczbie pytań (3 pytania)

#### 1.2 Pytanie wyboru z kilkoma poprawnymi odpowiedziami
**Steps:**
1. Kliknij przycisk "Stwórz test" w głównej nawigacji
2. Wpisz nazwę testu "Wielokrotny wybór" w pole "Nazwa testu"
3. W pierwszej karcie pytania (typ "Test wyboru") wpisz treść "Kolory flagi Polski?" oraz cztery odpowiedzi: "biały", "czerwony", "niebieski", "zielony"
4. Zaznacz checkboxy przy odpowiedziach "biały" i "czerwony" jako poprawne (odznacz domyślnie zaznaczoną odpowiedź A, jeśli inna niż te dwie)
5. Sprawdź licznik "Liczba prawidłowych odpowiedzi" w edytorze — powinien wskazywać 2
6. Usuń drugie domyślne pytanie, aby test zawierał tylko jedno pytanie
7. Kliknij przycisk "Zapisz test", a następnie rozpocznij zapisany test

**Expected:**
- Licznik w kreatorze pokazuje "2" prawidłowe odpowiedzi po zaznaczeniu dwóch checkboxów
- Po zapisaniu testu widoczna jest karta "Wielokrotny wybór" na liście testów
- Po rozpoczęciu testu podpowiedź pod pytaniem informuje "Zaznacz 2 prawidłowe odpowiedzi."
