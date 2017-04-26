"strict mode";
var GameController = require('../../src/controllers/gameController.js');
var Shape = require('../../src/models/shape.js');
function GameViewDouble() {

}
GameViewDouble.prototype = {
  getCanvas: function(){
  }
};

function GameDouble() {
  this.shapes = [];
}

GameDouble.prototype = {
  getShapes: function(){
    return true;
  },
  addShape: function(){
    return true;
  },
  rotateShapes: function(){
    return true;
  }
};

describe("GameController", function(){
  var gameController;
  var gameViewDouble;
  var gameDouble;

  beforeEach(function(){
    gameViewDouble = new GameViewDouble();
    gameDouble =  new GameDouble();
    gameController = new GameController(gameDouble, gameViewDouble);
  });

  it("exists", function(){
    expect(gameController).to.exist;
  });

  it("getAllShapes calls getShapes on game", function(){
    var spyGetShapes = sinon.spy(gameDouble, "getShapes");
    gameController.getAllShapes();
    expect(spyGetShapes).to.have.been.calledOnce;
  });

  it(".createShape returns a shape", function(){
    var spyAddShape = sinon.spy(gameDouble, "addShape");
    gameController.createShape();
    expect(spyAddShape).to.have.been.calledOnce;
  });

  it("can call rotate on all shapes", function(){
    var rotateSpy = sinon.spy(gameDouble, "rotateShapes");
    gameController.rotateWorld();
    expect(rotateSpy).to.have.been.calledOnce;
  });



});
