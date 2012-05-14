Tower.HTTP.Agent::request = (method, path, options, callback) ->
  if typeof options == "function"
    callback      = options
    options       = {}
  options       ||= {}
  url             = path
  
  History.pushState(null, null, url)
