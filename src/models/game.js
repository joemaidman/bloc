"strict mode";
var Isomer = require("isomer");
var Shape = Isomer.Shape;
var Point = Isomer.Point;
function Game(){
  this.name = "Bloc";
}
Game.prototype = {
  createShape:function(){
    return Shape.Prism(Point(2,0,1));
  }
}

module.exports = Game;
