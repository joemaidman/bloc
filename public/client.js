document.addEventListener("DOMContentLoaded", function(){

  var socket = io.connect();
  var iso = new Isomer(document.getElementById("canvas"));

  socket.emit('add_block', {block: [0,0,0]});
  socket.emit('add_block', {block: [3,0,0]});
  socket.emit('add_block', {block: [0,3,0]});
  socket.emit('add_block', {block: [0,3,0]});
  socket.emit('add_block', {block: [3,3,0]});

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

  GridLines(11,11,0);

   var blocks = data.blocks;
    for (var i = 0; i<blocks.length; i++ ){
      iso.add(Isomer.Shape.Prism(new Isomer.Point(blocks[i][0], blocks[i][1], blocks[i][2])));
    }
  });
});
