# Scenariusz: Dostępność kluczowych interakcji

Sprawdza semantykę kart testów oraz trwałe etykiety pól kreatora.

## Seed
seed.spec.ts (świeży stan, brak dodatkowej konfiguracji)

## Kroki i oczekiwania

1. Otwórz bibliotekę testów.
   - Oczekiwane: karta testu jest kontenerem, a rozpoczęcie, edycja, drukowanie
     i usuwanie są osobnymi przyciskami — żaden przycisk nie zawiera innego
     elementu interaktywnego.
   - Oczekiwane: przycisk „Rozpocznij test …” działa z klawiatury.

2. Otwórz kreator testu.
   - Oczekiwane: pole wyszukiwania zdjęcia ma etykietę „Szukaj zdjęcia”.
   - Oczekiwane: każde domyślne pytanie ma własne pole z etykietą „Szukaj zdjęcia do pytania”.
   - Oczekiwane: pole importu ma etykietę „Pytania w formacie CSV”, niezależną
     od przykładu umieszczonego w placeholderze.
