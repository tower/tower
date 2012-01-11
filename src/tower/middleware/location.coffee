Tower.Middleware.Location = (request, response, next) ->
  request.location ||= new Tower.Dispatch.Url(if request.url.match(/^http/) then request.url else "http://#{request.headers.host}#{request.url}")
  next()
  
module.exports = Tower.Middleware.Location
