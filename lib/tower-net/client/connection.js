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
    connect: function(socket, callback) {
      var _this = this;
      return socket.on('connect', function() {
        var connection, id;
        id = _this.getId(socket);
        connection = Tower.NetConnection.create({
          socket: socket
        }).connect();
        connection.id = id;
        Tower.connection = connection;
        Tower.connections[id] = connection;
        if (callback) {
          return callback(null, connection);
        }
      });
    },
    disconnect: function() {
      var _this = this;
      if (!Tower.connection) {
        return;
      }
      return Tower.connection.destroy(function() {
        return Tower.connection = void 0;
      });
    }
  });

  NetConnection.reopen({
    connect: function() {
      var _this = this;
      this.on('sync', function(data) {
        if (!Tower.NetConnection.transport || !Tower.NetConnection.transport.requesting) {
          return _this.serverDidChange(data);
        }
      });
      this.registerHandlers();
      return this;
    },
    notify: function(action, records, callback) {
      records = _.castArray(records);
      return this.clientDidChange(action, records, callback);
    },
    resolve: function(action, records, callback) {
      var app, iterator, matches, record,
        _this = this;
      record = records[0];
      if (!record) {
        return;
      }
      matches = [];
      app = Tower.Application.instance();
      iterator = function(controller, next) {
        return app.get(controller).resolveAgainstCursors(action, records, matches, next);
      };
      Tower.series(this.constructor.controllers, iterator, function(error) {
        if (callback) {
          return callback(error, records);
        }
      });
      return matches;
    },
    clientDidChange: function(action, records, callback) {
      var _this = this;
      return this.resolve(action, records, function(error, matches) {
        return _this["clientDid" + (_.camelize(action))](matches, callback);
      });
    },
    serverDidChange: function(data) {
      return this["serverDid" + (_.camelize(data.action))](data);
    },
    serverDidCreate: function(data) {
      try {
        return Tower.constant(data.type).load(data.records);
      } catch (_error) {}
    },
    serverDidUpdate: function(data) {
      try {
        return Tower.constant(data.type).load(data.records);
      } catch (_error) {}
    },
    serverDidDestroy: function(data) {
      try {
        return Tower.constant(data.type).unload(data.records);
      } catch (_error) {}
    },
    clientDidLoad: function(records) {
      return this.resolve('create', records);
    },
    clientDidCreate: function(records, callback) {
      return this.notifyTransport('create', records, callback);
    },
    clientDidUpdate: function(records) {
      return this.notifyTransport('update', records);
    },
    clientDidDestroy: function(records) {
      return this.notifyTransport('destroy', records);
    },
    notifyTransport: function(action, records, callback) {
      if (this.constructor.transport != null) {
        return this.constructor.transport[action](records, callback);
      }
    }
  });

  return NetConnection;

})(Tower.NetConnectionBase);

require('./connection/socketio');

require('./connection/sockjs');
