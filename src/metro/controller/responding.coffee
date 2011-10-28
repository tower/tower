class Responding
  #constructor: -> super
  
  #@include Metro.Support.Concern
    
  @respondTo: ->
    @_respondTo ?= []
    @_respondTo = @_respondTo.concat(arguments)
    
  respondWith: ->
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
      @contentType = Metro.Support.Path.contentType(@format)
    else 
      @contentType = "text/html"
    @process()
    
  process: ->  
    @processQuery()
    
    @[@params.action]()
    
  processQuery: ->
  
  constructor: ->
    @headers      = {}
    @status       = 200
    @request      = null
    @response     = null
    @contentType = "text/html"
    @params       = {}
    @query        = {}
    
module.exports = Responding
