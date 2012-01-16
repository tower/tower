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
    
  respondTo: ->
  
  respondWith: ->
    args      = Tower.Support.Array.args(arguments)
    callback  = null
    
    if typeof(args[args.length - 1]) == "function"
      callback  = args.pop()
      
    if typeof(args[args.length - 1]) == "object" && !(args[args.length - 1] instanceof Tower.Model)
      options   = args.pop()
    else
      options   = {}
      
    if callback
      callback.call @
    else
      data        = args
      
      switch(@format)
        when "json"
          @render json: data
        when "xml"
          @render xml: data
        else
          @render action: @params.action
          
  _mimesForAction: ->
    action  = @action
    
    result  = []
    mimes   = @constructor.mimes()
    
    for mime, config of mimes
      success = false
      
      if config.except
        success = !action.in?(config[:except])
      elsif config.only
        success = action.in?(config[:only])
      else
        success = true
      
      result.push mime if success
      
    result
    
module.exports = Tower.Controller.Responding
