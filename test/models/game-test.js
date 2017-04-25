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

  it("createShape returns a block", function(){
    game = new Game();
    expect(game.createShape()).to.be.an.instanceof(Shape);
  })

  it("createShape returns block to predefined position", function(){
    var spyGetCanvas = sinon.spy(gameViewDouble, "getCanvas");

    var spyShape = sinon.spy(game, )
    game = new Game();
    game.createShape(point);
    console.log(shape)
    expect(shape).toEqual(shape);
  })
});
