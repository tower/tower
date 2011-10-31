url = require('url')
qs  = require('qs')

class Metro.Middleware.Query
  @middleware: (request, result, next) -> (new Metro.Middleware.Query).call(request, result, next)
  
  call: (request, response, next) ->
    request.uri   = url.parse(request.url)
    request.query = if ~request.url.indexOf('?') then qs.parse(request.uri.query) else {}
    next() if next?
    
module.exports = Metro.Middleware.Query
