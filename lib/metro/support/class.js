(function() {
  var Class, moduleKeywords;
  moduleKeywords = ['included', 'extended', 'prototype'];
  Class = (function() {
    function Class() {}
    Class.alias = function(to, from) {
      return this.prototype[to] = this.prototype[from];
    };
    Class.aliasMethod = function(to, from) {
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
      var c, child, parent;
      if (!obj) {
        throw new Error('include(obj) requires obj');
      }
      this.extend(obj);
      c = this;
      child = this;
      return parent = obj;
    };
    return Class;
  })();
}).call(this);
