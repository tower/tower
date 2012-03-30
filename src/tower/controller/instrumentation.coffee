# @module
Tower.Controller.Instrumentation =
  
  # Called when the route for this controller is found.
  call: (request, response, next) ->
    @request  = request
    @response = response
    @params   = @request.params   || {}
    @cookies  = @request.cookies  || {}
    @query    = @request.query    || {}
    @session  = @request.session  || {}
    @format   = @params.format    || "html"
    @action   = @params.action
    @headers  = {}
    @callback = next
    @process()

  process: ->
    @processQuery()

    # hacking in logging for now
    unless Tower.env.match(/(test|production)/)
      console.log "  Processing by #{@constructor.name}##{@action} as #{@format.toUpperCase()}"
      console.log "  Parameters:"
      console.log @params

    @runCallbacks "action", name: @action, (callback) =>
      @[@action].call @, callback

  processQuery: ->

  clear: ->
    @request  = null
    @response = null
    @headers  = null

module.exports = Tower.Controller.Instrumentation
