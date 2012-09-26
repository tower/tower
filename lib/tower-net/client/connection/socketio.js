
Tower.NetConnectionSocketio = {
  getId: function(socket) {
    try {
      return socket.sessionid || socket.socket.sessionid;
    } catch (error) {
      return 1;
    }
  },
  listen: function(url) {
    return this.connect(Tower.module('socketio').connect(url));
  },
  registerHandler: function(socket, eventType, handler) {
    var _this = this;
    return socket.on(eventType, function(data) {
      return handler.call(_this, data, _this);
    });
  },
  emit: function(connection, data) {
    return connection.socket.emit(data);
  }
};
