var React = require('React');
var Row = require('./Row.jsx');

var Grid = React.createClass({
  render: function() {
    var board = this.props.board;
    var rows = [];
    for (var i=0; i < 9; i++) {
      rows.push(<Row key={i} row={board.rows[i]} />);
    }

    return (
      <div className="grid">
        {rows}
      </div>
    );
  }
});

module.exports = Grid;
