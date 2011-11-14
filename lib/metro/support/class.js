(function() {
  var key, moduleKeywords, value, _ref;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __slice = Array.prototype.slice;
  moduleKeywords = ['included', 'extended', 'prototype'];
  Metro.Support.Class = (function() {
    function Class() {}
    Class.alias = function(to, from) {
      return this.prototype[to] = this.prototype[from];
    };
    Class.alias_method = function(to, from) {
      return this.prototype[to] = this.prototype[from];
    };
    Class.accessor = function(key, self, callback) {
      this._accessors || (this._accessors = []);
      this._accessors.push(key);
      this.getter(key, self, callback);
      this.setter(key, self);
      return this;
    };
    Class.getter = function(key, self, callback) {
      self || (self = this.prototype);
      if (!self.hasOwnProperty("_getAttribute")) {
        Object.defineProperty(self, "_getAttribute", {
          enumerable: false,
          configurable: true,
          value: function(key) {
            return this["_" + key];
          }
        });
      }
      this._getters || (this._getters = []);
      this._getters.push(key);
      Object.defineProperty(self, "_" + key, {
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(self, key, {
        enumerable: true,
        configurable: true
      }, {
        get: function() {
          return this["_getAttribute"](key) || (callback ? this["_" + key] = callback.apply(this) : void 0);
        }
      });
      return this;
    };
    Class.setter = function(key, self) {
      self || (self = this.prototype);
      if (!self.hasOwnProperty("_setAttribute")) {
        Object.defineProperty(self, method, {
          enumerable: false,
          configurable: true,
          value: function(key, value) {
            return this["_" + key] = value;
          }
        });
      }
      this._setters || (this._setters = []);
      this._setters.push(key);
      Object.defineProperty(self, "_" + key, {
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(self, key, {
        enumerable: true,
        configurable: true,
        set: function(value) {
          return this["_setAttribute"](key, value);
        }
      });
      return this;
    };
    Class.classEval = function(block) {
      return block.call(this);
    };
    Class.delegate = function(key, options) {
      var to;
      if (options == null) {
        options = {};
      }
      to = options.to;
      if (typeof this.prototype[to] === "function") {
        return this.prototype[key] = function() {
          var _ref;
          return (_ref = this[to]())[key].apply(_ref, arguments);
        };
      } else {
        return Object.defineProperty(this.prototype, key, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this[to]()[key];
          }
        });
      }
    };
    Class.delegates = function() {
      var args, key, options, _i, _len, _results;
      args = Array.prototype.slice.call(arguments, 0, arguments.length);
      options = args.pop();
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        key = args[_i];
        _results.push(this.delegate(key, options));
      }
      return _results;
    };
    Class.include = function(obj) {
      var c, child, clone, cloned, included, key, newproto, oldproto, parent, value, _ref;
      if (!obj) {
        throw new Error('include(obj) requires obj');
      }
      this.extend(obj);
      c = this;
      child = this;
      parent = obj;
      clone = function(fct) {
        var clone_, property;
        clone_ = function() {
          return fct.apply(this, arguments);
        };
        clone_.prototype = fct.prototype;
        for (property in fct) {
          if (fct.hasOwnProperty(property) && property !== "prototype") {
            clone_[property] = fct[property];
          }
        }
        return clone_;
      };
      if (child.__super__) {
        oldproto = child.__super__;
      }
      cloned = clone(parent);
      newproto = cloned.prototype;
      _ref = cloned.prototype;
      for (key in _ref) {
        value = _ref[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this.prototype[key] = value;
        }
      }
      if (oldproto) {
        cloned.prototype = oldproto;
      }
      child.__super__ = newproto;
      included = obj.included;
      if (included) {
        included.apply(obj.prototype);
      }
      return this;
    };
    Class.extend = function(obj) {
      var extended, key, value;
      if (!obj) {
        throw new Error('extend(obj) requires obj');
      }
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this[key] = value;
        }
      }
      extended = obj.extended;
      if (extended) {
        extended.apply(obj);
      }
      return this;
    };
    Class["new"] = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(this, arguments, function() {});
    };
    Class.instanceMethods = function() {
      var key, result;
      result = [];
      for (key in this.prototype) {
        result.push(key);
      }
      return result;
    };
    Class.classMethods = function() {
      var key, result;
      result = [];
      for (key in this) {
        result.push(key);
      }
      return result;
    };
    Class.prototype.instanceExec = function() {
      var _ref;
      return (_ref = arguments[0]).apply.apply(_ref, [this].concat(__slice.call(arguments.slice(1))));
    };
    Class.prototype.instanceEval = function(block) {
      return block.apply(this);
    };
    Class.prototype.send = function(method) {
      var _ref;
      if (this[method]) {
        return (_ref = this[method]).apply.apply(_ref, arguments);
      } else {
        if (this.methodMissing) {
          return this.methodMissing.apply(this, arguments);
        }
      }
    };
    Class.prototype.methodMissing = function(method) {};
    return Class;
  })();
  module.exports = Metro.Support.Class;
  _ref = Metro.Support.Class;
  for (key in _ref) {
    value = _ref[key];
    Function.prototype[key] = value;
  }
}).call(this);
