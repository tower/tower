class Dispatcher
  @emit: (name, options = {}) ->
    Metro.emit(name, @, options)
  
  @on: (name, callback) ->
    Metro.on(name, @, callback)
    
  emit: (name, options) ->
    Metro.emit(name, @options)
  
  on: (name, callback) ->
    Metro.on(name, @, callback)
    
  
