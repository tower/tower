var Query, qs, url;
url = require('url');
qs = require('qs');
Query = (function() {
  function Query() {}
  Query.middleware = function(request, result, next) {
    return (new Query).call(request, result, next);
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
module.exports = Query;