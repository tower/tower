# https://raw.github.com/plessbd/superagent/f6e7a85555bbd1a70babf62b4d0c0ec674f3d2f5/lib/node/index.js
Tower.start = (port, callback) ->
  if typeof port == 'function'
    callback  = port
    port      = undefined
    
  Tower.port = port || 3001
  
  Tower.Application.instance().server.listen Tower.port, callback
  
Tower.stop = ->
  Tower.port = 3001
  delete Tower.Controller.testCase
  Tower.Application.instance().server.close()

Tower.modules.superagent.Request::make = (callback) ->
  @end (response) ->
    controller = Tower.Controller.testCase
    if controller
      response.controller = controller
      callback.call controller, response
    else
      callback.call @, response

_.get     = ->
  _.request "get", arguments...
  
_.post    = ->
  _.request "post", arguments...
  
_.head    = ->
  _.request "head", arguments...
  
_.put     = ->
  _.request "put", arguments...
  
_.destroy = ->
  _.request "del", arguments...

_.request = (method, path, options, callback) ->
  if typeof options == "function"
    callback  = options
    options   = {}
  options   ||= {}
  headers     = options.headers || {}
  params      = options.params  || {}
  redirects   = options.redirects || 5
  auth        = options.auth
  format      = options.format# || "form-data"
  
  newRequest = Tower.modules.superagent[method.toLowerCase()]("http://localhost:#{Tower.port}#{path}")
    .set(headers)
    .send(params)
    .redirects(redirects)
  
  newRequest = newRequest.auth(auth.username, auth.password) if auth
  
  newRequest = newRequest.type(format) if format
  
  if callback
    newRequest.make(callback)
  else
    newRequest