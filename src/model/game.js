"use strict";
function Game(){
  this.name = "Bloc";
};

Game.prototype = {
    play: function(){
      return true;
    }
  };

module.exports = Game;
