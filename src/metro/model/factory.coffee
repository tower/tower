class Metro.Model.Factory
  @store: ->
    @_store ?= new Metro.Store.Memory
  
  @define: (name, options, callback) ->
    if typeof options == "function"
      callback = options
      options  = {}
    options ?= {}
    
    @store()[name] = [options, callback]
    
  @build: (name, overrides) ->
    attributes = @store()[name][1]()
    
    for key, value of overrides
      attributes[key] = value
    
    new (global[name](attributes))
    
  @create: (name, overrides) ->
    record = @build(name, overrides)
    record.save()
    record
