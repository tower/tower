var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Tower.Engine = (function(_super) {

  __extends(Engine, _super);

  function Engine() {
    return Engine.__super__.constructor.apply(this, arguments);
  }

  Engine.configure = function(block) {
    return this.initializers().push(block);
  };

  Engine.initializers = function() {
    return this._initializers || (this._initializers = []);
  };

  Engine.prototype.configure = function(block) {
    return this.constructor.configure(block);
  };

  Engine.prototype.subscribe = function(key, block) {
    Tower.ModelCursor.subscriptions.push(key);
    return this[key] = typeof block === 'function' ? block() : block;
  };

  Engine.prototype.unsubscribe = function(key) {
    Tower.ModelCursor.subscriptions.splice(_.indexOf(key), 1);
    return delete this[key];
  };

  return Engine;

})(Tower.Hook);
