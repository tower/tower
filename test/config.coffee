require '../lib/tower'
File  = require('pathfinder').File
# require './secrets'

global.chai   = require 'chai'
global.assert = chai.assert
global.expect = chai.expect
global.test   = it
global.sinon  = require 'sinon'
global.async  = require 'async'
global.cb     = true # some library has a global leak...

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
  location        = new Tower.HTTP.Url(url)
  controller      = options.controller || new App.CustomController()
  delete options.controller
  request         = new Tower.HTTP.Request(url: url, location: location, method: method)
  response        = new Tower.HTTP.Response(url: url, location: location, method: method)
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

app = Tower.Application.instance()

before (done) ->
  app.initialize =>
    require "#{Tower.root}/app/models/address"
    
    App.Address.store().collection().ensureIndex {coordinates:"2d"}, done

beforeEach (done) ->
  #Tower.Application.instance().teardown()
  Tower.root          = process.cwd() + "/test/test-app"
  Tower.publicPath    = Tower.root + "/public"
  Tower.View.engine = "coffee"
  Tower.View.store().loadPaths = ["test/test-app/app/views"]
  
  Tower.Application.instance().initialize ->
    require "#{Tower.root}/app/controllers/customController"
    
    models = File.files("#{Tower.root}/app/models")
    
    for model in models
      require(model) if File.exists(model)
    
    controllers = File.files("#{Tower.root}/app/controllers")
    for controller in controllers
      require(controller) if File.exists(controller)
      
    done()
