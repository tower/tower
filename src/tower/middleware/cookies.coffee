# client cookie parser
Tower.Middleware.Cookies = (request, response, next) ->
  request._cookies ||= Tower.Dispatch.Cookies.parse()
  
module.exports = Tower.Middleware.Cookies
