var __slice = Array.prototype.slice;

Tower.Support.Callbacks = {
  ClassMethods: {
    before: function() {
      return this.appendCallback.apply(this, ["before"].concat(__slice.call(arguments)));
    },
    after: function() {
      return this.appendCallback.apply(this, ["after"].concat(__slice.call(arguments)));
    },
    callback: function() {
      return this.appendCallback.apply(this, arguments);
    },
    removeCallback: function(action, phase, run) {
      return this;
    },
    appendCallback: function(phase) {
      var args, callback, callbacks, filter, method, options, _i, _len;
      args = Tower.Support.Array.args(arguments, 1);
      if (typeof args[args.length - 1] !== "object") method = args.pop();
      if (typeof args[args.length - 1] === "object") options = args.pop();
      method || (method = args.pop());
      options || (options = {});
      callbacks = this.callbacks();
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        filter = args[_i];
        callback = callbacks[filter] || (callbacks[filter] = new Tower.Support.Callbacks.Chain);
        callback.push(phase, method, options);
      }
      return this;
    },
    prependCallback: function(action, phase, run, options) {
      if (options == null) options = {};
      return this;
    },
    callbacks: function() {
      return this._callbacks || (this._callbacks = {});
    }
  },
  runCallbacks: function(kind, block) {
    var chain;
    chain = this.constructor.callbacks()[kind];
    if (chain) {
      return chain.run(this, block);
    } else {
      return block.call(this);
    }
  }
};

Tower.Support.Callbacks.Chain = (function() {

  function Chain(options) {
    var key, value;
    if (options == null) options = {};
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    this.before || (this.before = []);
    this.after || (this.after = []);
  }

  Chain.prototype.run = function(binding, block) {
    var runner;
    var _this = this;
    runner = function(callback, next) {
      return callback.run(binding, next);
    };
    return Tower.async(this.before, runner, function(error) {
      if (!error) {
        return block.call(binding, function(error) {
          if (!error) {
            return Tower.async(_this.after, runner, function(error) {
              return binding;
            });
          }
        });
      }
    });
  };

  Chain.prototype.push = function(phase, method, filters, options) {
    return this[phase].push(new Tower.Support.Callback(method, filters, options));
  };

  return Chain;

})();

Tower.Support.Callback = (function() {

  function Callback(method, options) {
    if (options == null) options = {};
    this.method = method;
    this.options = options;
  }

  Callback.prototype.run = function(binding, next) {
    var method, result;
    method = this.method;
    if (typeof method === "string") method = binding[method];
    switch (method.length) {
      case 0:
        result = method.call(binding);
        return next(!result ? new Error("Callback did not pass") : null);
      default:
        return method.call(binding, next);
    }
  };

  return Callback;

})();

module.exports = Tower.Support.Callbacks;
