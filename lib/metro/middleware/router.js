(function() {
  var Router, exports, url;
  url = require('url');
  Router = (function() {
    function Router() {}
    Router.middleware = function(request, result, next) {
      return (new Router).call(request, result, next);
    };
    Router.prototype.call = function(request, response, next) {
      var controller, route, routes, _i, _len;
      routes = Metro.Application.routes();
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        route = routes[_i];
        if (route.matches(request) && (controller = route.options.controller != null)) {
          controller = new global[controller.class_name];
          break;
        }
      }
      if (controller) {
        controller.call(request, response);
      }
      if (next != null) {
        return next();
      }
    };
    return Router;
  })();
  exports = module.exports = Router;
}).call(this);
