
// Start Timer
function startTimer() {
  gStartTime = Date.now();
  gTimerInterval = setInterval(function () {
    var msDiff = Date.now() - gStartTime;
    var secs = '' + parseInt((msDiff / 1000) % 60);
    if (secs.length === 1) {
      secs = '0' + secs;
    }

    var min = '' + parseInt(msDiff / 1000 / 60);
    if (min.length === 1) min = '0' + min;

    var passedTime = `${min}:${secs}`;
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = passedTime;
  }, 10);
}

// random number NOT inclusive max
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


// Render Board
function renderBoard(board) {

  var strHTML = '<table border="1"><tbody><table border="1"><tbody>';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      var className = 'cell cell' + i + '-' + j;
      if (!gIsCellClicked) {
        currCell = EMPTY;
        strHTML += `<td class="${className}" oncontextmenu="cellMarked(this,${i},${j})" 
          onclick="cellClicked(this,${i},${j})">${currCell}</td>`;
        continue;
      }
      if (currCell.isMarked) {
        currCell = FLAG;
      }
      else if (currCell.isShown) {
        currCell = (currCell.isMine) ? MINE : currCell.minesAroundCount; // Check this also(for hints)
      }
      else { currCell = EMPTY; }
      strHTML += `<td class="${className}" oncontextmenu="cellMarked(this,${i},${j})" onclick="cellClicked(this,${i},${j})">${currCell}</td>`;
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector('.board');
  elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

// renders entire board(isShown to all)
function renderGameOver() {
  for (var i = 0; i < gLevel.SIZE; i++) { 
    for (var j = 0; j < gLevel.SIZE; j++) {
      var currCell = gBoard[i][j];
      if (currCell.isMine) {
        currCell.isShown = true;
      }
      if (currCell.isMine && gGame.healthCount === 0) {
        currCell.isShown = true;
      }
      if (currCell.isMarked && currCell.isMine) {
        currCell.isMarked = false;
      } else {
        continue;
      }
    }
  }
  renderBoard(gBoard);
}

// renders status of current game
function renderCurrStatus() {

  var elScore = document.querySelector('.score');
  var elFlags = document.querySelector('.flags');
  var elHealth = document.querySelector('.health');
  elScore.innerHTML = `Score: ${gGame.shownCount}`;
  elFlags.innerHTML = `Flags remaining: ${gLevel.MINES - gGame.markedCount}`;
  elHealth.innerHTML = `Health: ${gGame.healthCount}`;
}

function newData() {
  gGame.healthCount = 3;
  gLives = false;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gMinesIdxs = [];
  clearInterval(gTimerInterval);
  gGame.isOn = false;
  gStartTime = 0;
  restartStatsBoard ()

}


function restartStatsBoard () {

  document.querySelector('.smile').innerHTML = '😀';
  document.querySelector('.score').innerHTML = 'Score:';
  document.querySelector('.flags').innerHTML = 'Flags:';
  document.querySelector('.health').innerHTML = 'Health:';
  document.querySelector('.timer').innerHTML = 'Click on cell to start';
  
  
}

function newGame(){
  newData();
  initGame();
  
}
