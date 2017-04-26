document.addEventListener("DOMContentLoaded", function(){

  var socket = io.connect();
  var iso = new Isomer(document.getElementById("canvas"));

  GridLines(11,11,0);

  socket.emit('add_block', {block: [4,1,0,255,0,0]});
  socket.emit('add_block', {block: [3,0,0,255,0,0]});


  function GridLines (xsize, ysize, zheight) {
    for (x = 0; x < xsize+1; x++) {
      iso.add(new Isomer.Path([
        new Isomer.Point(x, 0, zheight),
        new Isomer.Point(x, xsize, zheight),
        new Isomer.Point(x, 0, zheight),
      ]),
    new Isomer.Color(255, 0, 0));
    }
    for (y = 0; y < ysize+1; y++) {
      iso.add(new Isomer.Path([
        new Isomer.Point(0, y, zheight),
        new Isomer.Point(ysize, y, zheight),
        new Isomer.Point(0, y, zheight),
      ]),
    new Isomer.Color(255,0,0));
    }
  }

  socket.on('updateWorld', function (data) {


   var blocks = data.blocks;
    for (var i = 0; i<blocks.length; i++ ){
      iso.add(Isomer.Shape.Prism(new Isomer.Point(blocks[i].xPos, blocks[i].yPos, blocks[i].zPos)));
    }
  });
});

document.addEventListener("DOMContentLoaded", function(){
  var canvas = document.getElementById("canvas");

  canvas.addEventListener("mousedown", getPosition, false);

  function getPosition(event){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + "y: " + y);
  }
});
