(function() {
  var Params, exports, url;
  url = require('url');
  Params = (function() {
    function Params() {}
    Params.middleware = function(request, result, next) {
      return (new Params).call(request, result, next);
    };
    Params.prototype.call = function(request, response, next) {
      var route, routes, _i, _len;
      routes = Metro.Application.routes();
      request.params = url.parse(request.url);
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
    return Params;
  })();
  exports = module.exports = Params;
}).call(this);
