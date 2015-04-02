var Immutable = require('immutable');
var keyMirror = require('keymirror');

module.exports = {
  // VALID_NUMBERS represents the set of valid numbers a player
  // can place on the sudoku board
  VALID_NUMBERS: Immutable.Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),

  // SAMPLE is a sample input grid, used for testing purposes
  SAMPLE: [[0, 0, 8, 0, 3, 0, 5, 4, 0],
           [3, 0, 0, 4, 0, 7, 9, 0, 0],
           [4, 1, 0, 0, 0, 8, 0, 0, 2],
           [0, 4, 3, 5, 0, 2, 0, 6, 0],
           [5, 0, 0, 0, 0, 0, 0, 0, 8],
           [0, 6, 0, 3, 0, 9, 4, 1, 0],
           [1, 0, 0, 8, 0, 0, 0, 2, 7],
           [0, 0, 5, 6, 0, 3, 0, 0, 4],
           [0, 2, 9, 0, 7, 0, 8, 0, 0]],

  // EMPTY represents an empty board, used for default instantiation
  EMPTY: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0]],

  // GRID_MAP represents the 3x3 grids in Sudoku that each must contain
  // VALID_NUMBERS in order to have a valid win state
  GRID_MAP: [[0, 0, 0, 1, 1, 1, 2, 2, 2],
             [0, 0, 0, 1, 1, 1, 2, 2, 2],
             [0, 0, 0, 1, 1, 1, 2, 2, 2],
             [3, 3, 3, 4, 4, 4, 5, 5, 5],
             [3, 3, 3, 4, 4, 4, 5, 5, 5],
             [3, 3, 3, 4, 4, 4, 5, 5, 5],
             [6, 6, 6, 7, 7, 7, 8, 8, 8],
             [6, 6, 6, 7, 7, 7, 8, 8, 8],
             [6, 6, 6, 7, 7, 7, 8, 8, 8]],

  // DIFFICULTY is an enumeration of the difficulty levels
  DIFFICULTY: {
    EASY: "Easy",
    MEDIUM: "Medium",
    HARD: "Hard",
    EXTREME: "Extreme",
    // Sample: Used for testing purposes
    SAMPLE: "Sample"
  },
 
  // TILES represent the number of empty tiles at the start of a sudoku
  // game, based on the given difficulty.  This is a poor means of 
  // identifying difficulty, but is much simpler than other methods. 
  TILES: {
    "Easy": 42,
    "Medium": 44,
    "Hard": 46,
    "Extreme": 48
  },

};
