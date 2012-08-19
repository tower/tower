_ = Tower._

# @mixin
Tower.ControllerRedirecting =
  InstanceMethods:
    redirectTo: ->
      @redirect arguments...

    # @todo Make this more robust.
    redirect: ->
      try
        args      = _.args(arguments)
        options   = _.extractOptions(args)
        url       = args.shift()

        if !url && options.hasOwnProperty('action')
          url = switch options.action
            when 'index', 'new'
              Tower.urlFor(@resourceType, action: options.action)
            when 'edit', 'show'
              Tower.urlFor(@resource, action: options.action)
        url ||= '/'

        # @todo remove
        # if Tower.env == 'test'
        #   if options.action == 'index'
        #     url = '/custom'
        #   else
        #     url = "/custom/#{@resource.get('id')}"

        @response.redirect url
      catch error
        console.log error
      @callback() if @callback

module.exports = Tower.ControllerRedirecting
