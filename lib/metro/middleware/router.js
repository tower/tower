
  Metro.Middleware.Router = (function() {

    function Router(request, response, next) {
      if (this.constructor !== Metro.Middleware.Router) {
        return (new Metro.Middleware.Router(request, response, next)).call(request, response, callback);
      }
    }

    Router.prototype.call = function(request, response, callback) {
      var self;
      self = this;
      this.find(request, response, function(controller) {
        if (controller) {
          response.writeHead(200, controller.headers);
          response.write(controller.body);
          response.end();
          return controller.clear();
        } else {
          return self.error(request, response);
        }
      });
      return response;
    };

    Router.prototype.find = function(request, response, callback) {
      var controller, route, routes, _i, _len;
      routes = Metro.Route.all();
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        route = routes[_i];
        controller = this.processRoute(route, request, response);
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

    Router.prototype.processRoute = function(route, request, response) {
      var capture, controller, i, keys, match, method, params, path, url, _len;
      url = request.parsedUrl || (request.parsedUrl = new Metro.Net.Url(request.url));
      path = url.attr("path");
      match = route.match(path);
      if (!match) return null;
      method = request.method.toLowerCase();
      keys = route.keys;
      params = Metro.Support.Object.extend({}, route.defaults, request.query || {}, request.body || {});
      match = match.slice(1);
      for (i = 0, _len = match.length; i < _len; i++) {
        capture = match[i];
        params[keys[i].name] = capture ? decodeURIComponent(capture) : null;
      }
      controller = route.controller;
      if (controller) params.action = controller.action;
      request.params = params;
      if (controller) {
        controller = new Metro.constant(Metro.namespaced(route.controller.className));
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

  module.exports = Metro.Middleware.Router;
