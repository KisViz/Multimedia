# Jégtörő

#### Statikus grafikus elemek
- A játékterület (#gamearea) és a víz (.water).
- A háttér.
- A hajó képe (icebreaker.png) (bár mozgatható, de a kinézete nem változik).

#### Dinamikus grafikus elemek (legalább 2db)
- A jégtáblák (.ice) dinamikusan változnak, amikor a hajó rájuk lép.
- A hajó pozíciója animációval változik a felhasználói input alapján.

#### Időzítés
- Minden kitörött jég plusz időt ad a visszaszámlálóhoz a nehézségtől függően.

#### Animáció
- Hajó mozgása.

#### Hangeffektus
- Jég eltörésekor "crack" hang.

#### Felhasználói interakció (legalább 2db)
- Nyílbillentyűk használata a hajó mozgatásához (billentyűlenyomás esemény).
- Egérrel történő nehézség választás.

#### Adatbeviteli lehetőség és tárolás a program futtatásai között
- Helyi tárolás (localStorage) használata:
  - Legjobb pontszám mentése
  - Felhasználónév rögzítése

#### A bevitt adatok lekérdezése, megtekintési lehetőség a programból
- Legjobb pontszám és utolsó játékosnév megjelenítése az oldalon vagy egy külön menüpontban.

#### Valamilyen konfigurációs beállítási lehetőség a programból vezérelve
- Játék nehézségi szint beállítása:
    - Könnyű: több jégtábla és több plusz idő
    - Nehéz: kevesebb jégtábla és kevesebb plusz idő

#### Súgó, tipp lehetőség
- A ? ikonra vagy gombra kattintva megjelenő súgó:
  - Játék célja
  - Irányítás: nyílbillentyűk
  - Visszaszámlálóhoz adott idő leírása

#### A készítő nevének és neptun kódjának elhelyezése könnyen megtalálható helyen