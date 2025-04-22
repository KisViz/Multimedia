# Legyen Ön is milliomos

#### Statikus grafikus elemek
- A játék háttérképe
- A kérdésdoboz dizájnja

#### Dinamikus grafikus elemek (legalább 2db)
- Játékos pénzösszege: A képernyőn megjelenő összeg dinamikusan változik a kérdések szintjével.
- Időmérő: Az időt visszaszámolja a képernyőn a program.

#### Időzítés
- Visszaszámláló: Minden kérdéshez kap az játékos egy fix időt (pl. 30 másodperc), és ha lejár, automatikusan rossz válasznak számít.

#### Animáció
- Kérdés megjelenése: Az új kérdés "beúszik" az oldalra.
- Gombnyomás effekt: A válaszgombok méretváltoztatása (pl. transform: scale(0.95) CSS-tel).

#### Hangeffektus
- Háttérzene: A műsor jellegzetes aláfestő zenéje (pl. loopolt MP3).

#### Felhasználói interakció (legalább 2db)
- Válasz kiválasztása: Kattintás a gombokon.
- Billentyűzet támogatás: 1-4 gombokkal is lehessen választani.

#### Adatbeviteli lehetőség és tárolás a program futtatásai között
- Toplista mentése jsonbe.
- JSON-ból betöltött kérdések.

#### A bevitt adatok lekérdezése, megtekintési lehetőség a programból
- Toplista: Egy külön oldal vagy felugró ablak, ahol látszik a legjobb 10 játékos.

#### Valamilyen konfigurációs beállítási lehetőség a programból vezérelve
- Hang be/ki.

#### Súgó, tipp lehetőség
- 50/50 segéd: A felhasználónak a kérdés megjelenése után (például egy meghatározott billentyű lenyomásával) lehetőséget kell adni arra, hogy két hibás opciót eltávolítson. Fontos, hogy a maradék opciók között továbbra is benne legyen a helyes válasz.
- Telefonos segéd: Ebben a segítségben a program „felhív egy szakértőt”. A megoldás lehet úgy, hogy a program véletlenszerűen ad visszajelzést, például: „A szakértő szerint a válasz A lehet a legvalószínűbb.” Az adott válasz 80%-ban helyes, a maradék 20%-ban a rossz válaszok között véletlenszerűt sorsoljunk!

A készítő nevének és neptun kódjának elhelyezése könnyen megtalálható helyen