var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

var server = http.createServer(app);
var io = socketIo.listen(server);
var blocks =[];
server.listen(8080);

app.use(express.static(__dirname + '/public'));
console.log("Server running on port 8080");

io.on('connection', function(socket) {
  console.log("new client connected");
  socket.on('add_block', function (data) {
    blocks.push(data.block);
    console.log("saved a block")

    io.emit("updateWorld", {blocks: blocks});
  })
});
