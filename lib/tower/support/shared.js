var __slice = [].slice;

_.extend(Tower, {
  nativeExtensions: true,
  env: "development",
  port: 3000,
  client: typeof window !== "undefined",
  isClient: typeof window !== "undefined",
  isServer: typeof window === "undefined",
  root: "/",
  publicPath: "/",
  "case": "camelcase",
  accessors: typeof window === "undefined",
  logger: typeof _console !== 'undefined' ? _console : console,
  structure: "standard",
  config: {},
  namespaces: {},
  metadata: {},
  _: _,
  subscribe: function() {
    var _ref;
    return (_ref = Tower.Application.instance()).subscribe.apply(_ref, arguments);
  },
  cb: function() {},
  toMixin: function() {
    return {
      include: function() {
        return Tower.include.apply(Tower, [this].concat(__slice.call(arguments)));
      },
      className: function() {
        return _.functionName(this);
      }
    };
  },
  include: function(self, object) {
    var ClassMethods, InstanceMethods, included;
    included = object.included;
    ClassMethods = object.ClassMethods;
    InstanceMethods = object.InstanceMethods;
    delete object.included;
    delete object.ClassMethods;
    delete object.InstanceMethods;
    if (ClassMethods) {
      self.reopenClass(ClassMethods);
    }
    if (InstanceMethods) {
      self.include(InstanceMethods);
    }
    self.reopen(object);
    object.InstanceMethods = InstanceMethods;
    object.ClassMethods = ClassMethods;
    if (included) {
      included.apply(self);
    }
    return object;
  },
  metadataFor: function(name) {
    var _base;
    return (_base = this.metadata)[name] || (_base[name] = {});
  },
  callback: function() {
    var _ref;
    return (_ref = Tower.Application).callback.apply(_ref, arguments);
  },
  runCallbacks: function() {
    var _ref;
    return (_ref = Tower.Application.instance()).runCallbacks.apply(_ref, arguments);
  },
  raise: function() {
    throw new Error(Tower.t.apply(Tower, arguments));
  },
  t: function() {
    var _ref;
    return (_ref = Tower.Support.I18n).translate.apply(_ref, arguments);
  },
  l: function() {
    var _ref;
    return (_ref = Tower.Support.I18n).localize.apply(_ref, arguments);
  },
  stringify: function() {
    var string;
    string = _.args(arguments).join("_");
    switch (Tower["case"]) {
      case "snakecase":
        return Tower.Support.String.underscore(string);
      default:
        return Tower.Support.String.camelize(string);
    }
  },
  namespace: function() {
    return Tower.Application.instance().constructor.className();
  },
  module: function(namespace) {
    var node, part, parts, _i, _len;
    node = Tower.namespaces[namespace];
    if (node) {
      return node;
    }
    parts = namespace.split(".");
    node = Tower;
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      node = node[part] || (node[part] = {});
    }
    return Tower.namespaces[namespace] = node;
  },
  constant: function(string) {
    var namespace, node, part, parts, _i, _len;
    node = global;
    parts = string.split(".");
    try {
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        node = node[part];
      }
    } catch (error) {
      node = null;
    }
    if (!node) {
      namespace = Tower.namespace();
      if (namespace && parts[0] !== namespace) {
        node = Tower.constant("" + namespace + "." + string);
      } else {
        throw new Error("Constant '" + string + "' wasn't found");
      }
    }
    return node;
  },
  namespaced: function(string) {
    var namespace;
    namespace = Tower.namespace();
    if (namespace) {
      return "" + namespace + "." + string;
    } else {
      return string;
    }
  },
  async: function(array, iterator, callback) {
    return this.series(array, iterator, callback);
  },
  each: function(array, iterator) {
    var index, item, _i, _len, _results;
    if (array.forEach) {
      return array.forEach(iterator);
    } else {
      _results = [];
      for (index = _i = 0, _len = array.length; _i < _len; index = ++_i) {
        item = array[index];
        _results.push(iterator(item, index, array));
      }
      return _results;
    }
  },
  series: function(array, iterator, callback) {
    var completed, iterate;
    if (callback == null) {
      callback = function() {};
    }
    if (!array.length) {
      return callback();
    }
    completed = 0;
    iterate = function() {
      return iterator(array[completed], function(error) {
        if (error) {
          callback(error);
          return callback = function() {};
        } else {
          completed += 1;
          if (completed === array.length) {
            return callback();
          } else {
            return iterate();
          }
        }
      });
    };
    return iterate();
  },
  parallel: function(array, iterator, callback) {
    var completed, iterate;
    if (callback == null) {
      callback = function() {};
    }
    if (!array.length) {
      return callback();
    }
    completed = 0;
    iterate = function() {};
    return Tower.each(array, function(x) {
      return iterator(x, function(error) {
        if (error) {
          callback(error);
          return callback = function() {};
        } else {
          completed += 1;
          if (completed === array.length) {
            return callback();
          }
        }
      });
    });
  },
  callbackChain: function() {
    var callbacks,
      _this = this;
    callbacks = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return function(error) {
      var callback, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        callback = callbacks[_i];
        if (callback) {
          _results.push(callback.call(_this, error));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
  },
  get: function() {
    return Tower.request.apply(Tower, ['get'].concat(__slice.call(arguments)));
  },
  post: function() {
    return Tower.request.apply(Tower, ['post'].concat(__slice.call(arguments)));
  },
  put: function() {
    return Tower.request.apply(Tower, ['put'].concat(__slice.call(arguments)));
  },
  destroy: function() {
    return Tower.request.apply(Tower, ['destroy'].concat(__slice.call(arguments)));
  },
  request: function() {
    var _ref;
    return (_ref = Tower.agent).request.apply(_ref, arguments);
  }
});
