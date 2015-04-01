var React = require('React');
var SudokuActions = require('../actions/SudokuActions');
var BoardConstants = require('../constants/BoardConstants');

var NewGameButton = React.createClass({
  getInitialState: function() {
    return {clicked: false};
  },

  render: function() {
    return this._renderButton();
  },

  _renderButton: function() {
    if (this.state.clicked) {
      return (
        <div className="newGameDifficulties">
          <span> Difficulty </span>
          <a className="newGameCancel"
            onClick={this._handleCancelNewGame}>x</a>
          <a className="newGameDifficulty Easy"
             onClick={this._handleEasy}> Easy </a>
          <a className="newGameDifficulty Medium"
             onClick={this._handleMedium}> Medium </a>
          <a className="newGameDifficulty Hard"
             onClick={this._handleHard}> Hard </a>
          <a className="newGameDifficulty Extreme"
             onClick={this._handleExtreme}> Extreme </a>
        </div>
      );
    }
    return (
      <a className="newGame" onClick={this._handleNewGameClick}>
        New Game
      </a>
    );
  },

  _handleNewGameClick: function() {
    this.setState({clicked: true});
  },

  _handleCancelNewGame: function() {
    this.setState({clicked: false});
  },

  _handleEasy: function() {
    SudokuActions.createGame(BoardConstants.DIFFICULTY.EASY);
    this.setState({clicked: false});
  },

  _handleMedium: function() {
    SudokuActions.createGame(BoardConstants.DIFFICULTY.MEDIUM);
    this.setState({clicked: false});
  },

  _handleHard: function() {
    SudokuActions.createGame(BoardConstants.DIFFICULTY.HARD);
    this.setState({clicked: false});
  },

  _handleExtreme: function() {
    SudokuActions.createGame(BoardConstants.DIFFICULTY.EXTREME);
    this.setState({clicked: false});
  }

});

module.exports = NewGameButton;
