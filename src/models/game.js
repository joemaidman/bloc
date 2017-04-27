"strict mode";

function Game(){
  this.shapes = [];
}

Game.prototype = {
  getShapes: function(){
    this._sortShapes();
    return this.shapes;
  },
  addShape: function(shape){
    if (this._findShapeIndex(shape.getPosition()) === false) { this.shapes.push(shape); }
  },
  deleteShape: function(coordinates){
    this.shapes.splice(this._findShapeIndex(coordinates),1);
  },
  rotateShapes: function(){
    for(var i = 0; i < this.shapes.length; i++){
      this.shapes[i].rotate();
    }
  },
  _findShapeIndex: function(coordinates){
    for(var i = 0; i < this.shapes.length; i++){
      if((this.shapes[i].getPosition().x == coordinates.x) &&(this.shapes[i].getPosition().y == coordinates.y) && (this.shapes[i].getPosition().z == coordinates.z)){
        return i;
      }
    }
    return false;
  },
  _sortShapes: function(){
    this.shapes.sort(function(a, b){
        return (a.getPosition().x + a.getPosition().y + (a.getPosition().z * 100)) < (b.getPosition().x + b.getPosition().y + (b.getPosition().z * 100));
    });
  }
};

module.exports = Game;
