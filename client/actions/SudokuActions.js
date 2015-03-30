var AppDispatcher = require('../dispatcher/AppDispatcher');
var SudokuConstants = require('../constants/SudokuConstants');

var SudokuActions = {

  /**
   * @param  {string} difficulty
   */
  createGame: function(difficulty) {
    AppDispatcher.dispatch({
      actionType: SudokuConstants.SUDOKU_NEW_GAME,
      difficulty: difficulty
    });
  },

  /**
   * @param  {int} x
   * @param  {int} y
   * @param  {int} value
   */
  updateBoardValue: function(x, y, value) {
    AppDispatcher.dispatch({
      actionType: SudokuConstants.SUDOKU_UPDATE_VALUE,
      x: x,
      y: y,
      value: value
    });
  },

  /**
   * @param  {int} x
   * @param  {int} y
   */
  deleteBoardValue: function(x, y) {
    AppDispatcher.dispatch({
      actionType: SudokuConstants.SUDOKU_DELETE_VALUE,
      x: x,
      y: y
    });
  },

  /**
   * @param  {int} x
   * @param  {int} y
   * @param  {int} value
   */
  updateBoardPossible: function(x, y, value) {
    AppDispatcher.dispatch({
      actionType: SudokuConstants.SUDOKU_UPDATE_POSSIBLE,
      x: x,
      y: y,
      value: value
    });
  },

  /**
   * @param  {int} x
   * @param  {int} y
   */
  deleteBoardPossible: function(x, y) {
    AppDispatcher.dispatch({
      actionType: SudokuConstants.SUDOKU_DELETE_POSSIBLE,
      x: x,
      y: y
    });
  },

  tick: function() {
    AppDispatcher.dispatch({
      actionType: SudokuConstants.SUDOKU_TICK
    });
  }
}

module.exports = SudokuActions;
