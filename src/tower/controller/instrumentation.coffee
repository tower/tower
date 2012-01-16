Tower.Controller.Instrumentation =
  call: (request, response, next) ->
    @request  = request
    @response = response
    @params   = @request.params || {}
    @cookies  = @request.cookies || {}
    @query    = @request.query || {}
    @session  = @request.session || {}
    @format   = @params.format
    @action   = @params.action
    @headers  = {}
    @callback = next
    
    if @format && @format != "undefined" && Tower.Support["Path"]
      @contentType = Tower.Support.Path.contentType(@format)
    else
      @contentType = "text/html"
    
    @process()
    
  process: ->
    @processQuery()
    
    @runCallbacks "action", (callback) =>
      @[@params.action].call @, callback
    
  processQuery: ->
  
  clear: ->
    @request  = null
    @response = null
    @headers  = null

module.exports = Tower.Controller.Instrumentation
