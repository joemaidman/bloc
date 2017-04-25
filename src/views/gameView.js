"strict mode";

function GameView(){
  this.canvas = document.createElement('canvas');
}

GameView.prototype = {
  getCanvas: function(){
    return this.canvas;
  }
};

module.exports = GameView;
