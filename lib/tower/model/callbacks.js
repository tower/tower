
Tower.Model.Callbacks = {
  ClassMethods: {
    before: function(action, run, options) {
      return this.appendCallback(action, "before", run, options);
    },
    after: function() {},
    callback: function() {
      return this.appendCallback.apply(this, arguments);
    },
    removeCallback: function(action, phase, run) {
      return this;
    },
    appendCallback: function(action, phase, run, options) {
      var callbacks, _base;
      if (options == null) options = {};
      callbacks = this.callbacks();
      callbacks[action] || (callbacks[action] = {});
      (_base = callbacks[action])[phase] || (_base[phase] = []);
      callbacks[action][phase].push([run, options]);
      return this;
    },
    prependCallback: function(action, phase, run, options) {
      var callbacks, _base;
      if (options == null) options = {};
      callbacks = this.callbacks();
      callbacks[action] || (callbacks[action] = {});
      (_base = callbacks[action])[phase] || (_base[phase] = []);
      callbacks[action][phase].push([run, options]);
      return this;
    },
    callbacks: function() {
      return this._callbacks || (this._callbacks = {});
    }
  }
};

module.exports = Tower.Model.Callbacks;
