var Immutable = require('immutable');
var BoardConstants = require('../constants/BoardConstants');
var BoardUtils = require('./BoardUtils');

// RandomGenerator is a generator for randomly generating a completed valid
// sudoku board.
var RandomGenerator = function(backprop) {
  this.board = BoardUtils._DeepCopy(BoardConstants.EMPTY);
  this.tiles = Immutable.Set(BoardUtils._TileKeys());
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
RandomGenerator.prototype.next = function() {
  var tile = BoardUtils._RandomFromSet(this.tiles);
  var row = Math.floor(tile / 9);
  var col = tile % 9;
  var value = BoardUtils._RandomValidValue(this.board, row, col);
  if (value != 0) {
    this.board[row][col] = value;
    this.tiles = this.tiles.delete(tile);

    if (this.backprop) {
      // Back propogation of known values
      var propCount = 0;
      var knownValue = BoardUtils._KnownValue(this.board);
      while (knownValue != null) {
        this.board[knownValue.x][knownValue.y] = knownValue.value;
        this.tiles = this.tiles.delete(knownValue.x * 9 + knownValue.y);
        propCount += 1;
        knownValue = BoardUtils._KnownValue(this.board);
      }
    }

  // value was 0, meaning we couldn't find a possible value at that
  // location.  Thus the board is no longer valid.
  } else {
    this.valid = false;
  }
};

module.exports = RandomGenerator;
