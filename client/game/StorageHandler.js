var StorageHandler = function() {};

StorageHandler.LoadGame = function() {
  return JSON.parse(localStorage.getItem("currentGame"));
};

StorageHandler.SaveGame = function(board) {
  localStorage.setItem("currentGame", JSON.stringify(board));
};

StorageHandler.LoadHighScores = function() {
  return JSON.parse(localStorage.getItem("highScores"));
};

StorageHandler.SaveHighScores = function(highScores) {
  localStorage.setItem("highScores", JSON.stringify(highScores));
};

StorageHandler.SaveGameWin = function(board, highScores) {
  StorageHandler.SaveGame(board);
  StorageHandler.SaveHighScores(highScores);
}

module.exports = StorageHandler;
