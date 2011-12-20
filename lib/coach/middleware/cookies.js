
  Coach.Middleware.Cookies = function(request, response, next) {
    return request._cookies || (request._cookies = Coach.Net.Cookies.parse());
  };
