class Tower.Controller.Responder
  constructor: (controller, resources, options = {}) ->
    @controller       = controller
    @request          = controller.request
    @format           = controller.formats[0]
    @resource         = resources[resources.length - 1]
    @resources        = resources
    @action           = options.action
    @defaultResponse  = options.defaultResponse
    
    delete options.action
    delete options.defaultResponse
    
    @options          = options
  
  respond: ->
    method  = "to#{format.toUpperCase()}"
    method  = @[method]
    if method then method() else @toFormat()
  
  toHTML: ->
    try
      @defaultRender()
    catch error
      @_navigationBehavior(error)
  
  toJSON: ->
    @defaultRender()
  
  toFormat: ->
    try
      if get? || !hasErrors?
        @defaultRender()
      else
        @displayErrors()
    catch error
      @_apiBehavior(error)
  
  _navigationBehavior: (error) ->
    if get?
      raise error
    else if hasErrors? && defaultAction
      @render action: @defaultAction
    else
      @redirectTo @navigationLocation

  _apiBehavior: (error) ->
    raise error unless resourceful?
    
    if get?
      @display resource
    else if post?
      @display resource, status: "created", location: @apiLocation
    else
      @head "noContent"
  
  isResourceful: ->
    @resource.hasOwnProperty("to#{@format.toUpperCase()}")
  
  resourceLocation: ->
    @options.location || @resources
  
  #alias :navigationLocation :resourceLocation
  #alias :apiLocation :resourceLocation
  
  defaultRender: ->
    @defaultResponse.call(options)
  
  display: (resource, givenOptions = {}) ->
    @controller.render _.extend givenOptions, options, format: resource
  
  displayErrors: ->
    controller.render format: @resourceErrors, status: "unprocessableEntity"
  
  hasErrors: ->
    @resource.respondTo?("errors") && !@resource.errors.empty?
  
  defaultAction: ->
    @action ||= ACTIONS_FOR_VERBS[request.requestMethodSymbol]
  
  resourceErrors: ->
    if @respondTo?("#{format}ResourceErrors") then @["#{format}RresourceErrors"] else @resource.errors
  
  jsonResourceErrors: ->
    errors: resource.errors
  
module.exports = Tower.Controller.Responder
