"strict mode";
var Isomer = require("isomer");
var Shape = Isomer.Shape;
var Point = Isomer.Point;
function Game(){
  this.name = "Bloc";
}
Game.prototype = {
  createShape:function(x = 0, y = 0, z = 0){
    return this._shape(new Point(x, y, z));
  },
  _shape: function(point){
    return Shape.Prism(point,0.5,0.5,0.5)
  }
}

module.exports = Game;
