
  Coach.Support.EventEmitter = {
    isEventEmitter: true,
    events: function() {
      return this._events || (this._events = {});
    },
    hasEventListener: function(key) {
      return Coach.Support.Object.isPresent(this.events(), key);
    },
    event: function(key) {
      var _base;
      return (_base = this.events())[key] || (_base[key] = new Coach.Event(this, key));
    },
    on: function() {
      var args, eventMap, eventType, handler, options, _results;
      args = Coach.Support.Array.args(arguments);
      if (typeof args[args.length - 1] === "object") {
        options = args.pop();
        if (args.length === 0) {
          eventMap = options;
          options = {};
        }
      } else {
        options = {};
      }
      if (typeof args[args.length - 1] === "object") {
        eventMap = args.pop();
      } else {
        eventMap = {};
        eventMap[args.shift()] = args.shift();
      }
      _results = [];
      for (eventType in eventMap) {
        handler = eventMap[eventType];
        _results.push(this.addEventHandler(eventType, handler, options));
      }
      return _results;
    },
    addEventHandler: function(type, handler, options) {
      return this.event(type).addHandler(handler);
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
      var event;
      event = this.event(key);
      return event.fire.call(event, Coach.Support.Array.args(arguments, 1));
    },
    allowAndFire: function(key) {
      return this.event(key).allowAndFire(Coach.Support.Array.args(arguments, 1));
    }
  };

  module.exports = Coach.Support.EventEmitter;
