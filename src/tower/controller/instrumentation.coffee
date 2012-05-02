# @mixin
Tower.Controller.Instrumentation =
  InstanceMethods:
    # Called when the route for this controller is found.
    call: (request, response, next) ->
      @request  = request
      @response = response
      @params   = @request.params   || {}
      @cookies  = @request.cookies  || {}
      @query    = @request.query    || {}
      @session  = @request.session  || {}
      
      unless @params.format
        try @params.format = require('mime').extension(@request.header('content-type'))
        @params.format ||= 'html'
        
      @format   = @params.format
      @action   = @params.action
      @headers  = {}
      @callback = next
      @process()

    process: ->
      # hacking in logging for now
      unless Tower.env.match(/(test|production)/)
        console.log "  Processing by #{@constructor.className()}##{@action} as #{@format.toUpperCase()}"
        console.log "  Parameters:"
        console.log @params

      @runCallbacks 'action', name: @action, (callback) =>
        @[@action].call @, callback

    clear: ->
      @request  = null
      @response = null
      #@headers  = null

    metadata: ->
      @constructor.metadata()

module.exports = Tower.Controller.Instrumentation
