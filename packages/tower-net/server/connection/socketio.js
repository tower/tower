
Tower.NetConnectionSocketio = {
  getId: function(socket) {
    return socket.id;
  },
  getSessionId: function(socket) {},
  listen: function(server) {
    var io,
      _this = this;
    io = Tower.module('socketio').listen(server);
    io.on('connection', function(socket) {
      return _this.connect(socket);
    });
    return io;
  },
  connect: function(socket) {
    return this._super(socket);
  },
  disconnect: function(socket) {
    return this._super(socket);
  },
  registerHandler: function(socket, eventType, handler) {
    var _this = this;
    return socket.on(eventType, function(data) {
      return handler.call(_this, data, _this);
    });
  },
  emit: function(socket, data, key) {
    if (key == null) {
      key = 'sync';
    }
    return socket.emit(key, data);
  },
  broadcast: function(socket, data) {
    return socket.broadcast(data);
  }
};

module.exports = Tower.NetConnectionSocketio;
