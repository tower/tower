require '../index.js'
File  = require('pathfinder').File

# mocha $(find test -name "*attributesTest.coffee") --store mongodb
store = require('commander').option('--store [name]', 'Store to run tests against', 'memory').parse(process.argv).store

console.log "Running tests with #{store} store"

Tower.store = Tower.Store[_.camelize(store)]

global.chai   = require 'chai'
global.assert = chai.assert
global.expect = chai.expect
global.test   = it
global.sinon  = require 'sinon'
global.async  = require 'async'
global.cb     = true # some library has a global leak...

Tower.root            = process.cwd() + "/test/example"
Tower.publicPath      = Tower.root + "/public"
Tower.env             = "test"
Tower.View.loadPaths  = ["./test/example/app/views"]
Tower.port            = 3001

require '../src/tower/server/generator/tst'

app = Tower.Application.instance()

# tmp until figure out how to test this syncing functionality...
Tower.Net.Connection.reopen(notify: ->)

before (done) ->
  Tower.Model.default('store', Tower.store)

  app.initialize =>
    done()
  # App.Address.store().collection().ensureIndex {coordinates:"2d"}, done

beforeEach (done) ->
  #Tower.Application.instance().teardown()
  Tower.root                    = "#{process.cwd()}/test/example"
  Tower.relativeRoot            = "test/example"
  Tower.publicPath              = "#{Tower.root}/public"
  Tower.View.engine             = "coffee"
  Tower.View.store().loadPaths  = ["test/example/app/views"]
  
  # @todo this doesn't look like it's running every time.
  Tower.Application.instance().initialize =>
    done()

beforeEach (done) ->
  Tower.store.clean =>
    done()

after (done) ->
  return done()
  if process.platform == "darwin" # tmp for travis.ci
    require("child_process").exec "open http://localhost:3000", =>
      done()
  else
    done()