var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Event = (function() {

  __extends(Event, Tower.Class);

  Event["for"] = function(object, key) {
    if (object.isEventEmitter) {
      return object.event(key);
    } else {
      return new Tower.Event(object, key);
    }
  };

  function Event(context, key) {
    this.context = context;
    this.key = key;
    this.handlers = [];
    this._preventCount = 0;
    this.context = context;
  }

  Event.prototype.isEvent = true;

  Event.prototype.addHandler = function(handler) {
    this.handlers.push(handler);
    if (this.oneShot) this.autofireHandler(handler);
    return this;
  };

  Event.prototype.removeHandler = function(handler) {
    this.handlers.splice(1, this.handlers.indexOf(handler));
    return this;
  };

  Event.prototype.handlerContext = function() {
    return this.context;
  };

  Event.prototype.prevent = function() {
    return ++this._preventCount;
  };

  Event.prototype.allow = function() {
    if (this._preventCount) --this._preventCount;
    return this._preventCount;
  };

  Event.prototype.isPrevented = function() {
    return this._preventCount > 0;
  };

  Event.prototype.autofireHandler = function(handler) {
    if (this._oneShotFired && (this._oneShotArgs != null)) {
      return handler.apply(this.handlerContext(), this._oneShotArgs);
    }
  };

  Event.prototype.resetOneShot = function() {
    this._oneShotFired = false;
    return this._oneShotArgs = null;
  };

  Event.prototype.fire = function() {
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
  };

  Event.prototype.allowAndFire = function() {
    this.allow();
    return this.fire.apply(this, arguments);
  };

  return Event;

})();

module.exports = Tower.Event;
