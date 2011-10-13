class Base
  constructor: ->
    @_headers  = 
      "Content-Type": "text/html"
    @_status   = 200
    @_request  = null
    @_response = null
    @_routes   = null
    
  params: ->
    @_params ?= @request.parameters()
  
  @controller_name: ->
    _.underscore(@name)
  
  controller_name: ->
    @constructor.controller_name()