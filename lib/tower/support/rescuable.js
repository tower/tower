
Tower.Support.Rescuable = {
  ClassMethods: {
    rescueHandlers: function() {
      return this._rescueHandlers || (this._rescueHandlers = []);
    },
    rescueFrom: function() {
      var block, key, klass, klasses, options, _i, _len, _results;
      klasses = _.args(arguments);
      block = _.extractBlock(klasses);
      options = _.extractOptions(klasses);
      key = void 0;
      if (!options.hasOwnProperty("with")) {
        if (block) {
          options["with"] = block;
        } else {
          throw new ArgumentError("Need a handler. Supply an options hash that has a `with` key as the last argument.");
        }
      }
      _results = [];
      for (_i = 0, _len = klasses.length; _i < _len; _i++) {
        klass = klasses[_i];
        if (typeof klass === "string") {
          key = klass;
        } else {
          throw new ArgumentError("" + klass + " is neither an Exception nor a String");
        }
        _results.push(this.rescueHandlers().push([key, options["with"]]));
      }
      return _results;
    }
  },
  InstanceMethods: {
    rescueWithHandler: function(exception) {
      var handler;
      if (handler = this.handlerForRescue(exception)) {
        if (handler.length !== 0) {
          handler.call(exception);
        } else {
          handler.call();
        }
        return true;
      }
    },
    handlerForRescue: function(exception) {
      var array, handler, handlers, klass, klassName, rescuer, _i, _len;
      handlers = this.constructor.rescueHandlers().reverse();
      rescuer = void 0;
      for (_i = 0, _len = handlers.length; _i < _len; _i++) {
        array = handlers[_i];
        klassName = array[0], handler = array[1];
        klass = Tower.constant(klassName);
        rescuer = handler;
      }
      return rescuer;
    }
  }
};

module.exports = Tower.Support.Rescuable;
