var React = require('React');

var Difficulty = React.createClass({
  render: function() {
    var difficulty = this.props.board.difficulty;
    return (
      <div className="difficulty">
        <div className="timerTitle"> DIFFICULTY </div>
        <div className={"difficultyValue " + difficulty}> {difficulty} </div>
      </div>
    );
  }
});

module.exports = Difficulty;
