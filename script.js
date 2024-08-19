// Array of all the cells in the table
const cells = document.getElementsByTagName("td")

// Variables to keep track of the game state
// Nought starts first
// Game is over once winning condition is met
// "clicks" keeps track of the number of clicks
// "xCount" and "oCount" keep track of the number of wins

let noughtsTurn = true
let gameIsOver
let clicks = 0
let oCount = 0
let xCount = 0

// Function to switch player
const switchPlayer = () => {
  // Toggle the value of "noughtsTurn"
  noughtsTurn = !noughtsTurn

  // Display player's turn
  noughtsTurn
    ? (document.getElementById(
        "subtitle"
      ).textContent = `It's ⭕️ Nought's Turn`)
    : (document.getElementById("subtitle").textContent = `It's ❌ Cross's Turn`)
}

// Function to handle the click cell event
const handleClickCell = event => {
  // Variable to store the cell that was clicked
  const cell = event.target

  // Play sound when cell is clicked
  const sound = new Audio("./sounds/click-sound.mp3")
  sound.play()

  // Condition: Empty cell
  // Mark cell "X" or "O"
  // Increment "clicks"
  if (cell.textContent === "") {
    // Variable for "X" or "O"
    let symbol = noughtsTurn ? "O" : "X"
    cell.textContent = symbol
    clicks++

    // Call the function to check for winning condition
    checkWinningCondition(symbol)

    // Condition: Game is not over && winning condition not met
    if (!gameIsOver) {
      // Switch to other player
      switchPlayer()

      // Condition: All cells are filled && winning condition not met
      if (clicks === 9) {
        document.getElementById("subtitle").textContent = "S T A L E M A T E !"

        // Play sound if it's a stalemate
        const sound = new Audio("./sounds/stalemate-sound.mp3")
        sound.play()
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
        const sound = new Audio("./sounds/game-over-sound.mp3")
        sound.play()

        // Display the winning message
        const subtitle = (document.getElementById(
          "subtitle"
        ).textContent = `Player 🔥 ${symbol} 🔥 Wins! `)

        // Increment "xCount" && "oCount" counter
        // Display number of wins
        if (symbol === "O") {
          oCount++
          document.getElementById("o-count").textContent = oCount
        } else {
          xCount++
          document.getElementById("x-count").textContent = xCount
        }

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
    // Reset the cell's text content to empty string
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
const resetGame = () => {
  // Winner starts second on the next game
  // Restarting switches to other player
  switchPlayer()

  // Call "resetGameLayout" function
  resetGameLayout()
}

// Function to handle the reset score click event
const resetScore = () => {
  // Nought always starts first
  noughtsTurn = true

  // Reset the counter for number of wins
  xCount = 0
  oCount = 0
  document.getElementById("x-count").textContent = ""
  document.getElementById("o-count").textContent = ""
  document.getElementById("subtitle").textContent =
    "Click on a cell to start! -> ⭕️ Nought's First!"

  // Call "resetGameLayout" function
  resetGameLayout()
}

// === Binding Event Handlers === //

// Event listener to bind "handleClickCell" event handler function to each cell
for (const cell of cells) {
  cell.addEventListener("click", handleClickCell)
}

// Event listener to bind "resetGame" event handler function to the "reset-game-btn"
document.getElementById("reset-game-btn").addEventListener("click", resetGame)

// Event listener to bind "resetScore" event handler function to the "reset-score-btn"
document.getElementById("reset-score-btn").addEventListener("click", resetScore)
