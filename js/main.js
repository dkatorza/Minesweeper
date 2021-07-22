'use strict'

//PAWNS
const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';

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
var gHint = false;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    healthCount: 3
};


//Disable mouse click menu 
// This function is called "Arrow function" ? or "Fat arrow" ?
document.addEventListener('contextmenu', event => event.preventDefault());

/*
function init() {
    renderBoard(gBoard);
    
}*/

function initGame() {
    gGame.isOn = false;
    buildBoard();
    setMines();
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
     gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        healthCount: 3
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
            var currCell = gBoard[i][j];
        }
    }
    return gBoard;
}
// we need to place mines in random cells
// we need to place them according to level difficulty
// we need to store their position
function setMines() {

    var minesCounter = 0;

    while (minesCounter < gLevel.MINES) {
        var iIdx = getRandomInteger(0, gBoard.length);
        var jIdx = getRandomInteger(0, gBoard[0].length);
        if (gBoard[iIdx][jIdx].isMine) {
            continue;
        }

        gBoard[iIdx][jIdx].isMine = true;
        gMinesIdxs.push({ iIdx, jIdx });
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
    if (gGame.isOn) {
        if (!gIsCellClicked) {
            startTimer();
            gIsCellClicked = true;
        }
        var currCell = gBoard[i][j];
        if (currCell.isMarked) return;

        if (!currCell.isMine) {
            currCell.isShown = true;
            gGame.shownCount++;

            expandShown({ i, j });
            renderCurrStatus();
        }
        else {
            if (gLives) {
                
                checkGameStatus();
                return

            } else {
                checkGameOver(true)
                return
            }
            ;
        }
    }
}



function cellMarked(elCell, i, j) {
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
        document.querySelector('.score').innerText = 'GAME LOST';
        document.querySelector('.smile').innerText = '🤯';
        gGame.isOn = false;
        clearInterval(gTimerInterval);
        renderGameOver();
        return;
    }

    if ((gGame.shownCount + gGame.markedCount) === (gLevel.SIZE * gLevel.SIZE)) {
        document.querySelector('.score').innerText = 'GAME WON';
        document.querySelector('.smile').innerText = '😎';
        gGame.isOn = false;
        clearInterval(gTimerInterval);
        renderGameOver();
        return;
    }
}

// cheking to see if landed on mine 
// if true and no health  - game lost
// also try to enter here some hint code so the player can know if there is mine there.
function checkGameStatus() {

    if (gGame.healthCount !== 0) {
        checkGameOver(false);
        gGame.healthCount--;
        renderCurrStatus()
    } else {
        checkGameOver(true)
    }

}

