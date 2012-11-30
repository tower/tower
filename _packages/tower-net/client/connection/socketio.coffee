Tower.NetConnectionSocketio =
  getId: (socket) ->
    try
      socket.sessionid || socket.socket.sessionid
    catch error
      1

  listen: (url) ->
    @connect(Tower.module('socketio').connect(url))

  registerHandler: (socket, eventType, handler) ->
    socket.on eventType, (data) =>
      handler.call(@, data, @)

  emit: (connection, data) ->
    connection.socket.emit(data)
