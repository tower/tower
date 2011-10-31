var __slice = Array.prototype.slice;
Metro.Model.Callbacks = (function() {
  function Callbacks() {}
  Callbacks.CALLBACKS = ["afterInitialize", "afterFind", "afterTouch", "beforeValidation", "afterValidation", "beforeSave", "aroundSave", "afterSave", "beforeCreate", "aroundCreate", "afterCreate", "beforeUpdate", "aroundUpdate", "afterUpdate", "beforeDestroy", "aroundDestroy", "afterDestroy", "afterCommit", "afterRollback"];
  Callbacks.defineCallbacks = function() {
    var callback, callbacks, options, type, types, _i, _len, _results;
    callbacks = Metro.Support.Array.extractArgsAndOptions(arguments);
    options = callbacks.pop();
    options.terminator || (options.terminator = "result == false");
    options.scope || (options.scope = ["kind", "name"]);
    options.only || (options.only = ["before", "around", "after"]);
    types = options.only.map(function(type) {
      return Metro.Support.String.camelize("_" + type);
    });
    _results = [];
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      callback = callbacks[_i];
      _results.push((function() {
        var _j, _len2, _results2;
        _results2 = [];
        for (_j = 0, _len2 = types.length; _j < _len2; _j++) {
          type = types[_j];
          _results2.push(this["_define" + type + "Callback"](callback));
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };
  Callbacks._defineBeforeCallback = function(name) {
    return this["before" + (Metro.Support.String.camelize("_" + name))] = function() {
      return this.setCallback.apply(this, [name, "before"].concat(__slice.call(arguments)));
    };
  };
  Callbacks._defineAroundCallback = function(name) {
    return this["around" + (Metro.Support.String.camelize("_" + name))] = function() {
      return this.setCallback.apply(this, [name, "around"].concat(__slice.call(arguments)));
    };
  };
  Callbacks._defineAfterCallback = function(name) {
    return this["after" + (Metro.Support.String.camelize("_" + name))] = function() {
      return this.setCallback.apply(this, [name, "after"].concat(__slice.call(arguments)));
    };
  };
  Callbacks.prototype.createOrUpdate = function() {
    return this.runCallbacks("save", function() {
      return this["super"];
    });
  };
  Callbacks.prototype.create = function() {
    return this.runCallbacks("create", function() {
      return this["super"];
    });
  };
  Callbacks.prototype.update = function() {
    return this.runCallbacks("update", function() {
      return this["super"];
    });
  };
  Callbacks.prototype.destroy = function() {
    return this.runCallbacks("destroy", function() {
      return this["super"];
    });
  };
  return Callbacks;
})();
module.exports = Metro.Model.Callbacks;