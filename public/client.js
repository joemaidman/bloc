"strict mode";

document.addEventListener("DOMContentLoaded", function(){

  var socket = io.connect();
  var iso = new Isomer(document.getElementById("canvas"), { scale: 30});
  var Shape = Isomer.Shape;
  var Point = Isomer.Point;
  var Color = Isomer.Color;
  var Path = Isomer.Path;
  var blocks = [];
  var input = document.querySelectorAll("input");
  var z = 0;
  var scrollDistance = 0;

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

  function writeMessage(message, divName) {
    document.getElementById(divName).innerText = message;
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

canvas.addEventListener('mousewheel',function(evt){
scrollDistance+= evt.deltaY
  if( scrollDistance> 10){
    z = Math.min(10,z+=1)
    scrollDistance = 0
    drawWorld();
  }
  else if (scrollDistance < -10) {
    z= Math.max(0,z-=1)
    scrollDistance = 0
    drawWorld();
  }
  console.log(evt.deltaY);

  evt.preventDefault();
}, false);

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var message = "Mouse: x:" + Math.floor(mousePos.x) + ", y:" + Math.floor(mousePos.y) + "  ";
    var gridPos = calculateGridPosition(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y);
    message += "Grid: x : " + gridPos.x + ", y: " + gridPos.y+ ", z: " + z;
    writeMessage(message, "positionDiv");
  }, false);

  // canvas.addEventListener('mouseup', function(evt) {
  //   var mousePos = getMousePos(canvas, evt);
  //   var gridPos = calculateGridPosition(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y);
  //   var r = document.getElementById("red").value,
  //       g = document.getElementById("green").value,
  //       b = document.getElementById("blue").value;
  //   socket.emit('add_block', {block: [(gridPos.x -=z),(gridPos.y -=z),z,r,g,b]});
  // }, false);

  canvas.addEventListener('mousedown', function(evt) {
   var mousePos = getMousePos(canvas, evt);
   var gridPos = calculateGridPosition(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y)
   if (evt.which === 3) {
     socket.emit('delete_block', {block: [gridPos.x,gridPos.y, 0]});
   }
     else if (evt.which === 1) {
       var r = document.getElementById("red").value,
           g = document.getElementById("green").value,
           b = document.getElementById("blue").value;
socket.emit('add_block', {block: [(gridPos.x -=z),(gridPos.y -=z),z,r,g,b]});
   }
 }, false);

 canvas.addEventListener('contextmenu', function(evt) {
   evt.preventDefault();
 }, false);

  // canvas.addEventListener("mousedown", function(evt) {
  //   var highlightGrid;
  //   var gridPos = calculateGridPosition(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y);
  //
  //   if (highlightGrid !== gridPos) {
  //     highlightGrid = gridPos
  //
  //     console.log('gridPos' + gridPos)
  //     console.log('highlight grid' + highlightGrid)
  //
  //     // console.log('original variable')
  //     // console.log('changed variable')
  //
  //     iso.add(new Path([
  //       Point(highlightGrid.x, highlightGrid.y, 0),
  //       Point(highlightGrid.x, highlightGrid.y + 1, 0),
  //       Point(highlightGrid.x + 1, highlightGrid.y, 0),
  //       Point(highlightGrid.x + 1, highlightGrid.y + 1, 0)
  //     ]), new Color(50, 160, 60));
  //   }
  // }, false);

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

  function drawGridLines (xsize, ysize, zheight, r, g, b, a) {
    for (x = 0; x < xsize+1; x++) {
      iso.add(new Path([
        new Point(x, 0, zheight),
        new Point(x, xsize, zheight),
        new Point(x, 0, zheight),
      ]),
      new Color(r, g, b,a));
    }
    for (y = 0; y < ysize+1; y++) {
      iso.add(new Path([
        new Point(0, y, zheight),
        new Point(ysize, y, zheight),
        new Point(0, y, zheight),
      ]),
      new Color(r, g, b,a));
    }
  }

  function drawOrigin(r, g, b, a, zIndex){
    iso.add(new Path([
      Point(4, 4, zIndex + 2),
      Point(4, 3, zIndex + 2),
      Point(4, 4, zIndex + 1),
      Point(4, 5, zIndex + 1)
    ]), new Color(r, g, b,a));
  }

  socket.on('updateWorld', function (data) {

    blocks = data.blocks;
    console.log("Receiving world update and drawing blocks");
   drawWorld();
  });


function drawWorld(){
  iso.canvas.clear();
  // drawGridLines(11,11,0,255,0,0,0.5);
  // drawOrigin(255, 0, 0, 0, 0);
  var didIDraw = false;
  if(z === 0){
    drawGridLines(11,11,z,255, 154, 0,1);
    drawOrigin(255, 154, 0,1, z);
    didIDraw = true;
  }

  for (var i = 0; i<blocks.length; i++ ){
    if(i > 0){
      if(blocks[i - 1].zPos != blocks[i].zPos && blocks[i].zPos === z && z > 0){
        drawGridLines(11,11,z,255, 154, 0,1);
        drawOrigin(255, 154, 0,1, z);
        didIDraw = true;
      }
    }

    console.log("Block added");
    iso.add(Shape.Prism(new Point(blocks[i].xPos, blocks[i].yPos, blocks[i].zPos)),new Color(blocks[i].r,blocks[i].g,blocks[i].b));
  }
  if(didIDraw === false){
    drawGridLines(11,11,z,255, 154, 0,1);
    drawOrigin(255, 154, 0, 1, z);
  }
  writeMessage("Block Count: " + blocks.length, "blockDiv");
}

  canvas.addEventListener("mousedown", getPosition, false);

  function getPosition(event){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
  }
});
