fs = require('fs')

class Base extends Class
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
    
  render: (context, options) ->
    type      = options.type || Metro.Templates.engine
    path      = "#{context}.#{type}"
    engine    = Metro.Templates.engines[type]
    body      = template.compile fs.readFileSync(), options
    
    @response.setHeader('Content-Length', body.length)
    @response.end(body)

exports = module.exports = Base
