"strict mode";

function GameController(game = new Game(),gameView = new GameView()) {
  this.game = game;
  this.gameView = gameView;
}

GameController.prototype = {
  render: function(){
    var canvas = this.gameView.getCanvas();
    document.getElementById('gameDiv').innerHtml = canvas;
  }
}

module.exports = GameController;
