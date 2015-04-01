var Immutable = require('immutable');
var BoardUtils = require('./BoardUtils');

// RandomRemoveGenerator is a generator for randomly removing tiles from a
// sudoku board.  Each step of next removes one tile.
var RandomRemoveGenerator = function(board) {
  this.board = board;
  this.tiles = Immutable.Set(BoardUtils._TileKeys());
  this.valid = true;
};

// RandomRemoveGenerator.next iterates the next step of the generator; it
// removes a random tile from the board
RandomRemoveGenerator.prototype.next = function() {
  var tile = BoardUtils._RandomFromSet(this.tiles);
  var row = Math.floor(tile / 9);
  var col = tile % 9;
  this.board[row][col] = 0;
  this.tiles = this.tiles.delete(tile);
};

module.exports = RandomRemoveGenerator;
