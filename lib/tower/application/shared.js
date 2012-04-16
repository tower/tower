
_.extend(Tower, {
  env: "development",
  port: 3000,
  client: typeof window !== "undefined",
  root: "/",
  publicPath: "/",
  "case": "camelcase",
  accessors: typeof window === "undefined",
  logger: typeof _console !== 'undefined' ? _console : console,
  structure: "standard",
  config: {},
  namespaces: {},
  metadata: {},
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
        return Tower.Support.String.camelcase(string);
    }
  },
  namespace: function() {
    return Tower.Application.instance().constructor.name;
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
  }
});

if (Tower.client) {
  Tower.request = function(method, path, options, callback) {
    var url;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options || (options = {});
    url = path;
    return History.pushState(null, null, url);
  };
}
