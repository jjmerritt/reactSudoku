var React = require('React');
var SudokuStore = require('../stores/SudokuStore');
var Header = require('./Header.jsx');
var Grid = require('./Grid.jsx');
var WinScreen = require('./WinScreen.jsx');

function getSudokuState() {
  return {board: SudokuStore.getBoard()};
}

var SudokuApp = React.createClass({
  getInitialState: function() {
    return getSudokuState();
  },

  componentDidMount: function() {
    SudokuStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SudokuStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div className="sudokuApp">
        <Header board={this.state.board} />
        <Grid board={this.state.board} />
        <WinScreen board={this.state.board} />
      </div>
    );
  },

  _onChange: function() {
    this.setState(getSudokuState());
  },

});

module.exports = SudokuApp;
