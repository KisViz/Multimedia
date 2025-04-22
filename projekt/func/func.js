$(document).ready(function() {
    console.log("DOM betöltődött, elemk keresése...");

    // Játékállapot
    const gameState = {
        currentQuestionIndex: 0,
        score: 0,
        timeLeft: 30,
        timerInterval: null,
        lifelines: {
            fiftyFifty: true,
            phoneAFriend: true
        },
        soundOn: true,
        questions: [],
        shuffledQuestions: [],
        moneyLadder: [
            1000000, 500000, 250000, 125000, 64000,
            32000, 16000, 8000, 4000, 2000,
            1000, 500, 300, 200, 100
        ].reverse(),
        creatorName: "Kovács János", // Szerző neve
        neptunCode: "ABC123" // Neptun kód
    };

    // Elemek kiválasztása
    const elements = {
        mainMenu: $('#main-menu'),
        gameScreen: $('#game-screen'),
        startGameBtn: $('#start-game'),
        showLeaderboardBtn: $('#show-leaderboard'),
        settingsBtn: $('#settings-btn'),
        leaderboardModal: $('#leaderboard-modal'),
        leaderboardContent: $('#leaderboard-content'),
        closeModal: $('.close'),
        creatorName: $('#creator-name'),
        neptunCode: $('#neptun-code'),

        questionText: $('#question-text'),
        answerButtons: $('.answer-btn'),
        timer: $('#timer'),
        moneyLadder: $('#money-ladder'),
        fiftyFiftyBtn: $('#fifty-fifty'),
        phoneAFriendBtn: $('#phone-a-friend'),
        soundToggleBtn: $('#sound-toggle'),
        backgroundMusic: $('#background-music')[0],
        questionBox: $('#question-box')
    };

    console.log("questionBox elem:", elements.questionBox);
    console.log("questionBox hossz:", elements.questionBox.length);

    if (elements.questionBox.length === 0) {
        console.error("A questionBox elem tényleg nem található a DOM-ban!");
        // return;
    }

    // Inicializálás
    initGame();

    function initGame() {
        // Szerző adatok beállítása
        elements.creatorName.text(gameState.creatorName);
        elements.neptunCode.text(gameState.neptunCode);

        // Eseményfigyelők beállítása
        setupEventListeners();

        // Hang beállítása
        if (gameState.soundOn) {
            elements.backgroundMusic.play().catch(e => console.log("Autoplay prevented"));
        }
    }

    async function loadQuestions() {
        try {
            console.log("Kérdések betöltésének kezdése...");
            const response = await fetch('../data/kviz.json'); // Próbáld ki a különböző elérési utakat

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP hiba! Állapot: ${response.status}, Szöveg: ${errorText}`);
            }

            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Érvénytelen kérdéslista formátum vagy üres lista");
            }

            gameState.questions = data;
            gameState.shuffledQuestions = [...data];
            shuffleArray(gameState.shuffledQuestions);

            console.log("Sikeresen betöltve:", data.length, "kérdés");
            showQuestion();
        } catch (error) {
            console.error("Kritikus hiba:", error);
            // Vészhelyzeti kérdések
            gameState.questions = [{
                "question": "Melyik évben ért véget a második világháború?",
                "answers": {"A": "1943", "B": "1945", "C": "1947", "D": "1950"},
                "correct": "B"
            }];
            gameState.shuffledQuestions = [...gameState.questions];
            showQuestion();
        }
    }

    // Segédfüggvény a tömb keveréséhez (Fisher-Yates algoritmus)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function showQuestion() {
        console.log("Kérdés megjelenítése...");

        // 1. DOM elemek ellenőrzése
        if (!elements.questionBox || elements.questionBox.length === 0) {
            console.error("questionBox elem nem található");
            return;
        }
        if (!elements.questionText || elements.questionText.length === 0) {
            console.error("questionText elem nem található");
            return;
        }

        // 2. Időzítő alaphelyzetbe állítása
        resetTimer();

        // 3. Aktuális kérdés betöltése
        const currentQuestion = gameState.shuffledQuestions[gameState.currentQuestionIndex];
        if (!currentQuestion) {
            console.error("Nincs aktuális kérdés:", gameState.currentQuestionIndex);
            return;
        }

        // 4. Kérdés szövegének beállítása
        elements.questionText.text(currentQuestion.question || "Nincs kérdés szöveg");
        console.log("Kérdés szöveg beállítva:", currentQuestion.question);

        // 5. Válaszlehetőségek feltöltése
        elements.answerButtons.each(function() {
            const option = $(this).data('option');
            const answerText = currentQuestion.answers[option] || "Nincs válasz szöveg";
            $(this).text(`${option}: ${answerText}`);
            $(this).show().removeClass('correct wrong disabled');
            console.log(`Válasz opció ${option} beállítva:`, answerText);
        });

        // 6. Animáció kezelése
        elements.questionBox.hide().removeClass('slide-in');
        setTimeout(() => {
            elements.questionBox.show().addClass('slide-in');
        }, 100);

        // 7. Időzítő indítása
        startTimer();

        console.log("Kérdés megjelenítve");
    }

    function resetTimer() {
        clearInterval(gameState.timerInterval);
        gameState.timeLeft = 30;
        elements.timer.text(gameState.timeLeft);
    }

    function startTimer() {
        gameState.timerInterval = setInterval(() => {
            gameState.timeLeft--;
            elements.timer.text(gameState.timeLeft);

            if (gameState.timeLeft <= 0) {
                timeUp();
            }
        }, 1000);
    }

    function timeUp() {
        clearInterval(gameState.timerInterval);
        // Automatikusan rossz válasznak minősül
        endGame(false);
    }

    function setupEventListeners() {
        // Főmenü gombok
        elements.startGameBtn.on('click', startGame);
        elements.showLeaderboardBtn.on('click', showLeaderboardModal);
        elements.settingsBtn.on('click', toggleSound);
        elements.closeModal.on('click', hideLeaderboardModal);

        // Válasz gombok
        elements.answerButtons.on('click', function() {
            const selectedOption = $(this).data('option');
            checkAnswer(selectedOption);
        });

        async function startGame() {
            // Főmenü elrejtése, játék megjelenítése
            elements.mainMenu.addClass('hidden');
            elements.gameScreen.removeClass('hidden');

            // Kérdések betöltése és játék indítása
            await loadQuestions(); // Várjuk meg a kérdések betöltését
        }

        // Billentyűzet támogatás
        $(document).on('keydown', function(e) {
            if (e.key >= '1' && e.key <= '4') {
                const option = String.fromCharCode(64 + parseInt(e.key)); // 1->A, 2->B stb.
                $(`.answer-btn[data-option="${option}"]`).trigger('click');
            }
        });

        // 50/50 segítség
        elements.fiftyFiftyBtn.on('click', useFiftyFifty);

        // Telefonos segítség
        elements.phoneAFriendBtn.on('click', usePhoneAFriend);

        // Hang be/ki
        elements.soundToggleBtn.on('click', toggleSound);
    }

    function checkAnswer(selectedOption) {
        clearInterval(gameState.timerInterval);

        const currentQuestion = gameState.shuffledQuestions[gameState.currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.correct;

        // Gombok színezése
        elements.answerButtons.each(function() {
            const option = $(this).data('option');
            if (option === currentQuestion.correct) {
                $(this).addClass('correct');
            } else if (option === selectedOption) {
                $(this).addClass('wrong');
            }
            $(this).addClass('disabled');
        });

        if (isCorrect) {
            gameState.score++;
            updateMoneyLadder();

            // Következő kérdés vagy játék vége
            setTimeout(() => {
                gameState.currentQuestionIndex++;
                if (gameState.currentQuestionIndex < gameState.shuffledQuestions.length) {
                    showQuestion();
                } else {
                    endGame(true);
                }
            }, 2000);
        } else {
            // Rossz válasz - játék vége
            setTimeout(() => endGame(false), 2000);
        }
    }

    function useFiftyFifty() {
        if (!gameState.lifelines.fiftyFifty) return;

        gameState.lifelines.fiftyFifty = false;
        elements.fiftyFiftyBtn.prop('disabled', true);

        const currentQuestion = gameState.shuffledQuestions[gameState.currentQuestionIndex];
        const incorrectOptions = Object.keys(currentQuestion.answers)
            .filter(opt => opt !== currentQuestion.correct);

        // Véletlenszerűen 2 hibás válasz eltávolítása
        const optionsToRemove = [];
        while (optionsToRemove.length < 2 && optionsToRemove.length < incorrectOptions.length) {
            const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
            const option = incorrectOptions[randomIndex];
            if (!optionsToRemove.includes(option)) {
                optionsToRemove.push(option);
            }
        }

        // Gombok elrejtése
        optionsToRemove.forEach(opt => {
            $(`.answer-btn[data-option="${opt}"]`).hide();
        });
    }

    function usePhoneAFriend() {
        if (!gameState.lifelines.phoneAFriend) return;

        gameState.lifelines.phoneAFriend = false;
        elements.phoneAFriendBtn.prop('disabled', true);

        const currentQuestion = gameState.shuffledQuestions[gameState.currentQuestionIndex];
        const correctOption = currentQuestion.correct;

        // 80% eséllyel a helyes választ adja, 20% eséllyel véletlenszerű választ
        const isCorrect = Math.random() < 0.8;
        let suggestedOption;

        if (isCorrect) {
            suggestedOption = correctOption;
        } else {
            const options = Object.keys(currentQuestion.answers).filter(opt => opt !== correctOption);
            suggestedOption = options[Math.floor(Math.random() * options.length)];
        }

        alert(`A szakértő szerint a válasz ${suggestedOption} lehet a legvalószínűbb!`);
    }

    function toggleSound() {
        gameState.soundOn = !gameState.soundOn;
        if (gameState.soundOn) {
            elements.backgroundMusic.play();
            elements.soundToggleBtn.text('Hang ki');
        } else {
            elements.backgroundMusic.pause();
            elements.soundToggleBtn.text('Hang be');
        }
    }

    function updateMoneyLadder() {
        let ladderHTML = '<h3>Nyeremények</h3><ul>';
        for (let i = 0; i < gameState.moneyLadder.length; i++) {
            const isCurrent = (gameState.moneyLadder.length - i - 1) === gameState.score;
            ladderHTML += `<li${isCurrent ? ' class="current"' : ''}>${gameState.moneyLadder[i]} Ft</li>`;
        }
        ladderHTML += '</ul>';
        elements.moneyLadder.html(ladderHTML);
    }

    function endGame(isWinner) {
        // Játék vége logika
        const prize = isWinner ? gameState.moneyLadder[gameState.moneyLadder.length - 1] :
            (gameState.score > 0 ? gameState.moneyLadder[gameState.score - 1] : 0);

        // Toplista mentése
        saveToLeaderboard(prize);

        // Eredmény megjelenítése
        alert(isWinner ? `Gratulálunk! Nyertél ${prize} Ft-ot!` :
            `Játék vége! Nyelmezed: ${prize} Ft.`);

        // Visszatérés a főmenübe
        returnToMainMenu();
    }

    function returnToMainMenu() {
        // Játék képernyő elrejtése
        elements.gameScreen.addClass('hidden');
        // Főmenü megjelenítése
        elements.mainMenu.removeClass('hidden');
        // Játék állapotának visszaállítása
        resetGame();
    }

    function saveToLeaderboard(score) {
        // Toplista mentése localStorage-ba
        let leaderboard = JSON.parse(localStorage.getItem('millionaireLeaderboard')) || [];
        const playerName = prompt('Gratulálunk! Add meg a neved a toplistához:') || 'Anonim';

        leaderboard.push({ name: playerName, score: score, date: new Date().toLocaleDateString() });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10); // Csak a top 10

        localStorage.setItem('millionaireLeaderboard', JSON.stringify(leaderboard));
    }

    function showLeaderboardModal() {
        const leaderboard = JSON.parse(localStorage.getItem('millionaireLeaderboard')) || [];
        let leaderboardHTML = '<ol>';

        if (leaderboard.length === 0) {
            leaderboardHTML = '<p>Még nincs eredmény a ranglistán!</p>';
        } else {
            leaderboard.forEach((entry, index) => {
                leaderboardHTML += `
                    <li>
                        <strong>${entry.name}</strong> - ${entry.score} Ft
                        <span class="date">${entry.date}</span>
                    </li>
                `;
            });
            leaderboardHTML += '</ol>';
        }

        elements.leaderboardContent.html(leaderboardHTML);
        elements.leaderboardModal.show();
    }

    function hideLeaderboardModal() {
        elements.leaderboardModal.hide();
    }

    function resetGame() {
        gameState.currentQuestionIndex = 0;
        gameState.score = 0;
        gameState.timeLeft = 30;
        gameState.lifelines = {
            fiftyFifty: true,
            phoneAFriend: true
        };

        // Kérdések újrakeverése új játékhoz
        if (gameState.questions.length > 0) {
            gameState.shuffledQuestions = [...gameState.questions];
            shuffleArray(gameState.shuffledQuestions);
        }

        elements.fiftyFiftyBtn.prop('disabled', false);
        elements.phoneAFriendBtn.prop('disabled', false);

        showQuestion();
        updateMoneyLadder();
    }
});