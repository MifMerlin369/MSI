let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};


updateScore();

let isAutoPlaying = false;
let intervalId ; 

document.querySelector('.js-rock-btn').addEventListener('click', ()=>{
  playGame('rock');
});   

document.querySelector('.js-paper-btn').addEventListener('click', ()=>{
  playGame('paper');
});

document.querySelector('.js-scissor-btn').addEventListener('click', ()=>{
  playGame('scissor');
});

document.querySelector('.js-reset-btn').addEventListener('click', () =>{
  showResetConfirmation();
  // resetBtn();
});

document.querySelector('.js-autoplay-btn').addEventListener('click', () => {
  autoPlay();
});

// playing game through keyborde using keydown().

document.body.addEventListener('keydown', (event)=>{
  if(event.key === 'r' || event.key === 'R'){
    playGame('rock');

  }else if(event.key === 'p' || event.key === 'P'){
    playGame('paper');

  }else if(event.key === 's' || event.key === 'S'){
    playGame('scissor');

  } else if(event.key === 'a' || event.key === 'A'){
    autoPlay();

  }else if(event.key === 'Backspace'){
    showResetConfirmation();
    

  }
});

function showResetConfirmation(){
  document.querySelector('.js-reset-confirmation').innerHTML = `
    Are you sure you want to reset the score?
    <div class="reset-confirm-btn-all">
      <button class="js-reset-confirm-yes reset-confirm-btn">
        Yes
      </button>

      <button class="js-reset-confirm-no reset-confirm-btn">
        No
      </button>
    </div>
  `;

  // Attach event listeners after the buttons are created
  document.querySelector('.js-reset-confirm-yes').addEventListener('click', ()=>{
    resetBtn();
    hideResetConfirmation();
  });

  document.querySelector('.js-reset-confirm-no').addEventListener('click', ()=>{
    hideResetConfirmation();
  });
}

function hideResetConfirmation(){
  document.querySelector('.js-reset-confirmation').innerHTML = '';
}

function autoPlay(){
  if(!isAutoPlaying){

    document.querySelector('.js-autoplay-btn').innerHTML = 'Stop Auto Play';
    // change it to arrow function
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);

    isAutoPlaying = true;

  }else{
    document.querySelector('.js-autoplay-btn').innerHTML = 'Start Auto Play';
    clearInterval(intervalId);
    isAutoPlaying = false;
  }
}

function playGame(playerMove){
  const computerMove =  pickComputerMove()
  let result = '';

  if(playerMove === 'scissor'){
    if(computerMove === 'rock'){
    result = 'You Lose.' ;
    } else if(computerMove === 'paper'){
      result = 'You Win.';
    } else {
      result= 'Tie.';
    }

  } else if(playerMove === 'paper'){
    if(computerMove === 'rock'){
    result = 'You Win.' ;
    } else if(computerMove === 'paper'){
      result = 'Tie.';
    } else {
      result= 'You Lose.';
    }
    
  } else if(playerMove === 'rock'){
    if(computerMove === 'rock'){
    result = 'Tie.' ;
    } else if(computerMove === 'paper'){
      result = 'You Lose.';
    } else {
      result= 'You Win.';
    }
  }

  if(result === 'You Win.'){
    score.wins += 1;
  }else if(result === 'You Lose.'){
    score.losses += 1;
  } else if(result === 'Tie.'){
    score.ties += 1;
  }

  localStorage.setItem('score', JSON.stringify(score));  // it only supports string.

  updateScore();

  document.querySelector('.js-result').innerHTML = `${result}`;

  document.querySelector('.js-moves').innerHTML = `you <img src="./image/${playerMove}-emoji.png" class="move-icons"  alt="">
    <img src="./image/${computerMove}-emoji.png" class="move-icons" alt="">
    computer`;

}

function resetBtn(){
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.removeItem('score');
  updateScore();
  document.querySelector('.js-result').innerHTML = '';
  document.querySelector('.js-moves').innerHTML = '';
}

function updateScore(){
  document.querySelector('.js-score').innerHTML = `<div><span class="wins-score">Wins:</span> ${score.wins}</div> <div><span class="loss-score">Losses:</span> ${score.losses}</div> <div><span class="tie-score">Ties:</span> ${score.ties}</div>`;
}

function pickComputerMove(){
  const randomNumber = Math.random();
  let computerMove = '';
  if(randomNumber >= 0 && randomNumber < 1 / 3){
    computerMove= 'rock';
  }else if(randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  }else{
    computerMove = 'scissor';
  }

  return computerMove;

}
