_path     = require('path')
fs        = require('fs')

if process.env.TOWER_COMMAND == 'new'
  # this is to speed up the app generator, which doesn't need ember.
  module.exports  = global.Tower = {isNew: true, toString: -> 'Tower'}
else
  # until ember supports npm...
  require 'ember-metal-node'
  require 'ember-runtime-node'
  require 'ember-states-node'
  module.exports  = global.Tower = Ember.Namespace.create()

# @todo inject this into generated file rather than reading it on startup
Tower.version = JSON.parse(fs.readFileSync(_path.normalize("#{__dirname}/../../package.json"))).version

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
  crypto:     -> require('crypto')
  mkdirp:     -> require('mkdirp')

Tower._ = require 'underscore' # takes 15-20ms just to load underscore
Tower._.mixin(require('underscore.string')) # add this takes 30ms

require '../tower-support/server'

unless Tower.isNew
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

global._  = Tower._

_.extend Tower,
  watch: true
  publicCacheDuration: 60 * 1000
  domain: 'localhost'
  defaultEncoding: 'utf-8'
  logger: console
  pathSeparator: _path.sep
  pathSeparatorEscaped: _.regexpEscape(_path.sep)
  pathRegExp: new RegExp(_.regexpEscape(_path.sep), 'g')

  render: (string, options = {}) ->
    Tower.modules.mint.render(options.type, string, options)

  joinPath: ->
    _path.join(arguments...)

  run: (argv) ->
    Tower.Command.load('server')
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
  # @todo doesn't need to be calculated on `tower new app`
  setRoot: (path) ->
    path ||= process.env.TOWER_ROOT

    unless path # figure out one
      path = process.cwd()
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
