# client cookie parser
Coach.Middleware.Cookies = (request, response, next) ->
  request._cookies ||= Coach.Net.Cookies.parse()