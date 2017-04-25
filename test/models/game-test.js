"strict mode";

var Game = require('../../src/models/game.js');
var Isomer = require("isomer");
var Shape = Isomer.Shape;

describe("Game", function(){
var game;

 it("has a name", function(){
   game = new Game();
   expect(game.name).to.equal("Bloc");
  });

it("createBlock returns a block", function(){
  game = new Game();
  expect(game.createBlock()).to.be.an.instanceof(Shape)
})
});
