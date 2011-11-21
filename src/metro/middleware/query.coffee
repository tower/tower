url = require('url')
qs  = require('qs')

class Metro.Middleware.Query
  constructor: (request, response, next) ->
    unless @constructor == Metro.Middleware.Query
      return new Metro.Middleware.Query(request, response, next)
    
    request.uri   = url.parse(request.url)
    request.query = if ~request.url.indexOf('?') then qs.parse(request.uri.query) else {}
    next() if next?
    
module.exports = Metro.Middleware.Query
