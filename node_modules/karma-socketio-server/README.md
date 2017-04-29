# karma-socketio-server
Make it easy to start up a socket.io server during karma tests

## Installation
```shell
npm install --save-dev karma-socketio-server
```

## Usage
```js
module.exports = function (config) {
  // your karma config goes here
  socketioServer: {
    port: 9999, //default port unless you set something different
    onConnect: function (socket) {
      // do something with the connected client
      socket.on('message', function (msg) {
        console.log('i got a message!', msg)
      })
    },
    ready: function (io) {
      // do something with the socket.io instance
    }
  },
  frameworks: ['socketio-server']
}
```

## Thanks
Thanks to [karma-websocket-server](https://github.com/weblogixx/karam-websocket-server) for the template on how to do this

## License
Copyright (c) 2015 Scripto; [Apache 2.0](License)
