var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

// start webserver on port 8080
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(8080);
// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8080");

// array of all blocks
var blocks = [];

// event-handler for new incoming connections
io.on('connection', function (socket) {
  console.log("A new client connected: " + socket.id)
   // first send the history to the new client
   for (var i in blocks) {
      socket.emit('add_block', { block: blocks[i] } );
   }

   // add handler for message type "add_block".
   socket.on('add_block', function (data) {
      // add received line to history
      blocks.push(data.block);
      // send block to all clients
      io.emit('add_block', { block: data.block });
   });
});
