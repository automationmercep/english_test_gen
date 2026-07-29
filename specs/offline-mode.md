# Scenariusz: Działanie bez Firebase

Sprawdza, że opcjonalna synchronizacja nie jest wymagana do korzystania z
lokalnej aplikacji.

## Seed
seed.spec.ts (świeży stan, brak dodatkowej konfiguracji)

## Kroki i oczekiwania

1. Zablokuj wszystkie moduły ładowane z Firebase CDN i otwórz aplikację.
   - Oczekiwane: biblioteka oraz domyślne testy są widoczne.
   - Oczekiwane: przycisk „Nowy test” nadal otwiera kreator.
