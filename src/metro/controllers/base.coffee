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
    
  @respond_to: ->
    @_respond_to ?= []
    @_respond_to = @_respond_to.concat(arguments)
    
  constructor: ->
    @headers      = {}
    @status       = 200
    @request      = null
    @response     = null
    @content_type = "text/html"
  
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
    @format   = @params.format
    @headers  = {}
    @content_type = Metro.Support.File.content_type(@format || "html")
    @process()
    
  process: ->  
    @process_query()
    
    @[@params.action]()
    
  process_query: ->
    
  render: ->
    view = new Metro.Views.Base(@)
    body = view.render(arguments...)
    if @response
      @headers["Content-Type"] ?= @content_type
      @response.writeHead(200, @headers)
      @response.write(body)
      @response.end()
      @response = null
      @request  = null
    body
    
  respond_with: ->
    data  = arguments[0]
    if arguments.length > 1 && typeof(arguments[arguments.length - 1]) == "function"
      callback = arguments[arguments.length - 1]
      
    switch(@format)
      when "json"
        @render json: data
      when "xml"
        @render xml: data
      else
        @render action: @action
        
  redirect_to: ->
    
  
  layout: ->
    layout = @constructor._layout
    if typeof(layout) == "function"
      layout.apply(@)
    else
      layout
    
module.exports = Base
