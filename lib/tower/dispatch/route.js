var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Dispatch.Route = (function() {

  __extends(Route, Tower.Class);

  Route.store = function() {
    return this._store || (this._store = []);
  };

  Route.create = function(route) {
    return this.store().push(route);
  };

  Route.all = function() {
    return this.store();
  };

  Route.clear = function() {
    return this._store = [];
  };

  Route.draw = function(callback) {
    return callback.apply(new Tower.Dispatch.Route.DSL(this));
  };

  Route.findController = function(request, response, callback) {
    var controller, route, routes, _i, _len;
    routes = Tower.Route.all();
    for (_i = 0, _len = routes.length; _i < _len; _i++) {
      route = routes[_i];
      controller = route.toController(request);
      if (controller) break;
    }
    if (controller) {
      controller.call(request, response, function() {
        return callback(controller);
      });
    } else {
      callback(null);
    }
    return controller;
  };

  Route.prototype.toController = function(request) {
    var capture, controller, i, keys, match, method, params, _len, _name;
    match = this.match(request);
    if (!match) return null;
    method = request.method.toLowerCase();
    keys = this.keys;
    params = Tower.Support.Object.extend({}, this.defaults, request.query || {}, request.body || {});
    match = match.slice(1);
    for (i = 0, _len = match.length; i < _len; i++) {
      capture = match[i];
      params[_name = keys[i].name] || (params[_name] = capture ? decodeURIComponent(capture) : null);
    }
    controller = this.controller;
    if (controller) params.action = controller.action;
    request.params = params;
    if (controller) {
      controller = new (Tower.constant(Tower.namespaced(this.controller.className)));
    }
    return controller;
  };

  function Route(options) {
    options || (options = options);
    this.path = options.path;
    this.name = options.name;
    this.method = (options.method || "GET").toUpperCase();
    this.ip = options.ip;
    this.defaults = options.defaults || {};
    this.constraints = options.constraints;
    this.options = options;
    this.controller = options.controller;
    this.keys = [];
    this.pattern = this.extractPattern(this.path);
    this.id = this.path;
    if (this.controller) this.id += this.controller.name + this.controller.action;
  }

  Route.prototype.match = function(requestOrPath) {
    var match, path;
    if (typeof requestOrPath === "string") return this.pattern.exec(requestOrPath);
    path = requestOrPath.location.path;
    if (requestOrPath.method.toUpperCase() !== this.method) return null;
    match = this.pattern.exec(path);
    if (!match) return null;
    if (!this.matchConstraints(requestOrPath)) return null;
    return match;
  };

  Route.prototype.matchConstraints = function(request) {
    var constraints, key, value;
    constraints = this.constraints;
    switch (typeof constraints) {
      case "object":
        for (key in constraints) {
          value = constraints[key];
          switch (typeof value) {
            case "string":
            case "number":
              if (request[key] !== value) return false;
              break;
            case "function":
            case "object":
              if (!request.location[key].match(value)) return false;
          }
        }
        break;
      case "function":
        return constraints.call(request, request);
      default:
        return false;
    }
    return true;
  };

  Route.prototype.urlFor = function(options) {
    var key, result, value;
    if (options == null) options = {};
    result = this.path;
    for (key in options) {
      value = options[key];
      result = result.replace(new RegExp(":" + key + "\\??", "g"), value);
    }
    result = result.replace(new RegExp("\\.?:\\w+\\??", "g"), "");
    return result;
  };

  Route.prototype.extractPattern = function(path, caseSensitive, strict) {
    var self;
    if (path instanceof RegExp) return path;
    self = this;
    if (path === "/") return new RegExp('^' + path + '$');
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
      if (!optional || !splat) result += slash;
      result += "(?:";
      if (format != null) {
        result += splat ? "\\.([^.]+?)" : "\\.([^/.]+?)";
      } else {
        result += splat ? "/?(.+)" : "([^/\\.]+)";
      }
      result += ")";
      if (optional) result += "?";
      return result;
    });
    return new RegExp('^' + path + '$', !!caseSensitive ? '' : 'i');
  };

  return Route;

})();

Tower.Route = Tower.Dispatch.Route;

require('./route/dsl');

require('./route/urls');

require('./route/polymorphicUrls');

Tower.Dispatch.Route.include(Tower.Dispatch.Route.Urls);

Tower.Dispatch.Route.include(Tower.Dispatch.Route.PolymorphicUrls);

module.exports = Tower.Dispatch.Route;
