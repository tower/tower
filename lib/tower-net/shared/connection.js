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

Tower.NetConnectionBase = (function(_super) {
  var NetConnectionBase;

  function NetConnectionBase() {
    return NetConnectionBase.__super__.constructor.apply(this, arguments);
  }

  NetConnectionBase = __extends(NetConnectionBase, _super);

  return NetConnectionBase;

})(Tower.Class);

Tower.NetConnectionBase.reopenClass({
  transport: void 0,
  controllers: [],
  handlers: Ember.Map.create(),
  initialize: function() {
    if (Tower.module('socketio')) {
      return this.reopenClass(Tower.NetConnectionSocketio);
    } else {
      return this.reopenClass(Tower.NetConnectionSockjs);
    }
  },
  addHandler: function(name, handler) {
    return this.handlers.set(name, handler);
  }
});

Tower.NetConnectionBase.reopen({
  registerHandlers: function() {
    var _this = this;
    return this.constructor.handlers.forEach(function(eventType, handler) {
      return _this.on(eventType, handler);
    });
  },
  resolve: function(action, records, callback) {
    var iterator, matches, record,
      _this = this;
    record = records[0];
    if (!record) {
      return;
    }
    if (!Tower.isClient) {
      matches = Ember.Map.create();
    }
    iterator = function(controller, next) {
      return _this.get(controller).resolveAgainstCursors(action, records, matches, next);
    };
    Tower.series(this.constructor.controllers, iterator, function(error) {
      matches = Tower.isClient ? records : matches.toArray();
      if (callback) {
        return callback(error, matches);
      }
    });
    return matches;
  },
  notifyTransport: function(action, records) {
    if (this.constructor.transport != null) {
      return this.constructor.transport[action](records, callback);
    }
  },
  destroy: function(callback) {
    return callback();
  },
  on: function(eventType, handler) {
    return this.constructor.registerHandler(this.socket, eventType, handler);
  }
});

module.exports = Tower.NetConnectionBase;
