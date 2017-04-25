"strict mode";
var GameView = require('../views/gameView.js');
var Game = require('../models/game.js');

function GameController(game, gameView) {
  this.game = game;
  this.gameView = gameView;
}

GameController.prototype = {
  render: function(){
    var canvas = this.gameView.getCanvas();
    document.getElementById('gameDiv').appendChild(canvas);
  }
}

module.exports = GameController;
