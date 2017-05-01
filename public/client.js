"strict mode";

document.addEventListener("DOMContentLoaded", function(){

  // Variables setup
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var socket = io.connect();
  var iso;
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
  var showFloor = true;
  var showBuildGrid =true;
  var changeColourOfGridlines = false;
  var gridr = 255;
  var gridg = 0;
  var gridb = 0;
  var bgridr = 255;
  var bgridg = 154;
  var bgridb = 0;
  var floorr = 255;
  var floorg = 0;
  var floorb = 0;
  var gridSize = 11;
  var gameScale;
  var roomId;
  var currentRotation = 0;

  $("#gameDiv").hide();

  //UI setup
  function setupColorPicker(){
    for(var i = 0; i < input.length; i++){
      input[i].addEventListener("input",function(){
        setColour()
      });
    }
    document.getElementById('red').value = RandomColour()
    document.getElementById('green').value = RandomColour()
    document.getElementById('blue').value = RandomColour()
  setColour()
  }

  function setColour() {
    var r = document.getElementById('red').value,
    g = document.getElementById('green').value,
    b = document.getElementById('blue').value
    var display = document.getElementById("display")
    display.style.background = "rgb(" + r + "," + g + "," + b + ")"
  }
  function RandomColour(){
  return  Math.round(Math.random()*225)
}
  document.getElementById('red').value = RandomColour()
  document.getElementById('green').value = RandomColour()
  document.getElementById('blue').value = RandomColour()
  //UI element event listeners


  //UI element event listeners
  $("#newGame").click(function() {
    var gameName = $("#newGameName").val();
    $("#inputGridSize option:selected").text() === "Small" ? gridSize = 11 : gridSize = 21;
    gridSize === 11 ? gameScale = 34 : gameScale = 18;
    var roomLimit = $("#roomLimit").val();
    socket.emit('new_game', {name: gameName, size: gridSize, roomLimit: roomLimit });
    $("#sessionDiv").hide();
    $("#gameDiv").show();
    iso = new Isomer(canvas, { scale: gameScale, originY: canvas.height });
    drawGridLines(gridSize,gridSize,0);
    drawOrigin();
    setupColorPicker();
    drawWorld();
  });

  $("#rotate").click(function() {
    updateRotationClockwise();
    rotateAllBlocks(90);
    sortBlocks();
    drawWorld();
  });

  $("#clear").click(function() {
    socket.emit('clearBlocks', roomId);
  });

  $("#leaveGame").click(function() {
    leaveGame();
  });

  $("#toggleGridlines").click(function() {
    showGridlines === true ? showGridlines = false : showGridlines = true;
    drawWorld();
  });
  $("#toggleFloor").click(function() {
    showFloor === true ? showFloor = false : showFloor = true;
    drawWorld();
  })

  $("#toggleBuildGrid").click(function() {
    showBuildGrid === true ? showBuildGrid = false : showBuildGrid = true;

    drawWorld();
  })

  $("#saveCanvas").click(function() {
    downloadCanvas(this);
  });

  $("#changeGridlinecolour").click(function() {

    gridr = document.getElementById("red").value;
    gridg = document.getElementById("green").value;
    gridb = document.getElementById("blue").value;
    drawWalls(gridSize,gridSize,gridSize,gridr,gridg,gridb,1);
    drawWorld();
  });

  $("#changeBuildGridColour").click(function() {
    bgridr = document.getElementById("red").value;
    bgridg = document.getElementById("green").value;
    bgridb = document.getElementById("blue").value;
    drawWalls(gridSize,gridSize,gridSize,bgridr,bgridg,bgridb,1);
    drawWorld();
  });


  $("#changeFloorColour").click(function() {
     floorr = document.getElementById("red").value;
    floorg = document.getElementById("green").value;
    floorb = document.getElementById("blue").value;
    drawGridLines(gridSize,gridSize,floorr,floorg,floorb,1);
    drawOrigin(floorr,floorg,floorb, 0, 0);
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
    emitNewBlock([x,y,z,r,g,b]);
  });

  $("#delete").click(function() {
    var x = parseInt($("#x").val());
    var y = parseInt($("#y").val());
    var z = parseInt($("#z").val());
    emitDeleteBlock([x, y, z]);
  });

  // Canvas event listeners
  canvas.addEventListener('mousewheel',function(evt){
    scrollDistance+= evt.deltaY
    if( scrollDistance> 10){
      z = Math.min(gridSize - 1,z+=1)
      scrollDistance = 0
      drawWorld();
    }
    else if (scrollDistance < -10) {
      z= Math.max(0,z-=1)
      scrollDistance = 0
      drawWorld();
    }
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
      emitDeleteBlock([(gridPos.x -=z),(gridPos.y -=z), z]);
    }
    else if (evt.which === 1) {
      var r = document.getElementById("red").value,
      g = document.getElementById("green").value,
      b = document.getElementById("blue").value;
      emitNewBlock([(gridPos.x -=z),(gridPos.y -=z),z,r,g,b]);
    }
  }, false);

  canvas.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
  }, false);

  //Key down listeners
  window.addEventListener('keydown', function(evt){
    if(evt.keyCode === 38){
      z = Math.min(gridSize - 1,z+=1)
      drawWorld();
      evt.preventDefault();
    }
    else if (evt.keyCode === 40) {
      z = Math.max(0,z-=1)
      drawWorld();
      evt.preventDefault();
    }
    else if (evt.keyCode === 37) {
      updateRotationAntiClockwise();
      rotateAllBlocks(-90);
      sortBlocks();
      drawWorld();
      evt.preventDefault();
    }
    else if (evt.keyCode === 39) {
      updateRotationClockwise();
      rotateAllBlocks(90);
      sortBlocks();
      drawWorld();
      evt.preventDefault();
    }
  });

  // Functions
  function calculateGridPosition(mouseX, mouseY){
    var x = Math.floor(((mouseX - (canvas.width / 2)) / (gameScale  * Math.cos(toRadians(30)))) + (((mouseX - (canvas.width / 2)) / (gameScale  * Math.cos(toRadians(30)))) + ((mouseY - (canvas.height))/ (gameScale  * Math.sin(toRadians(30))))) / -2);
    var y = Math.floor((((mouseX - (canvas.width / 2)) / (gameScale  * Math.cos(toRadians(30)))) + ((mouseY - (canvas.height)) / (gameScale  * Math.sin(toRadians(30))))) / -2);
    return {x: x, y: y};
  }

  function updateRotationClockwise(){
    currentRotation === 270 ? currentRotation = 0 : currentRotation += 90;
  }

  function updateRotationAntiClockwise(){
    currentRotation === 0 ? currentRotation = 270 : currentRotation -= 90;
  }

  function rotateAllBlocks(degree){
    blocks.forEach(function(shape){
      var newCoords = rotate({x: shape.xPos, y: shape.yPos}, degree);
      shape.xPos = newCoords.x;
      shape.yPos = newCoords.y;
    });
  }

  function writeMessage(message, divName) {
    document.getElementById(divName).innerText = message;
  }

  function toRadians (angle) {
    return angle * (Math.PI / 180);
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
    emitNewBlock([0,0,0,0,0,255]);
    emitNewBlock([3,0,0,0,255,0]);
    emitNewBlock([0,3,0,255,0,0]);
    emitNewBlock([3,3,0,100,100,100]);
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
      Point(Math.floor(gridSize / 2) -1, Math.floor(gridSize / 2) -1, zIndex + 2),
      Point(Math.floor(gridSize / 2) -1, Math.floor(gridSize / 2) -2, zIndex + 2),
      Point(Math.floor(gridSize / 2) -1, Math.floor(gridSize / 2) -1, zIndex + 1),
      Point(Math.floor(gridSize / 2) -1, Math.floor(gridSize / 2), zIndex + 1)
    ]), new Color(r, g, b,a));
  }

  function drawSomeBlocks(someBlocks){
    for (var i = 0; i<someBlocks.length; i++ ){
      iso.add(Shape.Prism(new Point(someBlocks[i].xPos, someBlocks[i].yPos, someBlocks[i].zPos)),new Color(someBlocks[i].r,someBlocks[i].g,someBlocks[i].b));
    }
  }

  function rotate(coordinates, degrees = 90){
    var newCoordinates = calculateRotation(((gridSize-1)/2), ((gridSize-1)/2), coordinates.x, coordinates.y, degrees);
    var x = newCoordinates[0];
    var y = newCoordinates[1];
    return {x: x, y: y};
  }

  function sortBlocks(){
    blocks.sort(function(obj1, obj2){
      return (obj1.zPos - obj2.zPos  || obj2.xPos - obj1.xPos || obj2.yPos - obj1.yPos);
    });
  }

  function calculateRotation(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
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
      drawWalls(gridSize,gridSize,gridSize,gridr, gridg, gridb,1);

    }

   if(showFloor){
     drawGridLines(gridSize,gridSize,0,floorr, floorg, floorb,1);
     drawOrigin(floorr, floorg, floorb, 0, 0);
   }

    var drewBuildGrid = false;

    if(blocks){
      if(blocks.length === 0){
        if (showBuildGrid){
        drawGridLines(gridSize,gridSize,z,bgridr,bgridg, bgridb);
        drawOrigin(bgridr,bgridg, bgridb,1, z);}
        drewBuildGrid = true;
        writeMessage("Block Count: 0", "blockDiv");
      }
      else{

        var underBlocks = blocks.filter(isBelow);
        var overBlocks = blocks.filter(isAbove);

        drawSomeBlocks(underBlocks);
        if(showBuildGrid){
        drawGridLines(gridSize,gridSize,z,bgridr,bgridg, bgridb,1);
        drawOrigin(bgridr,bgridg, bgridb,1, z);}
        drawSomeBlocks(overBlocks);
        drewBuildGrid = true;
        writeMessage("Block Count: " + blocks.length, "blockDiv");
      }
    }
    if(drewBuildGrid === false && showBuildGrid){
      drawGridLines(gridSize,gridSize,z,bgridr,bgridg, bgridb,1);
      drawOrigin(bgridr,bgridg, bgridb,1, z);
    }
    drawHighlight();
  }

  function downloadCanvas(link) {
    link.href = canvas.toDataURL();
    link.download = 'bloc' + new Date() + '.png';
  }

  // Socket receive events
  socket.on('updateWorld', function (data) {
    updateWorld(data);
  });

  function updateWorld(data){
    blocks = data.blocks;
    if(blocks){
      rotateAllBlocks(currentRotation);
      sortBlocks();
    }
    drawWorld();
  }

  socket.on('list_of_games', function(data) {
    $("#listOfGames").html(data);
    $(".joinButton").click(function(evt) {
      var gameId = evt.target.id
      socket.emit('join_game', gameId);
    });
  });

  socket.on('joined_game', function (data){
    roomId = data.roomId;
    blocks = data.blocks;
    gridSize = data.gameSize;
    gridSize === 11 ? gameScale = 34 : gameScale = 18;
    iso = new Isomer(canvas, { scale: gameScale, originY: canvas.height});
    $("#sessionDiv").hide();
    $("#gameDiv").show();
    drawGridLines(gridSize,gridSize,0);
    drawOrigin();
    updateWorld(blocks);
  });

  socket.on('new_game_id', function (data){
    roomId = data;
  });

  // Socket send events
  function emitDeleteBlock(block){
    var newCoords = rotate( {x: block[0], y: block[1]}, -currentRotation);
    block[0] = newCoords.x;
    block[1] = newCoords.y;
    socket.emit('delete_block', {block: block, roomId: roomId});
  }

  function emitNewBlock(block){
    var newCoords = rotate( {x: block[0], y: block[1]}, -currentRotation);
    block[0] = newCoords.x;
    block[1] = newCoords.y;
    socket.emit('add_block', {block: block, roomId: roomId});
  }

  function leaveGame(){
    gameId = "";
    socket.emit('leaveRoom', roomId);
    $("#sessionDiv").show();
    $("#gameDiv").hide();
  }

});
