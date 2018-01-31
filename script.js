//future refactoring:
//break this all up into classes? Or is that not necessary...
//...basically look through all of the functions
//right now and figure out how to reduce the number of passes variables;
//break out of bounds into its own function
//break out tallying square numbers into its own function
//

class Player {
	constructor(name, playerScore, size, playerData, bestScore, password) {
		this.name = name;
		this.score = playerScore;
		this.size = size;
		this.data = playerData;
		this.bestScore = bestScore;
		this.password = password;
	}
}

let loopCounter = 0;

document.getElementById('passPara').style.display = 'none';
document.getElementById('enterName').addEventListener('click', playerPass);
document.getElementById('enterPass').addEventListener('click', setUp);

function playerPass() {
	document.getElementById('namePara').style.display = 'none';
	document.getElementById('passPara').style.display = 'block';
}

function setUp() {	
	if (setUpPass()) {
		document.getElementById('passPara').style.display = 'none';
		password = document.getElementById("playerPassword1").value;
		playerName = document.getElementById("playerName").value.toLowerCase();
		playerData = JSON.parse(localStorage.getItem(playerName));
		//let boardSize = prompt("How big would you like the board?");
		let boardSize = 10;

		if (playerData === null) {
			playerData = {"name": playerName, "playerScore": 0, "size": 0, "playerData": null, "bestScore": 0, "password": password};
			localStorage.setItem(playerName, JSON.stringify(playerData));
			bestScore = 0;
			playerOne = new Player(playerName, 0, boardSize, playerData, bestScore, password);
			playerName = capitalizeName(playerName);
			document.getElementById('scorePara').innerHTML = "Good luck, " + playerName;
		} else {
			bestScore = playerData.bestScore;
			playerOne = new Player(playerData.playerName, 0, boardSize, playerData, bestScore, playerData.password);
			playerName = capitalizeName(playerName);
			document.getElementById('scorePara').innerHTML = "Welcome back, " + playerName + ". Previous best score: " + playerData.bestScore;
		}
		
		createMineArr(playerOne);
	}
}

function capitalizeName(name) {
	return name.charAt(0).toUpperCase() + name.slice(1);
}

function setUpPass() {
	let passOne = document.getElementById("playerPassword1").value;
	let passTwo = document.getElementById("playerPassword2").value;
	console.log(passOne, passTwo);
	let playerName = document.getElementById("playerName").value.toLowerCase();
	let playerData = JSON.parse(localStorage.getItem(playerName));
	console.log(playerData);
	if (validate(playerName, passOne, passTwo, playerData)) {
		return true;
	}
}

function erasePassword() {
	document.getElementById('playerPassword1').value = '';
	document.getElementById('playerPassword2').value = '';
}

function validate(playerName, passOne, passTwo, playerData) {
	if (passOne === passTwo) {
		if (playerData === null) {
			return true;
		} else {
			console.log(passOne, passTwo);
			console.log(playerData.password);
			if (passOne === playerData.password) {
				return true;		
			} else {
				alert("Incorrect password...");
				return false;
			}
		}
	} else {
		alert("Your passwords don't match, please check your typing and try again!");
		return false;
	}
}

function createMineArr(playerOne) {	
	let mineArr = new Object(playerOne.size);
	for (let i = 0; i < playerOne.size; i++) {
		mineArr[i] = new Object(playerOne.size);
		for (let k = 0; k < playerOne.size; k++) {
			mineArr[i][k] = {value: 0, status: 'closed', counted: 0};
		}
	}
	playerOne.mineArr = mineArr;
	createBoard(playerOne);
}

function createBoard(playerOne) {
	populateMines(playerOne);
	let grid = document.createElement('table');
	grid.className = 'grid';
	document.getElementById('game-board').appendChild(grid);
	let elementArr = new Object(playerOne.size);
	for (let i = 0; i < playerOne.size; i++) {
		let tr = grid.appendChild(document.createElement('tr'));
		elementArr[i] = new Object(playerOne.size);
		for (let k = 0; k < playerOne.size; k++) {
			elementArr[i][k] = addSquare(i, k, tr, playerOne);
		}
	}
	playerOne.elementArr = elementArr;
}

function addSquare(i, k, tr, playerOne) {
	let cell = tr.appendChild(document.createElement('td'));
	let spaceElement = document.createElement('img');
	spaceElement.setAttribute('data-id', playerOne.mineArr[i][k].value);
	spaceElement.setAttribute('src', 'images/Minesweeper_0.png');
	spaceElement.setAttribute('locX', i);
	spaceElement.setAttribute('locY', k);
	spaceElement.addEventListener('click', function() {clickFunction(event, playerOne)});
	cell.appendChild(spaceElement);
	return spaceElement;
}

function clickFunction(e, playerOne) {
	let xLoc = e.target.getAttribute('locX');
	let yLoc = e.target.getAttribute('locY');
	if (!checkWin(playerOne)) {
		if (e.button != 2) {
			if (playerOne.mineArr[xLoc][yLoc].value > 9) {
				playerOne.elementArr[xLoc][yLoc].setAttribute('src', 'images/Minesweeper_bomb.png')
				endGame(playerOne);
			}
			checkForMine(xLoc, yLoc, playerOne);
			updateBoard(playerOne);
			console.log(playerOne.score);
		} else if (playerOne.mineArr[xLoc][yLoc].status != 'open'){
			playerOne.elementArr[xLoc][yLoc].setAttribute('src', 'images/Minesweeper_flag.png');
		}
		document.getElementById('score').innerHTML = 'Player Score: ' + playerOne.score;
	} else {
		alert("You won!!!! Adding fifty to your score!");
		playerOne.score += 50;
		endGame(playerOne);
	}
}

function checkWin(playerOne) {
	let win = true;
	for (let i = 0; i < playerOne.size; i++) {
		for (let k = 0; k < playerOne.size; k++) {
			if (playerOne.mineArr[i][k].status === 'closed' && playerOne.mineArr[i][k].value < 10) {
				win = false;
			}
		}
	}
	return win;
}

function revealBoard(playerOne) {
	for (let i = 0; i < playerOne.size; i++) {
		for (let k = 0; k < playerOne.size; k++) {
			if (playerOne.mineArr[i][k].value === 0) {
				playerOne.elementArr[i][k].setAttribute('src', 'images/Minesweeper_10.png');
			} else {
				playerOne.elementArr[i][k].setAttribute('src', 'images/Minesweeper_' + playerOne.mineArr[i][k].value + '.png');
			}
		}
	}
}

function updateBoard(playerOne) {
	for (let i = 0; i < playerOne.size; i++) {
		for (let k = 0; k < playerOne.size; k++) {
			if (playerOne.mineArr[i][k].status === 'open') {
				if (playerOne.mineArr[i][k].value < 10) {
					if (playerOne.mineArr[i][k].counted != 1) {
						if (playerOne.mineArr[i][k].value === 0) {
							playerOne.score += 1;
							playerOne.mineArr[i][k].counted = 1;
							playerOne.elementArr[i][k].setAttribute('src', 'images/Minesweeper_10.png');
						} else {
							playerOne.score += 1;
							playerOne.elementArr[i][k].setAttribute('src', 'images/Minesweeper_' + playerOne.mineArr[i][k].value + '.png');
							playerOne.mineArr[i][k].counted = 1;
						}
					}
				} 
			}
		}
	}
}

 
function populateMines(playerOne) {
	let randomNum = Math.floor(Math.random() * playerOne.size) + 5;
//if the random number is less than five (less than five mines) add ten to it to 
//ensure that there is a sufficient number of mines	
	if (randomNum < 10) {
		randomNum += 5;
	}
	
	let x, y = 0;
	
	for (let i = 0; i < randomNum; i++) {
		x = Math.floor(Math.random() * playerOne.size);
		y = Math.floor(Math.random() * playerOne.size);

//Make sure that we are not going out of bounds when checking the addition of
//counters on the spaces in the next if statement
		if (x + 1 > playerOne.size - 1) {
			x -=1;
		} else if (x - 1 < 0) {
			x += 1;
		}
		if (y + 1 > playerOne.size - 1) {
			y -= 1;
		} else if (y - 1 < 0) {
			y += 1;
		}

//Check to make sure there isn't already a mine there, if there is
//remove one from the loop counter and continue on
		if (playerOne.mineArr[x][y].value != 10) {
			playerOne.mineArr[x][y].value = 10;
			playerOne.mineArr[x+1][y].value += 1;
			playerOne.mineArr[x-1][y].value += 1;
			playerOne.mineArr[x][y+1].value += 1;
			playerOne.mineArr[x][y-1].value += 1;
			playerOne.mineArr[x+1][y+1].value += 1;
			playerOne.mineArr[x-1][y-1].value += 1;
			playerOne.mineArr[x+1][y-1].value += 1;
			playerOne.mineArr[x-1][y+1].value += 1;
		} else {
			i -= 1;
		}
	}
}

function checkForMine(x, y, playerOne) {
	console.log(playerOne);
	x = parseInt(x);
	y = parseInt(y);
	if (playerOne.mineArr[x][y].status != 'open') {
		if (playerOne.mineArr[x][y].value < 10) {
			if (playerOne.mineArr[x][y].value > 0) {
				playerOne.mineArr[x][y].status = 'open';
				return;
			} else {
				playerOne.mineArr[x][y].status = 'open';
				if (checkArrayDownXIndex(x)) {
					checkForMine(x-1, y, playerOne);
				}
				if (checkArrayUpXIndex(x, playerOne.size)) {
					checkForMine(x+1, y, playerOne);
				}
				if (checkArrayDownYIndex(y)) {
					checkForMine(x, y-1, playerOne);
				}
				if (checkArrayUpYIndex(y, playerOne.size)) {
					checkForMine(x, y+1, playerOne);
				} 
				if (checkArrayUpXIndex(x, playerOne.size) && checkArrayUpYIndex(y, playerOne.size)) {
					checkForMine(x+1, y+1, playerOne);
				}
				if (checkArrayDownXIndex(x) && checkArrayDownYIndex(y)) {
					checkForMine(x-1, y-1, playerOne);	
				}
				if (checkArrayDownXIndex(x) && checkArrayUpYIndex(y, playerOne.size)) {
					checkForMine(x-1, y+1, playerOne);
				}
				if (checkArrayUpXIndex(x, playerOne.size) && checkArrayDownYIndex(y)) {
					checkForMine(x+1, y-1, playerOne);
				}
			}
		}
	} 
}

function checkArrayDownXIndex(x) {
	if (x > 0) {
		return true;
	}
	return false;
}
function checkArrayUpXIndex(x, size) {
	if (x+1 < size - 1) {
		return true;
	}
	return false;
}
function checkArrayDownYIndex(y) {
	if (y > 0) {
		return true;
	}
	return false;
}
function checkArrayUpYIndex(y, size) {
	if (y+1 < size - 1) {
		return true;
	}
	return false;
}

function endGame(playerOne) {
	console.log("Final score: " + playerOne.score);
	if (playerOne.score > playerOne.bestScore) {
		let data = {"name": playerOne.name, "playerScore": playerOne.score, "size": playerOne.size, "playerData": playerOne.data, "bestScore": playerOne.score, "password": playerOne.password};
		localStorage.setItem(playerOne.name, JSON.stringify(data));
	} else {
		let data = {"name": playerOne.name, "playerScore": playerOne.score, "size": playerOne.size, "playerData": playerOne.data, "bestScore": playerOne.bestScore, "password": playerOne.password};
		localStorage.setItem(playerOne.name, JSON.stringify(data));
	}
	revealBoard(playerOne);
	alert("Final score " + playerOne.score);
	cleanBoard();
}

function cleanBoard() {
	location = location;
	gamePlay();
}