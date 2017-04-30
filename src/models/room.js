"strict mode";

function Room(name, gameController, limit){
  this.name = name;
  this.gameController = gameController;
  this.players = [];
  this.setId();
  this.messages = [];
  this.setLimit(limit);
}

Room.prototype = {
  addPlayer: function(player){
    this.players.push(player);
  },
  getPlayers: function(){
    return this.players;
  },
  setId: function(){
    this.id = this._generateId();
  },
  getId: function(){
    return this.id;
  },
  getLimit: function(){
    return this.limit;
  },
  setLimit: function(limit){
    this.limit = limit;
  },
  getMessages: function(){
    return this.messages;
  },
  getName: function(){
    return this.name;
  },
  getPlayerCount: function(){
    return this.players.length;
  },
  addMessage: function(message){
    this.messages.push(message);
  },
  _generateId: function(){
    return '_' + Math.random().toString(36).substr(2, 9);
  }
};

module.exports = Room;
