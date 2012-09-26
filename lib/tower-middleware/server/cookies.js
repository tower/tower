
Tower.MiddlewareCookies = function(request, response, next) {
  return request._cookies || (request._cookies = Tower.NetCookies.parse());
};

module.exports = Tower.MiddlewareCookies;
