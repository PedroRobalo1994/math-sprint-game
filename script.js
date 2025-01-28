// DOM Elements
const domElements = {
    // Pages
    gamePage: document.getElementById('game-page'),
    scorePage: document.getElementById('score-page'),
    splashPage: document.getElementById('splash-page'),
    countdownPage: document.getElementById('countdown-page'),
    
    // Form Elements
    startForm: document.getElementById('start-form'),
    radioContainers: document.querySelectorAll('.radio-container'),
    radioInputs: document.querySelectorAll('input'),
    
    // Game Elements
    itemContainer: document.querySelector('.item-container'),
    countdown: document.querySelector('.countdown'),
    bestScores: document.querySelectorAll('.best-score-value'),
    
    // Score Elements
    finalTimeEl: document.querySelector('.final-time'),
    baseTimeEl: document.querySelector('.base-time'),
    penaltyTimeEl: document.querySelector('.penalty-time'),
    playAgainBtn: document.querySelector('.play-again')
};

// Game State
const gameState = {
    questionAmount: 0,
    equationsArray: [],
    playerGuessArray: [],
    bestScoreArray: [],
    valueY: 0,
    timer: null,
    timePlayed: 0,
    baseTime: 0,
    penaltyTime: 0,
    finalTime: 0,
    finalTimeDisplay: '0.0'
};

// Constants
const PENALTY_SECONDS = 0.5;
const SCROLL_AMOUNT = 80;
const TIMER_INTERVAL = 100;

// Initialize best scores
function initBestScores() {
    return [
        { questions: 10, bestScore: gameState.finalTimeDisplay },
        { questions: 25, bestScore: gameState.finalTimeDisplay },
        { questions: 50, bestScore: gameState.finalTimeDisplay },
        { questions: 99, bestScore: gameState.finalTimeDisplay }
    ];
}

// Update DOM with best scores
function updateScoresDisplay() {
    domElements.bestScores.forEach((bestScore, index) => {
        bestScore.textContent = `${gameState.bestScoreArray[index].bestScore}s`;
    });
}

// Load or initialize best scores
function loadBestScores() {
    gameState.bestScoreArray = localStorage.getItem('bestScores') 
        ? JSON.parse(localStorage.bestScores) 
        : initBestScores();
    localStorage.setItem('bestScores', JSON.stringify(gameState.bestScoreArray));
    updateScoresDisplay();
}

// Generate equation
function generateEquation(isCorrect) {
    const num1 = Math.floor(Math.random() * 9);
    const num2 = Math.floor(Math.random() * 9);
    const result = num1 * num2;
    
    if (isCorrect) {
        return {
            value: `${num1} x ${num2} = ${result}`,
            evaluated: 'true'
        };
    }

    const wrongFormats = [
        `${num1} x ${num2 + 1} = ${result}`,
        `${num1} x ${num2} = ${result - 1}`,
        `${num1 + 1} x ${num2} = ${result}`
    ];
    
    return {
        value: wrongFormats[Math.floor(Math.random() * 3)],
        evaluated: 'false'
    };
}

// Create equations array
function createEquations() {
    const correctCount = Math.floor(Math.random() * gameState.questionAmount);
    const wrongCount = gameState.questionAmount - correctCount;
    
    gameState.equationsArray = [
        ...Array(correctCount).fill().map(() => generateEquation(true)),
        ...Array(wrongCount).fill().map(() => generateEquation(false))
    ];
    
    shuffle(gameState.equationsArray);
}

// Game page setup
function setupGamePage() {
    domElements.itemContainer.textContent = '';
    const elements = [
        createSpacerElement('height-240'),
        createSelectedItemElement(),
        ...createEquationElements(),
        createSpacerElement('height-500')
    ];
    elements.forEach(element => domElements.itemContainer.appendChild(element));
}

function createSpacerElement(className) {
    const spacer = document.createElement('div');
    spacer.classList.add(className);
    return spacer;
}

function createSelectedItemElement() {
    const element = document.createElement('div');
    element.classList.add('selected-item');
    return element;
}

function createEquationElements() {
    return gameState.equationsArray.map(equation => {
        const item = document.createElement('div');
        item.classList.add('item');
        const equationText = document.createElement('h1');
        equationText.textContent = equation.value;
        item.appendChild(equationText);
        return item;
    });
}

// Refresh Splash Page Best Scores
function bestScoresToDOM() {
  domElements.bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${gameState.bestScoreArray[index].bestScore}s`;
  });
}

// Update Best Score Array
function updateBestScore() {
  gameState.bestScoreArray.forEach((score, index) => {
    // Select correct Best Score to update
    if (gameState.questionAmount == score.questions) {
      // Return Best Score as number with one decimal
      const savedBestScore = Number(gameState.bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > gameState.finalTime) {
        gameState.bestScoreArray[index].bestScore = gameState.finalTimeDisplay;
      }
    }
  });
  // Update Splash Page
  bestScoresToDOM();
  // Save to Local Storage
  localStorage.setItem('bestScores', JSON.stringify(gameState.bestScoreArray));
}

// Reset Game
function playAgain() {
  domElements.gamePage.addEventListener('click', startTimer);
  domElements.scorePage.hidden = true;
  domElements.splashPage.hidden = false;
  gameState.equationsArray = [];
  gameState.playerGuessArray = [];
  gameState.valueY = 0;
  domElements.playAgainBtn.hidden = true;
}

// Show Score Page
function showScorePage() {
  // Show Play Again button after 1 second delay
  setTimeout(() => {
    domElements.playAgainBtn.hidden = false;
  }, 1000);
  domElements.gamePage.hidden = true;
  domElements.scorePage.hidden = false;
}

// Format & Display Time in DOM
function scoresToDOM() {
  gameState.finalTimeDisplay = gameState.finalTime.toFixed(1);
  gameState.baseTime = gameState.timePlayed.toFixed(1);
  gameState.penaltyTime = gameState.penaltyTime.toFixed(1);
  domElements.baseTimeEl.textContent = `Base Time: ${gameState.baseTime}s`;
  domElements.penaltyTimeEl.textContent = `Penalty: +${gameState.penaltyTime}s`;
  domElements.finalTimeEl.textContent = `${gameState.finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to Top, go to Score Page
  domElements.itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  showScorePage();
}

// Stop Timer, Process Results, go to Score Page
function checkTime() {
  if (gameState.playerGuessArray.length == gameState.questionAmount) {
    clearInterval(gameState.timer);
    // Check for wrong guess, add penaltyTime
    gameState.equationsArray.forEach((equation, index) => {
      if (equation.evaluated === gameState.playerGuessArray[index]) {
        // Correct Guess, No Penalty
      } else {
        // Incorrect Guess, Add Penalty
        gameState.penaltyTime += PENALTY_SECONDS;
      }
    });
    gameState.finalTime = gameState.timePlayed + gameState.penaltyTime;
    scoresToDOM();
  }
}

// Add a tenth of a second to timePlayed
function addTime() {
  gameState.timePlayed += 0.1;
  checkTime();
}

// Start timer when game page is clicked
function startTimer() {
  // Reset times
  gameState.timePlayed = 0;
  gameState.penaltyTime = 0;
  gameState.finalTime = 0;
  gameState.timer = setInterval(addTime, TIMER_INTERVAL);
  domElements.gamePage.removeEventListener('click', startTimer);
}

// Scroll, Store user selection in playerGuessArray
function select(guessedTrue) {
  // Scroll 80 more pixels
  gameState.valueY += SCROLL_AMOUNT;
  domElements.itemContainer.scroll(0, gameState.valueY);
  // Add player guess to array
  return guessedTrue ? gameState.playerGuessArray.push('true') : gameState.playerGuessArray.push('false');
}

// Displays Game Page
function showGamePage() {
  domElements.gamePage.hidden = false;
  domElements.countdownPage.hidden = true;
}

// Get Random Number up to a certain amount
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Add Equations to DOM
function equationsToDOM() {
  gameState.equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation Text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    domElements.itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  domElements.itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  domElements.itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  domElements.itemContainer.appendChild(bottomSpacer);
}

// Displays 3, 2, 1, GO!
function countdownStart() {
  domElements.countdown.textContent = '3';
  setTimeout(() => {
    domElements.countdown.textContent = '2';
  }, 1000);
  setTimeout(() => {
    domElements.countdown.textContent = '1';
  }, 2000);
  setTimeout(() => {
    domElements.countdown.textContent = 'GO!';
  }, 3000);
}

// Navigate from Splash Page to CountdownPage to Game Page
function showCountdown() {
  domElements.countdownPage.hidden = false;
  domElements.splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
}

// Get the value from selected radio button
function getRadioValue() {
  let radioValue;
  domElements.radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides amount of Questions
function selectQuestionAmount(e) {
  e.preventDefault();
  gameState.questionAmount = getRadioValue();
  if (gameState.questionAmount) {
      showCountdown();
  }
}

// Switch selected input styling
function updateRadioStyles() {
  domElements.radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove('selected-label');
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
}

// Event Listeners
function initializeEventListeners() {
    domElements.gamePage.addEventListener('click', startTimer);
    domElements.startForm.addEventListener('submit', selectQuestionAmount);
    domElements.startForm.addEventListener('click', updateRadioStyles);
}

// Initialize game
function initializeGame() {
    loadBestScores();
    initializeEventListeners();
}

// Start the game
initializeGame();
