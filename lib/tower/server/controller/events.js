
Tower.Controller.Events = {
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
      return Tower.Support.String.pluralize(Tower.Support.String.camelize(this.name.replace(/(Controller)$/, ""), false));
    },
    addSocketEventHandler: function(name, handler, options) {
      var _this = this;
      if (!this.io) {
        return this.io = Tower.Application.instance().io.of("/" + this.socketNamespace()).on("connection", function(socket) {
          var eventType, handler, _ref, _results;
          _this.socket = socket;
          _ref = _this._socketHandlers;
          _results = [];
          for (eventType in _ref) {
            handler = _ref[eventType];
            _results.push(_this.registerHandler(socket, eventType, handler));
          }
          return _results;
        });
      }
    },
    registerHandler: function(socket, eventType, handler) {
      var _this = this;
      if (eventType !== 'connection' && eventType !== 'disconnect') {
        return socket.on(eventType, function(data) {
          return _this._dispatch(socket, handler, _.extend(data));
        });
      } else if (eventType === "connection") {
        return this._dispatch(socket, handler);
      }
    },
    _dispatch: function(event, handler, locals) {
      var controller, key, value;
      if (locals == null) locals = {};
      controller = new this;
      for (key in locals) {
        value = locals[key];
        controller.params[key] = value;
      }
      if (typeof handler === "string") {
        return controller[handler].call(controller, event);
      } else {
        return handler.call(controller, event);
      }
    }
  }
};

module.exports = Tower.Controller.Events;
