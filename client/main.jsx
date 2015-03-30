var $ = require('jquery');
var React = window.React = require('React');
var SudokuApp = require('./components/SudokuApp.jsx');

$(document).ready(function() {
  React.render(
    <SudokuApp />,
    $('#content').get(0)
  );
});
