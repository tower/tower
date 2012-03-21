Tower.Middleware.Cookies = (request, response, next) ->
  request._cookies ||= Tower.HTTP.Cookies.parse()

module.exports = Tower.Middleware.Cookies
