$(document).ready(() => {
    var board;
    const columnCount = 64;
    const rowCount = 64;
    var cellSize;
    var speciesArr;
    var iterationCount;
    const maxIteration = 100;

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

    function calculateWeight(speciesX,speciesY,terrainX,terrainY) {
        let terrainTile = board[terrainY][terrainX];
        let species = speciesArr[board[speciesY][speciesX].species];

        if(speciesX === terrainX && speciesY === terrainY && terrainTile.species === 0){
            return 100;
        }
        
        return species.attributeOne * terrainTile.attributeOne +
            species.attributeTwo * terrainTile.attributeTwo +
            species.attributeThree * terrainTile.attributeThree;
    }

    function updateTile(x,y) {
        let weightSum = 0;
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            for (let xOffset = -1; xOffset <= 1; xOffset++) {
                let newX = x + xOffset;
                let newY = y + yOffset;
                if (newY < 0 || newY > board.length - 1 ||
                    newX < 0 || newX > board[0].length - 1) {
                    continue;
                }

                weightSum += calculateWeight(newX,newY,x,y);
            }
        }

        if(weightSum === 0) {
            return board[y][x];
        }

        let randomWeight = Math.floor(Math.random()*weightSum);
        let currentWeightSum = 0;

        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            for (let xOffset = -1; xOffset <= 1; xOffset++) {
                let newX = x + xOffset;
                let newY = y + yOffset;
                if (newY < 0 || newY > board.length - 1 ||
                    newX < 0 || newX > board[0].length - 1) {
                    continue;
                }

                currentWeightSum += calculateWeight(newX,newY,x,y);
                if(randomWeight < currentWeightSum){
                    let oldTile = board[y][x];
                    let newTile = {
                        species: board[newY][newX].species,
                        attributeOne: oldTile.attributeOne,
                        attributeTwo: oldTile.attributeTwo,
                        attributeThree: oldTile.attributeThree
                    };

                    return newTile;
                }
            }
        }
        console.log("we've got a problem!");
        return null;
    }

    function drawBoard() {
        let canvas = $('.board')[0];

        let maxCanvasSize = Math.min($(window).height() * 0.75, $(window).width() * 0.9);
        let maxDivision = Math.max(columnCount, rowCount);	
        let cellLength = Math.floor(maxCanvasSize / maxDivision);	
        let canvasLength = cellLength * maxDivision;

        canvas.height = canvasLength;
        canvas.width = canvasLength;
        cellSize = cellLength;

        for (let y = 0; y < rowCount; y++) {
            for (let x = 0; x < columnCount; x++) {
                drawTile(x, y);
            }
        }
    }

    function firstBoardInit() {
        boardInit();
        setInterval(function updateBoard() {
            if(iterationCount === maxIteration) {
                boardInit();
            }
            else {
                let newBoard = new Array();
                for (let y = 0; y < rowCount; y++) {
                    let row = new Array();
                    for (let x = 0; x < columnCount; x++) {
                        let updatedTile = updateTile(x,y);
                        row.push(updatedTile);
                    }
                    newBoard.push(row);
                }
                board = newBoard;
                drawBoard();
                iterationCount++;
            }
        }, 50);
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
            color: "purple"
        };

        speciesArr.push(speciesOne);
        speciesArr.push(speciesTwo);
        speciesArr.push(speciesThree);
        speciesArr.push(speciesFour);
        speciesArr.push(speciesFive);

        for (let i = 1; i < speciesArr.length; i++) {
            let species = speciesArr[i];
            species.attributeOne = Math.floor(Math.random() * 10);
            species.attributeTwo = Math.floor(Math.random() * 10);
            species.attributeThree = Math.floor(Math.random() * 10);
        }

        board = new Array();
        for (let y = 0; y < rowCount; y++) {
            let row = new Array();
            for (let x = 0; x < columnCount; x++) {
                let tile = {
                    species: 0,
                    attributeOne: Math.ceil(Math.random() * 10),
                    attributeTwo: Math.ceil(Math.random() * 10),
                    attributeThree: Math.ceil(Math.random() * 10)
                };
                row.push(tile);
            }
            board.push(row);
        }

        //initialize species locations
        for (let i = 1; i < speciesArr.length; i++) {
            let x = Math.floor(Math.random() * columnCount);
            let y = Math.floor(Math.random() * rowCount);
            while (board[y][x].species != 0) {
                x = Math.floor(Math.random() * columnCount);
                y = Math.floor(Math.random() * rowCount);
            }

            board[y][x].species = i;
        }

        iterationCount = 0;
        drawBoard();
    }
});