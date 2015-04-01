var React = require('React');

var Footer = React.createClass({
  render: function() {
    return (
      <div className="footer">
        <div className="howToPlay">
          <b> HOW TO PLAY: </b> Each <b>row</b>, <b>column</b>, and <b>mini 3x3 
          grid</b> must all contain <b>1-9</b>.  No <b>row</b>, 
          <b> column</b> or <b>mini 3x3 grid</b> can contain the same 
          number twice.
        </div>
        <div className="endNote">
          <p>Created by 
          &nbsp;<a href="https://github.com/jjmerritt">Justin Merritt</a> using 
          &nbsp;<a href="http://facebook.github.io/react/">react.js</a>, 
          &nbsp;<a href="http://expressjs.com/">express.js</a>, and the 
          &nbsp;<a href="http://facebook.github.io/flux/docs/overview.html">flux
          architecture</a>
          &nbsp; (
          <a href="http://facebook.github.io/immutable-js/">and</a>
          &nbsp;<a href="http://browserify.org/">many</a> 
          &nbsp;<a href="https://github.com/andreypopp/reactify">others!</a>).  
          Primary style influenced by 
          &nbsp;<a href="http://gabrielecirulli.github.io/2048/">2048</a>.</p>
        </div>
      </div>
    );
  }
});

module.exports = Footer;
