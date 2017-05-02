"strict mode";

document.addEventListener("DOMContentLoaded", function(){

  // Variables setup
  var canvas = document.getElementById('centerpiece');
  var context = canvas.getContext('2d');
  var iso;
  var Shape = Isomer.Shape;
  var Point = Isomer.Point;
  var Color = Isomer.Color;
  var Path = Isomer.Path;
  var angle = 0;
  iso = new Isomer(canvas, { scale: 50});

  window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();



  function updateCenterPiece(){
        iso.canvas.clear();
    // iso.add(Octahedron(new Point(3, 2, 3.2)).rotateZ(new Point(3.5, 2.5, 0), angle), new Color(0, 180, 180));
    iso.add(Shape.Prism(new Point(0,0,0)).rotateZ(new Point(0.5,0.5,0), angle),new Color(0, 180, 180,0.3));

      iso.add(Shape.Cylinder(new Point(0.5,0.5), 0.5, 50, 1).rotateZ(new Point(0.5,0.5,0), angle),new Color(255,0,0,0.1));
        iso.add(Shape.Pyramid(new Point(0,0,0)).rotateZ(new Point(0.5,0.5,0), angle),new Color(255, 100, 0,0.3));

//     var blue = new Isomer.Color(50, 60, 160);
// var cube = Shape.Prism(Point.ORIGIN, 3, 3, 1);
// iso.add(cube);
// iso.add(cube
//   /* (1.5, 1.5) is the center of the prism */
//   .rotateZ(Point(1.5, 1.5, 0), angle)
//   .translate(0, 0, 1.1)
// , blue);
    angle += Math.PI / 90;
    console.log(angle)

  requestAnimationFrame(updateCenterPiece);
  }

  requestAnimationFrame(updateCenterPiece);

});
