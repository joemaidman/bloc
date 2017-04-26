document.addEventListener("DOMContentLoaded", function(){

  var socket = io.connect();
  var iso = new Isomer(document.getElementById("canvas"));

  GridLines(11,11,0);
  drawOrigin();

  $( "#rotate" ).click(function() {
    socket.emit('rotate');
  });

  socket.emit('add_block', {block: [0,0,0,255,0,0]});
  socket.emit('add_block', {block: [3,0,0,255,0,0]});
  socket.emit('add_block', {block: [0,3,0,255,0,0]});
  socket.emit('add_block', {block: [3,3,0,255,0,0]});

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

  function  drawOrigin(){
    iso.add(new Isomer.Path([
      Isomer.Point(5, 5, 0),
      Isomer.Point(6, 5, 0),
      Isomer.Point(5, 6, 0),
      Isomer.Point(6, 6, 0)
    ]), new Isomer.Color(50, 160, 60));
  }

  socket.on('updateWorld', function (data) {

   var blocks = data.blocks;
   console.log("Adding blocks");
    for (var i = 0; i<blocks.length; i++ ){
      console.log("Block added");
      iso.add(Isomer.Shape.Prism(new Isomer.Point(blocks[i].xPos, blocks[i].yPos, blocks[i].zPos)),new Isomer.Color(blocks[i].r,blocks[i].g,blocks[i].b));
    }

  });
});
