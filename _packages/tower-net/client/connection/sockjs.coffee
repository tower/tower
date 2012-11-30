# https://github.com/sockjs/sockjs-client
Tower.NetConnectionSockjs =
  getId: (socket) ->
    1

  listen: (url) ->
    @connect(new Tower.module('sockjs')(url))

  registerHandler: (socket, name, handler) ->
    socket.on name, handler

  emit: (data) ->
