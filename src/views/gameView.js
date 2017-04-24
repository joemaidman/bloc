"strict mode";

var Canvas = require('canvas');

function GameView(){
  this.canvas = new Canvas(200,200);
}

GameView.prototype = {
  getCanvas: function(){
    return this.canvas;
  }
};

module.exports = GameView;
