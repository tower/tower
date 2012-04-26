(function() {

  Tower.Middleware.Location = function(request, response, next) {
    var url;
    if (!request.location) {
      if (request.url.match(/^http/)) {
        url = request.url;
      } else {
        url = "http://" + request.headers.host + request.url;
      }
      request.location = new Tower.HTTP.Url(url);
    }
    return next();
  };

  module.exports = Tower.Middleware.Location;

}).call(this);
