# Scenariusz: Responsywność na telefonie i tablecie

Sprawdza, że aplikacja poprawnie wyświetla się i działa na małych ekranach
(telefon 390px oraz iPhone 15 Pro Max 430px, tablet ~768px), gdzie górna nawigacja `nav` jest ukrywana
przez media query `max-width: 800px`.

## Seed
seed.spec.ts (świeży stan, brak dodatkowej konfiguracji)

## Kontekst techniczny (z kodu)
- `@media (max-width: 800px)` ukrywa `nav` (`display: none`) — na telefonie/tablecie
  linki „Moje testy" / „Stwórz test" w pasku górnym są niewidoczne.
- Alternatywna droga do kreatora na małych ekranach: przycisk „Nowy test"
  w sekcji hero (`[data-view="create"]`, klasa `.button-outline`).
- `@media (max-width: 800px)` przełącza `.quiz-grid` na 2 kolumny, a
  `@media (max-width: 540px)` na 1 kolumnę.

## Warianty ekranów
- Telefon: 390 × 844 (iPhone-podobny)
- iPhone 15 Pro Max: 430 × 932
- Tablet: 768 × 1024 (iPad-podobny, dokładnie na granicy media query)

## Kroki i oczekiwania

1. Ustaw viewport telefonu (390×844) i otwórz stronę główną.
   - Oczekiwane: górna nawigacja `nav` jest ukryta (niewidoczna).
   - Oczekiwane: strona nie ma poziomego przewijania
     (`document.documentElement.scrollWidth <= window.innerWidth + 1`).
   - Oczekiwane: sekcja hero i przycisk „Nowy test" są widoczne.

2. Kliknij „Nowy test" (droga dostępna na mobile zamiast ukrytego nav).
   - Oczekiwane: widok kreatora (`#createView`) staje się aktywny.
   - Oczekiwane: nadal brak poziomego przewijania.
   - Oczekiwane: przycisk „Zapisz test" jest widoczny (nie ucięty poza ekran).

3. Wróć do biblioteki przyciskiem wstecz (`.back-button`).
   - Oczekiwane: widok główny (`#homeView`) znów aktywny.

4. Ustaw viewport tabletu (768×1024) i przeładuj.
   - Oczekiwane: nadal brak poziomego przewijania.
   - Oczekiwane: nav wciąż ukryta (768 ≤ 800), przycisk „Nowy test" widoczny.

5. Otwórz modal ustawień dźwięku (⚙ „Komunikaty") na tablecie.
   - Oczekiwane: modal `#soundMessagesModal` widoczny i mieści się w szerokości
     ekranu (prawa krawędź ≤ szerokość viewportu).

6. Na telefonie 375×812 otwórz modal „Lista słówek”.
   - Oczekiwane: wszystkie przyciski modalu mieszczą się w ekranie.
   - Oczekiwane: klawisz Tab zapętla fokus wewnątrz modalu.
   - Oczekiwane: Escape zamyka modal i przywraca fokus na przycisku, który go
     otworzył.

7. Na iPhonie 15 Pro Max (430×932) rozpocznij test i otwórz menu z górnego paska.
   - Oczekiwane: podczas testu dostępne są ustawienia motywu, dźwięku, muzyki
     i komunikatów.
   - Oczekiwane: można zmienić motyw, wyciszyć dźwięk i muzykę oraz otworzyć
     modal komunikatów bez opuszczania testu.
   - Oczekiwane: dolna nawigacja testu mieści się w ekranie i nie powoduje
     poziomego przewijania.
