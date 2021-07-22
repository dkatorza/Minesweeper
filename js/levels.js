'use strict'

function chooseLevel(size) {
    var level;
    switch (size) {
        case 4: {
            level = {
                size: 4,
                mines: 2,
                name: "Easy"
            }
            break;
        }
        case 8: {
            level = {
                size: 8,
                mines: 12,
                name: "Hard"
            }
            break;
        }
        case 12: {
            level = {
                size: 12,
                mines: 30,
                name: "Extrenel"
            }
            break;
        }
        default: {
            level = {
                size: 4,
                mines: 2,
                name: "Easy"
            }
            break;
        }
    }
    return level;
}