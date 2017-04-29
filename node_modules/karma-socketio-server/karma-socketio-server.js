'use strict'

const http = require('http')
const socket = require('socket.io')

const createSocketIOServer = function (args, config, logger) {
  const log = logger.create('socketio.server')
  log.info('Starting socket.io server')

  const port = config.socketioServer.port || '9999'
  const app = http.createServer(() => {})
  const io = socket(app)

  io.on('error', (err) => log.error(err))

  if (config.socketioServer.onConnect) {
    io.on('connect', (sock) => config.socketioServer.onConnect(sock))
  }

  app.listen(port, function () {
    log.info(`Socket.io server up and listening on ${port}`)
    config.socketioServer.ready && config.socketioServer.ready(io)
  })
}

module.exports = {
  'framework:socketio-server': ['factory', createSocketIOServer]
}
