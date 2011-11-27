(function() {
  var qs, url;

  url = require('url');

  qs = require('qs');

  Metro.Middleware.Query = (function() {

    function Query(request, response, next) {
      if (this.constructor !== Metro.Middleware.Query) {
        return new Metro.Middleware.Query(request, response, next);
      }
      request.uri = url.parse(request.url);
      request.query = ~request.url.indexOf('?') ? qs.parse(request.uri.query) : {};
      if (next != null) next();
    }

    return Query;

  })();

  module.exports = Metro.Middleware.Query;

}).call(this);
