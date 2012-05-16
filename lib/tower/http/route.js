var __defineStaticProperty = function(clazz, key, value) {
  if (typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.HTTP.Route = (function(_super) {
  var Route;

  function Route() {
    return Route.__super__.constructor.apply(this, arguments);
  }

  Route = __extends(Route, _super);

  __defineStaticProperty(Route,  "store", function() {
    return this._store || (this._store = []);
  });

  __defineStaticProperty(Route,  "byName", {});

  __defineStaticProperty(Route,  "create", function(route) {
    this.byName[route.name] = route;
    return this.store().push(route);
  });

  __defineStaticProperty(Route,  "find", function(name) {
    return this.byName[name];
  });

  __defineStaticProperty(Route,  "findByControllerOptions", function(options) {
    var controller, key, route, success, value, _i, _len, _ref;
    _ref = this.all();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      route = _ref[_i];
      controller = route.controller;
      success = true;
      for (key in options) {
        value = options[key];
        success = controller[key] === value;
        if (!success) {
          break;
        }
      }
      if (success) {
        return route;
      }
    }
    return null;
  });

  __defineStaticProperty(Route,  "all", function() {
    return this.store();
  });

  __defineStaticProperty(Route,  "clear", function() {
    return this._store = [];
  });

  __defineStaticProperty(Route,  "reload", function() {
    this.clear();
    return this.draw();
  });

  __defineStaticProperty(Route,  "draw", function(callback) {
    this._defaultCallback || (this._defaultCallback = callback);
    if (!callback) {
      callback = this._defaultCallback;
    }
    return callback.apply(new Tower.HTTP.Route.DSL(this));
  });

  __defineStaticProperty(Route,  "findController", function(request, response, callback) {
    var controller, route, routes, _i, _len;
    routes = Tower.Route.all();
    for (_i = 0, _len = routes.length; _i < _len; _i++) {
      route = routes[_i];
      controller = route.toController(request);
      if (controller) {
        break;
      }
    }
    if (controller) {
      controller.call(request, response, function() {
        return callback(controller);
      });
    } else {
      callback(null);
    }
    return controller;
  });

  __defineProperty(Route,  "toController", function(request) {
    var capture, controller, i, key, keys, match, method, params, _i, _len;
    match = this.match(request);
    if (!match) {
      return null;
    }
    method = request.method.toLowerCase();
    keys = this.keys;
    params = _.extend({}, this.defaults, request.query || {}, request.body || {});
    match = match.slice(1);
    for (i = _i = 0, _len = match.length; _i < _len; i = ++_i) {
      capture = match[i];
      key = keys[i].name;
      if (capture && !(params[key] != null)) {
        capture = decodeURIComponent(capture);
        try {
          params[key] = JSON.parse(capture);
        } catch (error) {
          params[key] = capture;
        }
      }
    }
    controller = this.controller;
    if (controller) {
      params.action = controller.action;
    }
    request.params = params;
    if (controller) {
      controller = Tower.constant(Tower.namespaced(this.controller.className)).create();
    }
    return controller;
  });

  __defineProperty(Route,  "init", function(options) {
    options || (options = options);
    this.path = options.path;
    this.name = options.name;
    this.methods = _.map(_.castArray(options.method || "GET"), function(i) {
      return i.toUpperCase();
    });
    this.ip = options.ip;
    this.defaults = options.defaults || {};
    this.constraints = options.constraints;
    this.options = options;
    this.controller = options.controller;
    this.keys = [];
    this.pattern = this.extractPattern(this.path);
    this.id = this.path;
    this.state = options.state;
    if (this.controller) {
      this.id += this.controller.name + this.controller.action;
    }
    return this._super();
  });

  __defineProperty(Route,  "get", function(name) {
    return this[name];
  });

  __defineProperty(Route,  "match", function(requestOrPath) {
    var match, path;
    if (typeof requestOrPath === "string") {
      return this.pattern.exec(requestOrPath);
    }
    path = requestOrPath.location.path;
    if (!(_.indexOf(this.methods, requestOrPath.method.toUpperCase()) > -1)) {
      return null;
    }
    match = this.pattern.exec(path);
    if (!match) {
      return null;
    }
    if (!this.matchConstraints(requestOrPath)) {
      return null;
    }
    return match;
  });

  __defineProperty(Route,  "matchConstraints", function(request) {
    var constraints, key, value;
    constraints = this.constraints;
    switch (typeof constraints) {
      case "object":
        for (key in constraints) {
          value = constraints[key];
          switch (typeof value) {
            case "string":
            case "number":
              if (request[key] !== value) {
                return false;
              }
              break;
            case "function":
            case "object":
              if (!request.location[key].match(value)) {
                return false;
              }
          }
        }
        break;
      case "function":
        return constraints.call(request, request);
      default:
        return false;
    }
    return true;
  });

  __defineProperty(Route,  "urlFor", function(options) {
    var key, result, value;
    if (options == null) {
      options = {};
    }
    result = this.path;
    for (key in options) {
      value = options[key];
      result = result.replace(new RegExp(":" + key + "\\??", "g"), value);
    }
    result = result.replace(new RegExp("\\.?:\\w+\\??", "g"), "");
    return result;
  });

  __defineProperty(Route,  "extractPattern", function(path, caseSensitive, strict) {
    var self;
    if (path instanceof RegExp) {
      return path;
    }
    self = this;
    if (path === "/") {
      return new RegExp('^' + path + '$');
    }
    path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, function(_, open, slash, format, symbol, key, close, optional) {
      var result, splat;
      optional = (!!optional) || (open + close === "()");
      splat = symbol === "*";
      self.keys.push({
        name: key,
        optional: !!optional,
        splat: splat
      });
      slash || (slash = "");
      result = "";
      if (!optional || !splat) {
        result += slash;
      }
      result += "(?:";
      if (format != null) {
        result += splat ? "\\.([^.]+?)" : "\\.([^/.]+?)";
      } else {
        result += splat ? "/?(.+)" : "([^/\\.]+)";
      }
      result += ")";
      if (optional) {
        result += "?";
      }
      return result;
    });
    return new RegExp('^' + path + '$', !!caseSensitive ? '' : 'i');
  });

  return Route;

})(Tower.Class);

Tower.Route = Tower.HTTP.Route;

require('./route/dsl');

module.exports = Tower.HTTP.Route;
