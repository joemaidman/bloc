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
    return {x: this.xPos, y: this.yPos, z: this.zPos}
  }
};
describe("Game", function(){
  var game;

  beforeEach(function(){
    game = new Game();
  });

  it(".getShapes returns an array of shapes", function(){
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

  it (".deleteShape deletes a shape from the shape array", function(){
    var shapeDoubleOne = new ShapeDouble(1, 2, 0);
    var shapeDoubleTwo = new ShapeDouble(4, 1, 0);
    game.addShape(shapeDoubleOne);
    game.addShape(shapeDoubleTwo);
    expect(game.getShapes()).to.eql([shapeDoubleOne, shapeDoubleTwo]);
    console.log(game.getShapes())
    game.deleteShape({x: 1, y: 2, z: 0});
    console.log(game.getShapes())
    // expect(game.getShapes()).to.eql([shapeDoubleTwo]);
  })

});
