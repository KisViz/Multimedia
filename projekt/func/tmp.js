const questions = [
    {
        question: "Mi Magyarország fővárosa?",
        answers: ["Berlin", "Budapest", "Párizs", "Bécs"],
        correct: 1,
        level: 1
    },
    // További kérdések...
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;

function startGame() {
    loadQuestion(currentQuestionIndex);
    startTimer();
    document.addEventListener('keydown', handleKeyPress);
}

function loadQuestion(index) {
    const questionObj = questions[index];
    document.getElementById('question').textContent = questionObj.question;
    const answerButtons = document.querySelectorAll('.answer-btn');

    questionObj.answers.forEach((answer, i) => {
        answerButtons[i].textContent = `${i + 1}: ${answer}`;
        answerButtons[i].disabled = false;
        answerButtons[i].style.display = 'block';
    });

    // Animáció újrakezdése
    document.getElementById('question-box').classList.add('slide-in');
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById('timer').textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleAnswer(false);
        }
    }, 1000);
}

document.getElementById('fifty-fifty').addEventListener('click', () => {
    const questionObj = questions[currentQuestionIndex];
    const incorrectAnswers = questionObj.answers
        .filter((_, index) => index !== questionObj.correct - 1)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

    document.querySelectorAll('.answer-btn').forEach(btn => {
        if (incorrectAnswers.some(ans => btn.textContent.includes(ans))) {
            btn.style.display = 'none';
        }
    });

    this.disabled = true;
});

document.getElementById('phone-help').addEventListener('click', function() {
    const isCorrect = Math.random() < 0.8;
    const correctAnswer = questions[currentQuestionIndex].correct - 1;
    const randomAnswer = isCorrect ? correctAnswer : Math.floor(Math.random() * 4);

    alert(`A szakértő szerint a válasz ${randomAnswer + 1} lehet a legvalószínűbb!`);
    this.disabled = true;
});

function saveScore() {
    const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    highscores.push({ name: prompt("Add meg a neved!"), score });
    localStorage.setItem('highscores', JSON.stringify(highscores));
}

const backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true;

document.getElementById('settings-btn').addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
});