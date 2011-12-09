
  Metro.Middleware.Location = function(request, response, next) {
    request.location || (request.location = new Metro.Net.Url(request.url.match(/^http/) ? request.url : "http://" + request.headers.host + request.url));
    return next();
  };

  module.exports = Metro.Middleware.Location;
