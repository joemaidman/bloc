// function _calculateRotation(cx, cy, x, y, angle) {
//   var radians = (Math.PI / 180) * angle,
//   cos = Math.cos(radians),
//   sin = Math.sin(radians),
//   nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
//   ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
//   return [nx, ny];
// }
//
// function rotate(coordinates, degrees = 90){
//   var newCoordinates = _calculateRotation((gridSize - 1)/2, (gridSize - 1)/2, coordinates.x, coordinates.y, degrees);
//   var x = Math.round(newCoordinates[0],0);
//   var y = Math.round(newCoordinates[1],0);
//   return {x: x, y: y};
// }

function Geometry() {
}

Geometry.prototype = {
  rotate: function (coordinates, degrees = 90, origin){
    var newCoordinates = this._calculateRotation((origin), (origin), coordinates.x, coordinates.y, degrees);
    var x = Math.max(0,Math.round(newCoordinates[0],0));
    var y = Math.max(0,Math.round(newCoordinates[1],0));
    return {x: x, y: y};
  },
  _calculateRotation: function (cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
  }
};

module.exports = Geometry;
