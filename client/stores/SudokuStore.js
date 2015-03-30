var assign = require('object-assign');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Board = require('../game/Board');
var BoardConstants = require('../constants/BoardConstants');
var EventEmitter = require('events').EventEmitter;
var SudokuConstants = require('../constants/SudokuConstants');

var CHANGE_EVENT = 'change';

var _board = Board.LoadOrNew(BoardConstants.DIFFICULTY.EASY);

var SudokuStore = assign({}, EventEmitter.prototype, {

  getBoard: function() {
    return _board;         
  },

   emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  } 
});

AppDispatcher.register(function(action) {

  switch(action.actionType) {

    case SudokuConstants.SUDOKU_NEW_GAME:
      _board = Board.NewGame(action.difficulty);
      SudokuStore.emitChange();
      break;

    case SudokuConstants.SUDOKU_UPDATE_VALUE:
      _board.updateValue(action.x, action.y, action.value);
      SudokuStore.emitChange();
      break;

    case SudokuConstants.SUDOKU_DELETE_VALUE:
      _board.deleteValue(action.x, action.y);
      SudokuStore.emitChange();
      break;

    case SudokuConstants.SUDOKU_UPDATE_POSSIBLE:
      _board.updatePossible(action.x, action.y, action.value);
      SudokuStore.emitChange();
      break;

    case SudokuConstants.SUDOKU_DELETE_POSSIBLE:
      _board.deletePossible(action.x, action.y);
      SudokuStore.emitChange();
      break;
  
    case SudokuConstants.SUDOKU_TICK:
      _board.tick();
      SudokuStore.emitChange();
      break;
  
    default:
      // no op
  }
});

module.exports = SudokuStore;
