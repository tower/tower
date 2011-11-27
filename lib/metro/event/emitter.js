
  Metro.Event.Emitter = {
    isEventEmitter: true,
    events: function() {
      return this._events || (this._events = {});
    },
    hasEvent: function(key) {
      return Metro.Support.Object.isPresent(this.events(), key);
    },
    event: function(key) {
      var _base;
      return (_base = events())[key] || (_base[key] = new Metro.Event(this, key));
    },
    on: function(key, handler) {
      return this.event(key).addHandler(handler);
    },
    mutation: function(wrappedFunction) {
      return function() {
        var result;
        result = wrappedFunction.apply(this, arguments);
        this.event('change').fire(this, this);
        return result;
      };
    },
    prevent: function(key) {
      this.event(key).prevent();
      return this;
    },
    allow: function(key) {
      this.event(key).allow();
      return this;
    },
    isPrevented: function(key) {
      return this.event(key).isPrevented();
    },
    fire: function(key) {
      return this.event(key).fire(Metro.Support.Array.args(arguments, 1));
    },
    allowAndFire: function(key) {
      return this.event(key).allowAndFire(Metro.Support.Array.args(arguments, 1));
    }
  };

  module.exports = Metro.Event.Emitter;
