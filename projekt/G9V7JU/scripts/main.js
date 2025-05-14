//ha minedn betoltott, akkor kezd el futni
window.onload = function() {
    //lekerjuk az elemeket
    const startButton = document.querySelector(".start-btn"); //class
    const mainMenu = document.getElementById("main-menu");
    const gameArea = document.getElementById("gamearea");

    //konnyu mod infok      a localStorage ugye kulcs ertek parokban tarol, ha nincs olyan null-t ad vissza
    const easyTime = localStorage.getItem("bestTime_easy") || "-"; //kivesszuk a legjobb idot vagy - legyen helyette
    const easyPlayer = localStorage.getItem("bestPlayer_easy") || "-"; //kivesszuk a legjobb jatekost vagy - legyen helyette
    document.getElementById("easy-best-time").textContent = easyTime; //beallitjuk a megfelelo helyeken a szovegeket
    document.getElementById("easy-best-player").textContent = easyPlayer;

    //nehez mod infok
    const hardTime = localStorage.getItem("bestTime_hard") || "-";
    const hardPlayer = localStorage.getItem("bestPlayer_hard") || "-";
    document.getElementById("hard-best-time").textContent = hardTime;
    document.getElementById("hard-best-player").textContent = hardPlayer;

    //sugo
    //lekerjuk az elemeket
    const modal = document.getElementById("helpModal");
    const btn = document.querySelector(".help-btn");
    const closeBtn = document.querySelector(".close-button");

    //ha ranyomunk a gombra jelenjen meg
    btn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    //ha bezarasra nyomunk tuntesse el
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
};

//nehezseg mentese
function saveDifficulty() {
    const difficulty = document.getElementById("difficulty").value; //elkeri a valasztott nehezseget
    localStorage.setItem("difficulty", difficulty); //lS-ben beallitja
}

function clearLocalData() {
    localStorage.clear(); //ha torolni szeretnenk a mentett dolgokat

    //kiirasok frissitese
    document.getElementById("easy-best-time").textContent = "-";
    document.getElementById("easy-best-player").textContent = "-";
    document.getElementById("hard-best-time").textContent = "-";
    document.getElementById("hard-best-player").textContent = "-";
}