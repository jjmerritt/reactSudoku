
var TimeUtils = {
  
  secondsToTimeString: function(time) {
    var minutes = Math.floor(time / 60).toString();
    var seconds;
    if (time % 60 < 10) {
      seconds = "0" + (time % 60).toString();
    } else {
      seconds = (time % 60).toString();
    }
    return minutes + ":" + seconds; 
  }
};

module.exports = TimeUtils;
