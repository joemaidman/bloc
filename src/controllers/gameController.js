"strict mode";

function GameController(game = new Game(),gameView = new GameView()) {
  this.game = game;
  this.gameView = gameView;
}

GameController.prototype = {
  render: function(){
    this.gameView.getCanvas();
  }

}

module.exports = GameController;
