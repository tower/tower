
Tower.NetConnectionSockjs = {
  getId: function(socket) {
    return 1;
  },
  listen: function(url) {
    return this.connect(new Tower.module('sockjs')(url));
  },
  registerHandler: function(socket, name, handler) {
    return socket.on(name, handler);
  },
  emit: function(data) {}
};
