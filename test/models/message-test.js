"strict mode";

var Message = require('../../src/models/message.js');

function PlayerDouble(id, name){
  this.id = id;
  this.name = name;
}

PlayerDouble.prototype = {
  getName: function(){
    return this.name;
  },
  getId: function(){
    return this.id;
  }
};


describe("Message", function(){
  var message;
  var player;

  beforeEach(function(){
    mockDate = new Date();
    timekeeper.freeze(mockDate);
    player = new PlayerDouble(1, "Timmy");
    message = new Message(player, "Hi there");
  });

  it("exists", function(){
    expect(message).to.exist;
  });

  it("can return its body", function(){
    expect(message.getBody()).to.eql("Hi there");
  });

  it("can return its sender", function(){
    expect(message.getSender()).to.eql(player);
  });

  it("can return it's time", function(){
    expect(message.getTime()).to.eql(mockDate.getTime());
  });

  afterEach(function(){
     timekeeper.reset();
   });

});
