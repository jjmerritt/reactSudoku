var BoardConstants = require('../constants/BoardConstants');
var Immutable = require('immutable');

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

// RandomGenerator is a generator for randomly generating a completed valid 
// sudoku board.
var RandomGenerator = function(backprop) {
  this.board = BoardGenerator._DeepCopy(BoardConstants.EMPTY);
  this.tiles = Immutable.Set(BoardGenerator._TileKeys());
  // this.backprop tells the generator whether to use backpropogation to 
  // speed up a full board creation;
  this.backprop = backprop;
  this.valid = true;
};

// RandomGenerator.prototype.next iterates the next step of the generator; each
// step adds a tile to the board.
// We can reduce the number of times we have to reset the generator by keeping a
// list of possible values at each location, updating the possible values as 
// we fill in each random tile.  If a list ever becomes a singleton we can
// just fill in the actual value and update this.tiles accordingly
// TODO: Optimize so we don't have to reset as often
RandomGenerator.prototype.next = function() {
  var tile = BoardGenerator._RandomFromSet(this.tiles);
  var row = Math.floor(tile / 9);
  var col = tile % 9;
  var value = BoardGenerator._RandomValidValue(this.board, row, col);
  if (value != 0) {
    this.board[row][col] = value;
    this.tiles = this.tiles.delete(tile);
    
    if (this.backprop) { 
      // Back propogation of known values 
      var propCount = 0;
      var knownValue = BoardGenerator._KnownValue(this.board);
      while (knownValue != null) {
        this.board[knownValue.x][knownValue.y] = knownValue.value;
        this.tiles = this.tiles.delete(knownValue.x * 9 + knownValue.y); 
        propCount += 1;
        knownValue = BoardGenerator._KnownValue(this.board);
      }
    }

  // value was 0, meaning we couldn't find a possible value at that
  // location.  Thus the board is no longer valid.
  } else {
    this.valid = false;
  }
};

// RandomRemoveGenerator is a generator for randomly removing tiles from a 
// sudoku board.  Each step of next removes one tile.
var RandomRemoveGenerator = function(board) {
  this.board = board;
  this.tiles = Immutable.Set(BoardGenerator._TileKeys());
  this.valid = true;
};

// RandomRemoveGenerator.next iterates the next step of the generator; it 
// removes a random tile from the board
RandomRemoveGenerator.prototype.next = function() {
  var tile = BoardGenerator._RandomFromSet(this.tiles);
  var row = Math.floor(tile / 9);
  var col = tile % 9;
  this.board[row][col] = 0;
  this.tiles = this.tiles.delete(tile);
};

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
  var boardCopy = BoardGenerator._DeepCopy(board);
  var generator = new RandomRemoveGenerator(boardCopy);
  while (validBoard == null) {
    while (removedTiles < tiles) {
      generator.next();
      removedTiles++;
    }
    var valid = BoardGenerator._Solve(BoardGenerator._DeepCopy(generator.board)).valid;
    if (valid) {
     validBoard = generator.board; 

    // Board isn't valid, start over and try again
    } else {
      removedTiles = 0;
      boardCopy = BoardGenerator._DeepCopy(board);
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
    var valid = BoardGenerator._Solve(BoardGenerator._DeepCopy(generator.board)).valid;
    if (valid) {
      validBoard = generator.board;
    } else {
      addedTiles = 0;
      generator = new RandomGenerator(false);
    }
  }
  return validBoard;
}

// BoardGenerator._Solve solves a given sodoku board, returning an object 
// consisting of the solved board (if there is one) and a boolean valid that
// is true if the board is solvable and there is only one unique solution.
BoardGenerator._Solve = function(board) {
  var solutions = [];
  var queue = [board];
  while (queue.length > 0) {
    current = queue.pop();
    if (BoardGenerator._BoardIsFilled(current)) {
      solutions.push(current);
    } else {
      nextBoards = BoardGenerator._SolveStep(current);
      for (var i = 0; i < nextBoards.length; i++) {
        queue.push(nextBoards[i]);
      }
    }
  }
  switch (solutions.length) {
    case 0:
      return {board: null, valid: false};
    case 1:
      return {board: solutions[0], valid: true};
    default:
      return {board: solutions[0], valid: false};
  }
};

BoardGenerator._SolveStep = function(board) {
  var possibilities = BoardGenerator._GetAllPossibilities(board);
  var move = {
    x: 0,
    y: 0,
    min: 9,
    possibilities: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (board[i][j] != 0) {
        continue;
      }
      if (possibilities[i][j].length < move.min) {
        move = {
          x: i,
          y: j,
          min: board[i][j].length,
          possibilities: possibilities[i][j]
        }
      }
    }
  }

  var nextBoards = [];
  for (var i = 0; i < move.possibilities.length; i++) {
    var x = move.x;
    var y = move.y;
    var value = move.possibilities[i];
    var boardCopy = BoardGenerator._DeepCopy(board);
    var next = BoardGenerator._AddValue(boardCopy, x, y, value);
    nextBoards.push(next);
  }
  return nextBoards;
};

BoardGenerator._KnownValue = function(board) {
  var possibilities = BoardGenerator._GetAllPossibilities(board);
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

BoardGenerator._RandomValidValue = function(board, x, y) {
  var possibilities = BoardGenerator._GetPossibilities(board, x, y);
  if (possibilities.length == 0) {
    return 0;
  }
  return BoardGenerator._RandomFromSet(Immutable.Set(possibilities));
};

// BoardGenerator._BoardIsFilled returns true if the board is completely filled
// (i.e. has no 0 values)
BoardGenerator._BoardIsFilled = function(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (board[i][j] == 0) {
        return false;
      }
    }
  }
  return true;
}

// BoardGenerator._AddValue inserts value into the board at location x y.
BoardGenerator._AddValue = function(board, x, y, value) {
  var newBoard = board;
  newBoard[x][y] = value;
  return newBoard;
}

// BoardGenerator._GetAllPossibilities returns a 3d array of possible 
// values for every location in board.
BoardGenerator._GetAllPossibilities = function(board) {
  var possibilities = [];
  for (var i = 0; i < board.length; i++) {
    possibilities.push([]);
    for (var j = 0; j < board.length; j++) {
      possibilities[i].push(BoardGenerator._GetPossibilities(board, i, j)); 
    }
  }
  return possibilities;
}

// BoardGenerator._GetPossibilities returns all of the possible values
// at a given x y location.
BoardGenerator._GetPossibilities = function(board, x, y) {
  if (board[x][y] != 0) {
    return [];
  }
  var row = board[x];
  var column = BoardGenerator._GetColumn(board, y);
  var grid = BoardGenerator._GetGrid(board, x, y);
  var possibilities = BoardConstants.VALID_NUMBERS;
  for (var i = 0; i < board.length; i++) {
    possibilities = possibilities.delete(row[i])
                                 .delete(column[i])
                                 .delete(grid[i]);
  }
  return possibilities.toArray();
}

BoardGenerator._GetColumn = function(board, col) {
  var column = [];
  for (var i = 0; i < board.length; i++) {
    column.push(board[i][col]);
  }
  return column;
}

BoardGenerator._GetGrid = function(board, row, column) {
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

// BoardGenerator._TileKeys generates an array 0..1..81 representing all of the
// sudoku tile locations
BoardGenerator._TileKeys = function() {
  var tileKeys = [];
  for (var i = 0; i < 81; i++) {
    tileKeys.push(i);
  }
  return tileKeys;
};

// BoardGenerator._RandomFromSet returns a random value from the given immutable
// set
BoardGenerator._RandomFromSet = function(set) {
  var array = set.toArray();
  // Line copied and pasted from stack overflow; ~~ does bit shifting to the 
  // nearest integer value
  return array[~~(Math.random() * array.length)];
};

BoardGenerator._DeepCopy = function(board) {
  var newBoard = [];
  for (var i = 0; i < board.length; i++) {
    newBoard.push(board[i].slice(0));
  }
  return newBoard;
}

module.exports = BoardGenerator;
