

/* ---------- global variables ---------- */

var moving = true;
var gameover = false;
var loop;

var point = 0;
var cells;
var refresh_ms = 650; // Update interval [ms]
var level = 1;

var blocks = { // Block pattern
	i: {
		class: "i",
		pattern: [
			[0, 0, 0, 0],
			[1, 1, 1, 1]
		]
	},
	o: {
		class: "o",
		pattern: [
			[1, 1],
			[1, 1]
		]
	},
	t: {
		class: "t",
		pattern: [
			[0, 1, 0],
			[1, 1, 1]
		]
	},
	s: {
		class: "s",
		pattern: [
			[0, 1, 1],
			[1, 1, 0]
		]
	},
	z: {
		class: "z",
		pattern: [
			[1, 1, 0],
			[0, 1, 1]
		]
	},
	j: {
		class: "j",
		pattern: [
			[1, 0, 0],
			[1, 1, 1]
		]
	},
	l: {
		class: "l",
		pattern: [
			[0, 0, 1],
			[1, 1, 1]
		]
	},
}
var blockArray = permulation([0, 1, 2, 3, 4, 5, 6]); //The order in which the blocks appear

var isFalling = false;
var fallingBlockNum = 0;


/* ---------- main ---------------------- */

/* Initialization */
loadTable();

/* Keyboard input */
document.addEventListener("keydown", onKeyDown); //Monitor keyboard events

function onKeyDown(event) {
	if (event.keyCode === 37 && moving) { // Move left with the left arrow key
		moveLeft();
	} else if (event.keyCode === 39 && moving) { // Move right with the right arrow key
		moveRight();
	} else if (event.keyCode === 38 && moving) { // Rotate with the up arrow key
		rotate();
	} else if (event.keyCode === 40 && moving) { // Drop with the down arrow key
		fallTrough();
	} else if (event.keyCode === 72 && moving) { // hold at h (not implemented)
		hold();
	} else if (event.keyCode === 32 && !gameover) { // spacebar  Pause/Restart
		if (moving) {
			document.getElementById("point").textContent = "Pause";
			stop();
			moving = false;
		} else {
			mainLoop();
			moving = true;
		}
	}
}
// Check keyCode at http://keycode.info

/* Main loop */
mainLoop();

function mainLoop(){
	loop = setInterval(function() { // setInterval(function, interval) Repeat function every interval [ms]
/* Title count up */
		point++; // Increase the variable point by 1 to count several times
		document.getElementById("point").textContent = "Point: " + point; //Display the number of times in characters

		/* 1000Level up for each point*/
		if (level * 1000 < point) {
			level++;
			refresh_ms *= 0.9;
		}
		document.getElementById("level").textContent = "Level: " + level;

		/* Confirmation to continue the game */
		checkGameOver();

		/* Drop the block */
		if (hasFallingBlock()) {
			fallBlocks();
		} else {
			deleteCompleteRow();
			generateNewBlock();
		}

		//checkBase();
	}, refresh_ms);
}

function stop(){
	clearInterval(loop);
}

/* ---------- Function declaration ----------------- */


//This function is creating a 2d array with 20 rows and 20 columns
//Using a array makes storing or you know here the blocks
function loadTable() { // Match 200 td to each cell
	var td_array = document.getElementsByTagName("td");
	cells = [];
	var index = 0;
	for (var row = 0; row < 20; row++) {
		cells[row] = [];
		for (var col = 0; col < 10; col++) {
			cells[row][col] = td_array[index];
			index++;
		}
	}
}

function checkGameOver() {
	for (var row = 0; row < 2; row++) {
		for (var col = 0; col < 10; col++) {
			if (cells[row][col].className !== "" && cells[row][col].blockNum !== fallingBlockNum) {
				//alert("GAME OVER!\nRestart: Press F5")
				document.getElementById("error").style.display="block";
				clearInterval(loop); // If you keep counting even after the alert is issued, you will be alerted infinitely and it will be annoying, so stop
				// Even in this way, two alerts may appear, which is a mystery
				// Stop using alert
				gameover = true;
				moving = false;
			}
		}
	}
}

function hasFallingBlock() { // Check if there is a falling block
	return isFalling;
}

function fallBlocks() { // drop the block
/* // Empty the class in the bottom row
	for (var i = 0; i < 10; i++) {
		cells[19][i].className = "";
	}*/

	// 1. Isn't it at the bottom?
	for (var col = 0; col < 10; col++) {
		if (cells[19][col].blockNum === fallingBlockNum) {
			isFalling = false;
			return;
		}
	}

	// 2.Is there another block one square below?
	for (var row = 18; row >= 0; row--) {
		for (var col = 0; col < 10; col++) {
			if (cells[row][col].blockNum === fallingBlockNum) {
				if (cells[row+1][col].className !== "" && cells[row+1][col].blockNum !== fallingBlockNum) {
					isFalling = false;
					return;
				}
			}
		}
	}

	// Repeatedly lower the class from the second row from the bottom
	for (var row = 18; row >= 0; row--) {
		for (var col = 0; col < 10; col++) {
			if (cells[row][col].base) {
				//cells[row+1][col].textContent = "b";
				//cells[row][col].textContent = "";
				cells[row+1][col].base = true;
				cells[row][col].base = null;
			}
			if (cells[row][col].blockNum === fallingBlockNum) {
				cells[row+1][col].className = cells[row][col].className;
				cells[row+1][col].blockNum = cells[row][col].blockNum;
				cells[row][col].className = "";
				cells[row][col].blockNum = null;
			}
		}
	}
}

function deleteCompleteRow() { // Erase all lines
	var cntDeleteLine = 0;
	var row = 19;
	while(row >= 0) {
		var canDelete = true;
		for (var col = 0; col < 10; col++) {
			if (cells[row][col].className === "") {
				canDelete = false;
			}
		}
		if (canDelete) {
			// 1Erase
			for (var col = 0; col < 10; col++) {
				cells[row][col].className = "";
			}// Drop all blocks in the upper row by 1 square
			for (var downRow = row-1; downRow >= 0; downRow--) {
				for (var col = 0; col < 10; col++) {
					cells[downRow+1][col].className = cells[downRow][col].className;
					cells[downRow+1][col].blockNum = cells[downRow][col].blockNum;
					cells[downRow][col].className = "";
					cells[downRow][col].blockNum = null;
				}
			}
			//
			cntDeleteLine++;
		} else {
			row--;
		}
	}
	if (cntDeleteLine === 4) { // Display of the number of erased lines
		document.getElementById("information").textContent = "TETRIS";
		point += 1000;
	} else if (cntDeleteLine >= 2){
		document.getElementById("information").textContent = cntDeleteLine + " lines were deleted!";
		point += cntDeleteLine * 100;
	} else if (cntDeleteLine) {
		document.getElementById("information").textContent = cntDeleteLine + " line was deleted!";
		point += cntDeleteLine * 100;
	} else {
		document.getElementById("information").innerHTML = "<br>";
	}
}

function generateNewBlock() { // Randomly generate blocks
// 0. Delete the base point of the previous block
	for (var row = 0; row < 20; row++) {
		for (var col = 0; col < 10; col++) {
			if (cells[row][col].base) {
				cells[row][col].base = null;
			}
		}
	}

	// 1. Randomly select one pattern from the block patterns
	var keys = Object.keys(blocks);
	//var nextBlockKey = keys[Math.floor(Math.random() * keys.length)]; //Completely random (this can cause the same block to appear many times in a row)
	var nextFallingBlockNum = fallingBlockNum + 1;
	if (nextFallingBlockNum % keys.length == 0) {
		blockArray = permulation([0, 1, 2, 3, 4, 5, 6]);
	}
//	var nextBlockKey = (nextFallingBlockNum % blockArray.length == 0) ? keys[blockArray[blockArray.length - 1]] : keys[blockArray[nextFallingBlockNum % blockArray.length - 1]];
	if (nextFallingBlockNum % blockArray.length == 0) {
		var nextBlockKey = keys[blockArray[blockArray.length - 1]];
	} else {
		var nextBlockKey = keys[blockArray[nextFallingBlockNum % blockArray.length - 1]];
	}
	var nextBlock = blocks[nextBlockKey];
	// Display of the next next block
	var nextnextBlockKey = keys[blockArray[nextFallingBlockNum % blockArray.length]];
	var nextnextBlock = blocks[nextnextBlockKey];

	// 2. Place blocks based on the selected pattern
	var pattern = nextBlock.pattern;
	//cells[0][3].textContent = "b"; // Base point of rotation
	cells[0][3].base = true; //Base point of rotation
	for (var row = 0; row < pattern.length; row++) {
		for (var col = 0; col < pattern[row].length; col++) {
			if (pattern[row][col]) {
				cells[row][col+3].className = nextBlock.class; // The position to place is from the 4th square
				cells[row][col+3].blockNum = nextFallingBlockNum;
			}
		}
	}
// 3. Suppose there is a falling block
	isFalling = true;
	fallingBlockNum = nextFallingBlockNum;
}

function moveRight() { // Move the block to the right
	for (var row = 0; row < 20; row++) {
		if (cells[row][9].blockNum === fallingBlockNum) { // The block is on the far right
			//document.getElementById("hello_text").textContent = "firstJavaScript***";
			return;
		}
	}
	for (var row = 0; row < 20; row++) {
		for (var col = 8; col >= 0; col--) {
			if (cells[row][col].blockNum === fallingBlockNum && cells[row][col+1].className !== "" && cells[row][col+1].blockNum !== fallingBlockNum) { // There is another block on the right
				//document.getElementById("hello_text").textContent = "first JavaScript*****";
				return;
			}
		}
	}
	for (var row = 0; row < 20; row++) {
		for (var col = 8; col >= 0; col--) {
			if (cells[row][col].base) {
				//cells[row][col+1].textContent = "b";
				//cells[row][col].textContent = null;
				cells[row][col+1].base = true;
				cells[row][col].base = null;
			}
			if (cells[row][col].blockNum === fallingBlockNum) {
				//document.getElementById("hello_text").textContent = "First JavaScript moveRight";
				cells[row][col+1].className = cells[row][col].className;
				cells[row][col+1].blockNum = cells[row][col].blockNum;
				cells[row][col].className = "";
				cells[row][col].blockNum = null;
			}
		}
	}
}

function moveLeft() {
	for (var row = 0; row < 20; row++) {
		if (cells[row][0].blockNum === fallingBlockNum) { // The block is on the far left
			//document.getElementById("hello_text").textContent = "For the first timeJavaScript***";
			return;
		}
	}
	for (var row = 0; row < 20; row++) {
		for (var col = 1; col < 10; col++) {
			if (cells[row][col].blockNum === fallingBlockNum && cells[row][col-1].className !== "" && cells[row][col-1].blockNum !== fallingBlockNum) { // There is another block on the left
				//document.getElementById("hello_text").textContent = "For the first timeJavaScript*****";
				return;
			}
		}
	}
	for (var row = 0; row < 20; row++) {
		for (var col = 1; col < 10; col++) {
			if (cells[row][col].base) {
				//cells[row][col-1].textContent = "b";
				//cells[row][col].textContent = null;
				cells[row][col-1].base = true;
				cells[row][col].base = null;

			}
			if (cells[row][col].blockNum === fallingBlockNum) {
				//document.getElementById("hello_text").textContent = "first JavaScript moveRight";
				cells[row][col-1].className = cells[row][col].className;
				cells[row][col-1].blockNum = cells[row][col].blockNum;
				cells[row][col].className = "";
				cells[row][col].blockNum = null;
			}
		}
	}
}

function rotate() { // Rotate the block
// 1. Determine the range related to block rotation (blockRange ** 2 range)
	var blockRange = 0;
	var initRow, initCol;
	var blockClass;
	for (var row = 0; row < 20; row++) {
		for (var col = 0; col < 10; col++) {
			if (cells[row][col].blockNum === fallingBlockNum) {
				if (cells[row][col].className === "o") {
					return; // Square cannot rotate
				} else if (cells[row][col].className === "i") {
					blockRange = 4;
				} else {
					blockRange = 3;
				}
				blockClass = cells[row][col].className
				break;
			}
		}
	}
	// 2. Move to the starting cell
	for (var row = 0; row < 20; row++) {
		for (var col = 0; col < 10; col++) {
			if (cells[row][col].base) {
				initRow = row;
				initCol = col;
				break;
			}
		}
	}

	// 3.Check if another block exists in the range
	for (var i = 0; i < blockRange; i++) {
		for (var j = 0; j < blockRange; j++) {
			if (cells[initRow+i][initCol+j].className !== "" && cells[initRow+i][initCol+j].blockNum !== fallingBlockNum) {
				return; // Cannot rotate
			}
		}
	}

	// 4. Rotate the block
	var rotetedBlockClass;
	if (blockRange === 3) {
		rotetedBlockClass = [["","",""],["","",""],["","",""]]
	} else if (blockRange === 4) {
		rotetedBlockClass = [["","","",""],["","","",""],["","","",""],["","","",""]]
	}
	for (var i = 0; i < blockRange; i++) {
		for (var j = 0; j < blockRange; j++) {
			rotetedBlockClass[j][blockRange-1-i] = cells[initRow+i][initCol+j].className;
		}
	}
	for (var i = 0; i < blockRange; i++) {
		for (var j = 0; j < blockRange; j++) {
			cells[initRow+i][initCol+j].blockNum = null;
			cells[initRow+i][initCol+j].className = rotetedBlockClass[i][j];
			//cells[initRow+i][initCol+j].textContent = "c"
			if (rotetedBlockClass[i][j] !== "") {
				cells[initRow+i][initCol+j].blockNum = fallingBlockNum;
			}
		}
	}
}

function fallTrough() { // Drop to the point where it falls
	while(isFalling) {
		fallBlocks();
	}
}

function permulation(array) { // Randomly sorted permutations
	var answer = [];
	var n = array.length;
	for (var i = 0; i < n; i++) {
		pushKey = Math.floor(Math.random() * array.length);
		answer.push(array[pushKey]);
		array.splice(pushKey, 1);
	}
	return answer;
}

function checkBase() {
	for (var row = 0; row < 20; row++) {
		for (var col = 0; col < 10; col++) {
			if (cells[row][col].base) {
				cells[row][col].className = "base";
			}
		}
	}
}

//show and hide KeyInfo on button
function showkeyinfo() {
	var xv = document.getElementById("keyInfo");
	if (xv.style.display=="none") { xv.style.display = "block"; }
	else { xv.style.display = "none"; }
}