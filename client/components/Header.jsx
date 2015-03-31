var React = require('React');
var SudokuStore = require('../stores/SudokuStore');
var Difficulty = require('./Difficulty.jsx');
var Timer = require('./Timer.jsx');
var NewGameButton = require('./NewGameButton.jsx');

var Header = React.createClass({
  render: function() {
    return (
      <div className="header">
        <Difficulty board={this.props.board} />
        <Timer board={this.props.board} />
        <h1 className="title"> SUDOKU </h1>
        <NewGameButton />
        <div className="explanation">
          A Game of Logic -- Try to beat your best time!
        </div>
      </div>
    );
  }
});

module.exports = Header;
