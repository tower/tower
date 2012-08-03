# https://github.com/sockjs/sockjs-node
Tower.Net.Connection.Sockjs =
  getId: (socket) ->
    socket.id

  getSessionId: (socket) ->

  listen: (server) ->
    io = Tower.modules.socketio.createServer()
    io.installHandlers(server)

    io.on 'connection', (socket) =>
      @connect(socket)

    io

  connect: (socket) ->
    connection = @_super(socket)

    connection

  disconnect: (socket) ->

  addHandler: (socket, name, handler) ->
    socket.on name, handler

  emit: (data, sockets...) ->

  broadcast: (data) ->

module.exports = Tower.Net.Connection.Sockjs
