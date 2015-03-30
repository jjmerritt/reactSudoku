var BoardConstants = require('../constants/BoardConstants');
var StorageHandler = require('./StorageHandler');

var HighScores = function() {
 this.scores = {
   "Easy": 0,
   "Medium": 0,
   "Hard": 0,
   "Extreme": 0
 };
};

HighScores.LoadOrNew = function() {
  var highScores = StorageHandler.LoadHighScores();
  if (highScores) {
    return highScores;
  }
  return new HighScores();
};

HighScores.prototype.updatePossibleHighScore = function(difficulty, time) {
  if (this.scores[difficulty] > time) {
    this.scores[difficulty] = time;
  }
};

module.exports = HighScores;
