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
  },
  rotateShapes: function(){
    for(var i = 0; i < this.shapes.length; i++){
      this.shapes[i].rotate();
    }
  }
}

module.exports = Game;
