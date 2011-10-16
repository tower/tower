url = require('url')
qs  = require('qs')

class Body
  @middleware: (request, result, next) -> (new Body).call(request, result, next)
  
  call: (request, response, next) ->
    next() if next?
    
module.exports = Body
