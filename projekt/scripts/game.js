const gameArea = document.getElementById('gamearea');
const ship = document.getElementById('ship');
const gridSize = 10;
const tileSize = 60;
let shipX = 0, shipY = 0;
let remainingIce = 0;
let timer = 10;
let countdown;
const difficulty = localStorage.getItem("difficulty") || "easy";

// Timer elem létrehozása
const timerDisplay = document.createElement("div");
timerDisplay.id = "timer";
timerDisplay.style.position = "absolute";
timerDisplay.style.top = "10px";
timerDisplay.style.right = "10px";
timerDisplay.style.color = "white";
timerDisplay.style.fontSize = "20px";
timerDisplay.style.fontWeight = "bold";
gameArea.appendChild(timerDisplay);

updateTimerDisplay();
startCountdown();
createIceBlocks(gridSize, difficulty);

function updateTimerDisplay() {
    timerDisplay.textContent = `⏱️ ${timer}s`;
}

function startCountdown() {
    countdown = setInterval(() => {
        timer--;
        updateTimerDisplay();
        if (timer <= 0) {
            endGame(false); // vesztett
        }
    }, 1000);
}

function addTimeByDifficulty() {
    timer += difficulty === "easy" ? 2 : 1;
    updateTimerDisplay();
}

function createIceBlocks(gridSize, difficulty) {
    const totalTiles = gridSize * gridSize;
    let iceCoverage = difficulty === "easy" ? 0.2 : 0.1;
    const numberOfIceTiles = Math.floor(totalTiles * iceCoverage);
    remainingIce = numberOfIceTiles;

    const tiles = [];
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (x !== 0 && y !== 0) {
                tiles.push({ x, y });
            }
        }
    }

    tiles.sort(() => 0.5 - Math.random());
    for (let i = 0; i < numberOfIceTiles; i++) {
        const tile = tiles[i];
        const ice = document.createElement("div");
        ice.classList.add("ice");
        ice.style.left = `${tile.x * tileSize}px`;
        ice.style.top = `${tile.y * tileSize}px`;
        gameArea.appendChild(ice);
    }
}

function moveShip(dx, dy) {
    const newX = shipX + dx;
    const newY = shipY + dy;
    const areaSize = gridSize * tileSize;

    if (newX >= 0 && newX < areaSize && newY >= 0 && newY < areaSize) {
        shipX = newX;
        shipY = newY;
        ship.style.left = `${shipX}px`;
        ship.style.top = `${shipY}px`;

        // Kis várakozás, hogy a vizuális mozgás megtörténjen
        setTimeout(() => {
            breakIceAt(shipX, shipY);
        }, 50);
    }
}

const iceBreakSound = new Audio("../assets/audio/breaking.mp3");
iceBreakSound.load(); // Előre betölti

function breakIceAt(x, y) {
    const iceBlocks = document.querySelectorAll('.ice');
    iceBlocks.forEach(block => {
        if (parseInt(block.style.left) === x && parseInt(block.style.top) === y) {
            block.remove();
            remainingIce--;
            addTimeByDifficulty();

            iceBreakSound.currentTime = 0; // Visszatekerés
            iceBreakSound.play(); // Lejátszás

            if (remainingIce <= 0) {
                endGame(true); // győzelem
            }
        }
    });
}



function endGame(won) {
    clearInterval(countdown);

    if (won) {
        const bestKey = `bestTime_${difficulty}`;
        const bestTime = parseInt(localStorage.getItem(bestKey) || "0");

        if (timer > bestTime) {
            const name = prompt("🎉 Új rekord! Írd be a neved:");
            localStorage.setItem(bestKey, timer.toString());
            localStorage.setItem(`bestPlayer_${difficulty}`, name || "Ismeretlen");
        }

        alert("Gratulálok! Minden jeget feltörtél! 🔨");
    } else {
        alert("⏱️ Lejárt az idő!");
    }

    window.location.href = "index.html";
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': moveShip(0, -tileSize); break;
        case 'ArrowDown': moveShip(0, tileSize); break;
        case 'ArrowLeft': moveShip(-tileSize, 0); break;
        case 'ArrowRight': moveShip(tileSize, 0); break;
    }
});
