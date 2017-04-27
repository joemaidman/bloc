"strict mode";

document.addEventListener("DOMContentLoaded", function(){

  var socket = io.connect();
  var iso = new Isomer(document.getElementById("canvas"), { scale: 30 });
  var Shape = Isomer.Shape;
  var Point = Isomer.Point;
  var Color = Isomer.Color;
  var Path = Isomer.Path;

  drawGridLines(11,11,0);
  drawOrigin();

  $("#rotate").click(function() {
    socket.emit('rotate');
  });

  $("#add").click(function() {
    var x = parseInt($("#x").val());
    var y = parseInt($("#y").val());
    var z = parseInt($("#z").val());
    socket.emit('add_block', {block: [x,y,z,255,0,0]});
  });

  socket.emit('add_block', {block: [0,0,0,0,0,255]});

  socket.emit('add_block', {block: [3,0,0,0,255,0]});
  socket.emit('add_block', {block: [0,3,0,255,0,0]});
  socket.emit('add_block', {block: [3,3,0,100,100,100]});

  function drawGridLines (xsize, ysize, zheight) {
    for (x = 0; x < xsize+1; x++) {
      iso.add(new Path([
        new Point(x, 0, zheight),
        new Point(x, xsize, zheight),
        new Point(x, 0, zheight),
      ]),
      new Color(255, 0, 0));
    }
    for (y = 0; y < ysize+1; y++) {
      iso.add(new Path([
        new Point(0, y, zheight),
        new Point(ysize, y, zheight),
        new Point(0, y, zheight),
      ]),
      new Color(255,0,0));
    }
  }

  function  drawOrigin(){
    iso.add(new Path([
      Point(4, 4, 2),
      Point(4, 3, 2),
      Point(4, 4, 1),
      Point(4, 5, 1)
    ]), new Color(50, 160, 60));
  }

  socket.on('updateWorld', function (data) {
    iso.canvas.clear();
    drawGridLines(11,11,0);
    drawOrigin();
    var blocks = data.blocks;
    console.log("Adding blocks");
    for (var i = 0; i<blocks.length; i++ ){
      console.log("Block added");
      iso.add(Shape.Prism(new Point(blocks[i].xPos, blocks[i].yPos, blocks[i].zPos)),new Color(blocks[i].r,blocks[i].g,blocks[i].b));
    }
  });
});

document.addEventListener("DOMContentLoaded", function(){
  var canvas = document.getElementById("canvas");
  var stage = new createjs.Stage(document.getElementById("canvas"));


  stage.on("stagemousedown", function(evt) {
    alert("the canvas was clicked at "+evt.stageX+","+evt.stageY);
});
  // canvas.addEventListener("mousedown", getPosition, false);
  //
  // function getPosition(event){
  //   var rect = canvas.getBoundingClientRect();
  //   var x = event.clientX - rect.left;
  //   var y = event.clientY - rect.top;
  //   console.log("x: " + x + "y: " + y);
  // }
});
