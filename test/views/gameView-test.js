"strict mode";

var GameView = require('../../app/views/gameView.js');

describe("GameView", function(){
  var gameView;

  beforeEach(function(){
    gameView = new GameView();
  });

  it("exists", function(){
    expect(gameView).not.to.be.undefined;
  });

  it("can return a canvas", function(){
    expect(gameView.getCanvas()).to.equal("<canvas width='600px' height='498px' id='canvas'></canvas>");
  });

});
