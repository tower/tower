Metro.Controller.Responding =
  ClassMethods:
    respondTo: ->
      @_respondTo ||= []
      @_respondTo = @_respondTo.concat(Metro.Support.Array.args(arguments))
    
  respondWith: ->
    data  = arguments[0]
    if arguments.length > 1 && typeof(arguments[arguments.length - 1]) == "function"
      callback = arguments[arguments.length - 1]
      
    switch(@format)
      when "json"
        @render json: data
      when "xml"
        @render xml: data
      else
        @render action: @action
    
module.exports = Metro.Controller.Responding
