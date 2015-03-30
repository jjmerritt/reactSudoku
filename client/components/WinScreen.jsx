var React = require('React');
var SudokuActions = require('../actions/SudokuActions');
var BoardConstants = require('../constants/BoardConstants');
var TimeUtils = require('../utils/TimeUtils.js');

var WinScreen = React.createClass({
  getInitialState: function() {
    return {clicked: false};
  },

  render: function() {
    var win = this.props.board.win;
    var time = this.props.board.time;
    var timeString = TimeUtils.secondsToTimeString(time);
    return (
      <div className={"win win" + win.toString()}>
        <div className="winText"> 
          ~ You Win! ~ 
          <span> Time: {timeString} </span> 
          {this._renderButton()}
        </div>
      </div>
    );
  },

  _renderButton: function() {
    if (this.state.clicked) {
      return (
        <div className="playAgainDifficulties">
          <span> Difficulty </span>
          <a className="playAgainDifficulty Easy"
             onClick={this._handleEasy}> Easy </a>
          <a className="playAgainDifficulty Medium"
             onClick={this._handleMedium}> Medium </a>
          <a className="playAgainDifficulty Hard"
             onClick={this._handleHard}> Hard </a>
          <a className="playAgainDifficulty Extreme"
             onClick={this._handleExtreme}> Extreme </a>
        </div>
      );
    }
    return (
      <a className="playAgain" onClick={this._handlePlayAgainClick}>
        Play Again
      </a>
    );
  },

  _handlePlayAgainClick: function() {
    this.setState({clicked: true}); 
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

module.exports = WinScreen;
