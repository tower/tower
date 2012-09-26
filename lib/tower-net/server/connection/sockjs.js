var __slice = [].slice;

Tower.NetConnectionSockjs = {
  getId: function(socket) {
    return socket.id;
  },
  getSessionId: function(socket) {},
  listen: function(server) {
    var io,
      _this = this;
    io = Tower.module('socketio').createServer();
    io.installHandlers(server);
    io.on('connection', function(socket) {
      return _this.connect(socket);
    });
    return io;
  },
  connect: function(socket) {
    var connection;
    connection = this._super(socket);
    return connection;
  },
  disconnect: function(socket) {},
  addHandler: function(socket, name, handler) {
    return socket.on(name, handler);
  },
  emit: function() {
    var data, sockets;
    data = arguments[0], sockets = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  },
  broadcast: function(data) {}
};

module.exports = Tower.NetConnectionSockjs;
