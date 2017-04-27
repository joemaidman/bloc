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
  deleteShape: function(coordinates){
    // console.log(this.shapes)
    this.shapes = this._findShape(coordinates)
    // console.log(this.shapes)
  },
  rotateShapes: function(){
    for(var i = 0; i < this.shapes.length; i++){
      this.shapes[i].rotate();
    }
  },
  _findShape: function(coordinates){
    return this.shapes.find(function(shape){
      console.log(shape.getPosition().toString())
      console.log(coordinates.toString())

      // console.log(shape.getPosition().toString() !== coordinates.toString());
    });
  }
};

module.exports = Game;
