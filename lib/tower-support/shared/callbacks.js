var _,
  __slice = [].slice,
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

_ = Tower._;

Tower.SupportCallbacks = {
  ClassMethods: {
    before: function() {
      return this.appendCallback.apply(this, ['before'].concat(__slice.call(arguments)));
    },
    after: function() {
      return this.appendCallback.apply(this, ['after'].concat(__slice.call(arguments)));
    },
    callback: function() {
      var args;
      args = _.args(arguments);
      if (!args[0].match(/^(?:before|around|after)$/)) {
        args = ['after'].concat(args);
      }
      return this.appendCallback.apply(this, args);
    },
    removeCallback: function(action, phase, run) {
      return this;
    },
    appendCallback: function(phase) {
      var args, callback, callbacks, filter, method, options, _i, _len;
      args = _.args(arguments, 1);
      if (typeof args[args.length - 1] !== 'object') {
        method = args.pop();
      }
      if (typeof args[args.length - 1] === 'object') {
        options = args.pop();
      }
      method || (method = args.pop());
      options || (options = {});
      callbacks = this.callbacks();
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        filter = args[_i];
        callback = callbacks[filter] || (callbacks[filter] = new Tower.SupportCallbacksChain);
        callback.push(phase, method, options);
      }
      return this;
    },
    prependCallback: function(action, phase, run, options) {
      if (options == null) {
        options = {};
      }
      return this;
    },
    callbacks: function() {
      return this._callbacks || (this._callbacks = {});
    }
  },
  runCallbacks: function(kind, options, block, complete) {
    var chain;
    if (typeof options === 'function') {
      complete = block;
      block = options;
      options = {};
    }
    options || (options = {});
    chain = this.constructor.callbacks()[kind];
    if (chain) {
      return chain.run(this, options, block, complete);
    } else {
      if (block) {
        block.call(this);
      }
      if (complete) {
        return complete.call(this);
      }
    }
  },
  _callback: function() {
    return Tower.callbackChain.apply(Tower, arguments);
  }
};

Tower.SupportCallbacksChain = (function() {

  function SupportCallbacksChain(options) {
    var key, value;
    if (options == null) {
      options = {};
    }
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    this.before || (this.before = []);
    this.after || (this.after = []);
  }

  __defineProperty(SupportCallbacksChain,  "clone", function() {
    return new Tower.SupportCallbacksChain({
      before: this.before.concat(),
      after: this.after.concat()
    });
  });

  __defineProperty(SupportCallbacksChain,  "run", function(binding, options, block, complete) {
    var done, runner,
      _this = this;
    runner = function(callback, next) {
      return callback.run(binding, options, next);
    };
    done = function(error) {
      if (error) {
        if (!(error instanceof Error)) {
          error = new Error(error);
        }
        if (complete) {
          complete.call(binding, error);
        } else {
          if (!Tower.SupportCallbacks.silent) {
            throw error;
          }
        }
      } else {
        if (complete) {
          complete.call(binding);
        }
      }
      return binding;
    };
    return Tower.async(this.before, runner, function(error) {
      if (error) {
        return done(error);
      }
      if (block) {
        switch (block.length) {
          case 0:
            block.call(binding);
            return Tower.async(_this.after, runner, done);
          default:
            return block.call(binding, function(error) {
              if (error) {
                return done(error);
              }
              if (!error) {
                return Tower.async(_this.after, runner, done);
              }
            });
        }
      } else {
        return Tower.async(_this.after, runner, done);
      }
    });
  });

  __defineProperty(SupportCallbacksChain,  "push", function(phase, method, filters, options) {
    return this[phase].push(new Tower.SupportCallback(method, filters, options));
  });

  return SupportCallbacksChain;

})();

Tower.SupportCallback = (function() {

  function SupportCallback(method, conditions) {
    if (conditions == null) {
      conditions = {};
    }
    this.method = method;
    this.conditions = conditions;
    if (conditions.hasOwnProperty('only')) {
      conditions.only = _.castArray(conditions.only);
    }
    if (conditions.hasOwnProperty('except')) {
      conditions.except = _.castArray(conditions.except);
    }
  }

  __defineProperty(SupportCallback,  "run", function(binding, options, next) {
    var conditions, method, result;
    conditions = this.conditions;
    if (options && options.hasOwnProperty('name')) {
      if (conditions.hasOwnProperty('only')) {
        if (_.indexOf(conditions.only, options.name) === -1) {
          return next();
        }
      } else if (conditions.hasOwnProperty('except')) {
        if (_.indexOf(conditions.except, options.name) !== -1) {
          return next();
        }
      }
    }
    method = this.method;
    if (typeof method === 'string') {
      if (!binding[method]) {
        throw new Error("The method `" + method + "` doesn't exist");
      }
      method = binding[method];
    }
    switch (method.length) {
      case 0:
        result = method.call(binding);
        return next(result === false ? new Error('Callback did not pass') : null);
      default:
        return method.call(binding, next);
    }
  });

  return SupportCallback;

})();

module.exports = Tower.SupportCallbacks;
