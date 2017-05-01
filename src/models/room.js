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
  getPlayerById: function(id){
    var playerIndex = this._findPlayerIndex(id);
    return this.players[playerIndex];
  },
  removePlayer: function(id){
    var playerIndex = this._findPlayerIndex(id);
    if(playerIndex >= 0){this.players.splice(playerIndex,1)};
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
  },
  _findPlayerIndex: function(id){
    for(var i = 0; i < this.players.length; i++){
      if(this.players[i].id === id ){
        return i;
      }
    }
    return -1;
  }
};

module.exports = Room;
