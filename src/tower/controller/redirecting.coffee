Tower.Controller.Redirecting =
  redirectTo: ->
    @redirect arguments...

  # @todo, better url extraction
  redirect: ->
    try
      args      = Tower.Support.Array.args(arguments)
      options   = Tower.Support.Array.extractOptions(args)
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
