"strict mode";

var Room = require('../../app/models/room.js');

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
  deleteShape: function(coordinates){
    return true;
  },
  rotateShapes: function(){
    return true;
  },
  getScale: function(){
    return true;
  },
  clearShapes: function(){
    return true;
  }
};

function MessageDouble(player, body){
  this.body = body;
  this.player = player;
  this.time = new Date().getTime();
}

MessageDouble.prototype = {
  getBody: function(){
    return this.body;
  },
  getSender: function(){
    return this.player;
  },
  getTime: function(){
    return this.time;
  }
};

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

describe("Room", function(){
  var room;
  var gameDouble;
  sinon.stub(Math, "random").callsFake(function () { return 23482748273; });

  beforeEach(function(){
    gameDouble = new GameDouble();
    room = new Room("Timmy's Game",gameDouble, 2);
  });

  it("exists", function(){
    expect(room).to.exist;
  });

  it("can return a list of players", function(){
    expect(room.getPlayers()).to.eql([]);
  });

  it("can return an id", function(){
    expect(room.getId()).to.eql('_d0sj5');
  });

  it("can return the limit of the room", function(){
    expect(room.getLimit()).to.eql(2);
  });

  it("can set the limit of the room", function(){
    room.setLimit(5);
    expect(room.getLimit()).to.eql(5);
  });

  it("can add a message to its messages and return the list of messages", function(){
    var player = new PlayerDouble(1, "Timmy");
    var msg = new MessageDouble(player, "Hi there");
    room.addMessage(msg);
    expect(room.getMessages()).to.eql([msg]);
  });

  it("can add a player to the room", function(){
    var player = new PlayerDouble();
    room.addPlayer(player);
    expect(room.getPlayers()).to.eql([player]);
  });

  it("can get the room name", function(){
    expect(room.getName()).to.eql("Timmy's Game");
  });

  it("can get a player count", function(){
    var player = new PlayerDouble(1, "Timmy");
    room.addPlayer(player);
    expect(room.getPlayerCount()).to.eql(1);
  });

  it("can remove a player", function(){
    var player = new PlayerDouble(1, "Timmy");
    room.addPlayer(player);
    room.removePlayer(player.id);
    expect(room.getPlayers()).to.eql([]);
  });

  it("cannot remove a player that isn't in the room", function(){
    var player = new PlayerDouble(1, "Timmy");
    room.addPlayer(player);
    room.removePlayer(2);
    expect(room.getPlayers()).to.eql([player]);
  });

  it("can return a single player by ID", function(){
    var player = new PlayerDouble(1, "Timmy");
    room.addPlayer(player);
    expect(room.getPlayerById(1)).to.eql(player);
  });

  it("can determine if it is full", function(){
    var player1 = new PlayerDouble(1, "Timmy");
    var player2 = new PlayerDouble(2, "Jimmy");
    room.addPlayer(player1);
    room.addPlayer(player2);
    expect(room.isFull()).to.be.true;
  });

});
