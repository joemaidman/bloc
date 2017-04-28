"strict mode";

var express = require('express'),
app = express(),
http = require('http'),
socketIo = require('socket.io'),
GameView = require('./src/views/gameView.js'),
Game = require('./src/models/game.js'),
GameController = require('./src/controllers/gameController.js');

var server = http.createServer(app);
var io = socketIo.listen(server);
var gameView = new GameView();
var game = new Game();
var gameController = new GameController(game, gameView);
server.listen(8080);
var clientCount = 0;

app.use(express.static(__dirname + '/public'));
console.log("Server running on port 8080");

io.on('connection', function(socket) {
  clientCount++;
  console.log("A new client connected: " + socket.id + " (" + clientCount + " clients)");

  socket.on('add_block', function (data) {
    gameController.createShape(data.block[0], data.block[1], data.block[2], data.block[3], data.block[4], data.block[5]);
    updateWorld();
  });

  socket.on('delete_block', function (data) {
    console.log('delete block server')
    gameController.removeShape(data.block[0], data.block[1], data.block[2]);
    updateWorld();
  });

  socket.on('rotate', function (data) {
    gameController.rotateWorld();
    updateWorld();
  });

  socket.on('clearBlocks', function (data) {
    gameController.resetWorld();
    updateWorld();
  });

  socket.on('disconnect', function (data) {
    clientCount--;
    console.log("A client disconnected: " + socket.id + " (" + clientCount + " clients)");
  });

  function updateWorld(){
    io.emit("updateWorld", {blocks: gameController.getAllShapes()});
  }

});
