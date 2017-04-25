"strict mode";

function GameView(){
  this.canvas = "<canvas width='600px' height='498px' id='canvas'></canvas>";
}

GameView.prototype = {
  getCanvas: function(){
    return this.canvas;
  }
};

module.exports = GameView;
