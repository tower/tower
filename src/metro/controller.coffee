_ = require("underscore")
_.mixin(require("underscore.string"))

class Controller extends Class
  @Dispatcher: require('./controller/dispatcher')
  
  @bootstrap: ->
    files = require('findit').sync "#{Metro.root}/app/controllers"
    for file in files
      klass = Metro.Asset.File.basename(file).split(".")[0]
      klass = _.camelize("_#{klass}")
      global[klass] = require(file)
  
  @controller_name: ->
    @_controller_name ?= _.underscore(@name)
    
  @helpers: ->
    
  @layout: ->
    
  constructor: ->
    @_headers  = 
      "Content-Type": "text/html"
    @_status   = 200
    @_request  = null
    @_response = null
    @_routes   = null
    
  params: ->
    @_params ?= @request.parameters()
  
  controller_name: ->
    @constructor.controller_name()

exports = module.exports = Controller
