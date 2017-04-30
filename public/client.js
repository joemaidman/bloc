"strict mode";

document.addEventListener("DOMContentLoaded", function(){

  // Variables setup
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var socket = io.connect();

  var iso = new Isomer(canvas, { scale: 18, originY: canvas.height});
  var Shape = Isomer.Shape;
  var Point = Isomer.Point;
  var Color = Isomer.Color;
  var Path = Isomer.Path;
  var blocks = [];
  var highlightGrid = {x: 5, y: 5};
  var input = document.querySelectorAll("input");
  var z = 0;
  var scrollDistance = 0;
  var showGridlines = true;
  var changeColourOfGridlines = false;
  var gridr = 255;
  var gridg = 0;
  var gridb = 0;
  var roomId;

  drawGridLines(21,21,0);
  drawOrigin();
  // drawTestBlocks();
  setupColorPicker();
  drawWorld();

  $("#gameDiv").hide();

  $("#newGame").click(function() {
    var gameName = $("#newGameName").val();
    socket.emit('new_game', gameName);
    $("#sessionDiv").hide();
    $("#gameDiv").show();
  });



  //UI setup
  function setupColorPicker(){
    for(var i = 0; i < input.length; i++){
      input[i].addEventListener("input",function(){
        var r = document.getElementById("red").value,
        g = document.getElementById("green").value,
        b = document.getElementById("blue").value;
        var display = document.getElementById("display");
        display.style.background = "rgb(" + r + "," + g + "," + b + ")"
      });
    }
  }

  //UI element event listeners
  $("#rotate").click(function() {
    socket.emit('rotate', roomId );
  });

  $("#clear").click(function() {
    socket.emit('clearBlocks', roomId);
  });

  $("#toggleGridlines").click(function() {
    showGridlines === true ? showGridlines = false : showGridlines = true;
    drawWorld();
  });

  $("#saveCanvas").click(function() {
    downloadCanvas(this);
  });

  $("#changeGridlinecolour").click(function() {

        gridr = document.getElementById("red").value;
        gridg = document.getElementById("green").value;
        gridb = document.getElementById("blue").value;
        drawWalls(21,21,21,gridr,gridg,gridb,1);
        drawGridLines(21,21,0,255,0,0,1);
        drawOrigin(255,0,0, 0, 0);

      drawWorld();
  });
  $("#changeCanvasColour").click(function() {
    var r = document.getElementById("red").value,
    g = document.getElementById("green").value,
    b = document.getElementById("blue").value;
    var changeColour = document.getElementById("canvas");
    changeColour.style.background = "rgb(" + r + "," + g + "," + b + ")"
  })

  $("#add").click(function() {
    var x = parseInt($("#x").val());
    var y = parseInt($("#y").val());
    var z = parseInt($("#z").val());
    var r = document.getElementById("red").value,
    g = document.getElementById("green").value,
    b = document.getElementById("blue").value;
    emitBlock([x,y,z,r,g,b]);
  });

  $("#delete").click(function() {
    var x = parseInt($("#x").val());
    var y = parseInt($("#y").val());
    var z = parseInt($("#z").val());
    socket.emit('delete_block', {block: [x,y,z], roomId: roomId});
  });

  // Canvas event listeners
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
    console.log("Im here")
    evt.preventDefault();
  }, false);

  canvas.addEventListener("mousemove", function(evt) {
    var gridPos = calculateGridPosition(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y);
    if (highlightGrid !== gridPos) {
      highlightGrid = gridPos;
      drawWorld();
      var message = "Grid: x : " + gridPos.x + ", y: " + gridPos.y+ ", z: " + z;
      writeMessage(message, "positionDiv");
    }
  });

  canvas.addEventListener('mousedown', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var gridPos = calculateGridPosition(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y)
    if (evt.which === 3) {
      socket.emit('delete_block', {block: [(gridPos.x -=z),(gridPos.y -=z), z], roomId: roomId});
    }
    else if (evt.which === 1) {
      var r = document.getElementById("red").value,
      g = document.getElementById("green").value,
      b = document.getElementById("blue").value;
      emitBlock([(gridPos.x -=z),(gridPos.y -=z),z,r,g,b]);
    }
  }, false);

  canvas.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
  }, false);

  //Key down listeners
  window.addEventListener('keydown', function(evt){
    if(evt.keyCode === 38){
      z = Math.min(10,z+=1)
      drawWorld();
      evt.preventDefault();
    }
    else if (evt.keyCode === 40) {
      z = Math.max(0,z-=1)
      drawWorld();
      evt.preventDefault();
    }
  });

  // Functions
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

  function drawHighlight(){
    var r = document.getElementById("red").value,
    g = document.getElementById("green").value,
    b = document.getElementById("blue").value;
    a = 0.4
    iso.add(Shape.Prism(new Point(highlightGrid.x, highlightGrid.y)),new Color(r,g,b,a));
  }

  function drawTestBlocks(){
    emitBlock([0,0,0,0,0,255]);
    emitBlock([3,0,0,0,255,0]);
    emitBlock([0,3,0,255,0,0]);
    emitBlock([3,3,0,100,100,100]);
  }

  function emitBlock(block){
    socket.emit('add_block', {block: block, roomId: roomId});
  }

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

  function drawWalls (xsize, ysize, zheight, r, g, b, a) {
    for(zVal = 0; zVal < zheight + 1; zVal++){
      iso.add(new Path([
        new Point(xsize, zVal, 0),
        new Point(xsize, zVal, 0),
        new Point(xsize, zVal, xsize),
      ]), new Color(r, g, b,a));
    }

    for(zValb = 0; zValb < zheight + 1; zValb++){
      iso.add(new Path([
        new Point(zValb, ysize, 0),
        new Point(zValb, ysize, 0),
        new Point(zValb, ysize, xsize),
      ]), new Color(r, g, b,a));
    }


    for(zValc = 0; zValc < zheight + 1; zValc++){
      iso.add(new Path([
        new Point(xsize, ysize, zValc),
        new Point((xsize / 2), ysize, zValc),
        new Point(0, ysize, zValc),
      ]), new Color(r,g,b,a));
    }

    for(zVald = 0; zVald < zheight + 1; zVald++){
      iso.add(new Path([
        new Point(xsize, 0, zVald),
        new Point(xsize, ysize, zVald),
        new Point(xsize, 0, zVald),
      ]), new Color(r,g,b,a));
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

  function drawSomeBlocks(someBlocks){
    for (var i = 0; i<someBlocks.length; i++ ){
      iso.add(Shape.Prism(new Point(someBlocks[i].xPos, someBlocks[i].yPos, someBlocks[i].zPos)),new Color(someBlocks[i].r,someBlocks[i].g,someBlocks[i].b));
    }
  }

  function isBelow(block){
    return block.zPos < z;
  }

  function isAbove(block){
    return block.zPos >= z;
  }

  function clearCanvas(){
    iso.canvas.clear();
  }

  function drawWorld(){
    clearCanvas();

    if(showGridlines){
      drawWalls(21,21,21,gridr, gridg, gridb,1);
      drawGridLines(21,21,0,255,0,0,1);
      drawOrigin(255,0,0, 0, 0);
     }

    if(blocks.length === 0){
      drawGridLines(21,21,z,255, 154, 0,1);
      drawOrigin(255, 154, 0,1, z);
    }
    else{

      var underBlocks = blocks.filter(isBelow);
      var overBlocks = blocks.filter(isAbove);

      drawSomeBlocks(underBlocks);
      drawGridLines(21,21,z,255, 154, 0,1);
      drawOrigin(255, 154, 0,1, z);
      drawSomeBlocks(overBlocks);
    }

    drawHighlight();
    writeMessage("Block Count: " + blocks.length, "blockDiv");
  }

  function downloadCanvas(link) {
    link.href = canvas.toDataURL();
    link.download = 'bloc' + new Date() + '.png';
}

  // Socket receive events
  socket.on('updateWorld', function (data) {
    blocks = data.blocks;
    drawWorld();
  });

  socket.on('list_of_games', function(data) {
    // console.log(data)
    // console.log(gameid)
    $("#listOfGames").html(data);
    $("#join").click(function() {
      var gameId = $('#join').attr('gameId')
      // console.log(x)
      // console.log(data)
      // // console.log('hello')
      // var gameId = rooms[i].id;
      // console.log('1')
      console.log(gameId)
      socket.emit('join_game', gameId);
      $("#sessionDiv").hide();
      $("#gameDiv").show();
    });
  });

  socket.on('join_game', function (data){
    roomId = data;

    // $("#join").click(function(roomId) {
      // console.log(data)
      // console.log('hello')
      // var gameId = rooms[i].id;
      // console.log('1')
      // console.log(gameId)
      // socket.emit('join_game', roomId);
      // $("#sessionDiv").hide();
      // $("#gameDiv").show();
  // });
});

  socket.on('new_game_id', function (data){
    roomId = data;
  });

  // Socket send events

});
