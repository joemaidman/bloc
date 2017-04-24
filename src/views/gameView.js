"strict mode";

function GameView(){
  this.canvas = document.createElement('canvas');
  this.canvas.width = 200;
  this.canvas.height  = 200;
}

GameView.prototype = {
  getCanvas: function(){
    return this.canvas;
  }
};

module.exports = GameView;
