
  Coach.Middleware.Location = function(request, response, next) {
    request.location || (request.location = new Coach.Net.Url(request.url.match(/^http/) ? request.url : "http://" + request.headers.host + request.url));
    return next();
  };

  module.exports = Coach.Middleware.Location;
