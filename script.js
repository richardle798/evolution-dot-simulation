$(document).ready(() => {
    var board;
    var columnCount = 64;
    var rowCount = 64;
    var cellSize;
    var speciesArr;
    var iterationCount;

    firstBoardInit();

    function drawTile(x, y) {
        let canvas = $('.board')[0];
        let ctx = canvas.getContext('2d');

        let tile = board[y][x];

        ctx.beginPath();
        ctx.rect(x * cellSize, y * cellSize, cellSize, cellSize);

        ctx.fillStyle = speciesArr[tile.species].color;
        ctx.fill();
        ctx.stroke();
    }

    function updateBoard() {
        if(iterationCount == maxIteration) {
            boardInit();
        }
        else {
            
        }
    }

    function drawBoard() {
        let canvas = $('.board')[0];

        let cellLength = Math.floor(Math.min($(window).height() * .05, $(window).width() * .05));

        canvas.height = cellLength * rowCount;
        canvas.width = cellLength * columnCount;
        cellSize = cellLength;

        for (let y = 0; y < rowCount; y++) {
            for (let x = 0; x < columnCount; x++) {
                drawTile(x, y);
            }
        }
    }

    function firstBoardInit() {
        boardInit();
        setInterval(updateBoard(), 1000);
    }

    function boardInit() {
        speciesArr = new Array();

        let noSpecies = {
            color: "black",
            attributeOne: 0,
            attributeTwo: 0,
            attributeThree: 0
        };
        speciesArr.push(noSpecies);

        let speciesOne = {
            color: "red"
        };
        let speciesTwo = {
            color: "blue"
        };
        let speciesThree = {
            color: "white"
        };
        let speciesFour = {
            color: "green"
        };
        let speciesFive = {
            color: "pink"
        };

        speciesArr.push(speciesOne);
        speciesArr.push(speciesTwo);
        speciesArr.push(speciesThree);
        speciesArr.push(speciesFour);
        speciesArr.push(speciesFive);

        for (let i = 1; i < speciesArr.length; i++) {
            let species = speciesArr[i];
            species.attributeOne = Math.floor(Math.random() * 5);
            species.attributeTwo = Math.floor(Math.random() * 5);
            species.attributeThree = Math.floor(Math.random() * 5);
        }

        board = new Array();
        for (var y = 0; y < rowCount; y++) {
            let row = new Array();
            for (var x = 0; x < columnCount; x++) {
                let tile = {
                    species: 0,
                    attributeOne: Math.floor(Math.random() * 5),
                    attributeTwo: Math.floor(Math.random() * 5),
                    attributeThree: Math.floor(Math.random() * 5)
                };
                row.push(tile);
            }
            board.push(row);
        }

        //initialize species locations
        for (let i = 1; i < speciesArr.length; i++) {
            let x = Math.floor(Math.random() * columnCount);
            let y = Math.floor(Math.random() * rowCount);
            while (board[y][x] != 0) {
                x = Math.floor(Math.random() * columnCount);
                y = Math.floor(Math.random() * rowCount);
            }

            board[y][x].species = i;
        }

        iterationCount = 0;
        drawBoard();
    }

    function calculateAdjacentFlags(x, y) {
        let adjacentFlags = 0;

        for (var yOffset = -1; yOffset <= 1; yOffset++) {
            for (var xOffset = -1; xOffset <= 1; xOffset++) {
                if (yOffset == 0 && xOffset == 0) {
                    continue;
                }
                if (isFlagged(x + xOffset, y + yOffset)) {
                    adjacentFlags++;
                }
            }
        }

        return adjacentFlags;
    }

    function revealNeighbors(x, y) {
        for (var yOffset = -1; yOffset <= 1; yOffset++) {
            for (var xOffset = -1; xOffset <= 1; xOffset++) {
                if (yOffset == 0 && xOffset == 0) {
                    continue;
                }
                let newX = x + xOffset;
                let newY = y + yOffset;
                if (newY < 0 || newY > board.length - 1 ||
                    newX < 0 || newX > board[0].length - 1 ||
                    isFlagged(newX, newY)) {
                    continue;
                }
                let neighbor = board[newY][newX]
                if (!neighbor.isRevealed) {
                    neighbor.isRevealed = true;
                    remainingHiddenTiles--;
                    updateDisplay(newX, newY);
                }
            }
        }
    }
});