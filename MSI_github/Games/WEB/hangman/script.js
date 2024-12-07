window.onload = function() {
  let wordsArray = [
    ["C", "A", "T", "S"],
    ["M", "O", "U", "S", "E"],
    ["J", "A", "V", "A", "S", "C", "R", "I", "P", "T"],
    ["P", "O", "T", "A", "T", "O"],
    ["U", "N", "D", "E", "F", "I", "N", "E", "D"],
    ["S", "P", "A", "G", "H", "E", "T"],
    ["W", "A", "Y"]
  ];
  let categoryArray = [
    ["The internet and Youtube would not be the same without them"],
    ["Touchpad ain't got nothing on me"],
    ["Love it or hate it, frontend devs need it"],
    ["This hangman game is..."],
    ["I'm declared, but don't have a value"],
    ["Somebody toucha my..."],
    ["You do not know de..."]
  ];

  let newGame = document.getElementById("newGame");
  newGame.onclick = startNewGame;

  class Hangman {
    constructor() {
      //game state and initial values
      this.random = Math.floor(Math.random() * wordsArray.length);
      this.wordToGuess = wordsArray[this.random];
      this.category = categoryArray[this.random];
      this.placeholderArray = Array(this.wordToGuess.length).fill("_");
      this.guessed = [];
      this.lives = 6;
    }
    setupNewWord() {
      //setsup new game input/buttons and creates initial placeholder containing only "_" and puts it on the board. placeholder has as many characters as the word
      let guessWrapper = document.getElementById("guessWrapper");
      let placeholderP = document.createElement("p");
      let category = document.getElementById("categoryName");
      category.innerHTML = this.category;

      placeholderP.setAttribute("id", "placeholderP");
      placeholderP.innerHTML = this.placeholderArray.join("");
      guessWrapper.appendChild(placeholderP);

      let userLetter = document.getElementById("userLetter");
      userLetter.onkeypress = this.handleKeyPress.bind(this);

      let guessButton = document.getElementById("guessButton");
      guessButton.onclick = this.handleClick.bind(this);
    }
    handleClick() {
      //main game logic, triggers input check, win or loose, updates lives, shows/hides various elements on click
      let userLetterInput = document.getElementById("userLetter");
      let userLetter = userLetterInput.value.toUpperCase();
      let placeholderP = document.getElementById("placeholderP");
      let warningText = document.getElementById("warningText");
      let alreadyGuessed = document.querySelector("#alreadyGuessed span");
      let wrongLetters = document.querySelector("#wrongLetters span");
      let leftLives = document.querySelector("#leftLives span");

      if (!/[a-zA-Z]/.test(userLetter)) {
        //check that the user types in letters
        unhideElements("hidden", warningText);
        warningText.innerHTML = "Please enter a letter from A-Z"; //and shows warning if not
      } else {
        hideElements("hidden", warningText);

        if (
          this.wordToGuess.indexOf(userLetter) > -1 &&
          this.guessed.indexOf(userLetter) == -1
        ) {
          //check if letter is a match, and first guess
          checkGuess(this.wordToGuess, userLetter);
          hideElements("hidden", warningText);
        } else if (
          this.wordToGuess.indexOf(userLetter) == -1 &&
          this.guessed.indexOf(userLetter) == -1
        ) {
          //check if not match, and first wrong
          hideElements("hidden", warningText);
          unhideElements("hidden", wrongLetters.parentNode);
          wrongLetters.innerHTML += userLetter;
          this.lives--;
          hangerDraw(this.lives);
          hideLives(this.lives);
        } else {
          //if not first use of this letter
          unhideElements("hidden", warningText);
          warningText.innerHTML = "";
          warningText.innerHTML += "Already typed " + userLetter;
        }
        this.guessed.indexOf(userLetter) == -1
          ? this.guessed.push(userLetter)
          : null; //for all guesses, if its the first time using the letter, save it

        if (Array.from(placeholderP.innerHTML).indexOf("_") == -1) {
          //trigger game win or loose
          gameOver(true); //when no more '_' exist in placeholder, you win
        } else if (this.lives == 0) {
          //when lives are gone, you loose
          gameOver();
        }
      }
      userLetterInput.value = "";
    }
    handleKeyPress(e) {
      //if enter is pressed trigger click on button
      var guessButton = document.getElementById("guessButton");
      if (e.keyCode === 13) {
        guessButton.click();
      }
    }
  }

  function checkGuess(wordToGuess, userLetter) {
    //handles check logic, and replaces letters in placeholder when a match is found
    let placeholderP = document.getElementById("placeholderP");
    let placeholderArray = Array.from(placeholderP.innerHTML);
    placeholderArray = placeholderArray.map((el, i) => {
      //check if letter exists in the guess word, and if yes,replace it in the placeholder and display it
      if (wordToGuess[i] == userLetter) {
        return (el = userLetter);
      } else {
        return el;
      }
    });

    placeholderP.innerHTML = placeholderArray.join("");
  }

  function gameOver(win) {
    // shows win/game over message
    let winMessage = document.getElementById("statusMessage");
    let btnWrapper = document.querySelector(".button-wrapper");
    hideElements("hidden", btnWrapper);
    if (win) {
      winMessage.innerHTML = "You Win";
      winMessage.style.color = "green";
    } else {
      winMessage.innerHTML = "Game Over";
      winMessage.style.color = "rgb(239, 83, 80)";
    }
  }

  function hangerDraw(num) {
    //helper function triggers show hanger drawing
    let show = document.getElementById(`show${num}`);
    unhideElements("hidden", show);
  }

  function hideLives(num) {
    //helper function triggers hides lives
    let life = document.getElementById(`life${num}`);
    hideElements("hiddenLife", life);
  }

  function hideElements(myclass, ...els) {
    //helper func that hides
    for (let el of els) {
      el.classList.add(myclass);
    }
  }

  function unhideElements(myclass, ...els) {
    //helper func that unhides
    for (let el of els) {
      el.classList.remove(myclass);
    }
  }

  function startNewGame() {
    let btnWrapper = document.querySelector(".button-wrapper");
    let winMessage = document.getElementById("statusMessage");
    let wrongLetters = document.querySelector("#wrongLetters span");
    let warningText = document.querySelector("#warningText");
    let hiddenHangman = Array.from(document.querySelectorAll("svg .bodyPart"));
    let hiddenLives = Array.from(document.querySelectorAll(".lives"));

    for (let bodyPart of hiddenHangman) {
      hideElements("hidden", bodyPart);
    }

    for (let life of hiddenLives) {
      unhideElements("hiddenLife", life);
    }

    wrongLetters.innerHTML = "";
    unhideElements("hidden", btnWrapper);
    hideElements("hidden", wrongLetters.parentNode, warningText);
    winMessage.innerHTML = "Vanilla JavaScript Hangman Game";
    winMessage.style.color = "black";
    let oldP = document.getElementById("placeholderP");
    if (oldP.parentNode) {
      oldP.parentNode.removeChild(oldP);
    }

    let startGame = new Hangman();
    startGame.setupNewWord();
  }

  let startGame = new Hangman(); //initiates first game on windo load
  startGame.setupNewWord();
};