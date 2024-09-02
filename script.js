// ===== Variables for the elements ===== //
const cells = document.getElementsByTagName("td") // Array of all the cells in the table
const subtitle = document.getElementById("subtitle") // Dynamic subtitle
const oCountWins = document.getElementById("o-count") // Displays "O" wins
const xCountWins = document.getElementById("x-count") // Displays "X" wins
const resetGameBtn = document.getElementById("reset-game-btn") // Reset game button
const resetScoreBtn = document.getElementById("reset-score-btn") // Reset score button

// SoundPaths
const clickSoundPath = "./sounds/click-sound.mp3"
const staleMateSoundPath = "./sounds/stalemate-sound.mp3"
const gameOverSoundPath = "./sounds/game-over-sound.mp3"
const resetGameSoundPath = "./sounds/reset-game-sound.mp3"
const resetScoreSoundPath = "./sounds/reset-score-sound.mp3"

// Variables to keep track of the game state
let noughtsTurn = true // Nought starts first
let gameIsOver // Game is over once winning condition is met
let clicks = 0 // Clicks counter
let oCount = 0 // "O" wins counter
let xCount = 0 // "X" wins counter

// Function to play sound
const playSound = soundPath => {
  const sound = new Audio(soundPath)
  sound.play()
}

// Function to switch player
const switchPlayer = () => {
  // Toggle the value of "noughtsTurn"
  noughtsTurn = !noughtsTurn

  // Display player's turn
  subtitle.textContent = noughtsTurn
    ? `It's ⭕️ Nought's Turn`
    : `It's ❌ Cross's Turn`
}

// Function to handle the click cell event
const handleClickCell = event => {
  // Variable to store the cell that was clicked
  const cell = event.target

  // Play sound when cell is clicked
  playSound(clickSoundPath)

  // Condition: Empty cell
  // Mark cell "X" or "O"
  // Increment "clicks"
  if (cell.textContent === "") {
    // Variable for "X" or "O"
    let symbol = noughtsTurn ? "O" : "X"
    cell.textContent = symbol
    cell.style.color = symbol === "O" ? "darkOrange" : "khaki"
    clicks++

    // Call the function to check for winning condition
    checkWinningCondition(symbol)

    // Condition: Game is not over && winning condition not met
    if (!gameIsOver) {
      // Switch to other player
      switchPlayer()

      // Condition: All cells are filled && winning condition not met
      if (clicks === 9) {
        subtitle.textContent = "❗️ S T A L E M A T E ❗️"

        // Play sound if it's a stalemate
        playSound(staleMateSoundPath)
      }
    }
  }
}

// Function to check for winning condition
const checkWinningCondition = symbol => {
  // Array of winning combinations
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  // Loop through each winning combination
  for (let combination of winningCombinations) {
    // Variable to keep track of the count of the symbol in the combination
    let symbolCount = 0

    // Loop through each cell in the combination
    for (let cell of combination) {
      // Condition: Cell not empty and contains same symbol as the current player
      // Increment "symbolCount"
      if (cells[cell].textContent === symbol) {
        symbolCount++
      }

      // Condition: All cells in the combination have the same symbol
      // gameIsOver -> Winning condition is met
      if (symbolCount === 3) {
        // Update the game state
        gameIsOver = true

        // Play sound when game is over
        playSound(gameOverSoundPath)

        // Display the winning message
        subtitle.textContent =
          symbol === "X" ? `Cross 🍁❌🍁 Wins!` : `Nought 🍁⭕️🍁 Wins!`

        // Increment "xCount" && "oCount" counter
        // Display number of wins
        symbol === "O"
          ? (oCount++, (oCountWins.textContent = oCount))
          : (xCount++, (xCountWins.textContent = xCount))

        // Disable "handleClickCell" event when game is over
        for (const cell of cells) {
          cell.removeEventListener("click", handleClickCell)
        }
      }
    }
  }
}

// Function to reset the game layout to be used for handling reset buttons
const resetGameLayout = () => {
  for (const cell of cells) {
    // Reset the cells to empty string
    cell.textContent = ""
    // Reset the game state and clicks counter
    gameIsOver = false
    clicks = 0
    // Activate "handleClickCell" event again
    cell.addEventListener("click", handleClickCell)
  }
}

// Function to handle the reset game click event
// Scores remain
const handleResetGame = () => {
  // Winner starts second on the next game
  // Restarting switches to other player
  switchPlayer()

  // Call "resetGameLayout" function
  resetGameLayout()

  // Play sound when resetting the game
  playSound(resetGameSoundPath)
}

// Function to handle the reset score click event
const handleResetScore = () => {
  // Nought always starts first
  noughtsTurn = true

  // Reset the counter for number of wins
  xCount = 0
  oCount = 0
  xCountWins.textContent = ""
  oCountWins.textContent = ""
  subtitle.textContent = "Click on a cell to start! -> ⭕️ First!"

  // Call "resetGameLayout" function
  resetGameLayout()

  // Play sound when resetting score
  playSound(resetScoreSoundPath)
}

// === Binding Event Handlers === //

// Event listener to bind "handleClickCell" event handler function to each cell
for (const cell of cells) {
  cell.addEventListener("click", handleClickCell)
}

// Event listener to bind "resetGame" event handler function to the "reset-game-btn"
resetGameBtn.addEventListener("click", handleResetGame)

// Event listener to bind "handleResetScore" event handler function to the "reset-score-btn"
resetScoreBtn.addEventListener("click", handleResetScore)
