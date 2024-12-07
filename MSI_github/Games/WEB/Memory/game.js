/**
 * The functionality behind the Memory Card game. Memory (also known as Concentration) is a card game played with one or more players.
 * Using a standard card deck (including both jokers) the players shuffle the deck and lay all of the cards face down on a surface and two cards are flipped face up over each turn. 
 * The objective of the game is to turn over pairs of matching cards. Concentration can be played with any number of players or as solitaire. 
 * This game in particular however is implemented as a two-player game. The winner is th player that reaches 28 points first since that is more than half of the cards on the board.
 * @author Zaidh import
 * @version 13/10/2021
 */

const deck = document.querySelectorAll('.card');
deck.forEach(card => card.addEventListener('click', flipCard));

shuffleDeck(); // randomizes the board before each game

const displayScore1 = document.querySelector('#score1');
const displayScore2 = document.querySelector('#score2');
let gameOverMsg = document.querySelector('#memoryID');

let score1 = 0;
let score2 = 0;
let isFirstCard = false;
let first, second;
let isBoardClosed = false;
let p1Turn = true;

/**
 * Shuffles the deck so that each game has a completely different board
 */
function shuffleDeck(){
    deck.forEach(card => {
        let randomIndex = Math.floor(Math.random()*54);
        card.style.order = randomIndex;
    });

}


function flipCard(){
    if (isBoardClosed) return;
    if (this === first) return;
    
    this.classList.add('flip');

    if (!isFirstCard){
        isFirstCard = true; //first click
        first = this; // 'this' = the element that has fired the event
        return
    }
       
    isFirstCard = false; //second click
    second = this;

    // if the second card has been chosen, check if they match
    checkMatch();
}

function checkMatch(){

    if (first.dataset.id == second.dataset.id) {
        //so cards cannot be clicked again
        first.removeEventListener('click', flipCard);
        second.removeEventListener('click', flipCard);
        removeCards(first,second);

        resetBoard();

        if (p1Turn) {
            score1 +=2;
            displayScore1.textContent = score1.toString();
        }
        else {
            score2 +=2;
            displayScore2.textContent = score2.toString();
        }
        checkGameOver();
    } 
    else{
        //if the cards are not a match then turn them over again
        isBoardClosed = true;
        setTimeout(() => {
        first.classList.remove('flip');
        second.classList.remove('flip');
        isBoardClosed = false;
        resetBoard();
        }, 1000);
        if (p1Turn){
            p1Turn = false;
        }
        else if (!p1Turn){
            p1Turn = true;
        }
       // p2Turn = true;
        
    }
}

/**
 * Removes correctly found matching cards from the board
 * @param {*} first 
 * @param {*} second 
 */
function removeCards(first, second){
        setTimeout(() => {
        first.innerHTML = "";
        first.style.backgroundImage = "none";
        first.style.backgroundColor = "transparent";
        second.innerHTML = "";
        second.style.backgroundImage = "none";
        second.style.backgroundColor = "transparent";
        
        }, 600);
}

/**
 * Prevents more than 2 cards being flipped over at once since it is against the rules
 */
function resetBoard(){
    first = null;
    second = null;
    isFirstCard = false;
    isBoardClosed = false;
}

function restartGame(){
    shuffleDeck();

}

function checkGameOver(){ // game is over if either player gets 28 points
    if (score1 === 28){
       alert("CONGRATULATIONS PLAYER ONE! YOU WON!");
       shuffleDeck();
       location.reload();
    }
    else if (score2 === 28){
       alert("CONGRATULATIONS PLAYER TWO! YOU WON!");
       shuffleDeck();
       location.reload();
    }
}


