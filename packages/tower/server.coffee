# until ember supports npm...
require 'ember-metal-node'
require 'ember-runtime-node'
require 'ember-states-node'

_path = require('path')
fs    = require('fs')

# @todo actually remove warning in pathfinder module
_path.existsSync = fs.existsSync

global._ = require 'underscore'
_.mixin(require('underscore.string'))

module.exports  = global.Tower = Tower = Ember.Namespace.create()

# reads and sets the latest version on startup
Tower.version = JSON.parse(fs.readFileSync(_path.normalize("#{__dirname}/../../package.json"))).version

Tower.logger    = console

# @todo put in a better place
Tower.defaultEncoding = 'utf-8'

# External libraries, to get around having to use `require` in the browser.
# 
# They are lazy-loaded, to improve perceived startup time.
Tower._modules =
  validator:  -> require 'validator'
  accounting: -> require 'accounting'
  moment:     -> require 'moment'
  geo:        -> require 'geolib'
  inflector:  -> require 'inflection'
  async:      -> require 'async'
  superagent: -> require 'superagent'
  mime:       -> require 'mime'
  mint:       -> require 'mint'
  kue:        -> require 'kue'
  coffeecup:  -> require 'coffeecup'
  socketio:   -> try require 'socket.io'
  sockjs:     -> try require 'sockjs'
  _:          -> _
  wrench:     -> require 'wrench'
  File:       -> require('pathfinder').File

require '../tower-support/server'
#require '../tower-application/server'
#require '../tower-store/server'
#require '../tower-model/server'
#require '../tower-view/server'
#require '../tower-controller/server'
#require '../tower-net/server'
#require '../tower-mailer/server'
#require '../tower-middleware/server'
require '../tower-command/server'
require '../tower-generator/server'

_.extend Tower,
  watch: true
  publicCacheDuration: 60 * 1000
  domain: 'localhost'
  pathSeparator: _path.sep
  pathSeparatorEscaped: _.regexpEscape(_path.sep)
  pathRegExp: new RegExp(_.regexpEscape(_path.sep), 'g')

  render: (string, options = {}) ->
    Tower.modules.mint.render(options.type, string, options)

  joinPath: ->
    _path.join(arguments...)

  run: (argv) ->
    (new Tower.CommandServer(argv)).run()

  testIfRoot: (path) ->
    # first, the path must exist and be a directory
    return false unless fs.existsSync(path) && fs.statSync(path).isDirectory(path)
    # then check for package.json
    return false unless fs.existsSync(_path.join(path, 'package.json'))
    return false unless fs.existsSync(_path.join(path, 'server.js'))
    # then check for some key directories / files
    for ext in ['coffee', 'js', 'iced']
      return path if fs.existsSync(_path.join(path, "app/config/shared/application.#{ext}"))

    return false

  # It starts off of process.env.TOWER_ROOT or process.cwd(), then
  # works it's way up.
  # 
  # @todo make Tower.root an Ember.computed property
  setRoot: (path) ->
    path ||= (process.env.TOWER_ROOT || process.cwd())
    while !Tower.testIfRoot(path) && path != _path.sep && !path.match(/(?:\\|\/)$/)
      path = _path.join(path, '..')

    Tower.root = path unless path == _path.sep
    
    throw new Error('Could not find Tower.root') unless Tower.root?

    Tower.publicPath = Tower.joinPath(Tower.root, 'public')

    Tower.root

# It will silently set it, so you don't have to explicitly set it.
# But if you want to do things differently than convention, you'll
# have to call `Tower.setRoot(path)` yourself.
try
  Tower.setRoot()
catch error
  console.log error

Tower.View.store(new Tower.StoreFileSystem(['app/templates/shared', 'app/templates/server'])) if Tower.View
