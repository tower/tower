global._ = require 'underscore'
_.mixin(require("underscore.string"))

module.exports = global.Metro = Metro = {}

require './metro/support'
require './metro/application'
require './metro/store'
require './metro/model'
require './metro/view'
require './metro/controller'
require './metro/route'
require './metro/middleware'
require './metro/command'
require './metro/generator'
require './metro/spec'

Metro.configuration   = null
Metro.logger          = new (require("common-logger"))(colorized: true)
Metro.root            = process.cwd()
Metro.publicPath      = process.cwd() + "/public"
Metro.env             = "test"
Metro.port            = 1597
Metro.cache           = null
Metro.version         = "0.2.0"
Metro.configure = (callback) ->
  callback.apply(@)

Metro.application = -> Metro.Application.instance

Metro.run = (argv) ->
  (new Metro.Command.Server(argv)).run()

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
  
Metro.initialize  = -> Metro.Application.initialize()
Metro.teardown    = -> Metro.Application.teardown()

# http://nodejs.org/docs/v0.3.1/api/http.html#response.headers
Metro.get = ->
  Metro.application().client().get

Metro.locale =
  en:
    errors:
      missingCallback: "You must pass a callback to %s."
      missingOption: "You must pass in the '%s' option to %s."
      notFound: "%s not found."
      store:
        missingAttribute: "Missing %s in %s for '%s'"
      asset:
        notFound: "Asset not found: '%s'\n  Lookup paths: [\n%s\n  ]"