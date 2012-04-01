# @module
Tower.Controller.Redirecting =
  redirectTo: ->
    @redirect arguments...

  # @todo Make this more robust.
  redirect: ->
    try
      args      = _.args(arguments)
      options   = _.extractOptions(args)
      url       = args.shift()
      if !url && options.hasOwnProperty("action")
        url = switch options.action
          when "index", "new"
            Tower.urlFor(@resourceType, action: options.action)
          when "edit", "show"
            Tower.urlFor(@resource, action: options.action)
      url ||= "/"
      @response.redirect url
    catch error
      console.log error
    @callback() if @callback

module.exports = Tower.Controller.Redirecting
