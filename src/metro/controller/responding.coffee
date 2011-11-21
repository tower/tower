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
  
  call: (request, response, next) ->
    @request  = request
    @response = response
    @params   = @request.params || {}
    @cookies  = @request.cookies || {}
    @query    = @request.query || {}
    @session  = @request.session || {}
    @format   = @params.format
    @headers  = {}
    @callback = next
    
    if @format && @format != "undefined"
      @contentType = Metro.Support.Path.contentType(@format)
    else
      @contentType = "text/html"
    @process()
    
  process: ->
    @processQuery()
    
    @[@params.action]()
    
  processQuery: ->
  
  clear: ->
    @request  = null
    @response = null
    @headers  = null
    
module.exports = Metro.Controller.Responding
