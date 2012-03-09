###
require '../../config'

generator       = null
sourceRoot      = null
destinationRoot = null
File            = require('pathfinder').File
fs              = require 'fs'

expectGeneratedFile = (path) ->
  expect(File.exists(File.join(destinationRoot, path))).toEqual true

describe 'Tower.Generator.AppGenerator', ->
  beforeEach ->
    sourceRoot      = process.cwd() + "/src/tower/generator/generators/tower/app"
    destinationRoot = process.cwd() + "/test/tmp"
    sourceRoot      = process.cwd() + "/src/tower/generator/generators/tower/app"
    destinationRoot = process.cwd() + "/test/tmp"
    #generator   = new Tower.Generator.AppGenerator(sourceRoot: sourceRoot, destinationRoot: destinationRoot)
    
  test 'create an app', ->
    #generator.run()
    Tower.Command.run(["tower", "new", "myapp"])
###