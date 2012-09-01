require 'tower'

global.chai     = require 'chai'
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

# Initialize the app before everything.
before (done) ->
  app.initialize done

# Run this before each action
beforeEach (done) ->
  if Tower.isClient
    Tower.StoreMemory.clean(done)
  else
    Tower.StoreMongodb.clean(done)
