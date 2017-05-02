"strict mode";

var express = require('express'),
app = express(),
http = require('http'),
socketIo = require('socket.io'),
GameView = require('./app/views/gameView.js'),
Game = require('./app/models/game.js'),
Room = require('./app/models/room.js'),
Player = require('./app/models/player.js'),
GameController = require('./app/controllers/gameController.js'),
mongoose = require('mongoose'),
passport = require('passport'),
passportSocketIo = require('passport.socketio')
flash = require('connect-flash'),
morgan = require('morgan'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
session = require('express-session'),
connect = require('connect'),
configDB = require('./config/database.js');
require('./config/passport')(passport);
var Message = require("./app/models/message.js");
mongoose.connect(configDB.url);
const MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
var systemPlayer = new Player(0, "System");

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({
    secret:"ilovescotchscotchyscotchscotch", // Keep your secret key
    key:"connect.sid",
    store: new MongoStore({ mongooseConnection: mongoose.connection })}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./app/routes.js')(app, passport);

var sessionSettings = {
      "store": sessionStore, // or session.MemoryStore
      "secret": "ilovescotchscotchyscotchscotch",
      "cookie": { "path": '/', "httpOnly": true, "secure": false,  "maxAge": null }
    };

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



io.set('authorization', passportSocketIo.authorize({
  key: 'connect.sid',
  secret: 'ilovescotchscotchyscotchscotch',
  store: sessionStore,
  passport: passport,
  cookieParser: cookieParser,
  success: function(data, accept){accept(null, true)}
}));


io.sockets.on('connection', function(socket) {
  clientCount++;
  // console.log("User is :" + user)
  console.log("A new client connected: " + socket.id + " (" + clientCount + " clients)");
  socket.emit("list_of_games", listOfRooms());

  socket.on('new_game', function(data){
    var roomName = data.name;
    var size = data.size;
    var playerLimit = data.roomLimit;
    var room = new Room(roomName, new GameController(new Game(size)), playerLimit);
    rooms.push(room);
    room.addPlayer(new Player(socket.id, socket.request.user.facebook.displayName));
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
      room.addPlayer(new Player(socket.id, socket.request.user.facebook.displayName));
      socket.join(room.getId());
      socket.emit('joined_game',{roomId:room.getId(), gameSize: room.gameController.game.getSize() + 1, blocks: room.gameController.getAllShapes()});
      var message = new Message(systemPlayer, socket.request.user.facebook.displayName + " joined the room");
      room.addMessage(message);
      sendMessage(roomId);
      console.log("Adding player " + room.getPlayers()[0].id + " to room " + room.getId());
    }
  });

  socket.on('leaveRoom', function(data){
    leaveRoom(data, socket.id);
  });

socket.on('newMessage', function(data) {
  var room = findRoom(data.roomId);
  var player = room.getPlayerById(socket.id);
  var message = new Message(player, data.message);
  room.addMessage(message);
  sendMessage(data.roomId);
})

function sendMessage(roomId){
  var room = findRoom(roomId);
  io.sockets.in(roomId).emit("updateChat", room.getMessages()[room.getMessages().length - 1]);
}


  socket.on('add_block', function (data) {
    var room = findRoom(data.roomId);
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
    var message = new Message(systemPlayer, socket.request.user.facebook.displayName + " left the room");
    room.addMessage(message);
    sendMessage(roomId);
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
