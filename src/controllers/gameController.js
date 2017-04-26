"strict mode";
var GameView = require('../views/gameView.js');
var Game = require('../models/game.js');
var Shape = require('../models/shape.js');

function GameController(game, gameView) {
  this.game = game;
  this.gameView = gameView;
}

GameController.prototype = {
  getAllShapes: function(){
    return this.game.getShapes();
  },
  createShape: function(xPos = 0, yPos = 0, zPos = 0, r = 0, g = 0, b = 0){
    this.game.addShape(new Shape(xPos, yPos, zPos, r, g, b));
  }
};



module.exports = GameController;
