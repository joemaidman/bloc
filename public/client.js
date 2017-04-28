"strict mode";

document.addEventListener("DOMContentLoaded", function(){

  var socket = io.connect();
  var iso = new Isomer(document.getElementById("canvas"), { scale: 30});
  var Shape = Isomer.Shape;
  var Point = Isomer.Point;
  var Color = Isomer.Color;
  var Path = Isomer.Path;

  var input = document.querySelectorAll("input");





  drawGridLines(11,11,0);
  drawOrigin();

  $("#rotate").click(function() {
    socket.emit('rotate');
  });

  for(var i = 0; i < input.length; i++){
    input[i].addEventListener("input",function(){
      var r = document.getElementById("red").value,
        g = document.getElementById("green").value,
          b = document.getElementById("blue").value;
      var display = document.getElementById("display");
      display.style.background = "rgb(" + r + "," + g + "," + b + ")"
    });
  }


  $("#clear").click(function() {
    socket.emit('clearBlocks');
  });

  function calculateGridPosition(mouseX, mouseY){
    var x = Math.floor(((mouseX - 300) / 26) + (((mouseX - 300) / 26) + ((mouseY - 540)/ 15)) / -2);
    var y = Math.floor((((mouseX - 300) / 26) + ((mouseY - 540) / 15)) / -2);
    return {x: x, y: y};
  }

  function writeMessage(canvas, message, x, y) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, 400, 100);
    context.font = '12pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, x, y);
  }
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var message = "Mouse: x:" + Math.floor(mousePos.x) + ", y:" + Math.floor(mousePos.y) + "\n";
    var gridPos = calculateGridPosition(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y);
    message += "Grid: x : " + gridPos.x + ", y: " + gridPos.y;
    writeMessage(canvas, message, 10, 25);
  }, false);

  canvas.addEventListener('mouseup', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var gridPos = calculateGridPosition(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y);
    var r = document.getElementById("red").value,
        g = document.getElementById("green").value,
        b = document.getElementById("blue").value;
    socket.emit('add_block', {block: [gridPos.x,gridPos.y,0,r,g,b]});
  }, false);

  $("#add").click(function() {
    var x = parseInt($("#x").val());
    var y = parseInt($("#y").val());
    var z = parseInt($("#z").val());
    var r = document.getElementById("red").value,
      g = document.getElementById("green").value,
        b = document.getElementById("blue").value;
    socket.emit('add_block', {block: [x,y,z,r,g,b]});
  });

  $("#delete").click(function() {
    var x = parseInt($("#x").val());
    var y = parseInt($("#y").val());
    var z = parseInt($("#z").val());
    console.log("Deleting Block")
    socket.emit('delete_block', {block: [x,y,z]});
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

  function drawOrigin(){
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
    console.log("Receiving world update and drawing blocks");
    for (var i = 0; i<blocks.length; i++ ){
      console.log("Block added");
      iso.add(Shape.Prism(new Point(blocks[i].xPos, blocks[i].yPos, blocks[i].zPos)),new Color(blocks[i].r,blocks[i].g,blocks[i].b));
    }
    writeMessage(canvas, "Block Count: " + blocks.length, 450, 20);
  });
});

document.addEventListener("DOMContentLoaded", function(){
  var canvas = document.getElementById("canvas");

  canvas.addEventListener("mousedown", getPosition, false);

  function getPosition(event){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
  }
});
