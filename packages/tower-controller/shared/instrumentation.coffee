# @mixin
Tower.ControllerInstrumentation =
  InstanceMethods:
    # Called when the route for this controller is found.
    call: (request, response, next) ->
      @request  = request
      @response = response
      @params   = request.params   || {}
      @cookies  = request.cookies  || {}
      @query    = request.query    || {}
      @session  = request.session  || {}
      params    = @params
      # tmp, but need to think about his more
      params.conditions = JSON.parse(params.conditions) if typeof params.conditions == 'string'

      unless params.format
        accept = @request?.headers?['accept']
        acceptFormat = accept?.split(',')

        if accept is undefined
          try params.format = require('mime').extension(request.header('content-type'))
        else
          try params.format = require('mime').extension(acceptFormat[0])

        params.format ||= 'html'
        params.format = 'html' if params.format.toLowerCase() == 'form' # @todo tmp hack

      # @todo maybe move this into middleware (merging files with params)
      if files = request.files
        # {"profile": {"coverImage": {path: '/tmp/123.png'}, "attachments": [{path: '/tmp/456.png'}]}}
        # key == "profile"
        # value == {"coverImage": {path: '/tmp/123.png'}, "attachments": [{path: '/tmp/456.png'}]}
        for key, value of files
          params[key] ||= {} # "profile"
          Tower._.extend(params[key], value)

      @format   = params.format
      @action   = params.action
      @headers  = {}
      @callback = next
      @process()

    process: ->
      # hacking in logging for now
      unless Tower.env.match(/(test|production)/)
        console.log "  Processing by #{@constructor.className()}##{@action} as #{@format.toUpperCase()} (#{@request.method})"
        console.log "  Parameters:", @params

      block = (callback) =>
        try
          @[@action].call @, callback
        catch error
          callback(error)

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

module.exports = Tower.ControllerInstrumentation
