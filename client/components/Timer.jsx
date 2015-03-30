var React = require('React');
var SudokuActions = require('../actions/SudokuActions');
var SudokuStore = require('../stores/SudokuStore');
var TimeUtils = require('../utils/TimeUtils.js');

var Timer = React.createClass({

  componentDidMount: function() {
    this.interval = setInterval(this._tick, 1000);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  render: function() {
    var time = this.props.board.time;
    var timeString = TimeUtils.secondsToTimeString(time);

    var difficulty = this.props.board.difficulty;
    var best = this.props.board.highScores.scores[difficulty];
    var bestString = TimeUtils.secondsToTimeString(best);

    return (
      <div className="timerContainer">
        <div className="timer currentTime">
          <div className="timerTitle"> TIME </div>
          <div className="timerValue"> {timeString} </div>
        </div>
        <div className="timer bestTime">
          <div className="timerTitle"> BEST </div>
          <div className="timerValue"> {bestString} </div>
        </div>
      </div>
    );
  },

  _tick: function() {
    SudokuActions.tick();
  }

});

module.exports = Timer;
