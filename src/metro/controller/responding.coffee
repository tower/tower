class Responding
  #constructor: -> super
  
  #@include Metro.Support.Concern
    
  @respond_to: ->
    @_respond_to ?= []
    @_respond_to = @_respond_to.concat(arguments)
    
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
  
  call: (request, response, next) ->
    @request  = request
    @response = response
    @params   = @request.params || {}
    @cookies  = @request.cookies || {}
    @query    = @request.query || {}
    @session  = @request.session || {}
    @format   = @params.format
    @headers  = {}
    if @format && @format != "undefined"
      @content_type = Metro.Support.Path.content_type(@format)
    else 
      @content_type = "text/html"
    @process()
    
  process: ->  
    @process_query()
    
    @[@params.action]()
    
  process_query: ->
  
  constructor: ->
    @headers      = {}
    @status       = 200
    @request      = null
    @response     = null
    @content_type = "text/html"
    @params       = {}
    @query        = {}
    
module.exports = Responding
