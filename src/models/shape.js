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
  }
};

module.exports = Shape;
