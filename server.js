"strict mode";

var express = require('express'),
app = express(),
http = require('http'),
socketIo = require('socket.io'),
GameView = require('./app/views/gameView.js'),
Game = require('./app/models/game.js'),
Room = require('./app/models/room.js'),
Player = require('./app/models/player.js'),
Save = require('./app/models/save.js'),
GameController = require('./app/controllers/gameController.js'),
mongoose = require('mongoose'),
passport = require('passport'),
passportSocketIo = require('passport.socketio')
flash = require('connect-flash'),
morgan = require('morgan'),

mongo = require('mongodb'),

cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
session = require('express-session'),
connect = require('connect'),
configDB = require('./config/database.js');
require('./config/passport')(passport);
mongoose.connect(configDB.url);
const MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

var db;
const MongoClient = require('mongodb').MongoClient
MongoClient.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
})

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
  // console.log('hello')
  // console.log(socket.request.user.id)
  // console.log('hello2')
  // console.log(save)
  console.log("ID: " + socket.request.user)
  // console.log("User is :" + user)
  console.log("A new client connected: " + socket.id + " (" + clientCount + " clients)");
  loadSaves()


  console.log("got here")
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










  socket.on('saveBlocks', function(data) {
    console.log('server socket reached')
    var saveArray = data.blocks;
    var save = new Save({blocks: saveArray, userForSave: socket.request.user.id});
    save.save();
  });

  //
  // socket.on('loadBlocks', function(data) {
  //   console.log('server socket reached')
  //   var saveArray = data.blocks;
  //   var save = new Save({blocks: saveArray, userForSave: socket.request.user.id});
  //   save.save();
  // });
  //
  //

function printStuff(stuff){
  stuff.forEach(function(thing){
    console.log(thing)
  });
}

  function loadSaves(){

    // var saveSchema = require('./app/models/save.js')
    var userId = socket.request.user.id;
// var y = Save.find({'userForSave' : userId }, function (err, docs) {
//
// });

db.collection('saves').find().toArray((err, result) => {
   if (err) return console.log(err)
   printStuff(result);
 })
    //
    // var cursor = mongoose.collection('saves').find();
    //
    // // Execute the each command, triggers for each document
    // cursor.each(function(err, item) {
    //     // If the item is null then the cursor is exhausted/empty and closed
    //     if(item == null) {
    //         db.close(); // you may not want to close the DB if you have more code....
    //         return;
    //     }
    //     // otherwise, do something with the item
    // });
    //
    //



    // var saves = mongoose.saves.find({userForSave: userId});
    // console.log(saves)
    // var save = mongoose.model('Save', saveSchema)
  //   // console.log(user)
  //   var y = Save.findOne({'userForSave' : userId }, function (err, docs) {
  //     var z = [];
  //     console.log(docs.blocks)
  // //
  //
  // for(var i = 0; i < docs.blocks.length -1; i++){
  //     z.push(docs.blocks[i]);
  // }
  // //
  // // docs.blocks.forEach(function(block){
  //
  //
//   //
//   // });
//     console.log(z);
// });
//     // var x = Save.find( {'userForSave' : userId }, 'blocks', function(err, save){
    //   if(err) throw err;
    //   console.log(save);
    //   console.log(userId)
    // } )
    // var userId = socket.request.user.id;
    // var saves = mongoose.saves.find({userForSave: userId});
    // console.log(saves)
  }






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
