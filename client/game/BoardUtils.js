var Immutable = require('immutable');
var BoardConstants = require('../constants/BoardConstants');

var BoardUtils = function() {};

BoardUtils._KnownValue = function(board) {
  var possibilities = BoardUtils._GetAllPossibilities(board);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (possibilities[i][j].length == 1) {
        return {
          x: i,
          y: j,
          value: possibilities[i][j][0]
        };
      }
    }
  }
  return null;
};

BoardUtils._RandomValidValue = function(board, x, y) {
  var possibilities = BoardUtils._GetPossibilities(board, x, y);
  if (possibilities.length == 0) {
    return 0;
  }
  return BoardUtils._RandomFromSet(Immutable.Set(possibilities));
};

// BoardUtils._BoardIsFilled returns true if the board is completely filled
// (i.e. has no 0 values)
BoardUtils._BoardIsFilled = function(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (board[i][j] == 0) {
        return false;
      }
    }
  }
  return true;
}

// BoardUtils._AddValue inserts value into the board at location x y.
BoardUtils._AddValue = function(board, x, y, value) {
  var newBoard = board;
  newBoard[x][y] = value;
  return newBoard;
}

// BoardUtils._GetAllPossibilities returns a 3d array of possible
// values for every location in board.
BoardUtils._GetAllPossibilities = function(board) {
  var possibilities = [];
  for (var i = 0; i < board.length; i++) {
    possibilities.push([]);
    for (var j = 0; j < board.length; j++) {
      possibilities[i].push(BoardUtils._GetPossibilities(board, i, j));
    }
  }
  return possibilities;
}

// BoardUtils._GetPossibilities returns all of the possible values
// at a given x y location.
BoardUtils._GetPossibilities = function(board, x, y) {
  if (board[x][y] != 0) {
    return [];
  }
  var row = board[x];
  var column = BoardUtils._GetColumn(board, y);
  var grid = BoardUtils._GetGrid(board, x, y);
  var possibilities = BoardConstants.VALID_NUMBERS;
  for (var i = 0; i < board.length; i++) {
    possibilities = possibilities.delete(row[i])
                                 .delete(column[i])
                                 .delete(grid[i]);
  }
  return possibilities.toArray();
}

BoardUtils._GetColumn = function(board, col) {
  var column = [];
  for (var i = 0; i < board.length; i++) {
    column.push(board[i][col]);
  }
  return column;
}

BoardUtils._GetGrid = function(board, row, column) {
  var gridMap = BoardConstants.GRID_MAP;
  var gridLoc = gridMap[row][column];
  var grid = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (gridLoc == gridMap[i][j]) {
        grid.push(board[i][j]);
      }
    }
  }
  return grid;
};

// BoardUtils._TileKeys generates an array 0..1..81 representing all of the
// sudoku tile locations
BoardUtils._TileKeys = function() {
  var tileKeys = [];
  for (var i = 0; i < 81; i++) {
    tileKeys.push(i);
  }
  return tileKeys;
};

// BoardUtils._RandomFromSet returns a random value from the given immutable
// set
BoardUtils._RandomFromSet = function(set) {
  var array = set.toArray();
  // Line copied and pasted from stack overflow; ~~ does bit shifting to the
  // nearest integer value
  return array[~~(Math.random() * array.length)];
};

BoardUtils._DeepCopy = function(board) {
  var newBoard = [];
  for (var i = 0; i < board.length; i++) {
    newBoard.push(board[i].slice(0));
  }
  return newBoard;
};

module.exports = BoardUtils;
