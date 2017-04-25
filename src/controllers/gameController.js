"strict mode";
var GameView = require('../views/gameView.js');
var Game = require('../models/game.js');

function GameController(game, gameView) {
  this.game = game;
  this.gameView = gameView;
}

GameController.prototype = {
  loadInterface: function(){
    return this.gameView.getCanvas();
  },
  getShape: function(xPos, yPos, zPos){
    return this.game.createShape(xPos, yPos, zPos);
  }
};



module.exports = GameController;
