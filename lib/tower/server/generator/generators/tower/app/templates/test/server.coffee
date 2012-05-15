require 'tower'

global.chai     = require "chai"
global.assert   = chai.assert
global.expect   = chai.expect
global.sinon    = require 'sinon'
global.async    = require 'async'
global.test     = it
global.cb       = true # some library has a global leak...
global.factory  = -> Tower.Factory.create(arguments...)
global.urlFor   = Tower.urlFor
global.get      = _.get
global.post     = _.post
global.put      = _.put
global.destroy  = _.destroy

global.app      = Tower.Application.instance()

# initialize the app before everything.
before (done) ->
  app.initialize done

# run this before each action
beforeEach (done) ->
  if Tower.client
    Tower.Store.Memory.clean(done)
  else
    Tower.Store.Mongodb.clean(done)
