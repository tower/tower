# @todo
Tower.Support.Callbacks =
  ClassMethods:
    # 
    #     @before "save", "doAction"
    #     @before "save", "doAction", if: true
    #     @before "save", ->
    #     @before "setCurrentUser"
    before: ->
      @appendCallback "before", arguments...
      
    after: ->
      @appendCallback "after", arguments...
      
    callback: ->
      @appendCallback arguments...
      
    removeCallback: (action, phase, run) ->
      @
      
    appendCallback: (phase) ->
      {method, options, filters}  = @_callbackArgs(Tower.Support.Array.args(arguments, 1))
      
      callbacks   = @callbacks()
      
      for filter in filters
        callback = callbacks[filter] ||= new Tower.Support.Callbacks.Chain
        callback.push phase, method, options
        
      @
      
    prependCallback: (action, phase, run, options = {}) ->
      @
      
    _callbackArgs: (args) ->
      if typeof args[args.length - 1] == "function"
        method    = args.pop()
      if typeof args[args.length - 1] == "object"
        options   = args.pop()
      options   ||= {}
      method      = args.pop()
      
      method: method, options: options, filters: args
      
    callbacks: ->
      @_callbacks ||= {}
      
  # runCallbacks "save", ->
  runCallbacks: (kind, block) ->
    chain = @constructor.callbacks()[kind]
    if chain
      chain.run(@, block)
    else
      block.call @
      
class Tower.Support.Callbacks.Chain
  constructor: (options = {}) ->
    @[key] = value for key, value of options

    @before ||= []
    @after  ||= []

  run: (binding, block) ->
    runner    = (callback, next) => callback.run(binding, next)
    
    async     = Tower.async
    
    async.forEachSeries @before, runner, (error) =>
      unless error
        block.call binding, (error) =>
          unless error
            async.forEachSeries @after, runner, (error) =>
              binding
    
  push: (phase, method, filters, options) ->
    @[phase].push new Tower.Support.Callback(method, filters, options)
    
class Tower.Support.Callback
  constructor: (method, options = {}) ->
    @method   = method
    @options  = options
    
  run: (binding, next) ->
    method  = @method
    method  = binding[method] if typeof method == "string"
    
    switch method.length
      when 0
        result = method.call binding
        next(if !result then new Error("Callback did not pass") else null)
      else
        method.call binding, next

module.exports = Tower.Support.Callbacks
