'use strict'

//PAWNS
const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';
const LOOSE = '<img src= "./img/loose.png"/>';
const WIN = '<img src= "./img/win.png"/>'
const START ='<img src= "./img/start.png"/>'

//Globals
var gBoard;
var gLevelName = 'Easy';
var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame;
var gMinesIdxs = [];
var gTimerInterval;
var gStartTime;
var gIsCellClicked = false;
var gLives = true;
var gIsHint = false;

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    healthCount: 3,
    hints: 3
};


//Disable mouse click menu 
// This function is called "Arrow function" ? or "Fat arrow" ?

// its called arrow function, and we

document.addEventListener('contextmenu', event => event.preventDefault());



function initGame() {
    gIsCellClicked = false;
    gIsHint = false;
    buildBoard();

    renderBoard(gBoard);
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        healthCount: 3,
        hints: 3
    };

}


function buildCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function buildBoard() {
    gBoard = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = buildCell();
            //var currCell = gBoard[i][j];

            // you dont use the current cell here, remove it
        }
    }
    return gBoard;
}

// we need to place mines in random cells
// we need to place them according to level difficulty
// we need to store their position
function setMines() {

    var minesCounter = 0;

// you shouldn't use while - 
//you cant tell how many times it will run
// and we like to make sure how many itterations it will have. 
// instead, use a function that get empty cells and put mines in it by randomly picking cells. 
// its better, safer and more predictable.

    while (minesCounter < gLevel.MINES) {
        var randI = getRandomInteger(0, gBoard.length);
        var randJ = getRandomInteger(0, gBoard[0].length);
        if (gBoard[randI][randJ].isMine) {
            continue;
        }

        // not iIdx, you should call it i

        gBoard[randI][randJ].isMine = true;
        gMinesIdxs.push({ randI, randJ });
        minesCounter++;
    }
}


function countNegs(pos) {
    var negs = [];

    for (var i = pos.i - 1; i <= pos.i + 1 && i < gLevel.SIZE; i++) {
        if (i < 0) continue;

        for (var j = pos.j - 1; j <= pos.j + 1 && j < gLevel.SIZE; j++) {
            if (j < 0 || (i === pos.i && j === pos.j)) continue;
            if (gBoard[i][j].isMine) {
                negs.push({ i, j });
            }
        }
    }
    return negs;
}


//Count mines around each cell 
//and set the cell's minesAroundCount
//minesAroundCount is in the gBoard.

function setMinesNegsCount(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currPos = { i, j };
            var currMines = countNegs(currPos);
            board[i][j].minesAroundCount = currMines.length;
        }
    }
}

// Called when a cell (td) is clicked.
// Each click checks if game won or lost.
function cellClicked(elCell, i, j) {

    // better to check if game isn't on, if so - return;

    if (gGame.isOn) {
        if (!gIsCellClicked) {
            startTimer();
            gIsCellClicked = true;
            setMines();
            setMinesNegsCount(gBoard);

        }
        var currCell = gBoard[i][j];
        if (currCell.isMarked) return;

        if (!currCell.isMine) {
            currCell.isShown = true;
            gGame.shownCount++;

            expandShown({ i, j });
            renderCurrStatus();

        } else if (gLives) {
            checkHealthStatus();
            renderCell({ i, j }, MINE);
            setTimeout(() => {
                renderCell({ i, j }, EMPTY);

            }, 1000);
            return
        } else {
            checkGameOver(true)
            return
        };
    }
}




function cellMarked(elCell, i, j) {

    // same here for the if

    if (gGame.isOn) {
        if (!gIsCellClicked) {
            startTimer();
            gIsCellClicked = true;
        }
        var currCell = gBoard[i][j];
        if (currCell.isShown && !currCell.isMarked) return;
        if (gGame.markedCount < gLevel.MINES && !currCell.isMarked) {
            currCell.isMarked = true;
            gGame.markedCount++;
        }
        else if (currCell.isMarked) {
            currCell.isMarked = false;
            gGame.markedCount--;
        }
        renderCurrStatus();
    }
    checkGameOver(false);
    renderBoard(gBoard);
}

//When user clicks a cell with no mines around.
//Show not only the cell, but also its neighbors.
// let's try negs function

function expandShown(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1 && i < gLevel.SIZE; i++) {
        if (i < 0) continue;
        for (var j = pos.j - 1; j <= pos.j + 1 && j < gLevel.SIZE; j++) {
            if (j < 0) continue;
            var currCell = gBoard[i][j];
            if (currCell.isShown) continue;
            if (currCell.isMarked) continue;
            if (!currCell.isMine) {
                currCell.isShown = true;
                gGame.shownCount++;
            }
        }
    }
    renderBoard(gBoard);
    renderCurrStatus()
}


// checks if landed on a mine or won the game
function checkGameOver(isOnMine) {
    if (isOnMine) {
        document.querySelector('.score').innerText = 'GAME OVER!';
        document.querySelector('.smile').innerHTML = LOOSE;
        gGame.isOn = false;
        clearInterval(gTimerInterval);  
        renderGameOver();
        return;
    }
    
    if ((gGame.shownCount + gGame.markedCount) === (gLevel.SIZE * gLevel.SIZE)) {
        document.querySelector('.score').innerText = 'GAME WON!';
        document.querySelector('.smile').innerHTML = WIN;
        gGame.isOn = false;
        clearInterval(gTimerInterval);
        renderGameOver();
        return;
    }
}

// cheking to see if landed on mine 
// if true and no health  - game lost
// also try to enter here some hint code so the player can know if there is mine there.
function checkHealthStatus() {

    if (gGame.healthCount !== 0) {
        checkGameOver(false);
        gGame.healthCount--;
        renderCurrStatus()

    } else {
        checkGameOver(true)
    }

}

function checkHintsStatus() {

    if (gGame.hints !== 0) {
        checkGameOver(false);
        gGame.hints--;
        renderCurrStatus()

    } else {
        checkGameOver(true)
    }

}
