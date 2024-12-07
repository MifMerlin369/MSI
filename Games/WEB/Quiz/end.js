const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];//getting data form localstorage in json format

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;// Making button disabled if username field name is empty
});

saveHighScore = (e) => {
    e.preventDefault();//to prevent default action

    const score = {
        score: mostRecentScore,
        name: username.value,
    };// because json supports key value pairs
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);//sorting the players on the basis of score
    highScores.splice(5);// to get only first elements in the JSON

    localStorage.setItem('highScores', JSON.stringify(highScores));//Converting json to string to store it in localstorage
    window.location.assign('index.html');
};
