
  Tower.Event.Callbacks = {
    extended: function() {
      return this.callbacks = {};
    },
    ClassMethods: {
      before: function(name, callback) {
        return this.defineCallback("before", name, callback);
      },
      after: function(name, callback) {},
      defineCallback: function(phase, name, callback) {
        var callbacks, _base;
        callbacks = (_base = this.callbacks)[phase] || (_base[phase] = []);
        callbacks.push(callback);
        return this;
      }
    },
    InstanceMethods: {
      runCallbacks: function(name) {
        var callback, callbacks, _i, _len;
        callbacks = this.constructor.callbacks[name];
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          if (typeof callback === "string") callback = this[callback];
          if (!callback.call(this)) return false;
        }
        return true;
      },
      withCallbacks: function(block) {
        var self, success;
        self = this;
        success = self.runCallbacks("before");
        success = block.call(self);
        success = self.runCallbacks("after");
        return success;
      }
    }
  };

  module.exports = Tower.Event.Callbacks;
