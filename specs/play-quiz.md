### 1. Rozwiązywanie testu
**Seed:** `seed.spec.ts`

#### 1.1 Rozwiązanie testu "Everyday English" i sprawdzenie wyników
**Steps:**
1. Na stronie głównej kliknij kartę testu "Everyday English"
2. Zaznacz jakąkolwiek odpowiedź w pierwszym pytaniu (typu Test wyboru)
3. Kliknij przycisk "Sprawdź odpowiedź"
4. Kliknij przycisk "Następne pytanie" (lub odpowiednik) i odpowiedz analogicznie na kolejne pytania, aż do końca testu
5. Zaobserwuj ekran wyników

**Expected:**
- Po zaznaczeniu odpowiedzi przycisk "Sprawdź odpowiedź" staje się aktywny
- Po sprawdzeniu odpowiedzi widoczna jest informacja zwrotna (poprawna/błędna)
- Po ostatnim pytaniu wyświetla się widok wyników z elementem wyniku procentowego (#scorePercent) oraz liczbą poprawnych/łącznych odpowiedzi

#### 1.2 Animowane wejście pytania
**Steps:**
1. Na stronie głównej rozpocznij test "Everyday English"
2. Obserwuj pojawienie się etykiety, treści pytania i odpowiedzi
3. Sprawdź pierwszą odpowiedź i przejdź do następnego pytania
4. Powtórz kontrolę przy mobilnym rozmiarze ekranu
5. Włącz systemową preferencję ograniczenia ruchu i ponownie rozpocznij test

**Expected:**
- Etykieta, treść i odpowiedzi otrzymują krótką animację wejścia, a odpowiedzi mają rosnące opóźnienia tworzące efekt kaskady
- Animacja uruchamia się ponownie po przejściu do następnego pytania i działa w układzie mobilnym
- Przy preferencji `prefers-reduced-motion: reduce` animacja wejścia jest wyłączona
