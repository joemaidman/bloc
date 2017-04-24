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
var gameViewDouble = new GameViewDouble()
var gameDouble = new GameDouble()
beforeEach(function(){
  gameController = new GameController(gameDouble, gameViewDouble);
});

 it("exists", function(){
   expect(gameController).to.exist;
  });

it("render calls git canvas on game view", function() {

var spyOn = sinon.spy(gameViewDouble, "getCanvas")

gameController.render()
expect(spyOn).to.HaveBeenCalled 

});

});
