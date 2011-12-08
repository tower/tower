
  Metro.Middleware.Location = function(request, response, next) {
    request.location || (request.location = new Metro.Net.Url(request.url));
    return next();
  };

  module.exports = Metro.Middleware.Location;
