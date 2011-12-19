Coach.Event.Callbacks =
  extended: ->
    @callbacks = {}
    
  ClassMethods:
    before: (name, callback) ->
      @defineCallback("before", name, callback)
    
    after: (name, callback) ->
    
    defineCallback: (phase, name, callback) ->
      callbacks = @callbacks[phase] ||= []
      callbacks.push(callback)
      @
  
  InstanceMethods:
    runCallbacks: (name) ->
      callbacks = @constructor.callbacks[name]
      for callback in callbacks
        callback = @[callback] if typeof(callback) == "string"
        return false unless !!callback.call(@)
      true
    
    withCallbacks: (block) ->
      self    = @
      success = self.runCallbacks "before"
      success = block.call self
      success = self.runCallbacks "after"
      success