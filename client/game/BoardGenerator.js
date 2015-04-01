var BoardConstants = require('../constants/BoardConstants');
var BoardSolver = require('./BoardSolver');
var BoardUtils = require('./BoardUtils');
var Immutable = require('immutable');
var RandomGenerator = require('./RandomGenerator');
var RandomRemoveGenerator = require('./RandomRemoveGenerator');

var BoardGenerator = function() {};

// BoardGenerator.GenerateBoard generates a valid sudoku board.
// It first generates a valid solved board, then randomly removes tiles.  If
// the board is no longer valid after removing the tiles, it starts removing
// tiles again from the valid solved board.
BoardGenerator.GenerateBoard = function(difficulty) {
  var seedBoard = BoardGenerator._RandomFullBoard();
  var numTiles = BoardConstants.TILES[difficulty];
  return BoardGenerator._BoardRemoveRandomTiles(seedBoard, numTiles);
};

// BoardGenerator.GenerateAdditiveBoard Generates a valid board by randomly 
// adding valid tiles to an empty board.  
// Restarts from scratch if the board does not have a unique solution.
// This approach is much slower than BoardGenerator.GenerateBoard.
BoardGenerator.GenerateAdditiveBoard = function(difficulty) {
  var numTiles = BoardConstants.TILES[difficulty];
  return BoardGenerator._NewAdditiveBoard(numTiles);
}

// BoardGenerator._RandomFullBoard returns a full and valid randomly generated
// sudoku board.
BoardGenerator._RandomFullBoard = function() {
  var generator = new RandomGenerator(true);
  while (generator.tiles.size > 0) {
    generator.next();
    if (!generator.valid) {
      generator = new RandomGenerator(true);
    }
  }
  return generator.board;
};

// BoardGenerator._BoardRemoveRandomTiles randomly removes tiles until the 
// number specified by tiles is reached.  If the board is no longer valid after
// a tile remover, it starts over again.
BoardGenerator._BoardRemoveRandomTiles = function(board, tiles) {
  var validBoard = null;
  var removedTiles = 0;
  var boardCopy = BoardUtils._DeepCopy(board);
  var generator = new RandomRemoveGenerator(boardCopy);
  while (validBoard == null) {
    while (removedTiles < tiles) {
      generator.next();
      removedTiles++;
    }
    var valid = BoardSolver._Solve(BoardUtils._DeepCopy(generator.board)).valid;
    if (valid) {
     validBoard = generator.board; 

    // Board isn't valid, start over and try again
    } else {
      removedTiles = 0;
      boardCopy = BoardUtils._DeepCopy(board);
      generator = new RandomRemoveGenerator(boardCopy);
    }
  }
  return generator.board;
};

BoardGenerator._NewAdditiveBoard = function(tiles) {
  var addedTiles = 0;
  var validBoard = null;
  var generator = new RandomGenerator(false);
  while (validBoard == null) {
    while (addedTiles < (81 - tiles)) {
      generator.next();
      addedTiles++;
    }
    var valid = BoardSolver._Solve(BoardUtils._DeepCopy(generator.board)).valid;
    if (valid) {
      validBoard = generator.board;
    } else {
      addedTiles = 0;
      generator = new RandomGenerator(false);
    }
  }
  return validBoard;
}

module.exports = BoardGenerator;
