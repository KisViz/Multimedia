document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector(".start-btn");
    const mainMenu = document.getElementById("main-menu");
    const gameArea = document.getElementById("gamearea");

    startButton.addEventListener("click", () => {
        mainMenu.style.display = "none";
        gameArea.style.display = "block";
        window.location.href = "game.html";
    });

    // Easy mód
    const easyTime = localStorage.getItem("bestTime_easy") || "-";
    const easyPlayer = localStorage.getItem("bestPlayer_easy") || "-";
    document.getElementById("easy-best-time").textContent = easyTime;
    document.getElementById("easy-best-player").textContent = easyPlayer;

    // Hard mód
    const hardTime = localStorage.getItem("bestTime_hard") || "-";
    const hardPlayer = localStorage.getItem("bestPlayer_hard") || "-";
    document.getElementById("hard-best-time").textContent = hardTime;
    document.getElementById("hard-best-player").textContent = hardPlayer;

    const modal = document.getElementById("helpModal");
    const btn = document.querySelector(".help-btn");
    const closeBtn = document.querySelector(".close-button");

    btn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

});

function saveDifficulty() {
    const difficulty = document.getElementById("difficulty").value;
    localStorage.setItem("difficulty", difficulty);
}
