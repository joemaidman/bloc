"strict mode";

function Game(){
  this.shapes = [];
}

Game.prototype = {
  getShapes: function(){
    return this.shapes;
  },
  addShape: function(shape){
    this.shapes.push(shape);
  }
}

module.exports = Game;
