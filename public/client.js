document.addEventListener("DOMContentLoaded", function() {
  var socket  = io.connect();
  var iso = new Isomer(document.getElementById("canvas"));
  var blockCount = 0;

	socket.on('add_block', function (data) {
    console.log("Receiving block");
    var block = data.block;
    iso.add(Isomer.Shape.Prism(new Isomer.Point(block[0],block[1],block[2]),0.3,0.3,0.3));
    blockCount++;
   });
   //Adds a block every 2 seconds with a higher Y coordinate
   $('#add').click(function(){
     console.log("Sending block");
     socket.emit('add_block', { block: [ 0, 0, blockCount ] });

   });
});
