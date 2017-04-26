document.addEventListener("DOMContentLoaded", function(){
  var socket = io.connect();
  var iso = new Isomer(document.getElementById("canvas"));

  socket.emit('add_block', {block: [0,0,0]});
  socket.emit('add_block', {block: [-1,0,0]});
  socket.emit('add_block', {block: [3,6,9]});
  socket.on('updateWorld', function (data) {
   var blocks = data.blocks;
    for (var i = 0; i<blocks.length; i++ ){
      iso.add(Isomer.Shape.Prism(new Isomer.Point(blocks[i][0], blocks[i][1], blocks[i][2])));
    }
  });
});
