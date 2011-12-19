Coach.Middleware.Location = (request, response, next) ->
  request.location ||= new Coach.Net.Url(if request.url.match(/^http/) then request.url else "http://#{request.headers.host}#{request.url}")
  next()
  
module.exports = Coach.Middleware.Location
