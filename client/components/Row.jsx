var React = require('React');
var Cell = require('./Cell.jsx');

var Row = React.createClass({
  render: function() {
    var row = this.props.row;
    var cells = [];
    for (var i=0; i < 9; i++) {
      cells.push(<Cell key={i} cell={row[i]} />);
    }

    return (
      <div className="row">
        {cells}
      </div>
    );
  }
});

module.exports = Row;
