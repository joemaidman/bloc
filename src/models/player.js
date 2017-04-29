"strict mode";

function Player(id, name){
  this.id = id;
  this.name = name;
}

Player.prototype = {
  getName: function(){
    return this.name;
  },
  getId: function(){
    return this.id;
  }
};

module.exports = Player;
