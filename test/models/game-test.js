"strict mode";

var Game = require('../../src/models/game.js');

describe("Game", function(){
  var game;

  beforeEach(function(){
    game = new Game();
  });

  it(".getBlocks returns an array of shapes", function(){
    expect(game.getShapes()).to.eql([]);
  });

  it (".addShape adds a shape to the shapes array", function(){
    game.addShape(1);
    expect(game.getShapes()).to.eql([1]);
  })

});
