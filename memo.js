const images = [
    "images/memo1.bmp", "images/memo2.bmp", "images/memo3.bmp",
    "images/memo4.bmp", "images/memo5.bmp", "images/memo6.bmp",
    "images/memo7.bmp", "images/memo8.bmp", "images/memo9.bmp",
    "images/memo10.bmp", "images/memo11.bmp", "images/memo12.bmp",
    "images/memo13.bmp", "images/memo14.bmp", "images/memo15.bmp",
    "images/memo16.bmp", "images/memo17.bmp", "images/memo18.bmp"
];

let shuffledImages = [];
let selectedBoxes = [];
let matchedPairs = 0;
let startTime; // Time when the game starts
let elapsedTime; // Time taken to complete the game

// Retrieve leaderboard from localStorage
const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

function preloadGameBoard() {
    shuffledImages = [...images, ...images].sort(() => Math.random() - 0.5);
    const gameBoard = document.querySelector('#game-board');

    gameBoard.innerHTML = ''; // Clear the game board

    // Preload the game board with backside images
    for (let i = 0; i < 36; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.dataset.image = shuffledImages[i]; // Store the front image
        box.style.backgroundImage = "url('images/cardcover.jpg')"; // Set backside image
        gameBoard.appendChild(box);
    }
}

function initializeGame() {
    const gameBoard = document.querySelector('#game-board');
    gameBoard.style.display = 'grid'; // Show game board
    document.querySelector('#start-overlay').style.display = 'none'; // Hide overlay

    startTime = Date.now(); // Record the start time

    const boxes = gameBoard.querySelectorAll('.box');
    boxes.forEach((box) => {
        box.addEventListener('click', handleBoxClick);
    });
}

function handleBoxClick(e) {
    const box = e.target;

    // Prevent interaction with already flipped or matched cards
    if (box.classList.contains('flipped') || box.classList.contains('matched') || selectedBoxes.includes(box)) {
        return;
    }

    box.style.backgroundImage = `url(${box.dataset.image})`; // Show front image
    box.classList.add('flipped');
    selectedBoxes.push(box);

    // Close the first two cards if three are selected
    if (selectedBoxes.length === 3) {
        resetBox(selectedBoxes[0]);
        resetBox(selectedBoxes[1]);
        selectedBoxes = [selectedBoxes[2]]; // Keep the third card in the array
    }

    // Check for a match when two cards are flipped
    if (selectedBoxes.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [box1, box2] = selectedBoxes;

    if (box1.dataset.image === box2.dataset.image) {
        // Cards match
        box1.classList.add('matched');
        box2.classList.add('matched');
        matchedPairs++;
        selectedBoxes = [];

        // Check if all pairs are matched
        if (matchedPairs === 18) {
            endGame();
        }
    }
}

function resetBox(box) {
    box.style.backgroundImage = "url('images/cardcover.jpg')"; // Reset to backside
    box.classList.remove('flipped');
}

function endGame() {
    elapsedTime = Math.round((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
    const playerName = prompt('Enter your name for the leaderboard:');
    leaderboard.push({ name: playerName || "Anonymous", time: elapsedTime });
    leaderboard.sort((a, b) => a.time - b.time); // Sort by time (shortest first)
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard)); // Save leaderboard

    displayLeaderboard();
}

function displayLeaderboard() {
    const gameContainer = document.querySelector('#game-container');
    gameContainer.innerHTML = `
        <h1>Leaderboard</h1>
        <ul id="leaderboard-list"></ul>
        <button id="restart-game-btn">Play Again</button>
    `;

    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = leaderboard
        .slice(0, 10) // Show top 10 times
        .map((entry, index) => `<li>${index + 1}. ${entry.name} - ${entry.time}s</li>`)
        .join('');

    document.getElementById('restart-game-btn').addEventListener('click', () => {
        location.reload();
    });
}

document.getElementById('start-game-btn').addEventListener('click', initializeGame);
document.addEventListener('DOMContentLoaded', preloadGameBoard);