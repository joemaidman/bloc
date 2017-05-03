"strict mode";

var Geometry = require('../../client/geometry.js');

describe("Geometry", function(){
  var geometry;
  var coordinates;
  var gameDouble;
  // sinon.stub(Math, "random").callsFake(function () { return 23482748273; });

  beforeEach(function(){
    geometry = new Geometry();
    coordinates = { x: 10, y: 10};
  });

  it("exists", function(){
    expect(geometry).to.exist;
  });

  it("can rotate coordinates 90 degrees", function(){
    expect(geometry.rotate(coordinates, 90, 5)).to.eql({x: 10, y: 0});
  });

  it("can rotate coordinates 180 degrees", function(){
    expect(geometry.rotate(coordinates, 180, 5)).to.eql({x: 0, y: 0});
  });

  it("can rotate coordinates 270 degrees", function(){
    expect(geometry.rotate(coordinates, 270, 5)).to.eql({x: 0, y: 10});
  });

  it("can rotate coordinates 360 degrees", function(){
    expect(geometry.rotate(coordinates, 360, 5)).to.eql({x: 10, y: 10});
  });

  it("check that the _calculateRotation method is called", function(){
    var calculateRotationSpy = sinon.spy(geometry, '_calculateRotation');
    geometry.rotate(coordinates, 90, 5);
    expect(calculateRotationSpy).to.have.been.calledOnce;
  });
});
