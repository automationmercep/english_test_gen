### 1. Obrazek przypisany do pojedynczego pytania
**Seed:** `seed.spec.ts`

#### 1.1 Obrazek nie przechodzi do kolejnych pytań
**Steps:**
1. Utwórz test z dwoma pytaniami i wyłącz losowanie kolejności pytań.
2. Ustaw obrazek testu oraz ten sam obrazek tylko w pierwszym pytaniu.
3. Zapisz i rozpocznij test.
4. Pomiń pierwsze pytanie, aby przejść do drugiego.

**Expected:**
- W pierwszym pytaniu wyświetla się przypisany do niego obrazek.
- W drugim pytaniu, które nie ma własnego obrazka, obrazek nie jest widoczny.
- Drugie pytanie nie korzysta z układu przeznaczonego dla pytań obrazkowych.
