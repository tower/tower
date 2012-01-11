Tower.Controller.Processing =
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
    
    if @format && @format != "undefined" && Tower.Support["Path"]
      @contentType = Tower.Support.Path.contentType(@format)
    else
      @contentType = "text/html"
    @process()
    
  process: ->
    @processQuery()
    
    block = (callback) =>
      @[@params.action].call @, callback
    
    @runCallbacks "action", block
    
  processQuery: ->
  
  clear: ->
    @request  = null
    @response = null
    @headers  = null

module.exports = Tower.Controller.Processing
