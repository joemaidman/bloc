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

app.use(express.static(__dirname + '/public'));
console.log("Server running on port 8080");

io.on('connection', function(socket) {
  console.log("new client connected");
  socket.on('add_block', function (data) {
    gameController.createShape(data.block[0], data.block[1], data.block[2], data.block[3], data.block[4], data.block[5]);
    io.emit("updateWorld", {blocks: gameController.getAllShapes()});
  });
});
