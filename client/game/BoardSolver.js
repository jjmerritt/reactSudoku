var BoardUtils = require('./BoardUtils');

var BoardSolver = function() {};

// BoardSolver._Solve solves a given sodoku board, returning an object
// consisting of the solved board (if there is one) and a boolean valid that
// is true if the board is solvable and there is only one unique solution.
BoardSolver._Solve = function(board) {
  var solutions = [];
  var queue = [board];
  while (queue.length > 0) {
    current = queue.pop();
    if (BoardUtils._BoardIsFilled(current)) {
      solutions.push(current);
      // Added the break here to terminate early when we've found one solution
      // This means that the solutions are not necessarily unique (there may 
      // be multiple solutions to one board) but the board is generated about 
      // 1000x faster.
      break;
    } else {
      nextBoards = BoardSolver._SolveStep(current);
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

BoardSolver._SolveStep = function(board) {
  var possibilities = BoardUtils._GetAllPossibilities(board);
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
    var boardCopy = BoardUtils._DeepCopy(board);
    var next = BoardUtils._AddValue(boardCopy, x, y, value);
    nextBoards.push(next);
  }
  return nextBoards;
};

module.exports = BoardSolver;
