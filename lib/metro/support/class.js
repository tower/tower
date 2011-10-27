(function() {
  var Class, key, moduleKeywords, value;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __slice = Array.prototype.slice;
  moduleKeywords = ['included', 'extended', 'prototype'];
  Class = (function() {
    function Class() {}
    Class.alias = function(to, from) {
      return this.prototype[to] = this.prototype[from];
    };
    Class.alias_method = function(to, from) {
      return this.prototype[to] = this.prototype[from];
    };
    Class.accessor = function(key, self, callback) {
      var _ref;
      if ((_ref = this._accessors) == null) {
        this._accessors = [];
      }
      this._accessors.push(key);
      this.getter(key, self, callback);
      this.setter(key, self);
      return this;
    };
    Class.getter = function(key, self, callback) {
      var _ref;
      if (self == null) {
        self = this.prototype;
      }
      if (!self.hasOwnProperty("_getAttribute")) {
        Object.defineProperty(self, "_getAttribute", {
          enumerable: false,
          configurable: true,
          value: function(key) {
            return this["_" + key];
          }
        });
      }
      if ((_ref = this._getters) == null) {
        this._getters = [];
      }
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
      var _ref;
      if (self == null) {
        self = this.prototype;
      }
      if (!self.hasOwnProperty("_setAttribute")) {
        Object.defineProperty(self, method, {
          enumerable: false,
          configurable: true,
          value: function(key, value) {
            return this["_" + key] = value;
          }
        });
      }
      if ((_ref = this._setters) == null) {
        this._setters = [];
      }
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
    Class.delegate = function() {
      var key, options, self, to, _i, _len, _results;
      options = arguments.pop();
      to = options.to;
      self = this;
      _results = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        key = arguments[_i];
        _results.push(self.prototype[key] = to[key]);
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
        var property;
        clone = function() {
          return fct.apply(this, arguments);
        };
        clone.prototype = fct.prototype;
        for (property in fct) {
          if (fct.hasOwnProperty(property) && property !== "prototype") {
            clone[property] = fct[property];
          }
        }
        return clone;
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
    Class.instance_methods = function() {
      var key, result;
      result = [];
      for (key in this.prototype) {
        result.push(key);
      }
      return result;
    };
    Class.class_methods = function() {
      var key, result;
      result = [];
      for (key in this) {
        result.push(key);
      }
      return result;
    };
    Class.prototype.instance_exec = function() {
      var _ref;
      return (_ref = arguments[0]).apply.apply(_ref, [this].concat(__slice.call(arguments.slice(1))));
    };
    Class.prototype.instance_eval = function(block) {
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
  module.exports = Class;
  for (key in Class) {
    value = Class[key];
    Function.prototype[key] = value;
  }
}).call(this);
