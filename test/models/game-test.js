"strict mode";

var Game = require('../../src/models/game.js');

function ShapeDouble(x=0, y=0, z=0) {
  this.xPos = x;
  this.yPos = y;
  this.zPos = z;
}

ShapeDouble.prototype = {
  rotate: function(){
    return true;
  },
  getPosition: function(){
    return {x: this.xPos, y: this.yPos, z: this.zPos};
  }
};
describe("Game", function(){
  var game;

  beforeEach(function(){
    game = new Game();
  });

  it("exists", function(){
    expect(game).to.exist;
  });

  it(".getShapes returns an array of shapes", function(){
    expect(game.getShapes()).to.eql([]);
  });

  it (".addShape adds a shape to the shapes array", function(){
    var shapeDoubleOne = new ShapeDouble(1, 2, 0);
    var shapeDoubleTwo = new ShapeDouble(3, 2, 0);
    var rotateShapeSpyOne = sinon.spy(shapeDoubleOne, "rotate");
    var rotateShapeSpyTwo = sinon.spy(shapeDoubleTwo, "rotate");
    game.addShape(shapeDoubleOne);
    game.addShape(shapeDoubleTwo);
    game.rotateShapes();
    expect(rotateShapeSpyOne).to.have.been.calledOnce;
    expect(rotateShapeSpyTwo).to.have.been.calledOnce;
  });

  it (".deleteShape deletes a shape from the shape array", function(){
    var shapeDoubleOne = new ShapeDouble(1, 2, 0);
    var shapeDoubleTwo = new ShapeDouble(2, 3, 1);
    game.addShape(shapeDoubleOne);
    game.addShape(shapeDoubleTwo);
    game.deleteShape({x: 2, y: 3, z: 1});
    expect(game.getShapes()).to.eql([shapeDoubleOne]);
  });

  it (".deleteShape only deletes the requested shape from the shape array", function(){
    var shapeDoubleOne = new ShapeDouble(1, 2, 0);
    var shapeDoubleTwo = new ShapeDouble(2, 3, 1);
    game.addShape(shapeDoubleOne);
    game.addShape(shapeDoubleTwo);
    game.deleteShape({x: 2, y: 3, z: 1});
    game.deleteShape({x: 2, y: 3, z: 1});
    expect(game.getShapes()).to.eql([shapeDoubleOne]);
  });

  it (".getShapes returns an array of shapes in the correct order for drawing purposes", function(){
    var shapeDoubleOne = new ShapeDouble(1, 2, 0);
    var shapeDoubleTwo = new ShapeDouble(2, 3, 1);
    var shapeDoubleThree = new ShapeDouble(0, 0, 0);
    var shapeDoubleFour = new ShapeDouble(2, 0, 1);
    game.addShape(shapeDoubleOne);
    game.addShape(shapeDoubleTwo);
    game.addShape(shapeDoubleThree);
    game.addShape(shapeDoubleFour);
    expect(game.getShapes()).to.eql([shapeDoubleOne, shapeDoubleThree, shapeDoubleTwo, shapeDoubleFour]);
  });

  it (".addShape will check for existing block at same coordinates when block is added", function(){
    var shapeDoubleOne = new ShapeDouble(1, 2, 0);
    var shapeDoubleTwo = new ShapeDouble(1, 2, 0);
    game.addShape(shapeDoubleOne);
    game.addShape(shapeDoubleTwo);
    expect(game.getShapes()).to.eql([shapeDoubleOne]);
  });

  it (".clearShapes will remove all shapes from the game", function(){
    var shapeDoubleOne = new ShapeDouble(1, 2, 0);
    var shapeDoubleTwo = new ShapeDouble(1, 2, 0);
    game.addShape(shapeDoubleOne);
    game.addShape(shapeDoubleTwo);
    game.clearShapes();
    expect(game.getShapes()).to.eql([]);
  });

  it (".addShape doesn't add a shape with an invalid positive position on any axis", function(){
    var shapeDoubleOne = new ShapeDouble(0, 0, 0);
    var shapeDoubleTwo = new ShapeDouble(11, 0, 0);
    var shapeDoubleThree = new ShapeDouble(0, 11, 0);
    var shapeDoubleFour = new ShapeDouble(0, 0, 11);
    game.addShape(shapeDoubleOne);
    game.addShape(shapeDoubleTwo);
    game.addShape(shapeDoubleThree);
    game.addShape(shapeDoubleFour);
    expect(game.getShapes()).to.eql([shapeDoubleOne]);
  });

  it (".addShape doesn't add a shape with a negative position on any axis", function(){
    var shapeDoubleOne = new ShapeDouble(0, 0, 0);
    var shapeDoubleTwo = new ShapeDouble(-1, 0, 0);
    var shapeDoubleThree = new ShapeDouble(0, -1, 0);
    var shapeDoubleFour = new ShapeDouble(0, 0, -1);
    game.addShape(shapeDoubleOne);
    game.addShape(shapeDoubleTwo);
    game.addShape(shapeDoubleThree);
    game.addShape(shapeDoubleFour);
    expect(game.getShapes()).to.eql([shapeDoubleOne]);
  });

});
