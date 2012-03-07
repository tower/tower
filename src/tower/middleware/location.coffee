Tower.Middleware.Location = (request, response, next) ->
  unless request.location
    if request.url.match(/^http/)
      url = request.url
    else
      url = "http://#{request.headers.host}#{request.url}"
      
    request.location = new Tower.HTTP.Url(url)
    
  next()
  
module.exports = Tower.Middleware.Location
