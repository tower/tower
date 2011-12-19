require 'underscore.logger'

module.exports  = global.Coach = Coach = new (class Coach)

Coach.logger    = _console

require './coach/support'
require './coach/event'
require './coach/application/server'
require './coach/application/configuration'
require './coach/store'
require './coach/model'
require './coach/view'
require './coach/controller'
require './coach/net'
require './coach/middleware'
require './coach/command'
require './coach/generator'

Coach.root                = process.cwd()
Coach.publicPath          = process.cwd() + "/public"
Coach.publicCacheDuration = 60 * 1000
Coach.View.store(new Coach.Store.FileSystem(["app/views"]))
Coach.sessionSecret       = "coach-session-secret"
Coach.cookieSecret        = "coach-cookie-secret"
Coach.render              = (string, options = {}) ->
  Shift.render(options.type, string, options)
  
Coach.domain              = "localhost"

Coach.run = (argv) ->
  (new Coach.Command.Server(argv)).run()
