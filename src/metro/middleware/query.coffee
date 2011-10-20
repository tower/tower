url = require('url')
qs  = require('qs')

class Query
  @middleware: (request, result, next) -> (new Query).call(request, result, next)
  
  call: (request, response, next) ->
    request.uri   = url.parse(request.url)
    request.query = if ~request.url.indexOf('?') then qs.parse(request.uri.query) else {}
    next() if next?
    
module.exports = Query
