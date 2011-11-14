(function() {
  var qs, url;
  url = require('url');
  qs = require('qs');
  Metro.Middleware.Query = (function() {
    function Query() {}
    Query.middleware = function(request, result, next) {
      return (new Metro.Middleware.Query).call(request, result, next);
    };
    Query.prototype.call = function(request, response, next) {
      request.uri = url.parse(request.url);
      request.query = ~request.url.indexOf('?') ? qs.parse(request.uri.query) : {};
      if (next != null) {
        return next();
      }
    };
    return Query;
  })();
  module.exports = Metro.Middleware.Query;
}).call(this);
