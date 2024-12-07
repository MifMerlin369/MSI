// Initialize Variables
let bgMusic = new Audio("music.mp3");
let audioTurn = new Audio("ting.mp3");
let correct = new Audio("correct-sound.mp3");
let turn = 'X';
let isGameover = false;

// Function to change the turn
const changeTurn = () => {
    return turn === 'X' ? '0' : 'X'
}

// Function to check Winner
const checkWin = () => {
    let boxtext = document.getElementsByClassName('boxtext');
    let wins = [
        [0, 1, 2, 5, 5, 0],
        [3, 4, 5, 5, 15, 0],
        [6, 7, 8, 5, 25, 0],
        [0, 3, 6, -5, 15, 90],
        [1, 4, 7, 5, 15, 90],
        [2, 5, 8, 15, 15, 90],
        [0, 4, 8, 5, 15, 45],
        [2, 4, 6, 5, 15, 135],
    ]
    wins.forEach(e => {
        if ((boxtext[e[0]].innerText === boxtext[e[1]].innerText) && (boxtext[e[2]].innerText === boxtext[e[1]].innerText) && (boxtext[e[0]].innerText !== '')) {
            document.querySelector(".info").innerText = "Player " + boxtext[e[0]].innerText + " Won";
            isGameover = true;
            document.querySelector(".imgBox").getElementsByTagName("img")[0].style.width = "200px";
            document.querySelector(".line").style.width = "20vw";
            document.querySelector(".line").style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`;
            document.querySelector(".winner").style.display = "flex";
            document.querySelector(".confetti").style.opacity = "1";
            document.querySelector(".confetti").style.zIndex = "1";
            correct.play();
            turn = '';
            audioTurn.pause();
            bgMusic.pause();
        }
    })
}

    // Game Logic Starts from Here
    let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector(".boxtext");
    element.addEventListener("click", () => {
        if (boxtext.innerText === "") {
            boxtext.innerText = turn;
            turn = changeTurn();
            audioTurn.play();
            //bgMusic.play();
            checkWin();
            if (!isGameover) {
                document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
                    }
            }
        })
    })  



// Add onClick listener on Reset Button
reset.addEventListener('click', () => {
    let boxtext = document.querySelectorAll(".boxtext");
    Array.from(boxtext).forEach(element => {
        element.innerText = "";
    })
    turn = "X";
    isGameover = false;
    bgMusic.pause();
    audioTurn.play();
    document.querySelector(".line").style.width = "0vw";
    document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
    document.querySelector(".imgBox").getElementsByTagName("img")[0].style.width = "0px";
    document.querySelector(".winner").style.display = "none";
    document.querySelector(".confetti").style.opacity = "0";
    document.querySelector(".confetti").style.zIndex = "-1";
    correct.pause();
    audioTurn.play();
})
