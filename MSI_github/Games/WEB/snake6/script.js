var score = 0;

var canvas = document.getElementById("game");

var context = document.getElementById("game").getContext("2d");

var grid = 16;

var count = 0;

var snake = {
    x: 160,

    y: 160,

    // snake velocity. moves one grid length every frame in either the x or y direction

    dx: grid,

    dy: 0,

    // keep track of all grids the snake body occupies

    cells: [],

    // length of the snake. grows when eating an apple

    maxCells: 4,
};

var apple = {
    x: 320,

    y: 320,
};


//used window.requestAnimationFrame() function which tells the browser that you wish to perform an animation and requests then the browser calls a loop() function to update an animation before the next repaint.


// use event handeler for pausing the game
document.addEventListener('keydown',pauseFunc);
function pauseFunc(event){
  if (event.keyCode === 32){
    togglePause();
  }
}

var isRunning = true;  //this variable helps in pausing

function togglePause() {
  // toggle the value of isRunning
  isRunning = !isRunning;
  document.getElementById("pause-start").innerHTML = "( Click space to RESUME )";

  // call animate() if working
  if (isRunning) {
    document.getElementById("pause-start").innerHTML = "( Click space to PAUSE )";
    loop();
  }
}








// get random whole numbers in a specific range

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// game loop

function loop() {

    if (isRunning){  //as explained above this function calls the loop function to  keep the animation running
    requestAnimationFrame(loop);}

    // slowing game loop
    if (++count < 8) {
        return;
    }

    count = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // move snake by it's velocity

    snake.x += snake.dx;

    snake.y += snake.dy;

    // wrap snake position horizontally on edge of screen

    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    // wrap snake position vertically on edge of screen

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // keep track of where snake has been. front of the array is always the head

    snake.cells.unshift({ x: snake.x, y: snake.y });

    // remove cells as we move away from them

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // draw apple

    context.fillStyle = "red";

    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // draw snake one cell at a time

    context.fillStyle = "green";

    snake.cells.forEach(function (cell, index) {
        // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is

        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // snake ate apple

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;

            score += 1;

            document.getElementById("score").innerHTML = "<b>Score:</b> " + score;

            // canvas is 400x400 which is 25x25 grid
            //This is generating the apple in random spots

            apple.x = getRandomInt(0, 25) * grid;

            apple.y = getRandomInt(0, 25) * grid;
        }

        // check collision with all cells after this one (modified bubble sort)

        for (var i = index + 1; i < snake.cells.length; i++) {
            // snake occupies same space as a body part. reset game
            //This will render the snake in random position after game over.

            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {

                score = 0;
                document.getElementById("score").innerHTML = "<b>Score:</b> " + score;

                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}

// listen to keyboard events to move the snake

document.addEventListener("keydown", function (e) {
    // prevent snake from backtracking on itself by checking that it's

    // not already moving on the same axis (pressing left while moving

    // left won't do anything, and pressing right while moving left

    // shouldn't let you collide with your own body)

    // left arrow key

    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;

        snake.dy = 0;
    }

    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;

        snake.dx = 0;
    }

    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;

        snake.dy = 0;
    }

    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;

        snake.dx = 0;
    }
});

// start the game

requestAnimationFrame(loop);
