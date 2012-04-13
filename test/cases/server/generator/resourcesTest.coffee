generator       = null
sourceRoot      = null
destinationRoot = null
File            = require('pathfinder').File
fs              = require 'fs'
wrench          = require 'wrench'
cakefileDestination = null

describe 'Tower.Generator.Resources', ->
  beforeEach ->
    wrench.rmdirSyncRecursive("#{process.cwd()}/test/tmp")
    generator   = new Tower.Generator(silent: true)