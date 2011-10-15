class Controller extends Class
  @bootstrap: ->
    Metro.Support.load_classes("#{Metro.root}/app/controllers")
  
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
    
  params:     {}
  request:    null
  response:   null
  
  controller_name: ->
    @constructor.controller_name()
  
  call: (request, response, next) ->
    @request  = request
    @response = response
    @process(request.params.action)
    
  process: (action) ->
    @[action]()

exports = module.exports = Controller
