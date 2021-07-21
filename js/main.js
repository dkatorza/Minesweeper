'use strict'
debugger
//PAWNS
const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';

//Globals
var gBoard;
var gameLives = 1;
var gLevel = [
    { SIZE: 4, MINES: 2 },
    { SIZE: 8, MINES: 12 },
    { SIZE: 12, MINES: 30 },
];


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};


var gTimeInterval;
var gStartTime;
var gIsCellClicked = false;
var gMinesIdxs = []; // Store mine placment

//init when cell clicked to start the game and counter. 
function init() {
    //clearInterval(intervalTimer);
    //lives = gameLives; maybe use later...
    gBoard = buildBoard();
    renderBoard(gBoard);
    gGame.isOn = true;
    //gGame.shownCount = 0;  - maybe use later..
    gGame.markedCount = 0;
    setMinesNegsCount(gBoard);
}

//Disable mouse click menu 
// This function is called "Arrow function" ? or "Fat arrow" ?
document.addEventListener('contextmenu', event => event.preventDefault());


// Levels ( later add more level as requierd)
// Think about puting this in another file

/*
function selectLevel(SIZE) {
    var level;
    switch (SIZE) {
        case 4: {
            level = {
                SIZE: 4,
                MINES: 2,
                LEVEL_DEF: "Too easy"
            }
            break;
        }
        default: {
            level = {
                SIZE: 4,
                MINES: 2,
                LEVEL_DEF: "Too easy"
            }
            break;
        }
    }
    return level;
};
*/

//Build board
function buildBoard() {debugger
    var gBoard = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            function CellProperty() {
                return {
                    minesAroundCount: 0,
                    isShown: false,
                    isMine: false,
                    isMarked: false
                }
            }
            gBoard[i][j] = CellProperty();
            var cell = gBoard[i][j];

        }
        return gBoard;
    }
}

// renderBoard is in Utils 

// we need to place mines in random cells
// we need to place them according to level difficulty
// we need to store their position
function creatMines() {

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


function countNegs(pos) {

    var negsCount = [];

    for (var i = 0; i <= pos.i + 1 && i < gLevel.SIZE; i++) {
        if (i < 0) continue;
        for (var j = pos.j - 1; j <= pos.j + 1 && j < gLevel.SIZE; j++) {
            if (j < 0 || (i === pos.i && j === pos.j)) continue
            if (gBoard[i][j].isMine) {
                negsCount.push({ i, j });
            }
        }

    }
    return negsCount;

}

// Send current game statuss
function renderCurrStatus() {

    var elFlags = document.querySelector('.flags');
    var elScore = document.querySelector('.score');

    elFlags.innerHTML = `YOU HAVE ${gLevel.MINES - gGame.markedCount} FLAGS`;
    elScore.innerHTML = `SCORE: ${gGame.shownCount}`;
}

//Called when a cell (td) is clicked

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
            checkGameOver(false); // reminder to add if have no more life
            renderCurrStatus();
        }
        else {
            checkGameOver(true);
            return;
        }
    }
}


/*
Called on right click to mark a cell (suspected to be a mine)
In locl i already set the event with arrow function. 
*/

// What happen if the first move of the playet is placing a flag..
function cellMarked(elCell, i, j) {
    if (gGame.isOn) {
        if (!gIsClicked) {
            startTimer();
            gIsClicked = true;
        }// Need to check if the cell is exposed and marked alredy
        var currCell = gBoard[i][j];
        if (currCell.isShown && !currCell.isMarked) return;
        if (gGame.markedCount < gLevel.MINES && !currCell.isMarked) { // need to check if the cell still not markd and the count is less than the mine.  
            currCell.isMarked = true;
            gGame.markedCount++;
        }
        else if (currCell.isMarked) {
            currCell.isMarked = false;
            gGame.markedCount--;
        }
        renderStats();
    }
    checkGameOver(false);
    renderBoard(gBoard);
}


//When user clicks a cell with no mines around.
//Show not only the cell, but also its neighbors.
// let's try negs function
function expandShown(board, elCell, i, j) {

    var currCell = gBoard[i][j];
    if (currCell.minesAroundCount) {
        elCell.classList.add(`clicked-${currCell.minesAroundCount}`)

    }
    currCell.isShown = true;
    gGame.shownCount++;
    elCell.innerText = (currCell.minesAroundCount) ? currCell.minesAroundCount : EMPTY;
    elCell.classList.add('clicked');
    if (currCell.minesAroundCount) return;
    else {
        for (var i = pos.i - 1; i <= pos.i + 1 && i < gLevel.SIZE; i++) {
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
            expandShown(board, elCell, i, j)
        }
    }
    renderBoard(gBoard);
    renderCurrStatus()
}




function checkGameOver(isOnMine) { //Also here check about life
    if (isOnMine) {
        document.querySelector('.score').innerText = 'YOU LOST';
        gGame.isOn = false;
        clearInterval(gTimerInterval);
        renderGameOver();
        return;
    }
    if ((gGame.shownCount + gGame.markedCount) === gGame.winCount) {
        document.querySelector('.score').innerText = 'YOU WON!!!';
        gGame.isOn = false;
        clearInterval(gTimerInterval);
        renderGameOver();
        return;
    }
}

function renderGameOver() {//Also here check about life
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) {
                currCell.isShown = true;
            }
            if (currCell.isMarked && currCell.isMine) {
                currCell.isMarked = false;
            } else { continue; }
        }
    }
    renderBoard(gBoard);
}