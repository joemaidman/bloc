"strict mode";

var express = require('express'),
app = express(),
http = require('http'),
socketIo = require('socket.io'),
GameView = require('./src/views/gameView.js'),
Game = require('./src/models/game.js'),
Room = require('./src/models/room.js'),
Player = require('./src/models/player.js'),
GameController = require('./src/controllers/gameController.js');

var server = http.createServer(app);
var io = socketIo.listen(server);
var gameView = new GameView();
var game = new Game();
var gameController = new GameController(game, gameView);
server.listen(process.env.PORT || 8080);
var clientCount = 0;
var rooms = [];

app.use(express.static(__dirname + '/public'));
console.log("Server running on port 8080");

io.on('connection', function(socket) {
  clientCount++;
  console.log("A new client connected: " + socket.id + " (" + clientCount + " clients)");
  socket.emit("list_of_games", listOfRooms());

  function findRoom(id){
    for(var i = 0; i < rooms.length; i++){
      if(rooms[i].id === id){
        return rooms[i];
      }
    }
    return false;
  };

  function listOfRooms(){
    var listString = ""
    for(var i = 0; i < rooms.length; i++){
      listString += "<li>" + rooms[i].getName() + " (" + rooms[i].getPlayerCount() + "/" + rooms[i].getLimit() + ")" + "<button id='join' gameId='" + rooms[i].id + "'" + ">Join</button>" +  "</li>";
    }
    return listString;
  };

  socket.on('new_game', function(data){
    var roomName = data;
    var room = new Room(roomName,new GameController(new Game()),2);
    rooms.push(room);
    console.log(socket.id)
    room.addPlayer(new Player(socket.id, 'Timmy'));
    socket.join(room.getId());
    socket.emit('new_game_id', room.getId());
    console.log("Creating a new game with id: " + room.getId());
    console.log("Adding player " + room.getPlayers()[0].id + " to room " + room.getId());
    // console.log('start')
    // console.log(rooms)
    // console.log(rooms[0].getId());
    // console.log('end')
  });

  socket.on('join_game', function(data){
    var roomId = data;
    console.log('1')
    console.log(rooms[0].id)
    for(var i = 0; i < rooms.length; i++){

      if (rooms[i].id === roomId) {
        // console.log('2')
        console.log(i)
        return i;
      }
    }

    // var room = new Room(roomName,new GameController(new Game()),2);
    // rooms.push(room);
    // room.addPlayer(new Player(socket.id, 'Timmy'));
    // socket.join(room.getId());
    // socket.emit('join_game', roomId);
    // console.log("Creating a new game with id: " + room.getId());
    // console.log("Adding player " + room.getPlayers()[0].id + " to room " + room.getId());
    // console.log('start')
    // console.log(rooms)
    // console.log(rooms[0].getId());
    // console.log('end')
  });

  socket.on('add_block', function (data) {
    var room = findRoom(data.roomId);
    room.gameController.createShape(data.block[0], data.block[1], data.block[2], data.block[3], data.block[4], data.block[5]);
    updateWorld(room.id);
  });

  socket.on('delete_block', function (data) {
    var room = findRoom(data.roomId);
    room.gameController.removeShape(data.block[0], data.block[1], data.block[2]);
    updateWorld(room.getId());
  });

  socket.on('rotate', function (data) {
    var room = findRoom(data);
    room.gameController.rotateWorld();
    updateWorld(room.getId());
  });

  socket.on('clearBlocks', function (data) {
    var room = findRoom(data);
    room.gameController.resetWorld();
    updateWorld(room.getId());
  });

  socket.on('disconnect', function (data) {
    clientCount--;
    console.log("A client disconnected: " + socket.id + " (" + clientCount + " clients)");
  });

  function updateWorld(roomId){
    var room = findRoom(roomId);
    io.sockets.in(roomId).emit("updateWorld", {blocks: room.gameController.getAllShapes()});
  }

});
