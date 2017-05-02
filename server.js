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

  socket.on('new_game', function(data){
    var roomName = data.name;
    var size = data.size;
    var playerLimit = data.roomLimit;
    var room = new Room(roomName, new GameController(new Game(size)), playerLimit);
    rooms.push(room);
    room.addPlayer(new Player(socket.id, 'Timmy'));
    socket.join(room.getId());
    socket.emit('new_game_id', room.getId());
    console.log("Creating a new game with id: " + room.getId());
    console.log("Adding player " + room.getPlayers()[0].id + " to room " + room.getId());
    io.emit("list_of_games", listOfRooms());
  });

  socket.on('join_game', function(data){
    var roomId = data;
    var room = findRoom(roomId);
    if(room.isFull()){
      console.log("Unable to join a room that is full (player: " + socket.id +")");
    }
    else {
      room.addPlayer(new Player(socket.id, 'Timmy'));
      socket.join(room.getId());
      socket.emit('joined_game',{roomId:room.getId(), gameSize: room.gameController.game.getSize() + 1, blocks: room.gameController.getAllShapes()});
      console.log("Adding player " + room.getPlayers()[0].id + " to room " + room.getId());
    }
  });

  socket.on('leaveRoom', function(data){
    leaveRoom(data, socket.id);
  });

  socket.on('add_block', function (data) {
    var room = findRoom(data.roomId);
    console.log("Server adding block at X:" + data.block[0] + " Y: " + data.block[1]);
    console.log("Texture is: " + data.block[7])
    room.gameController.createShape(data.block[0], data.block[1], data.block[2], data.block[3], data.block[4], data.block[5], data.block[6], data.block[7]);
    updateWorld(room.id);
  });

  socket.on('delete_block', function (data) {
    var room = findRoom(data.roomId);
    room.gameController.removeShape(data.block[0], data.block[1], data.block[2]);
    updateWorld(room.getId());
  });

  socket.on('clearBlocks', function (data) {
    var room = findRoom(data);
    room.gameController.resetWorld();
    updateWorld(room.getId());
  });

  socket.on('disconnect', function () {
    clientCount--;
    var room = findRoomByPlayer(socket.id);
    if(room){
      leaveRoom(room.getId(), socket.id);
    }
    console.log("A client disconnected: " + socket.id + " (" + clientCount + " clients)");
  });

  function updateWorld(roomId){
    var room = findRoom(roomId);
    io.sockets.in(roomId).emit("updateWorld", {blocks: room.gameController.getAllShapes()});
  }

  function leaveRoom(roomId, playerId){
    var roomId = roomId;
    var room = findRoom(roomId);
    var player = room.getPlayerById(playerId)
    room.removePlayer(playerId);
    socket.leave(room.getId());
    console.log("Player " + socket.id + " left room: " + room.getId());
    if(room.getPlayerCount() === 0)
    {
      console.log("Closing room " + room.getId() + " (no players left)");
      var roomIndex = findRoomIndex(room.getId());
      rooms.splice(roomIndex, 1);
    }
    io.sockets.emit("list_of_games", listOfRooms());
  }

  function findRoom(id){
    for(var i = 0; i < rooms.length; i++){
      if(rooms[i].id === id){
        return rooms[i];
      }
    }
    return false;
  };

  function findRoomIndex(id){
    for(var i = 0; i < rooms.length; i++){
      if(rooms[i].id === id){
        return i;
      }
    }
    return false;
  };

  function findRoomByPlayer(playerId){
    for(var i = 0; i < rooms.length; i++){
      var players = rooms[i].getPlayers();
      for(var j = 0; j < players.length; j++){
        if(players[j].getId() === playerId){
          return rooms[i];
        }
      }
    }
    return false;
  }

  function listOfRooms(){
    var listString = "";
    for(var i = 0; i < rooms.length; i++){
      var buttonStatus;
      rooms[i].isFull() ? buttonStatus = "disabled" : buttonStatus = "";
      listString += "<li>" + rooms[i].getName() + " (" + rooms[i].getPlayerCount() + "/" + rooms[i].getLimit() + ")" + "<button " + " class ='joinButton' id='" + rooms[i].id  +  "' " + buttonStatus + ">Join</button>" +  "</li>";
    }
    return listString;
  };

});
