(function() {

  Tower.Middleware.Cookies = function(request, response, next) {
    return request._cookies || (request._cookies = Tower.HTTP.Cookies.parse());
  };

  module.exports = Tower.Middleware.Cookies;

}).call(this);
