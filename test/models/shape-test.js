"strict mode";

var Shape = require('../../src/models/shape.js');

describe("Shape", function(){
  var shape;

  beforeEach(function(){
    shape = new Shape(0, 0, 0, 155, 60, 50);
  });

  it("exists", function(){
    expect(shape).to.exist;
  });

  it(".getPosition returns a hash of the shape's position", function(){
    expect(shape.getPosition()).to.eql({x: 0, y: 0, z: 0});
  });

  it(".getColor returns a hash of the shape's RGB value", function(){
    expect(shape.getColor()).to.eql({r: 155, g: 60, b: 50});
  });

  it(".getPosition returns a hash of the shape's updated position", function(){
    shape.setPosition(1,1,1);
    expect(shape.getPosition()).to.eql({x: 1, y: 1, z: 1});
  });

  it(".getColor returns a hash of the shape's updated color", function(){
    shape.setColor(0,0,0);
    expect(shape.getColor()).to.eql({r: 0, g: 0, b: 0});
  });

  it("can set and get its texture", function(){
    shape.setTexture("wood");
    expect(shape.getTexture()).to.eq("wood");
  });

  it(".getTexture returns false if not textured", function(){
    expect(shape.getTexture()).to.eq(false);
  });

  it("can set and get the type of shape", function(){
    shape.setType(1);
    expect(shape.getType()).to.eq(1);
  });


});
