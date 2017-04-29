"strict mode";

function Room(gameController, limit, id = this._generateId()){
  this.gameController = gameController;
  this.players = [];
  this.id = id;
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
  addMessage: function(message){
    this.messages.push(message);
  },
  _generateId: function(){
    return '_' + Math.random().toString(36).substr(2, 9);
  }
};

module.exports = Room;
