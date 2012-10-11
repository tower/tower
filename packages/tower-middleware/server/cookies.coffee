Tower.MiddlewareCookies = (request, response, next) ->
  request._cookies ||= Tower.NetCookies.parse()
