require 'underscore.logger'

module.exports  = global.Metro = Metro = new (class Metro)

Metro.logger    = _console

require './metro/support'
require './metro/event'
require './metro/application'
require './metro/application/server'
require './metro/configuration'
require './metro/store'
require './metro/model'
require './metro/view'
require './metro/controller'
require './metro/route'
require './metro/middleware'
require './metro/command'
require './metro/generator'
require './metro/spec'

Metro.root            = process.cwd()
Metro.publicPath      = process.cwd() + "/public"
Metro.teardown        = -> Metro.Application.teardown()

Metro.run = (argv) ->
  (new Metro.Command.Server(argv)).run()
