(function() {
  var Params, exports, qs, url;
  url = require('url');
  qs = require('qs');
  Params = (function() {
    function Params() {}
    Params.middleware = function(request, result, next) {
      return (new Params).call(request, result, next);
    };
    Params.prototype.call = function(request, response, next) {
      request.query = ~request.url.indexOf('?') ? qs.parse(url.parse(request.url).query) : {};
      if (next != null) {
        return next();
      }
    };
    return Params;
  })();
  exports = module.exports = Params;
}).call(this);
