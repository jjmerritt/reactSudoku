var BoardConstants = require('../constants/BoardConstants');
var BoardGenerator = require('../game/BoardGenerator');
var HighScores = require('../game/HighScores');
var Immutable = require('immutable');
var StorageHandler = require('./StorageHandler');

// Board represents a sudoku Board along with whether the board is valid and
// whether the board is in a winning state
var Board = function(difficulty) {
  var board = BoardConstants.SAMPLE;
  this.difficulty = BoardConstants.DIFFICULTY.SAMPLE;
  if (difficulty) {
    board = BoardGenerator.GenerateBoard(difficulty);
    this.difficulty = difficulty;
  }
  this.rows = Board.FromArray(board, this.validation);
  this.win = false;
  this.time = 0;
  this.highScores = HighScores.LoadOrNew();
};

// Board.FromArray takes a 2D array of values and returns a 2D array of cells
Board.FromArray = function(array, validation) {
  return array.map(function(row, i) {
    return row.map(function(value, j) {
      return new Board.Cell(i, j, value, validation);
    });
  });
};

// Board.Validate returns a validation object with row validation, column
// validation, grid validation, and a boolean that is true if all rows,
// columns and grids are valid
Board.Validate = function(rows) {
  var rowValidation = Board.ValidateCellArrays(rows);
  var columnValidation = Board.ValidateCellArrays(Board.ColumnsFromRows(rows));
  var gridValidation = Board.ValidateCellArrays(Board.GridsFromRows(rows));
  var valid = Board.ReduceAnd(rowValidation) &&
              Board.ReduceAnd(columnValidation) &&
              Board.ReduceAnd(gridValidation);
  return {
    rows: rowValidation,
    columns: columnValidation,
    grids: gridValidation,
    valid: valid
  };
};


// Board.ValidateCellArrays takes a 2D array and returns a 1D array of
// booleans representing if each array in the 2D array is valid
Board.ValidateCellArrays = function(arrays) {
  return arrays.map(Board.ValidateCellArray);
};

// Board.ValidateCellArray takes an array of numbers and returns a boolean
// denoting whether the array is valid (i.e. each number is unique and is 
// in the set 1-9).
Board.ValidateCellArray = function(array) {
  var valid = BoardConstants.VALID_NUMBERS;
  var validationHelper = function(number) {
    if (valid.contains(number.value) || number.value === 0) {
      valid = valid.delete(number.value);
      return true;
    }
    return false;
  };
  return Board.ReduceAnd(array.map(validationHelper));
}

// Board.ReduceAnd is a Helper function shoved into Board that performs a
// reduce with a binary AND operation
Board.ReduceAnd = function(array) {
  return array.reduce(function(a, b) { return a && b;}, true);
};

// Board.ColumnsFromRows returns a list of columns given a list of rows
// I'm not sure of an elegant functional way to represent the transform
// from rows to columns
// TODO: Refactor
Board.ColumnsFromRows = function(rows) {
  var columns = [];
  rows.forEach(function() { columns.push([]);});
  rows.forEach(function(row) {
    row.forEach(function(element) {
      columns[element.column].push(element);
    });
  });
  return columns;
};

// Board.GridsFromRows returns a list of grids given a list of rows, as
// determined by Board.GRID_MAP
// I'm not sure of an elegant functional way to represent the transform
// from rows to grids
// TODO: Refactor
Board.GridsFromRows = function(rows) {
  var grids = [];
  rows.forEach(function() { grids.push([]);});
  rows.forEach(function(row) {
    row.forEach(function(element) {
      grids[element.grid].push(element);
    });
  });
  return grids;
};

// Board.CheckWinState returns true if the board is both full of non-zero
// numbers and valid, which are the prerequisites for a winning game state
// in Sudoku
Board.CheckWinState = function(rows, valid) {
  return Board.IsBoardFull(rows) && valid;
};

// Board.IsBoardFull returns true if rows are all composed of non-zero
// numbers
Board.IsBoardFull = function(rows) {
  return Board.ReduceAnd(rows.map(function(row) {
   return row.reduce(function(a, b) { 
     return a && (b.value !== 0);
   }, true);
  }));
};

// Board.prototype.updateValue updates a board at a given location with a
// given value, then updates validation and potential win state
Board.prototype.updateValue = function(row, col, value) {
    this.rows[row][col].value = value;
    var validation = Board.Validate(this.rows);
    this.updateCellValidations(validation);
    this.win = Board.CheckWinState(this.rows, validation.valid);
    if (this.win) {
      this.highScores.updatePossibleHighScore(this.difficulty, this.time);
      StorageHandler.SaveGameWin(this);
    }
};

// Board.prototype.deleteValue deletes a value by setting its value to zero
Board.prototype.deleteValue = function(row, col) {
  this.updateValue(row, col, 0);
};

// Board.prototype.updateCellValidations updates each cell with a valid
// boolean.  The valid boolean is true iff the cell's row, column, and
// grid are all valid.
Board.prototype.updateCellValidations = function(validation) {
  this.rows.forEach(function(row) {
    row.forEach(function(cell) {
      cell.valid = validation.rows[cell.row] &&
                   validation.columns[cell.column] &&
                   validation.grids[cell.grid];
    });
  });
};

// Board.prototype.updatePossible removes a possible value if it is
// already present, and adds it if it is not present
Board.prototype.updatePossible = function(row, col, value) {
  var cell = this.rows[row][col];

  if (cell.possibilities.has(value)) {
    cell.possibilities = cell.possibilities.delete(value);
  } else {
    cell.possibilities = cell.possibilities.add(value);
  }
};

// Board.prototype.deletePossible deletes the set of possible values
Board.prototype.deletePossible = function(row, col) {
  var cell = this.rows[row][col];
  cell.possibilities = Immutable.Set([]);
};

// Board.prototype.tick increments the Board Time
Board.prototype.tick = function() {
  if (!this.win) {
    this.time += 1;
  }
  StorageHandler.SaveGame(this);
};

// Board.Cell represents one cell in a Sudoku Board.  If initial is true
// (i.e. the value was given at the start of the game) then the Cell should
// not be modified.
Board.Cell = function(x, y, value) {
  this.row = x;
  this.column = y;
  this.grid = BoardConstants.GRID_MAP[x][y];
  this.value = value;
  this.valid = true;

  // this.initial represents whether the cell was populated at the start
  // of the game.
  this.initial = value !== 0;

  // this.possibilities represents a user-inputted list of possible values.
  this.possibilities = Immutable.Set([]);

};

// Board.NewGame returns a new Board() with a given difficulty (easy, medium,
// hard, extreme?).  Returns a random board.  If no difficulty is specified,
// returns a new Board() with Board.SAMPLE as the input.
Board.NewGame = function(difficulty) {
  return new Board(difficulty);
};

// Board.LoadOrNew attempts to load a game from storage; If that fails, then
// starts a new game with the given difficulty.
Board.LoadOrNew = function(difficulty) {
  var storedBoard = StorageHandler.LoadGame();
  if (storedBoard) {
    var board = new Board();
    board.difficulty = storedBoard.difficulty;
    board.rows = storedBoard.rows;
    board.time = storedBoard.time;
    board.win = storedBoard.win;
    board.highScores = HighScores.LoadOrNew();
    return board;
  }
  return Board.NewGame(difficulty);
};

module.exports = Board;
