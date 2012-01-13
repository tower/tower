
Tower.Middleware.Cookies = function(request, response, next) {
  return request._cookies || (request._cookies = Tower.Dispatch.Cookies.parse());
};
