var _;

_ = Tower._;

Tower.ControllerEvents = {
  ClassMethods: {
    addEventHandler: function(name, handler, options) {
      return this._addSocketEventHandler(name, handler, options);
    },
    _addSocketEventHandler: function(name, handler, options) {
      this._socketHandlers || (this._socketHandlers = {});
      return this._socketHandlers[name] = handler;
    },
    applySocketEventHandlers: function() {
      var handler, name, _ref, _results;
      _ref = this._socketHandlers;
      _results = [];
      for (name in _ref) {
        handler = _ref[name];
        _results.push(this.addSocketEventHandler(name, handler));
      }
      return _results;
    },
    socketNamespace: function() {
      return _.pluralize(_.camelize(this.className().replace(/(Controller)$/, ''), false));
    },
    addSocketEventHandler: function(name, handler, options) {
      var controllerName,
        _this = this;
      controllerName = this.metadata().name;
      return Tower.NetConnection.addHandler(name, options, function(connection) {
        return connection.get(controllerName)[name];
      });
    },
    _dispatch: function(event, handler, locals) {
      var controller, key, value;
      if (locals == null) {
        locals = {};
      }
      controller = this.create();
      for (key in locals) {
        value = locals[key];
        controller.params[key] = value;
      }
      if (typeof handler === 'string') {
        return controller[handler].call(controller, event);
      } else {
        return handler.call(controller, event);
      }
    }
  }
};

module.exports = Tower.ControllerEvents;
