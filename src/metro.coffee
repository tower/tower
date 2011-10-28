module.exports        = global.Metro = Metro = {}

Metro.Support         = require './metro/support'

Metro.Asset           = require './metro/asset'
Metro.Application     = require './metro/application'
Metro.Store           = require './metro/store'
Metro.Model           = require './metro/model'
Metro.View            = require './metro/view'
Metro.Controller      = require './metro/controller'
Metro.Route           = require './metro/route'
Metro.Presenter       = require './metro/presenter'
Metro.Middleware      = require './metro/middleware'
Metro.Command         = require './metro/command'
Metro.Generator       = require './metro/generator'
Metro.Spec            = require './metro/spec'

Metro.configuration   = null
Metro.logger          = new (require("common-logger"))(colorized: true)
Metro.root            = process.cwd()
Metro.public_path     = process.cwd() + "/public"
Metro.env             = "test"
Metro.port            = 1597
Metro.cache           = null
Metro.version         = "0.2.0"
Metro.configure = (callback) ->
  callback.apply(@)

Metro.env = -> 
  process.env()

Metro.application = ->
  Metro.Application.instance()

Metro.globalize = ->
  # add it to the function prototype!
  for key, value of Metro.Support.Class
    Function.prototype[key] = value

Metro.raise = ->
  args    = Array.prototype.slice.call(arguments)
  path    = args.shift().split(".")
  message = Metro.locale.en
  message = message[node] for node in path
  i       = 0
  message = message.replace /%s/g, -> args[i++]
    #object = args[i++]
    #if typeof(object) == "string" then object else require('util').inspect(object)
  throw new Error(message)
  
Metro.initialize  = Metro.Application.initialize
Metro.teardown    = Metro.Application.teardown

Metro.locale =
  en:
    errors:
      missing_callback: "You must pass a callback to %s."
      missing_option: "You must pass in the '%s' option to %s."
      not_found: "%s not found."
      store:
        missing_attribute: "Missing %s in %s for '%s'"
      asset:
        notFound: "Asset not found: '%s'\n  Lookup paths: [\n%s\n  ]"

Metro.engine = (extension) ->
  @_engine ?= {}
  @_engine[extension] ?= switch extension
    when "less" then new (require("shift").Less)
    when "styl", "stylus" then new (require("shift").Stylus)
    when "coffee", "coffee-script" then new (require("shift").CoffeeScript)
    when "jade" then new (require("shift").Jade)
    when "mustache" then new (require("shift").Mustache)