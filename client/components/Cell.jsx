var React = require('React');
var SudokuActions = require('../actions/SudokuActions');

var Cell = React.createClass({
  render: function() {
    var cell = this.props.cell;
    var initial = cell.initial;
    var initialString = initial ? "initial " : "";
    var validString = cell.valid ? "" : "invalid ";
    var cellClasses = "cell " + initialString + validString;
    return (
      <div className={cellClasses}>
        {this._createCellHeader()}
        {this._createCell()}
      </div>
    );
  },

  _createCellHeader: function() {
    var cell = this.props.cell;
    var hasValue = cell.value !== 0;
    return (
      <div 
        className={hasValue ? "cellHeader cellHeaderValue" : "cellHeader"}
        tabIndex="0"
        onClick={this._handleHeaderClick}
        onKeyDown={this._handleKeyDown}
        onKeyUp={this._handleHeaderKeyPress} >
        {this._renderPossibilities()}
      </div>
    );
  },

  _renderPossibilities: function() {
    var possibilities = this.props.cell.possibilities;
    var result = ""; 
    var space = possibilities.size <= 6 ? " " : "";
    possibilities.forEach(function(possibility) {
      result += possibility.toString() + space;
    });
    return result;
  },

  _createCell: function() {
    var cell = this.props.cell;
    var inputtedValue = (!this.props.cell.initial) && (cell.value !== 0);
    var inputtedValueClass = inputtedValue ? "cellTextValue" : "";
    var classNames = "cellText " + inputtedValueClass;
    return (
      <div 
        className={classNames}
        tabIndex="0"
        onClick={this._handleClick}
        onKeyDown={this._handleKeyDown}
        onKeyUp={this._handleKeyPress} >
        {cell.value !== 0 ? cell.value : null}
      </div>
    );
  },

  _handleClick: function() {
    if (this.isMounted()) {
      this.getDOMNode().childNodes[1].focus();
    }
  },

  _handleHeaderClick: function() {
    if (this.isMounted()) {
      this.getDOMNode().childNodes[0].focus();
    }
  },

  _handleKeyPress: function(e) {
    if (this.props.cell.initial) {
      return;
    }

    var cell = this.props.cell;
    var charCode = e.which
    if (charCode == 8) {
      SudokuActions.deleteBoardValue(cell.row, cell.column);
      return;
    }

    var value = parseInt(String.fromCharCode(charCode));
    if (isNaN(value)) {
      return;
    }
    SudokuActions.updateBoardValue(cell.row, cell.column, value);
  },

  _handleHeaderKeyPress: function(e) {
    if (this.props.cell.initial) {
      return;
    }

    var cell = this.props.cell;
    var charCode = e.which
    if (charCode == 8) {
      SudokuActions.deleteBoardPossible(cell.row, cell.column);
      return;
    }

    var value = parseInt(String.fromCharCode(charCode));
    if (isNaN(value) || value === 0) {
      return;
    }

    SudokuActions.updateBoardPossible(cell.row, cell.column, value);
  },

  _handleKeyDown: function(e) {
    e.preventDefault();
  }
});

module.exports = Cell;
