
function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < gLevel.SIZE; i++) {
      strHtml += '<tr>'
      for (var j = 0; j < gLevel.SIZE; j++) {
        var cell = '';
        if (board[i][j].isShown) {
          cell = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;
        }
        if (board[i][j].isMarked) {
          cell = FLAG;
        }
        var cellClass = getClassName({ i: i, j: j })
        strHtml += `<td class="cell ${cellClass}"
        className ="${cell}" 
        onmousedown="cellClicked(event,${i},${j})"
            >${cell}</td>`
      }
      strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml
  }
