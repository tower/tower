require '../lib/tower'
File  = require('pathfinder').File
# require './secrets'

Tower.root            = process.cwd() + "/spec/spec-app"
Tower.publicPath      = Tower.root + "/public"
Tower.env             = "test"
Tower.View.loadPaths  = ["./spec/spec-app/app/views"]

Tower.Application.instance().initialize()
# You must either "extends X" or create a constructor: -> super
# so that coffeescript generates a callback to the parent class!

beforeEach ->
  Tower.Application.instance().teardown()
  Tower.Application.instance().initialize()
  Tower.root          = process.cwd() + "/spec/spec-app"
  Tower.publicPath    = Tower.root + "/public"
  
  models = File.files("#{Tower.root}/app/models")
  for model in models
    require(model) if File.exists(model)
