class Configuration
  env: 
    -> process.env()
    
  @bootstrap: ->
    require("#{Metro.root}/config/application")
    Metro.Routes.bootstrap()
    Metro.Models.bootstrap()
    Metro.Views.bootstrap()
    Metro.Controllers.bootstrap()
    Metro.Application.instance()
  
  configure: (callback) ->
    callback.apply(@)
    
  @configuration:  null
  @logger:         new (require("common-logger"))(colorized: true)
  @root:           process.cwd()
  @public_path:    process.cwd() + "/public"
  @env:            "test"
  @port:           1597
  @cache:          null
  @version:        "0.2.0"

  @locale:
    en:
      errors:
        missing_callback: "You must pass a callback to %s."
        not_found: "%s not found."

  @raise: ->
    args    = Array.prototype.slice.call(arguments)
    path    = args.shift().split(".")
    message = Metro.locale.en
    message = message[node] for node in path
    i       = 0
    message = message.replace /%s/g, -> args[i++]
    throw new Error(message)

  @application: ->
    Metro.Application.instance()

  @assets: -> 
    Metro.Application.instance().assets()

  @configure:  (callback) ->
    self   = @
    config = assets: {}
    callback.apply(config)
    for key of config
      switch key
        when "assets"
          for asset_key of config[key]
            self.Assets.config[asset_key] = config[key][asset_key]

  @eventEmitter: new process.EventEmitter

  @on: (name, callback) ->
    @eventEmitter.on(name, callback)

  @emit: (name, dispatcher, options = {}) ->
    options.dispatcher = dispatcher
    @eventEmitter.emit(name, options)
  
module.exports = Configuration
