"strict mode";

var Player = require('../../app/models/player.js');

describe("Player", function(){
  var player;

  beforeEach(function(){
    player = new Player("123456", "Timmy");
  });

  it("exists", function(){
    expect(player).to.exist;
  });

  it("can return its ID", function(){
    expect(player.getId()).to.eql("123456");
  });

  it("can return its name", function(){
    expect(player.getName()).to.eql("Timmy");
  });

});
