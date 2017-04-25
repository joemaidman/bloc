"strict mode";

var Game = require('../../src/models/game.js');
var Isomer = require("isomer");
var Shape = Isomer.Shape;
var Point = Isomer.Point;

describe("Game", function(){
var game;

beforeEach(function(){
  game = new Game();
});

 it("has a name", function(){

   expect(game.name).to.equal("Bloc");
  });

  it("createShape returns a block", function(){
    expect(game.createShape()).to.be.an.instanceof(Shape);
  })

  it("createShape returns block to predefined position", function(){
    var spyShape = sinon.spy(game, '_shape')
    game.createShape(1,1,1);
    var point = new Point(1,1,1);
    expect(spyShape).to.have.been.calledWith(point);
  })
});
