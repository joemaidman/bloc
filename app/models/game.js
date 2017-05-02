"strict mode";

function Game(size){
  this.shapes = [];
  this.size = size - 1;
}

Game.prototype = {
  getShapes: function(){
    this._sortShapes();
    return this.shapes;
  },
  getSize: function(){
    return this.size;
  },
  addShape: function(shape){
    if (this._positionEmpty(shape) && this._positionValid(shape)) { this.shapes.push(shape); }
  },
  deleteShape: function(coordinates){
    var shapeIndex = this._findShapeIndex(coordinates);
    if(shapeIndex >= 0){this.shapes.splice(shapeIndex,1)};
  },
  clearShapes: function(){
    this.shapes = [];
  },
  _positionEmpty: function(shape){
    return this._findShapeIndex(shape.getPosition()) === -1;
  },
  _positionValid: function(shape){
    var position = shape.getPosition();
    return (position.x <= this.getSize() && position.x >= 0) && (position.y <= this.getSize() && position.y >= 0) && (position.z <= this.getSize() && position.z >= 0);
  },
  _findShapeIndex: function(coordinates){
    for(var i = 0; i < this.shapes.length; i++){
      if((this.shapes[i].getPosition().x == coordinates.x) &&(this.shapes[i].getPosition().y == coordinates.y) && (this.shapes[i].getPosition().z == coordinates.z)){
        return i;
      }
    }
    return -1;
  },
  _sortShapes: function(){
    this.shapes.sort(function(a, b){
      return (a.getPosition().z - b.getPosition().z || b.getPosition().x - a.getPosition().x || b.getPosition().y - a.getPosition().y);
    });
  }
};

module.exports = Game;
