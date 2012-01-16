Tower.Controller.Responding =
  ClassMethods:
    respondTo: ->
      mimes     = @mimes()
      args      = Tower.Support.Array.args(arguments)
      
      if typeof args[args.length - 1] == "object"
        options = args.pop()
      else
        options = {}
        
      only      = Tower.Support.Object.toArray(options.only) if options.only
      except    = Tower.Support.Object.toArray(options.except) if options.except
      
      for name in args
        mimes[name]         = {}
        mimes[name].only    = only if only
        mimes[name].except  = except if except
      
      @
      
    mimes: ->
      @_mimes ||= {}
    
  respondTo: (block) ->
    Tower.Controller.Responder.respond(@, {}, block)
  
  respondWith: ->
    args      = Tower.Support.Array.args(arguments)
    callback  = null
    
    if typeof(args[args.length - 1]) == "function"
      callback  = args.pop()
      
    if typeof(args[args.length - 1]) == "object" && !(args[args.length - 1] instanceof Tower.Model)
      options   = args.pop()
    else
      options   = {}

    options.records = args

    Tower.Controller.Responder.respond(@, options, callback)
    
  _mimesForAction: ->
    action  = @action
    
    result  = []
    mimes   = @constructor.mimes()
    
    for mime, config of mimes
      success = false
      
      if config.except
        success = !_.include(config.except, action)
      else if config.only
        success = _.include(config.only, action)
      else
        success = true
      
      result.push mime if success
      
    result
    
module.exports = Tower.Controller.Responding
