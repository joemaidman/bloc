"strict mode";

function Room(game, id, limit){
  this.game = game;
  this.players = [];
  this.id = id;
  this.messages = [];
  this.setLimit(limit);
}

Room.prototype = {
  getPlayers: function(){
    return this.players;
  },
  getId: function(){
    return this.id;
  },
  getLimit: function(){
    return this.limit
  },
  setLimit: function(limit){
    this.limit = limit
  },
  getMessages: function(){
    return this.messages;
  },
  addMessage: function(message){
    this.messages.push(message);
  }
};

module.exports = Room;
