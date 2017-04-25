"strict mode";

function GameView(){
  this.canvas = "<canvas id='canv'></canvas>";
}

GameView.prototype = {
  getCanvas: function(){
    return this.canvas;
  }
};

module.exports = GameView;
