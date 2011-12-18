Metro.Controller.Processing =
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
    
    if @format && @format != "undefined" && Metro.Support["Path"]
      @contentType = Metro.Support.Path.contentType(@format)
    else
      @contentType = "text/html"
    @process()
    
  process: ->
    @processQuery()
    
    block = (callback) =>
      @[@params.action].call @, callback
    
    @runFilters block, (error) ->
      console.log "ERROR in callback!"
      console.log error
    
  processQuery: ->
  
  clear: ->
    @request  = null
    @response = null
    @headers  = null

module.exports = Metro.Controller.Processing
