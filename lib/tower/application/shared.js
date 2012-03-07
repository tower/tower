var __slice = Array.prototype.slice;

Tower.Support.Object.extend(Tower, {
  env: "development",
  port: 3000,
  version: "0.3.0",
  client: typeof window !== "undefined",
  root: "/",
  publicPath: "/",
  "case": "camelcase",
  namespace: null,
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
  sync: function(method, records, callback) {
    if (callback) return callback(null, records);
  },
  get: function() {
    return Tower.request.apply(Tower, ["get"].concat(__slice.call(arguments)));
  },
  post: function() {
    return Tower.request.apply(Tower, ["post"].concat(__slice.call(arguments)));
  },
  put: function() {
    return Tower.request.apply(Tower, ["put"].concat(__slice.call(arguments)));
  },
  destroy: function() {
    return Tower.request.apply(Tower, ["delete"].concat(__slice.call(arguments)));
  },
  request: function(method, path, options, callback) {
    var location, request, response, url;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options || (options = {});
    url = path;
    location = new Tower.Dispatch.Url(url);
    request = new Tower.Dispatch.Request({
      url: url,
      location: location,
      method: method
    });
    response = new Tower.Dispatch.Response({
      url: url,
      location: location,
      method: method
    });
    request.query = location.params;
    return Tower.Application.instance().handle(request, response, function() {
      return callback.call(this, this.response);
    });
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
    string = Tower.Support.Array.args(arguments).join("_");
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
    if (node) return node;
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
    var completed, iterate;
    if (!array.length) return callback();
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
