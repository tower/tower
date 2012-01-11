
Tower.Controller.Events = {
  ClassMethods: {
    addEventHandler: function(name, handler, options) {
      return this._addSocketEventHandler(name, handler, options);
    },
    socketNamespace: function() {
      return Tower.Support.String.pluralize(Tower.Support.String.camelize(this.name.replace(/(Controller)$/, ""), false));
    },
    addSocketEventHandler: function(name, handler, options) {
      var _this = this;
      if (!this.io) {
        this._socketHandlers = {};
        this.io = Tower.Application.instance().socket.of(this.socketNamespace()).on("connection", function(socket) {
          var eventType, handler, _ref, _results;
          _ref = _this._socketHandlers;
          _results = [];
          for (eventType in _ref) {
            handler = _ref[eventType];
            _results.push((function(eventType, handler) {
              var _this = this;
              if (eventType !== 'connection' && eventType !== 'disconnect') {
                return socket.on(eventType, function(data) {
                  return _this._dispatch(void 0, handler, data);
                });
              }
            })(eventType, handler));
          }
          return _results;
        });
      }
      return this._socketHandlers[name] = handler;
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
