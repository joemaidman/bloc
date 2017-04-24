function GameController(game = new Game(),gameView = new GameView()) {
this.game = game;
this.gameView = gameView;
}

module.exports = GameController;
