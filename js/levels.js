'use strict'

function chooseLevel(elBtn) {
    gLevelName = elBtn.innerText;
    switch (gLevelName) {
        case 'Easy':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
         
            break;
        case 'Medium':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
          
            break;
        case 'Hard':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
         
            break;
    }
    newGame();
   
}   

