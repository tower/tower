Tower.Net.Connection.Socketio =
  getId: (socket) ->
    socket.id

  getSessionId: (socket) ->

  listen: (server) ->
    io = require('socket.io').listen(server)

    io.on 'connection', (socket) =>
      @connect(socket)

    io

  connect: (socket) ->
    @_super(socket)

  disconnect: (socket) ->

  registerHandler: (socket, eventType, handler) ->
    socket.on eventType, (data) =>
      handler.call(@, data, @)

  emit: (data, sockets...) ->

  broadcast: (data) ->

module.exports = Tower.Net.Connection.Socketio
