//lekerjuk az elemeket
const gameArea = document.getElementById('gamearea'); //jatekterulet
const ship = document.getElementById('ship'); //hajo
const gridSize = 10; //racs merete
const tileSize = 60; //kocka merete
let shipX = 0, shipY = 0; //kezdeti hajo poz
let remainingIce = 0; //jeg szamlalo
let iceGrid = [];  //jegeket ebben taroljuk
let timer = 10; //idozito
let countdown; //majd az intervalnal kell
const difficulty = localStorage.getItem("difficulty"); //nehezseg lekerese
const timerDisplay = document.getElementById('timer') //idozito
const iceBreakSound = new Audio("../assets/audio/breaking.mp3"); //a toreshang
iceBreakSound.load(); //elore betoltve, hogy ne kelljen varni

//ha minden betoltott
window.onload = function () {
    //elinditjuk a jatekot
    updateTimerDisplay(); //eloszor is kiirja az idot
    createIceBlocks(gridSize, difficulty); //legeneralja a jegeket
    startCountdown(); //es elinditja az idot
}

//ido kiirasa - azert van kulon, mert gyakran modositgatjuk a hozzaadasnal is
function updateTimerDisplay() {
    timerDisplay.textContent = `${timer}s`; //sima kiiras
    //a kisebb az ido mint 5 akkor piros lesz
    if (timer <= 5) {
        timerDisplay.style.color = "red";
    } else {
        timerDisplay.style.color = "white"; //egyebkent az eredeti
    }
}

//visszaszamlalo, masodpercenkent csokkentjuk
function startCountdown() {
    countdown = setInterval(() => {
        timer--;
        updateTimerDisplay();
        if (timer <= 0) {
            endGame(false); //vesztett
        }
    }, 1000);
}

//ido hozzaadasa
function addTime() {
    timer += difficulty === "easy" ? 2 : 1; //attol fugg hogymenni, hogy milyen a nehezseg
    updateTimerDisplay(); //es frissitjuk is
}

//legeneralja a jegkockakat
function createIceBlocks(gridSize, difficulty) {
    const iceChance = difficulty === "easy" ? 0.2 : 0.1; //lekerjuk a nehezseget
    remainingIce = 0; //biztos ami biztos nullazzuk (pl ha visszalep kozben, akkor lhet bak)

    //vegig megyunk a tombon
    for (let y = 0; y < gridSize; y++) {
        iceGrid[y] = []; //ketdimenziossa teszzuk
        //halal hogy igy kell csinalni 2d arrayt
        for (let x = 0; x < gridSize; x++) {
            if (x === 0 && y === 0) { //kezdo pozicion tuti ne legyen
                iceGrid[y][x] = false;
                continue;
            }

            //eldontjuk, hogy legyen e jeg
            const isIce = Math.random() < iceChance;
            iceGrid[y][x] = isIce;
            if (isIce) { //ha legyen
                remainingIce++; //noveljuk a jegyek szamat
                const ice = document.createElement("div"); //csinalunk egy jeget
                ice.classList.add("ice"); //hozzaadjuk a jeg classkent (mint a div-ben a class="ice")
                ice.dataset.x = x;  //attributumakent elmentjuk a koordinatajat (mint a div-ben a data-x=x)
                ice.dataset.y = y;
                ice.style.left = `${x * tileSize}px`; //beallitjuk, hogy jo helyen legyen
                ice.style.top  = `${y * tileSize}px`;
                gameArea.appendChild(ice); //hozzaadjuk a terhez
            }
        }
    }
}


//hajo mozgas
function moveShip(dx, dy) {
    const newX = shipX + dx; //hozzaadjuk az uj xet
    const newY = shipY + dy;
    const areaSize = gridSize * tileSize; //ez maganak a jatekternek a merete

    //ellenorizzuk, hogy bent vagyunk e meg
    if (newX >= 0 && newX < areaSize && newY >= 0 && newY < areaSize) {
        //ha igen beallitjuk az uj ertekeket es a vizuakis stilust
        shipX = newX;
        shipY = newY;
        ship.style.left = `${shipX}px`;
        ship.style.top = `${shipY}px`;

        //varakozas, hogy a mozgas megtortenjen
        setTimeout(() => {
            breakIceAt(shipX, shipY);
        }, 50);
    }
}

//jeg torese
function breakIceAt(px, py) {
    //a kapott (hajo) poziciojat koordinatakra szedjuk
    const x = px / tileSize;
    const y = py / tileSize;

    //megnezzuk va e ott jeg
    if (iceGrid[y][x]) {
        iceGrid[y][x] = false; //ha van toroljuk
        remainingIce--; //kevesebb jeg lesz
        addTime(); //es hozzaadjuk az idot

        //kikeressuk a jegest:(
        const selector = `.ice[data-x="${x}"][data-y="${y}"]`;
        const block = gameArea.querySelector(selector);
        block.remove(); //es trorljuk

        iceBreakSound.currentTime = 0; //a hang eljere tekerunk, ha tobb is lenne gyorsan, akkor ne legyen csunya
        iceBreakSound.play(); //lejatszuk a hangot

        //ha elfogy a jeg nyertunk
        if (remainingIce <= 0) {
            endGame(true);
        }
    }
}

//nyeres kiiratas
function endGame(won) {
    clearInterval(countdown); //toroljuk a szamlalot

    if (won) { //ha nyert
        alert("Gratulálok! Minden jeget feltörtél!");

        const bestKey = `bestTime_${difficulty}`; //elkeszitjuk a kulcsot
        const bestTime = parseInt(localStorage.getItem(bestKey) || "0"); //es lekerjuk az alapjan az idot

        if (timer > bestTime) { //ha jobb
            const name = prompt("Új rekord! Írd be a neved:"); //elkerjuk a nvet
            localStorage.setItem(bestKey, timer.toString()); //letaroljuk az idot
            localStorage.setItem(`bestPlayer_${difficulty}`, name || "Ismeretlen"); //es a nevet, ha nincs akkor sem nullt
        }
    } else { //egyebkent meg lejart az ido
        alert("Lejárt az idő!");
    }

    window.location.href = "../../index.html"; //visszadob a kezdore
}

//billentyu kezeles
document.addEventListener('keydown', (e) => {
    if (e.repeat) return; //hogy ne lehessen nyomva tartani és mindig nyomni kelljen a lepeshez

    switch (e.key) {
        case 'ArrowUp': moveShip(0, -tileSize); break;
        case 'ArrowDown': moveShip(0, tileSize); break;
        case 'ArrowLeft': moveShip(-tileSize, 0); break;
        case 'ArrowRight': moveShip(tileSize, 0); break;
    }
});
