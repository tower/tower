(function() {
  var Router, exports;
  Router = (function() {
    function Router() {}
    Router.middleware = function(request, result, next) {
      return (new Router).call(request, result, next);
    };
    Router.prototype.calling = function(request, result, next) {
      var body, renderer;
      console.log("CALLED");
      renderer = new Metro.View.Renderer;
      body = renderer.render("" + Metro.root + "/app/views/posts/index", {
        type: "jade"
      });
      res.setHeader('Content-Length', body.length);
      res.end(body);
      return next();
    };
    Router.prototype.call = function(request, response, next) {
      var route, routes, _i, _len;
      routes = Metro.Application.routes();
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        route = routes[_i];
        if (route.matches(request)) {
          route.call(request, response);
          break;
        }
      }
      if (next != null) {
        return next();
      }
    };
    return Router;
  })();
  exports = module.exports = Router;
}).call(this);
