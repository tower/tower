_ = require("underscore")
_.mixin(require("underscore.string"))

class Base
  @controller_name: ->
    @_controller_name ?= _.underscored(@::constructor.name)
    
  @helper: (object) ->
    @_helpers ?= []
    @_helpers.push(object)
    
  @layout: (layout) ->
    @_layout = layout
    
  constructor: ->
    @headers    = "Content-Type": "text/html"
    @status     = 200
    @request    = null
    @response   = null
  
  params:     {}
  request:    null
  response:   null
  query:      {}
  
  controller_name: ->
    @constructor.controller_name()
  
  call: (request, response, next) ->
    @request  = request
    @response = response
    @params   = @request.params || {}
    @cookies  = @request.cookies || {}
    @query    = @request.query || {}
    @session  = @request.session || {}
    @process()
    
  process: ->  
    @process_query()
    
    @[@params.action]()
    
  process_query: ->
    
  render: (context, options) ->
    view = new Metro.Views.Base(@)
    body = view.render(context, options)
    if @response
      @response.writeHead(200, @headers)
      @response.write(body)
      @response.end()
      @response = null
      @request  = null
    body
  
  layout: ->
    layout = @constructor._layout
    if typeof(layout) == "function"
      layout.apply(@)
    else
      layout
    
module.exports = Base
