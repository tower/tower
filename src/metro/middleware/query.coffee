url = require('url')
qs  = require('qs')

class Query
  @middleware: (request, result, next) -> (new Query).call(request, result, next)
  
  call: (request, response, next) ->
    request.query = if ~request.url.indexOf('?') then qs.parse(url.parse(request.url).query) else {}
    next() if next?
    
exports = module.exports = Query
