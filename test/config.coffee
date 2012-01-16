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

Tower.root            = process.cwd() + "/test/test-app"
Tower.publicPath      = Tower.root + "/public"
Tower.env             = "test"
Tower.View.loadPaths  = ["./test/test-app/app/views"]

Tower.Application.instance().initialize()
#Tower.Store.MongoDB.initialize()
# You must either "extends X" or create a constructor: -> super
# so that coffeescript generates a callback to the parent class!
i = 0
beforeEach ->
  Tower.Application.instance().teardown()
  Tower.Application.instance().initialize()
  Tower.root          = process.cwd() + "/test/test-app"
  Tower.publicPath    = Tower.root + "/public"
  Tower.View.engine = "coffee"
  Tower.View.store().loadPaths = ["test/test-app/app/views"]
  
  models = File.files("#{Tower.root}/app/models")
  for model in models
    require(model) if File.exists(model)

###

test 'where(firstName: "=~": "L")'
test 'where(firstName: "$match": "L")'
test 'where(firstName: "!~": "L")'
test 'where(firstName: "!=": "Lance")'
test 'where(firstName: "!=": null)'
test 'where(firstName: "==": null)'
test 'where(firstName: null)'
test 'where(createdAt: ">=": _(2).days().ago())'
test 'where(createdAt: ">=": _(2).days().ago(), "<=": _(1).day().ago())'
test 'where(tags: $in: ["ruby", "javascript"])'
test 'where(tags: $nin: ["java", "asp"])'
test 'where(tags: $all: ["jquery", "node"])'
test 'asc("firstName")'
test 'desc("firstName")'
test 'order(["firstName", "desc"])'
test 'limit(10)'
test 'paginate(perPage: 20, page: 2)'
test 'page(2)'
###