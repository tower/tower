(function() {
  var IE, key, lingo, moduleKeywords, value, _, _ref;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Metro.Support = {};
  Metro.Support.Array = {
    extractArgs: function(args) {
      return Array.prototype.slice.call(args, 0, args.length);
    },
    extractArgsAndOptions: function(args) {
      args = Array.prototype.slice.call(args, 0, args.length);
      if (typeof args[args.length - 1] !== 'object') {
        args.push({});
      }
      return args;
    },
    argsOptionsAndCallback: function() {
      var args, callback, last, options;
      args = Array.prototype.slice.call(arguments);
      last = args.length - 1;
      if (typeof args[last] === "function") {
        callback = args[last];
        if (args.length >= 3) {
          if (typeof args[last - 1] === "object") {
            options = args[last - 1];
            args = args.slice(0, (last - 2 + 1) || 9e9);
          } else {
            options = {};
            args = args.slice(0, (last - 1 + 1) || 9e9);
          }
        } else {
          options = {};
        }
      } else if (args.length >= 2 && typeof args[last] === "object") {
        args = args.slice(0, (last - 1 + 1) || 9e9);
        options = args[last];
        callback = null;
      } else {
        options = {};
        callback = null;
      }
      return [args, options, callback];
    },
    sortBy: function(objects) {
      var arrayComparator, callbacks, sortings, valueComparator;
      sortings = Array.prototype.slice.call(arguments, 1, arguments.length);
      callbacks = sortings[sortings.length - 1] instanceof Array ? {} : sortings.pop();
      valueComparator = function(x, y) {
        if (x > y) {
          return 1;
        } else {
          if (x < y) {
            return -1;
          } else {
            return 0;
          }
        }
      };
      arrayComparator = function(a, b) {
        var x, y;
        x = [];
        y = [];
        sortings.forEach(function(sorting) {
          var aValue, attribute, bValue, direction;
          attribute = sorting[0];
          direction = sorting[1];
          aValue = a[attribute];
          bValue = b[attribute];
          if (typeof callbacks[attribute] !== "undefined") {
            aValue = callbacks[attribute](aValue);
            bValue = callbacks[attribute](bValue);
          }
          x.push(direction * valueComparator(aValue, bValue));
          return y.push(direction * valueComparator(bValue, aValue));
        });
        if (x < y) {
          return -1;
        } else {
          return 1;
        }
      };
      sortings = sortings.map(function(sorting) {
        if (!(sorting instanceof Array)) {
          sorting = [sorting, "asc"];
        }
        if (sorting[1] === "desc") {
          sorting[1] = -1;
        } else {
          sorting[1] = 1;
        }
        return sorting;
      });
      return objects.sort(function(a, b) {
        return arrayComparator(a, b);
      });
    }
  };
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
  _ref = Metro.Support.Class;
  for (key in _ref) {
    value = _ref[key];
    Function.prototype[key] = value;
  }
  Metro.Support.Concern = (function() {
    function Concern() {
      Concern.__super__.constructor.apply(this, arguments);
    }
    Concern.included = function() {
      this._dependencies || (this._dependencies = []);
      if (this.hasOwnProperty("ClassMethods")) {
        this.extend(this.ClassMethods);
      }
      if (this.hasOwnProperty("InstanceMethods")) {
        return this.include(this.InstanceMethods);
      }
    };
    Concern._appendFeatures = function() {};
    return Concern;
  })();
  IE = (function() {
    function IE() {}
    return IE;
  })();
  Metro.Support.I18n = (function() {
    function I18n() {}
    I18n.defaultLanguage = "en";
    I18n.translate = function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.hasOwnProperty("tense")) {
        key += "." + options.tense;
      }
      if (options.hasOwnProperty("count")) {
        switch (options.count) {
          case 0:
            key += ".none";
            break;
          case 1:
            key += ".one";
            break;
          default:
            key += ".other";
        }
      }
      return this.interpolator().render(this.lookup(key, options.language), {
        locals: options
      });
    };
    I18n.t = I18n.translate;
    I18n.lookup = function(key, language) {
      var part, parts, result, _i, _len;
      if (language == null) {
        language = this.defaultLanguage;
      }
      parts = key.split(".");
      result = this.store[language];
      try {
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          result = result[part];
        }
      } catch (error) {
        result = null;
      }
      if (result == null) {
        throw new Error("Translation doesn't exist for '" + key + "'");
      }
      return result;
    };
    I18n.store = {};
    I18n.interpolator = function() {
      return this._interpolator || (this._interpolator = new (require('shift').Mustache));
    };
    return I18n;
  })();
  Metro.Support.Number = {
    isInt: function(n) {
      return n === +n && n === (n | 0);
    },
    isFloat: function(n) {
      return n === +n && n !== (n | 0);
    }
  };
  _ = require('underscore');
  Metro.Support.Object = {
    isA: function(object, isa) {},
    isHash: function() {
      var object;
      object = arguments[0] || this;
      return _.isObject(object) && !(_.isFunction(object) || _.isArray(object));
    },
    isPresent: function(object) {
      var key, value;
      for (key in object) {
        value = object[key];
        return true;
      }
      return false;
    },
    isBlank: function(object) {
      var key, value;
      for (key in object) {
        value = object[key];
        return false;
      }
      return true;
    }
  };
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  lingo = require("lingo").en;
  Metro.Support.String = {
    camelize: function() {
      return _.camelize("_" + (arguments[0] || this));
    },
    constantize: function() {
      return global[this.camelize.apply(this, arguments)];
    },
    underscore: function() {
      return _.underscored(arguments[0] || this);
    },
    titleize: function() {
      return _.titleize(arguments[0] || this);
    }
  };
  Metro.Support.RegExp = {
    escape: function(string) {
      return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    escapeEach: function() {
      var args, i, item, result, _len;
      result = [];
      args = arguments[0];
      for (i = 0, _len = args.length; i < _len; i++) {
        item = args[i];
        result[i] = this.escape(item);
      }
      return result;
    }
  };
  Metro.Support.Time = (function() {
    Time._lib = function() {
      return require('moment');
    };
    Time.zone = function() {
      return this;
    };
    Time.now = function() {
      return new this();
    };
    function Time() {
      this.moment = this.constructor._lib()();
    }
    Time.prototype.toString = function() {
      return this._date.toString();
    };
    Time.prototype.beginningOfWeek = function() {};
    Time.prototype.week = function() {
      return parseInt(this.moment.format("w"));
    };
    Time.prototype.dayOfWeek = function() {
      return this.moment.day();
    };
    Time.prototype.dayOfMonth = function() {
      return parseInt(this.moment.format("D"));
    };
    Time.prototype.dayOfYear = function() {
      return parseInt(this.moment.format("DDD"));
    };
    Time.prototype.meridiem = function() {
      return this.moment.format("a");
    };
    Time.prototype.zoneName = function() {
      return this.moment.format("z");
    };
    Time.prototype.strftime = function(format) {
      return this.moment.format(format);
    };
    Time.prototype.beginningOfDay = function() {
      this.moment.seconds(0);
      return this;
    };
    Time.prototype.beginningOfWeek = function() {
      this.moment.seconds(0);
      this.moment.subtract('days', 6 - this.dayOfWeek());
      return this;
    };
    Time.prototype.beginningOfMonth = function() {
      this.moment.seconds(0);
      this.moment.subtract('days', 6 - this.dayOfMonth());
      return this;
    };
    Time.prototype.beginningOfYear = function() {
      this.moment.seconds(0);
      return this.moment.subtract('days', 6 - this.dayOfMonth());
    };
    Time.prototype.toDate = function() {
      return this.moment._d;
    };
    return Time;
  })();
  Metro.Support.Time.TimeWithZone = (function() {
    __extends(TimeWithZone, Metro.Support.Time);
    function TimeWithZone() {
      TimeWithZone.__super__.constructor.apply(this, arguments);
    }
    return TimeWithZone;
  })();
}).call(this);
