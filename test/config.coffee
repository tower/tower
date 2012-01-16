require '../lib/tower'
File  = require('pathfinder').File
# require './secrets'

global.test = it

global.spec =
  startDatabase: ->
  
  cleanDatabase: ->
    
  closeDatabase: ->
    
  clearMemoryDatabase: ->
    User
    
  resetUserStore: (type = "memory") ->
    type = Tower.Support.String.camelize(type)
    
    User.delete()
    User.store(new Tower.Store[type](name: "users", type: "User"))

Tower.root            = process.cwd() + "/spec/spec-app"
Tower.publicPath      = Tower.root + "/public"
Tower.env             = "test"
Tower.View.loadPaths  = ["./spec/spec-app/app/views"]

Tower.Application.instance().initialize()
#Tower.Store.MongoDB.initialize()
# You must either "extends X" or create a constructor: -> super
# so that coffeescript generates a callback to the parent class!
i = 0
beforeEach ->
  Tower.Application.instance().teardown()
  Tower.Application.instance().initialize()
  Tower.root          = process.cwd() + "/spec/spec-app"
  Tower.publicPath    = Tower.root + "/public"
  Tower.View.engine = "coffee"
  Tower.View.store().loadPaths = ["spec/spec-app/app/views"]
  
  models = File.files("#{Tower.root}/app/models")
  for model in models
    require(model) if File.exists(model)

  