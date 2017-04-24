"strict mode";

var GameView = require('../../src/views/gameView.js');

describe("GameView", function(){
var gameView;

 it("exists", function(){
   gameView = new GameView();
   expect(gameView).not.to.be.undefined;
  });

});
