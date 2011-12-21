Tower.Controller.Responding =
  ClassMethods:
    respondTo: ->
      @_respondTo ||= []
      @_respondTo = @_respondTo.concat(Tower.Support.Array.args(arguments))
    
  respondWith: ->
    args      = Tower.Support.Array.args(arguments)
    callback  = null
    
    if typeof(args[args.length - 1]) == "function"
      callback  = args.pop()
      
    if typeof(args[args.length - 1]) == "object" && !(args[args.length - 1] instanceof Tower.Model)
      options   = args.pop()
    else
      options   = {}
      
    @respond(callback)
    
  respond: (callback) ->
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
          @render action: @action
    
module.exports = Tower.Controller.Responding
