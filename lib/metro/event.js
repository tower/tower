(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Event = (function() {

    __extends(Event, Metro.Object);

    Event.include({
      ClassMethods: {
        "for": function(object, key) {
          if (object.isEventEmitter) {
            return object.event(key);
          } else {
            return new Metro.Event(object, key);
          }
        }
      },
      isEvent: true,
      addHandler: function(handler) {
        this.handlers.push(handler);
        if (this.oneShot) this.autofireHandler(handler);
        return this;
      },
      removeHandler: function(handler) {
        this.handlers.splice(1, this.handlers.indexOf(handler));
        return this;
      },
      handlerContext: function() {
        return this.base;
      },
      prevent: function() {
        return ++this._preventCount;
      },
      allow: function() {
        if (this._preventCount) --this._preventCount;
        return this._preventCount;
      },
      isPrevented: function() {
        return this._preventCount > 0;
      },
      autofireHandler: function(handler) {
        if (this._oneShotFired && (this._oneShotArgs != null)) {
          return handler.apply(this.handlerContext(), this._oneShotArgs);
        }
      },
      resetOneShot: function() {
        this._oneShotFired = false;
        return this._oneShotArgs = null;
      },
      fire: function() {
        var args, context, handler, handlers, _i, _len, _results;
        if (this.isPrevented() || this._oneShotFired) return false;
        context = this.handlerContext();
        args = arguments;
        handlers = this.handlers;
        if (this.oneShot) {
          this._oneShotFired = true;
          this._oneShotArgs = arguments;
        }
        _results = [];
        for (_i = 0, _len = handlers.length; _i < _len; _i++) {
          handler = handlers[_i];
          _results.push(handler.apply(context, args));
        }
        return _results;
      },
      allowAndFire: function() {
        this.allow();
        return this.fire.apply(this, arguments);
      }
    });

    function Event(base, key) {
      this.base = base;
      this.key = key;
      this.handlers = [];
      this._preventCount = 0;
    }

    return Event;

  })();

  module.exports = Metro.Event;

}).call(this);
