require '../lib/tower'
File  = require('pathfinder').File
# require './secrets'

global.chai   = require 'chai'
global.assert = chai.assert
global.expect = chai.expect
global.test   = it
global.sinon  = require 'sinon'
global.async  = require 'async'

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

Tower.request = (method, action, options, callback) ->
  if typeof options == "function"
    callback      = options
    options       = {}
  options       ||= {}
  params          = _.extend {}, options
  params.action   = action
  url             = "http://example.com/#{action}"
  location        = new Tower.Dispatch.Url(url)
  controller      = options.controller || new App.CustomController()
  delete options.controller
  request         = new Tower.Dispatch.Request(url: url, location: location, method: method)
  response        = new Tower.Dispatch.Response(url: url, location: location, method: method)
  request.params  = params
  # extend actual http request to make this fully realistic!
  #Tower.Application.instance().handle request, response, ->
  #  console.log response.controller
  controller.call request, response, (error, result) ->
    callback.call @, @response

# redirectTo action: "show"
Tower.Controller::redirectTo = (options = {}) ->
  callback  = @callback
  
  if typeof options == "string"
    string  = options
    options = {}
    if string.match(/[\/:]/)
      options.path    = string
    else
      options.action  = string
      
  if options.action
    options.path = switch options.action
      when "show"
        "show"
      else
        options.action
        
  params = @params
  params.id = @resource.get("id") if @resource
  
  process.nextTick =>
    if params.hasOwnProperty("id")
      params = {id: params.id}
    else
      params = {}
      
    Tower.get options.path, params, callback

Tower.Application.instance().initialize()

require "#{Tower.root}/app/controllers/customController"
#Tower.Store.MongoDB.initialize()
# You must either "extends X" or create a constructor: -> super
# so that coffeescript generates a callback to the parent class!
i = 0
before (done) ->
  Tower.Store.MongoDB.initialize ->
    done()
    
beforeEach ->
  #Tower.Application.instance().teardown()
  Tower.Application.instance().initialize()
  Tower.root          = process.cwd() + "/test/test-app"
  Tower.publicPath    = Tower.root + "/public"
  Tower.View.engine = "coffee"
  Tower.View.store().loadPaths = ["test/test-app/app/views"]
  
  models = File.files("#{Tower.root}/app/models")
  for model in models
    require(model) if File.exists(model)
    
  controllers = File.files("#{Tower.root}/app/controllers")
  for controller in controllers
    require(controller) if File.exists(controller)

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