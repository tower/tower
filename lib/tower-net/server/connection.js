var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.NetConnection = (function(_super) {
  var NetConnection;

  function NetConnection() {
    return NetConnection.__super__.constructor.apply(this, arguments);
  }

  NetConnection = __extends(NetConnection, _super);

  NetConnection.reopenClass({
    all: {},
    connect: function(socket) {
      var connection, id,
        _this = this;
      id = this.getId(socket);
      Tower.connections[id] = connection = Tower.NetConnection.create({
        socket: socket
      });
      connection.registerHandlers();
      connection.on('disconnect', function() {
        return delete Tower.connections[id];
      });
      return connection;
    },
    disconnect: function(socket) {
      var connection,
        _this = this;
      connection = this.all[this.getId(socket)];
      return connection.destroy(function() {
        return delete _this.all[_this.getId(socket)];
      });
    }
  });

  NetConnection.reopen({
    notify: function(action, records) {
      if (!(records instanceof Array)) {
        records = [records];
      }
      return this.serverDidChange(action, records);
    },
    clientDidChange: function(action, records) {},
    serverDidChange: function(action, records) {
      var _this = this;
      return this.resolve(action, records, function(error, matches) {
        return _this["serverDid" + (_.camelize(action))](records);
      });
    },
    serverDidCreate: function(records) {
      return this.notifyTransport('create', records);
    },
    serverDidUpdate: function(records) {
      return this.notifyTransport('update', records);
    },
    serverDidDestroy: function(records) {
      return this.notifyTransport('destroy', records);
    },
    notifyTransport: function(action, records) {
      var data;
      data = {
        action: action,
        records: _.map(records, function(i) {
          return i.toJSON();
        }),
        port: Tower.port,
        type: (function() {
          try {
            return records[0].constructor.className();
          } catch (_error) {}
        })()
      };
      return this.constructor.emit(this.socket, data);
    }
  });

  return NetConnection;

})(Tower.NetConnectionBase);

module.exports = Tower.NetConnection;
