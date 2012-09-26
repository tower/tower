global.chai     = require "chai"
global.assert   = chai.assert
global.expect   = chai.expect
global.sinon    = require 'sinon'
global.test     = it
global.cb       = true # some library has a global leak...
