"use strict";
var Game = require('../../src/models/game.js');
describe("Game", function(){
var game;

 it("has a name", function(){
   game = new Game();
    expect(game.name).to.equal("Bloc");
  });

});
