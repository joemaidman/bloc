"strict mode";

function Shape(xPos = 0, yPos = 0, zPos = 0, r = 0, g = 0, b = 0){
  this.setPosition(xPos, yPos, zPos);
  this.setColor(r, g, b);
}

Shape.prototype = {
  getPosition: function(){
    return { x: this.xPos, y: this.yPos, z: this.zPos };
  },
  getColor: function(){
    return { r: this.r, g: this.g, b: this.b };
  },
  setPosition: function(xPos = 0, yPos = 0, zPos = 0){
    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos = zPos;
  },
  setColor: function( r = 0, g = 0, b = 0){
    this.r = r;
    this.g = g;
    this.b = b;
  },
  rotate: function(originX = 5, originY = 5, degrees = 90){
    var newCoordinates = this._calculateRotation(originX, originY, this.xPos, this.yPos, degrees)
    this.setPosition(newCoordinates[0], newCoordinates[1], this.zPos);
  },
  _calculateRotation: function(cx, cy, x, y, angle) {
      var radians = (Math.PI / 180) * angle,
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
          ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
      return [nx, ny];
  }
};

module.exports = Shape;
