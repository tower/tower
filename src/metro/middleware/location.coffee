Metro.Middleware.Location = (request, response, next) ->
  request.location ||= new Metro.Net.Url(request.url)
  next()
  
module.exports = Metro.Middleware.Location
