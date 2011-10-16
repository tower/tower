class Base extends Class
  @controller_name: ->
    @_controller_name ?= _.underscore(@name)
    
  @helpers: ->
    
  @layout: ->
    
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
    @response = response || {}
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
    options ?= {}
    type      = options.type || Metro.Templates.engine
    path      = "#{Metro.root}/app/views/#{context}.#{type}"
    template  = Metro.Templates.engines()[type]
    template  = new template
    body      = template.compile path, options
    
    @response.setHeader(@headers)
    @response.end(body)
    
module.exports = Base
