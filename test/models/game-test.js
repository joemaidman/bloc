"strict mode";

var Game = require('../../src/models/game.js');

function ShapeDouble() {
}

ShapeDouble.prototype = {
  rotate: function(){
    return true;
  }
};
describe("Game", function(){
  var game;

  beforeEach(function(){
    game = new Game();
  });

  it(".getBlocks returns an array of shapes", function(){
    expect(game.getShapes()).to.eql([]);
  });

  it (".addShape adds a shape to the shapes array", function(){
    var shapeDoubleOne = new ShapeDouble();
    var shapeDoubleTwo = new ShapeDouble();
    var rotateShapeSpyOne = sinon.spy(shapeDoubleOne, "rotate");
    var rotateShapeSpyTwo = sinon.spy(shapeDoubleTwo, "rotate");
    game.addShape(shapeDoubleOne);
    game.addShape(shapeDoubleTwo);
    game.rotateShapes();
    expect(rotateShapeSpyOne).to.have.been.calledOnce;
    expect(rotateShapeSpyTwo).to.have.been.calledOnce;
  })

});
