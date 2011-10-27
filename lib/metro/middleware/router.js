(function() {
  var Router, _, _url;
  _url = require('url');
  _ = require('underscore');
  Router = (function() {
    function Router() {}
    Router.middleware = function(request, result, next) {
      return (new Metro.Middleware.Router).call(request, result, next);
    };
    Router.prototype.call = function(request, response, next) {
      if (!this.process(request, response)) {
        this.error(request, response);
      }
      return response;
    };
    Router.prototype.process = function(request, response) {
      var controller, route, routes, _i, _len;
      routes = Metro.Route.all();
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        route = routes[_i];
        if (controller = this.process_route(route, request, response)) {
          return controller;
        }
      }
      return null;
    };
    Router.prototype.process_route = function(route, request, response) {
      var capture, controller, i, keys, match, method, params, path, url, _len;
      url = _url.parse(request.url);
      path = url.pathname;
      match = route.match(path);
      if (!match) {
        return null;
      }
      method = request.method.toLowerCase();
      keys = route.keys;
      params = _.extend({}, route.defaults, request.query || {}, request.body || {});
      match = match.slice(1);
      for (i = 0, _len = match.length; i < _len; i++) {
        capture = match[i];
        params[keys[i].name] = capture ? decodeURIComponent(capture) : null;
      }
      controller = route.controller;
      if (controller) {
        params.action = controller.action;
      }
      request.params = params;
      if (controller) {
        try {
          controller = new global[route.controller.class_name];
        } catch (error) {
          throw new Error("" + route.controller.class_name + " wasn't found");
        }
        controller.call(request, response);
      }
      return controller;
    };
    Router.prototype.error = function(request, response) {
      if (response) {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        return response.end("No path matches " + request.url);
      }
    };
    return Router;
  })();
  module.exports = Router;
}).call(this);
