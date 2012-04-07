# @mixin
Tower.Controller.Responding =
  ClassMethods:
    # Defines mime types that are rendered by default when invoking {#respondWith}.
    # 
    # @example
    #   @respondTo "html", "json", "csv", "pdf"
    # 
    # @example Only certain actions
    #   @respondTo "json", only: "edit"
    # 
    # @example Except certain actions
    #   @respondTo "json", except: ["create", "destroy"]
    # 
    # @return [Function] Return this controller.
    respondTo: ->
      mimes     = @mimes()
      args      = _.args(arguments)

      if typeof args[args.length - 1] == "object"
        options = args.pop()
      else
        options = {}

      only      = _.toArray(options.only) if options.only
      except    = _.toArray(options.except) if options.except

      for name in args
        mimes[name]         = {}
        mimes[name].only    = only if only
        mimes[name].except  = except if except

      @

    mimes: ->
      @metadata().mimes
  
  InstanceMethods:
    # Build a responder.
    # 
    # @example
    #   index: ->
    #     App.User.all (error, users) =>
    #       @respondTo (format) =>
    #         format.html()
    #         format.json => @render json: users
    # 
    # @param [Function] block
    # 
    # @return [void] Requires a block.
    respondTo: (block) ->
      Tower.Controller.Responder.respond(@, {}, block)

    # A more robust responder.
    # 
    # Wraps a resource around a responder for default representation. 
    # First it invokes {#respondTo}, and if a response cannot be found 
    # (ie. no block for the request was given and template was not available), 
    # it instantiates a {Tower.Controller.Responder} with the controller and resource.
    # 
    # @example
    #   index: ->
    #     App.User.all (error, users) =>
    #       @respondWith(users)
    # 
    # @example With simple handler
    #   index: ->
    #     App.User.all (error, users) =>
    #       @respondWith users, (format) =>
    #         format.html()
    #         format.json => @render json: users
    # 
    # @example With success and failure handlers
    #   index: ->
    #     App.User.all (error, users) =>
    #       @respondWith users, (success, failure) =>
    #         success.json => @render json: users
    #         failure.json => @render text: "Error!", status: 404
    respondWith: ->
      args      = _.args(arguments)
      callback  = null

      if typeof(args[args.length - 1]) == "function"
        callback  = args.pop()

      if typeof(args[args.length - 1]) == "object" && !(args[args.length - 1] instanceof Tower.Model)
        options   = args.pop()
      else
        options   = {}

      options ||= {}

      options.records = args[0]

      Tower.Controller.Responder.respond(@, options, callback)

    # @private
    _mimesForAction: ->
      action  = @action

      result  = []
      mimes   = @constructor.mimes()

      for mime, config of mimes
        success = false

        if config.except
          success = !_.include(config.except, action)
        else if config.only
          success = _.include(config.only, action)
        else
          success = true

        result.push mime if success

      result

module.exports = Tower.Controller.Responding
