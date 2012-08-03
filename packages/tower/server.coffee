# until ember supports npm...
require 'ember-metal-node'
require 'ember-runtime-node'
require 'ember-states-node'

require 'underscore.logger'

global._ = require 'underscore'
_.mixin(require('underscore.string'))

module.exports  = global.Tower = Tower = Ember.Namespace.create()

# reads and sets the latest version on startup
Tower.version = JSON.parse(require('fs').readFileSync(require('path').normalize("#{__dirname}/../../package.json"))).version

Tower.logger    = _console

# external libraries, to get around having to use `require` in the browser.
Tower.modules =
  validator:  require 'validator'
  accounting: require 'accounting'
  moment:     require 'moment'
  geo:        require 'geolib'
  inflector:  require 'inflection'
  async:      require 'async'
  superagent: require 'superagent'
  mime:       require 'mime'
  mint:       require 'mint'
  kue:        try require 'kue'
  coffeecup:  require 'coffeecup'
  socketio:   try require 'socket.io'
  sockjs:     try require 'sockjs'
  _:          _

require '../tower-support/server'
require '../tower-application/server'
require '../tower-store/server'
require '../tower-model/server'
require '../tower-view/server'
require '../tower-controller/server'
require '../tower-net/server'
require '../tower-mailer/server'
require '../tower-middleware/server'
require '../tower-command/server'
require '../tower-generator/server'

Tower.watch = true

Tower.View.store(new Tower.Store.FileSystem(['app/views']))
Tower.root                = process.cwd()
Tower.publicPath          = process.cwd() + '/public'
Tower.publicCacheDuration = 60 * 1000
Tower.render              = (string, options = {}) ->
  Tower.modules.mint.render(options.type, string, options)

Tower.domain              = 'localhost'

Tower.run = (argv) ->
  (new Tower.Command.Server(argv)).run()
