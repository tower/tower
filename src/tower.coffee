require 'underscore.logger'

module.exports  = global.Tower = Tower = new (class Tower)

Tower.logger    = _console

require './tower/support'
require './tower/event'
require './tower/application/server'
require './tower/application/configuration'
require './tower/store'
require './tower/model'
require './tower/view'
require './tower/controller'
require './tower/http'
require './tower/middleware'
require './tower/command'
require './tower/generator'

Tower.root                = process.cwd()
Tower.publicPath          = process.cwd() + "/public"
Tower.publicCacheDuration = 60 * 1000
Tower.View.store(new Tower.Store.FileSystem(["app/views"]))
Tower.sessionSecret       = "tower-session-secret"
Tower.cookieSecret        = "tower-cookie-secret"
Tower.render              = (string, options = {}) ->
  Shift.render(options.type, string, options)
  
Tower.domain              = "localhost"

Tower.run = (argv) ->
  (new Tower.Command.Server(argv)).run()

