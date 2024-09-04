// ========== HTML Element References ========== //
const cells = Array.from(document.getElementsByTagName("td")) // Array of all table cells
const subtitle = document.getElementById("subtitle") // Dynamic subtitle
const oCountWins = document.getElementById("o-count") // Displays "O" wins
const xCountWins = document.getElementById("x-count") // Displays "X" wins
const resetGameBtn = document.getElementById("reset-game-btn") // Reset game button
const resetScoreBtn = document.getElementById("reset-score-btn") // Reset score button

// ========== Sound File Paths ========== //
const soundPaths = {
  click: "./sounds/click-sound.mp3",
  stalemate: "./sounds/stalemate-sound.mp3",
  gameOver: "./sounds/game-over-sound.mp3",
  resetGame: "./sounds/reset-game-sound.mp3",
  resetScore: "./sounds/reset-score-sound.mp3",
}

// ========== Game State Variables ========== //

let noughtsTurn = true // Nought starts first
let gameIsOver // Indicates if winning condition is met
let clicks = 0 // Counter for number of clicks
let oCount = 0 // Counter for nought's wins
let xCount = 0 // Counter for cross's wins

// Array of winning combinations
const winningCombinations = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal from top left to bottom right
  [2, 4, 6], // Diagonal from top right to bottom left
]

// ========== Utility Functions ========== //

// ===== Play Sound ===== //
const playSound = soundType => {
  const sound = new Audio(soundPaths[soundType])
  sound.play()
}

// ===== Toggle Player ===== //
const togglePlayer = () => {
  // Toggle value of "noughtsTurn"
  noughtsTurn = !noughtsTurn

  // Display player's turn
  subtitle.textContent = noughtsTurn
    ? `It's ⭕️ Nought's Turn`
    : `It's ❌ Cross's Turn`

  return noughtsTurn
}

// ========== Game Logic Functions ========== //

// ===== Update Game State if Winning ===== //
const setWinningGameState = symbol => {
  gameIsOver = true

  // Play sound when game is over
  playSound("gameOver")

  // Display winning message
  subtitle.textContent =
    symbol === "X" ? `Cross -❌- Wins!` : `Nought -⭕️- Wins!`

  // Increment "xCount" && "oCount" counters
  // Display number of wins
  symbol === "O"
    ? (oCount++, (oCountWins.textContent = oCount))
    : (xCount++, (xCountWins.textContent = xCount))

  // Call function to disable cell clicks
  clickEvent("removeEventListener")
}

// ===== Update Game State if Stalemate ===== //
const setStalemateGameState = () => {
  // Display stalemate message
  subtitle.textContent = "❗️ S T A L E M A T E ❗️"
  playSound("stalemate")
}

// ===== Check for Winning Condition ===== //
const checkWinningCondition = symbol => {
  // Loop through each winning combination
  for (let combination of winningCombinations) {
    // Check if each cell in combination has same symbol
    const winningCombination = combination.every(
      cell => cells[cell].textContent === symbol
    )

    if (winningCombination) {
      // Call function to update the game state
      setWinningGameState(symbol)
    }
  }
}

// ===== Display Player's Move ===== //
const displayMove = (index, symbol) => {
  cells[index].textContent = symbol
  cells[index].style.color = symbol === "O" ? "darkOrange" : "khaki"
}

// ===== Check Player's Move ===== //
const checkMove = (index, symbol) => {
  // Call function to display player's move
  displayMove(index, symbol)

  // Increment the clicks counter
  clicks++

  // Call function to check for winning condition
  checkWinningCondition(symbol)

  // Condition: No player is winning yet
  if (!gameIsOver) {
    // Switch to next player
    const noughtsTurn = togglePlayer()
    // Computer's turn
    if (!noughtsTurn) {
      setTimeout(makeComputerMove, 500)
    }
    // Condition: All cells are filled and winning condition not met
    if (clicks === 9) {
      // Call function to update the game state
      setStalemateGameState()
    }
  }
}

// ===== Find Best Move for Computer ===== //
const findBestMove = () => {
  const computerSymbol = "X"
  const opponentSymbol = "O"

  // Iterate through each winning combination
  for (let combination of winningCombinations) {
    // Get values of cells in the combination
    const combinationValues = combination.map(index => cells[index].textContent)

    // Find empty cell in the combination
    const emptyCellIndex = combination.find(
      index => cells[index].textContent === ""
    )

    // Check if empty cell is a winning move or a blocking move
    if (emptyCellIndex !== undefined) {
      const isWinningMove =
        combinationValues.filter(value => value === computerSymbol).length === 2
      const isBlockingMove =
        combinationValues.filter(value => value === opponentSymbol).length === 2

      if (isWinningMove || isBlockingMove) {
        return emptyCellIndex
      }
    }
  }

  return null // No best move found
}

// ===== Computer's Move ===== //
const makeComputerMove = () => {
  // Variable for computer's symbol
  const symbol = "X"

  // Call function to find best move
  let bestMoveIndex = findBestMove()

  if (bestMoveIndex !== null) {
    // Best move found
    checkMove(bestMoveIndex, symbol)
  } else {
    // Best move not found
    // Make a random move
    const availableCells = cells.filter(cell => cell.textContent === "")
    if (availableCells.length > 0) {
      let randomMoveIndex = Number(
        availableCells[
          Math.floor(Math.random() * availableCells.length)
        ].getAttribute("data-index")
      )
      // Check computer's move
      checkMove(randomMoveIndex, symbol)
    }
  }
}

// ===== Handle Cell Click ===== //
const handleClickCell = event => {
  // Variable to store clicked
  const cell = event.target

  // Play sound if clicked
  playSound("click")

  // Condition: Empty cell
  if (cell.textContent === "") {
    // Variable for user's symbol
    let symbol = "O"
    let index = Number(cell.getAttribute("data-index"))
    cell.textContent = symbol

    // Check user's move
    checkMove(index, symbol)
  }
}

// ========== Reset Utility Functions ========== //

// ===== Reset Content for Each Cells ===== //
const resetCellsContent = () => cells.forEach(cell => (cell.textContent = ""))

// ===== Reset Game Condition ===== //
const resetGameCondition = () => {
  gameIsOver = false
  clicks = 0
}

// ===== Reset Player to Nought ===== //
const resetPlayerToNought = () => {
  // Nought starts first
  noughtsTurn = false
  togglePlayer()
}

// ===== Reset Wins Counters ===== //
const resetCounters = () => {
  oCount = 0
  xCount = 0
  oCountWins.textContent = ""
  xCountWins.textContent = ""
}

// ===== Reset Subtitle ===== //
const resetSubtitle = () =>
  (subtitle.textContent = `Click on a cell to start! -> ⭕️ First!"`)

// ========== Handle Reset Buttons ========== //
const handleResetButtons = event => {
  const button = event.target.id

  // Reset player to nought
  resetPlayerToNought()

  // Reset cell content
  resetCellsContent()

  // Reset game condition and clicks counter
  resetGameCondition()

  // Activate "handleClickCell" event again
  clickEvent("addEventListener")

  if (button === "reset-score-btn") {
    // Reset counters for number of wins
    resetCounters()

    // Reset subtitle
    resetSubtitle()

    // Play sound when resetting score
    playSound("resetScore")
  } else {
    // Play sound when resetting the game
    playSound("resetGame")
  }
}

// ========== Binding Event Handlers ========== //
const clickEvent = event =>
  cells.forEach(cell => cell[event]("click", handleClickCell))

clickEvent("addEventListener")

const clickButtonEvent = button => {
  button.addEventListener("click", handleResetButtons)
}
clickButtonEvent(resetGameBtn)
clickButtonEvent(resetScoreBtn)
