/*-------------------------------- Constants --------------------------------*/
// links to the images acting as pieces for each player
const pieceObject = {
    green: '../assets/images/pieces/donatello.png',
    yellow: '../assets/images/pieces/michaelangelo.png',
    blue: '../assets/images/pieces/leonardo.png',
    red: '../assets/images/pieces/raphael.png',
}

// player names to display on the game state messages
const playerNames = {
    green: 'Donatello',
    yellow: 'Michaelangelo',
    blue: 'Leonardo',
    red: 'Raphael',
}

// predefined turn sequence to go clockwise on the board
const turnSequence = ['green', 'yellow', 'blue', 'red']

// index of the home square (also the last square) on their respective pathway for each player
const homeSquare = {
    green: 72,
    yellow: 73,
    blue: 74,
    red: 75,
}

// index of the starting square on the path way for each player
const squareOne = {
    green: 47,
    yellow: 8,
    blue: 21,
    red: 34
}

// defining the pathway that needs to be followed by each player based on their piece color
const pathWay = {
    green: [47, 48, 49, 50, 51, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
         16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 
         35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 67, 68, 69, 70, 71, 72],
    yellow: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
         27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 
         46, 47, 48, 49, 50, 51, 0, 1, 2, 3, 4, 5, 6, 52, 53, 54, 55, 56, 73],
    blue: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
         40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
         10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 57, 58, 59, 60, 61, 74],
    red: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 0, 1,
         2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 
         23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 62, 63, 64, 65, 66, 75],
}

// referencing the audio files for game sounds
const diceSound = new Audio('../assets/sounds/dice.wav')
const clickSound = new Audio('../assets/sounds/click.wav')
const piecePopSound = new Audio('../assets/sounds/pop.wav')
const buttonSound = new Audio('../assets/sounds/button.wav')
const twoSixesSound = new Audio('../assets/sounds/booyah.mp3')
const rolledSixSound = new Audio('../assets/sounds/cowabunga.mp3')
const threeSixesSound = new Audio('../assets/sounds/ouch.mp3')
const knockOffSound = new Audio('../assets/sounds/hurt.mp3')
const oobSound = new Audio('../assets/sounds/oob.mp3')
const pieceHomeSound = new Audio('../assets/sounds/turtle-power.mp3')
const winSound = new Audio('../assets/sounds/whose-the-turtle.mp3')

// TMNT theme song from 1987 cartoon
const titleSound = new Audio('../assets/sounds/tmnt-theme-1987.mp3')


/*---------------------------- Variables (state) ----------------------------*/
let numOfPlayers, turn, selectedPiece, winner, outOfBounds, pieceHome, playArea
let diceValue, diceDisabled, count6, knockOffBonus
let board, playerDepots

const activePieces = {}
const piecesWon = {}
const vacantDepot = {}
const piecePosition = {}

/*------------------------ Cached Element References ------------------------*/
// element for the selecting the number of players through select button
const selectPlayersEl = document.getElementById('select-players')

// elements representing all the squares on the pathway, home squares and depot squares
const pathSquareEls = document.querySelectorAll('.path')
// referenced from: https://www.geeksforgeeks.org/fastest-way-to-convert-javascript-nodelist-to-array/
let pathEls = Array.from(pathSquareEls)
//considering that nodes are objects in an array
pathEls = pathEls.sort((a,b) => parseInt(a.id) - parseInt(b.id)) 

// main message element showing the game state to players
const messageEl = document.getElementById('message')

// elements representing each of the players' depots
const redDepotEl = document.querySelector('#red-big')
const greenDepotEl = document.querySelector('#green-big')
const yellowDepotEl = document.querySelector('#yellow-big')
const blueDepotEl = document.querySelector('#blue-big')

// dice button and dice roll value elements
const diceEl = document.getElementById('dice-button')
const diceRollValueEl = document.getElementById('dice-value')

// reset button element
const resetBtnEl = document.getElementById('reset')

// elements of the title screen on overlay
const titleScreenEl = document.getElementById('title-screen')
const startBtnEl = document.getElementById('start')
const howBtnEl = document.getElementById('instr-btn')

// elements of the how to play screen on overlay
const backBtnEl = document.getElementById('back')
const tldrScreenEl = document.getElementById('how-to-play')
const linkToInstrEl = document.getElementById('link-instr')

// elements of the detailed instructions/rules screen on overlay
const backToStartBtnEl = document.getElementById('back-to-start')
const instrScreenEl = document.getElementById('instructions')

/*-------------------------------- Functions --------------------------------*/

init()

// function to initialise the game 
function init() {
    board = []
    diceRollValueEl.className = 'dice'
    diceEl.className = 'dice'
    selectPlayersEl.selectedIndex = 0
    playerDepots = []
    numOfPlayers = 0
    diceValue = 0
    turn = 'green'
    playArea = pathWay[turn]
    activePieces.green = 0
    activePieces.blue = 0
    activePieces.red = 0
    activePieces.yellow = 0
    piecesWon.green = 0
    piecesWon.yellow = 0 
    piecesWon.blue = 0
    piecesWon.red = 0
    vacantDepot.green = []
    vacantDepot.yellow = []
    vacantDepot.blue = []
    vacantDepot.red = []
    count6 = 0
    piecePosition.green = [88, 89, 90, 91]
    piecePosition.yellow = [76, 77, 78, 79] 
    piecePosition.blue = [80, 81, 82, 83]
    piecePosition.red = [84, 85, 86, 87]
    winner = false
    pieceHome = false
    outOfBounds = false
    selectedPiece = false
    diceDisabled = true
    knockOffBonus = false
    titleScreenEl.style.display = ''
    tldrScreenEl.style.display = 'none' 
    instrScreenEl.style.display = 'none'
    startBtnEl.setAttribute('disabled', true)  
    rolledSixSound.volume = 0.4
    twoSixesSound.volume = 0.4 
    render()
}

//function to render the board
function render() {
    updateDepots()
    updateBoard()
    updateMessage()
    showDiceValue()
}

//setting number of players
function playerSelection() {
    buttonSound.play()
    numOfPlayers = parseInt(selectPlayersEl.value)
    startBtnEl.removeAttribute('disabled')   
}

// to update the depots based on number of players
function updateDepots() {
    if (diceValue) {
        return
    }
    for (let i = 0; i < 76; i++) {
        board[i] =''
    }
    if (numOfPlayers === 4) {
        playerDepots = ['yellow', 'yellow', 'yellow', 'yellow',
            'blue', 'blue', 'blue', 'blue',
            'red', 'red', 'red', 'red',
            'green', 'green', 'green', 'green' 
        ]
    } else if (numOfPlayers === 2 || numOfPlayers === 1) {
        playerDepots = ['', '', '', '', 
                        'blue', 'blue', 'blue', 'blue',
                        '', '', '', '',
                        'green', 'green', 'green', 'green'
        ]
    } else if (numOfPlayers === 0) {
        playerDepots = ['', '', '', '',
                        '', '', '', '',
                        '', '', '', '',
                        '', '', '', '',
        ]
    } 
    playerDepots.forEach((sqr, index) => board[76 + index] = sqr)
}

//to update the board with game state
function updateBoard() {
    board.forEach((cell, idx) => {
                       
        pathEls[idx].innerHTML = ''
        if (cell.includes('green')) {
            for (let i = 0; i < cell.match(/green/g).length; i++) {
                const pieceElement = document.createElement('img')
                pieceElement.classList.add('piece')
                pieceElement.src = pieceObject['green']
                pieceElement.alt = 'Donatello Face'
                pieceElement.classList.add('animate__animated','animate__pulse')
                pathEls[idx].appendChild(pieceElement)
                
            }
        }
        if (cell.includes('yellow')) {
            for (let i = 0; i < cell.match(/yellow/g).length; i++) {
                const pieceElement = document.createElement('img')
                pieceElement.classList.add('piece')
                pieceElement.src = pieceObject['yellow']
                pieceElement.alt = 'Michaelangelo Face'
                pieceElement.classList.add('animate__animated','animate__pulse')
                pathEls[idx].appendChild(pieceElement)

            }
        }
        if (cell.includes('blue')) {
            for (let i = 0; i < cell.match(/blue/g).length; i++) {
                const pieceElement = document.createElement('img')
                pieceElement.classList.add('piece')
                pieceElement.src = pieceObject['blue']
                pieceElement.alt = 'Leonardo Face'
                pieceElement.classList.add('animate__animated','animate__pulse')
                pathEls[idx].appendChild(pieceElement)
            }
        }
        if (cell.includes('red')) {
            for (let i = 0; i < cell.match(/red/g).length; i++) {
                const pieceElement = document.createElement('img')
                pieceElement.classList.add('piece')
                pieceElement.src = pieceObject['red']
                pieceElement.alt = 'Raphael Face'
                pieceElement.classList.add('animate__animated','animate__pulse')
                pathEls[idx].appendChild(pieceElement)
            }
        }

        /*
        caching the child elements (image pieces) on the respective parent element (pathway square),
        for applying the class 'multi' so that more than one image (piece) can accomodate that square
        */
        const imageElements = pathEls[idx].querySelectorAll('.piece') 
        if (imageElements.length > 1) {
            imageElements.forEach( imageElement => {
               imageElement.classList.add('multi')
            })   
        } else {
            imageElements.forEach( imageElement => {
                imageElement.classList.remove('multi')
             })   
        }
    })
}

// to update the message element text to display the game state
function updateMessage() {
    if (numOfPlayers === 0) {
        messageEl.textContent = 'Game On!!'
    } else if (winner) {
        messageEl.textContent = `BOOYAKASHA!! ${playerNames[turn]} is the LUDO MASTER!! Congratulations!!`
        winSound.play()
    } else if (pieceHome) {
        messageEl.textContent = `BOOYAKASHA!! ${playerNames[turn]}'s Piece reached HOME!! Get ${4 - piecesWon[turn]} more Piece(s) Home to Win`
        pieceHomeSound.play()
    } else if (!winner && !pieceHome && activePieces[turn] === 0) {
        if (outOfBounds) {
            messageEl.textContent = `Out Of Bounds!! You lose the turn! ${playerNames[turn]}'s turn. Roll the Dice!`
        } else {
            messageEl.textContent = `${playerNames[turn]}'s turn. Roll the Dice and get a SIX to make your First move!`
        }
        if (diceDisabled) {
            firstMove()
        }
    } else {
        if (diceDisabled){
            makeYourMove()
        } else {
            rollTheDice()
        }
    } 
}

// to render a message based on different dice roll condition when there are no activePieces
function firstMove() {
    if (diceValue !== 6) {
        messageEl.textContent = `${playerNames[turn]} didn't get a SIX. Better Luck in the next roll of Dice`
   } else {
        messageEl.textContent = `COWABUNGA!! ${playerNames[turn]} got a SIX! Select a Piece from Depot to make a move!`
        rolledSixSound.play()
   }
}

// to render a message when user has rolled a dice when there is/are active piece(s)
function makeYourMove() {
    if (outOfBounds) {
        messageEl.textContent = `Out Of Bounds!! This is not going to be a walk in the park! Select a different Piece!`
        oobSound.play()
    } else if (diceValue !== 6) {
        messageEl.textContent = `${playerNames[turn]} got a ${diceValue}! Select an Active Piece to make a move!`
    } else if (count6 === 1) {
        messageEl.textContent = `COWABUNGA!! ${playerNames[turn]} got a SIX! Select any Piece to make a move!!`
        rolledSixSound.play()
    } else if(count6 === 2) { 
        messageEl.textContent = `BOOYAH!! ${playerNames[turn]} got a SIX Again! Select any Piece to make a move!!`
        twoSixesSound.play()
    } else if (count6 === 3) {
        messageEl.textContent = `OOPS!! Rule of 3 SIXES: You lose the turn!!` 
        threeSixesSound.play()
    } 
}

// to render a message when user needs to roll the dice 
function rollTheDice() {
    if (outOfBounds) {
        messageEl.textContent = `Out Of Bounds!! You lose the turn! ${playerNames[turn]}'s turn. Roll the Dice!`
    }  else if (knockOffBonus) {
        messageEl.textContent = `KNOCK OFF bonus!! ${playerNames[turn]}'s turn. Roll the Dice!`
        knockOffSound.play()
    } else if (count6 === 1) {
        messageEl.textContent = `${playerNames[turn]}'s turn. Rule of SIX: Bonus turn!! Roll the Dice!`
    } else if (count6 === 2) {
        messageEl.textContent = `${playerNames[turn]}'s turn. Rule of 2 SIXES: Another Bonus turn!! Roll the Dice!`
    } else {
        messageEl.textContent = `${playerNames[turn]}'s turn. Roll the Dice!`
    }
}

// to display the value of rolled dice
function showDiceValue() {
    if (diceValue) {
        diceRollValueEl.classList.add(`d${diceValue}`)
    }
}

// handleDice function
function handleDice() {
    if (winner || diceDisabled) {
        return
    }
    if (diceValue) {
        diceRollValueEl.className = 'dice'
    }
    selectedPiece = false
    handleDiceRoll()
    diceDisabled = true
    knockOffBonus = false // to reset knockOffBonus from previous turn
    outOfBounds = false // to reset outOfBounds from previous turn
    render() 
    /* 
    if player has rolled 6 for the third time in a row OR
    if the player doesn't have any active pieces AND dice value is not 6, 
    then, switch player turn and make sure the next player is not able to move piece without rolling a dice
    */
    if ((count6 === 3) || (activePieces[turn] === 0 && diceValue !== 6)) {
        switchPlayerTurn()
        setTimeout(() => render(), 2000)
    } 
    /*
    decision making for the computer in the solo player mode to decide 
    whether to move an active piece or select a piece from depot if the die roll is 6 
    */
    if ((activePieces[turn] + piecesWon[turn]) < 4 && diceValue === 6) {
        setTimeout(() => selectAiPiece(), 3000)
    } else if (numOfPlayers === 1 && turn !== 'green' && (activePieces[turn] !== 0)) {
        setTimeout(() => selectActiveAiPiece(), 4000)
    }
}

// to handle dice roll and randomly assign diceValue
function handleDiceRoll() {
    diceEl.classList.add('animate__animated','animate__shakeX')
    diceSound.play()
    diceValue = Math.floor(Math.random() * 6) + 1
    if (diceValue === 6) {
        count6 += 1
    }
    setTimeout(() => diceEl.className = 'dice', 500)
}

// to select an AI piece from the depot
function selectAiPiece() {
    if (numOfPlayers === 1 && turn !== 'green') {
        let depotIndex 
        piecePosition[turn].forEach(index => {
            if (board[index] !== '') {
                depotIndex = index
            }
        })
        if ((activePieces[turn] + piecesWon[turn]) < 4) {
        handleDepot(pathEls[depotIndex])
        }
    }
}

// to make the first move 
function handleDepot(event) {
    //if dice value is not 6 or if they have already selected their piece, return
    if (diceValue !== 6 || selectedPiece) {
        clickSound.play()
        return
    }
    let pieceIndex
    if (numOfPlayers === 1 && turn !== 'green') {
        pieceIndex = event.id
    } else {
        pieceIndex = parseInt(event.target.parentElement.id)
    }
    // if the selected depot square is empty, return
    if (board[pieceIndex] !== turn) {
        clickSound.play()
        return
    }
    piecePopSound.play()    
    board[pieceIndex] = ''
    vacantDepot[turn].push(pieceIndex)
    const startPos = playArea[0]
    board[startPos] += turn
    selectedPiece = true
    activePieces[turn] += 1
    diceDisabled = false
    render()
    if (diceValue === 6 && count6 !== 3) {
        setTimeout(() => checkAi(), 3000)
    }
}

// select an AI Piece when there is atleast 1 active AI Piece
function selectActiveAiPiece(){
    if (numOfPlayers === 1 && turn !== 'green') {
        let activePieceIndex = []
        pathWay[turn].forEach((pathIdx) => {
            if (board[pathIdx].includes(turn) && pathIdx !== homeSquare[turn]) {
                activePieceIndex.push(pathIdx)
            }
        })
        if(outOfBounds && activePieces[turn] > 1) {
            handleClick(pathEls[activePieceIndex.at(0)])
        } else {
            handleClick(pathEls[activePieceIndex.at(-1)])
        }
    }
}

//to handle the piece selection by the player
function handleClick(event) {
    let squareIndex
    if (numOfPlayers === 1 && turn !== 'green') {
        squareIndex = parseInt(event.id)
    } else {
        squareIndex = parseInt(event.target.parentElement.id)
    }
    // to make sure the player is clicking on a piece and not empty space
    if (typeof board[squareIndex] !== 'string') {
        return
    }
    if (!board[squareIndex].includes(turn) || selectedPiece) {
        clickSound.play()
        return
    }
    const newPos = playArea.indexOf(squareIndex) + diceValue
    const newSquareIndex = playArea[newPos]
    checkBounds(newSquareIndex)
    if (outOfBounds) {
        if(activePieces[turn] === 1) {
            clickSound.play()
            switchPlayerTurn()
        } 
        render()
        setInterval(() => selectActiveAiPiece(), 3000)
        return
    }
    piecePopSound.play()
    checkOccupier(newSquareIndex)
    board[squareIndex] = board[squareIndex].replace(turn,'')
    movePiece(newSquareIndex)
    checkForWinner(newSquareIndex)
    render()
    // a player gets an extra roll anytime a 6 is rolled or if they knocked off another player's piece
    if (diceValue !== 6 && !knockOffBonus) {
        switchPlayerTurn()
    } else {
        diceDisabled = false
        selectedPiece = true
        
    }
    if (pieceHome) {
        pieceHome = false // to reset pieceHome for the next turn
        setTimeout(() => render(), 4000)
    }
    else {
        render()
    }
}

// to check if the new position is outOfBounds for the player
function checkBounds(newSquareIndex) {
    outOfBounds = false //to switch-back outOfBounds to false after intial outOfBounds message
    if(newSquareIndex === undefined || pathEls[newSquareIndex].children.length === 4) {
        outOfBounds = true
    } 
}

// check if the same square is occupied by piece of other player
function checkOccupier(newSquareIndex) {
    if (Object.values(squareOne).includes(newSquareIndex) || board[newSquareIndex] === ''){
        return
    } 
    Object.keys(homeSquare).forEach(player => {
        // check which other player's piece is occupying the square
        // that particular piece will be knocked off the play area and moved back to its depot. 
        // that piece can then only be activated by rolling a 6 by the respective player
        if (player !== turn) {
            if (board[newSquareIndex] === player) {
                knockOff(newSquareIndex, player)
            }
        }
    })
}

// knock off player piece back to depot
function knockOff(index, player) {
    board[index] = board[index].replace(player,'')
    let depotIndex = vacantDepot[player].pop()
    board[depotIndex] = player
    activePieces[player] -= 1
    knockOffBonus = true
}

// to move the piece from current position to new position on the board
function movePiece(newSquareIndex) {
    board[newSquareIndex] += turn
}

// check if there is a winner
function checkForWinner(newSquareIndex) {
    if (newSquareIndex !== homeSquare[turn]){
        return
    }
    pieceHome = true
    confetti.start(500)
    piecesWon[turn] += 1
    activePieces[turn] -= 1
    if (piecesWon[turn] === 4) {
        winner = true
        confetti.start(4000)
    }
}

// to switch turn to next player in the turn sequence
function switchPlayerTurn() {
    if (winner) {
        return
    }
    if (turn === 'red') {
        turn = turnSequence[0]
    } else if (numOfPlayers === 4) {
        turn = turnSequence[turnSequence.indexOf(turn) + 1]
    } else  {
        turn = turn === 'green' ? turn = 'blue' : turn = 'green'
    }
    playArea = pathWay[turn]
    count6 = 0
    diceDisabled = false
    selectedPiece = true
    setTimeout(() => checkAi(), 4000)
}

// to check if its Solo Player playing with computer
function checkAi() {
    if (numOfPlayers === 1 && turn !== 'green') {
        handleDice()
    }
}

// to start the game after selecting the numOfPlayers
function startGame() {
    if (numOfPlayers === 0) {
        return
    }
    buttonSound.play()
    titleScreenEl.style.display = 'none'
    setTimeout(() => {
        diceDisabled = false
        render()
    }, 1500)
}

// to show the how to play instructions screen 
function howToPlay() {
    buttonSound.play()
    tldrScreenEl.style.display = ''
    titleScreenEl.style.display = 'none'
}

//to go to the detailed rules page
function detailedInstr() {
    buttonSound.play()
    instrScreenEl.style.display = ''
    tldrScreenEl.style.display = 'none'
}

// to return back to same screen where the how to play button was clicked from
function returnBack() {
    buttonSound.play()
    instrScreenEl.style.display = 'none'
    tldrScreenEl.style.display = 'none'
    titleScreenEl.style.display = ''
}

// to play/pause the theme music

function themeMusic(event) {
    if (event.target.id === 'leonardo') {
        titleSound.paused ? titleSound.play() : titleSound.pause()
    }
}

/*----------------------------- Event Listeners -----------------------------*/
// event listener for the player selection (game mode selection) button
selectPlayersEl.addEventListener('change', playerSelection)

// when player clicks on the dice
diceEl.addEventListener('click', handleDice)

// when player clicks on an image-piece inside the player depots
greenDepotEl.addEventListener('click', handleDepot)
yellowDepotEl.addEventListener('click', handleDepot)
blueDepotEl.addEventListener('click', handleDepot)
redDepotEl.addEventListener('click', handleDepot)

// to check if the player has clicked on an "active piece" on the pathway
pathEls.forEach(pathEl => {
    if (parseInt(pathEl.id) < 72) {
        pathEl.addEventListener('click', handleClick)
    }
})

// when player clicks on the "Start Over" button
resetBtnEl.addEventListener('click', init)

// when player clicks on the "Start" button
startBtnEl.addEventListener('click', startGame)

// button for opening the "how to play" instructions
howBtnEl.addEventListener('click', howToPlay)

// for detailed instructions/rules
linkToInstrEl.addEventListener('click', detailedInstr)

// back buttons taking the player back to title screen
backBtnEl.addEventListener('click', returnBack)
backToStartBtnEl.addEventListener('click', returnBack)

// to play the TMNT theme music 
document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', themeMusic)
})






