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
      # tmp, but need to think about his more
      @params.conditions = JSON.parse(@params.conditions) if typeof @params.conditions == 'string'

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
        console.log "  Processing by #{@constructor.className()}##{@action} as #{@format.toUpperCase()} (#{@request.method})"
        console.log "  Parameters:", @params

      block = (callback) =>
        @[@action].call @, callback

      complete = (error) =>
        if error
          # @todo tmp
          console.log "Callback failed", error if Tower.env == 'development'
          @handleError(error)

      @runCallbacks 'action', name: @action, block, complete

    clear: ->
      @request  = null
      @response = null
      #@headers  = null

    metadata: ->
      @constructor.metadata()

module.exports = Tower.Controller.Instrumentation
