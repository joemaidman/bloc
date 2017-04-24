"strict mode";

var GameController = require('../../src/controllers/gameController.js');
function GameViewDouble() {

}
GameViewDouble.prototype = {
  getCanvas: function(){
  }
};

function GameDouble() {

}
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

  it("render calls git canvas on game view", function(){
    var spyGetCanvas = sinon.spy(gameViewDouble, "getCanvas");
    gameController.render();
    expect(spyGetCanvas).to.have.been.calledOnce;
  });

});
