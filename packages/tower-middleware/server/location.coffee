Tower.MiddlewareLocation = (request, response, next) ->
  response.cacheControl ||= {}

  unless request.location
    if request.url.match(/^http/)
      url = request.url
    else
      url = "http://#{request.headers.host}#{request.url}"

    request.location = new Tower.NetUrl(url)

  next()

module.exports = Tower.MiddlewareLocation
