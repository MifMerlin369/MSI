const question = document.getElementById('Question');
const choices = Array.from(document.getElementsByClassName('suffix'));// to store all choices elements in the form of an array
const socreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const progressBarText = document.getElementById('progressText');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [{
    "question": "Inside which HTML element do we put the JavaScript??",
    "choice1": "<script>",
    "choice2": "<javascript>",
    "choice3": "<js>",
    "choice4": "<scripting>",
    "answer": 1
  },
  {
    "question": "What is the correct syntax for referring to an external script called 'xxx.js'?",
    "choice1": "<script href='xxx.js'>",
    "choice2": "<script name='xxx.js'>",
    "choice3": "<script src='xxx.js'>",
    "choice4": "<script file='xxx.js'>",
    "answer": 3
  },
  {
    "question": " How do you write 'Hello World' in an alert box?",
    "choice1": "msgBox('Hello World');",
    "choice2": "alertBox('Hello World');",
    "choice3": "msg('Hello World');",
    "choice4": "alert('Hello World');",
    "answer": 4
  },
  {
    "question": "Which one of the following also known as Conditional Expression:",
    "choice1": "Alternative to if-else",
    "choice2": "Switch statement",
    "choice3": "If-then-else statement",
    "choice4": "immediate if",
    "answer": 4
  },
  {
    "question": "When interpreter encounters an empty statements, what it will do:",
    "choice1": "Shows a warning",
    "choice2": "Prompts to complete the statement",
    "choice3": "Throws an error",
    "choice4": "Ignores the statements",
    "answer": 4
  }];//created a list of coded questions
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];//It is used to create shallow copy of js objects
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore',score);//adding score to localstorage
        return window.location.assign('end.html');
    }
    questionCounter++;
    progressBarText.innerText = 'Question' + questionCounter + '/' + MAX_QUESTIONS;
    // increament progress bar
    progressBarFull.style.width = (questionCounter/MAX_QUESTIONS)*100+'%';//filling progress bar as we play the game
    const questionIndex = Math.floor(Math.random() * availableQuesions.length);// It is used to get random question
    currentQuestion = availableQuesions[questionIndex];// To get current question
    question.innerText = currentQuestion.question;// getting question

    choices.forEach((choice) => {
        const number = choice.dataset.number;//to get the value to number data in each choices
        choice.innerText = currentQuestion['choice' + number];// to display each choice in choice box
    });
    availableQuesions.splice(questionIndex, 1);//to delete the current question from available questions
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;// to get the html element we clicked on
        const selectedAnswer = selectedChoice.dataset['number'];//Get the value corresponding to selected option
        const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";// check if answer is correct or not
        if (classToApply == "correct"){
            increamentScore(CORRECT_BONUS);
        }
    selectedChoice.parentElement.classList.add(classToApply);// apply correct or incorrect class on parent element
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);// to remove the added class after 1 second
    });
});

increamentScore = num => {
    score += num;
    socreText.innerText = score;//increamenting score
}
startGame();