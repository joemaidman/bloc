document.addEventListener("DOMContentLoaded", function(){
  var socket = io.connect();
  var iso = new Isomer(document.getElementById("canvas"));

  socket.emit('add_block', {block: [0,0,0]});
  socket.emit('add_block', {block: [3,0,0]});
  socket.emit('add_block', {block: [0,3,0]});
  socket.emit('add_block', {block: [0,3,0]});
  socket.emit('add_block', {block: [3,3,0]});


  socket.on('updateWorld', function (data) {

  function GridLines () {
    for (x = 0; x < 13; x++) {
      iso.add(new Isomer.Path([
        new Isomer.Point(x, 10, 0),
        new Isomer.Point(x, 5, 0),
        new Isomer.Point(x, 0, 0),
      ]),
    new Isomer.Color(255, 0, 0));
    }
  }

  GridLines()


   var blocks = data.blocks;
    for (var i = 0; i<blocks.length; i++ ){
      iso.add(Isomer.Shape.Prism(new Isomer.Point(blocks[i][0], blocks[i][1], blocks[i][2])));
    }
  });
});
