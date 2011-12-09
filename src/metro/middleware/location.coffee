Metro.Middleware.Location = (request, response, next) ->
  request.location ||= new Metro.Net.Url(if request.url.match(/^http/) then request.url else "http://#{request.headers.host}#{request.url}")
  next()
  
module.exports = Metro.Middleware.Location
