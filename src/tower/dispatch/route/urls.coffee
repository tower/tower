Tower.Dispatch.Route.Urls =
  ClassMethods:
    urlFor: (options) ->
      switch typeof(options)
        when "string"
          options
        else
          # https://github.com/kieran/barista/blob/master/lib/route.js#L157
          {controller, action, host, port, anchor} = options

module.exports = Tower.Dispatch.Route.Urls
