Tower.Middleware.Cookies = (request, response, next) ->
  request._cookies ||= Tower.Net.Cookies.parse()

module.exports = Tower.Middleware.Cookies
