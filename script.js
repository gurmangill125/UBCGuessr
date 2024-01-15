let score = 0;

document.getElementById('guessButton').addEventListener('click', function() {
    // This function will be expanded to handle the guessing logic
    alert('Guess button clicked!');

    // For now, let's just increase the score by 1 for each guess
    score++;
    updateScore();
});

function updateScore() {
    document.getElementById('scoreBoard').innerText = 'Score: ' + score;
}

// Initialization function
function initGame() {
    // Game initialization logic will go here
    console.log('Game initialized');
}

// Initialize the game when the window loads
window.onload = initGame;
