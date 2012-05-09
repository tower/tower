Tower.HTTP.Agent::request = (method, path, options, callback) ->
  if typeof options == "function"
    callback  = options
    options   = {}
  options   ||= {}
  headers     = options.headers || {}
  params      = options.params  || {}
  
  History.pushState
