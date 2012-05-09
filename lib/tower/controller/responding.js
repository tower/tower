
Tower.Controller.Responding = {
  ClassMethods: {
    respondTo: function() {
      var args, except, mimes, name, only, options, _i, _len;
      mimes = this.mimes();
      args = _.args(arguments);
      if (typeof args[args.length - 1] === 'object') {
        options = args.pop();
      } else {
        options = {};
      }
      if (options.only) {
        only = _.toArray(options.only);
      }
      if (options.except) {
        except = _.toArray(options.except);
      }
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        name = args[_i];
        mimes[name] = {};
        if (only) {
          mimes[name].only = only;
        }
        if (except) {
          mimes[name].except = except;
        }
      }
      return this;
    },
    mimes: function() {
      return this.metadata().mimes;
    }
  },
  InstanceMethods: {
    respondTo: function(block) {
      return Tower.Controller.Responder.respond(this, {}, block);
    },
    respondWith: function() {
      var args, callback, options;
      args = _.args(arguments);
      callback = null;
      if (typeof args[args.length - 1] === 'function') {
        callback = args.pop();
      }
      if (typeof args[args.length - 1] === 'object' && !(args[args.length - 1] instanceof Tower.Model)) {
        options = args.pop();
      } else {
        options = {};
      }
      options || (options = {});
      options.records = args[0];
      return Tower.Controller.Responder.respond(this, options, callback);
    },
    _mimesForAction: function() {
      var action, config, mime, mimes, result, success;
      action = this.action;
      result = [];
      mimes = this.constructor.mimes();
      for (mime in mimes) {
        config = mimes[mime];
        success = false;
        if (config.except) {
          success = !_.include(config.except, action);
        } else if (config.only) {
          success = _.include(config.only, action);
        } else {
          success = true;
        }
        if (success) {
          result.push(mime);
        }
      }
      return result;
    }
  }
};

module.exports = Tower.Controller.Responding;
