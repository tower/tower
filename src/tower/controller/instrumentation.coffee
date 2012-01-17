Tower.Controller.Instrumentation =
  call: (request, response, next) ->
    @request  = request
    @response = response
    @params   = @request.params || {}
    @cookies  = @request.cookies || {}
    @query    = @request.query || {}
    @session  = @request.session || {}
    @format   = @params.format || "html"
    @action   = @params.action
    @headers  = {}
    @callback = next
    @process()
    
  process: ->
    @processQuery()
    
    @runCallbacks "action", (callback) =>
      @[@action].call @, callback
    
  processQuery: ->
  
  clear: ->
    @request  = null
    @response = null
    @headers  = null

module.exports = Tower.Controller.Instrumentation
