class Tower.Controller.Responder
  @respond: (controller, options, callback) ->
    responder = new @(controller, options)
    responder.respond callback

  constructor: (controller, options = {}) ->
    @controller       = controller
    @options          = options

    @accept(format) for format in @controller.formats

  accept: (format) ->
    @[format] = (callback) -> @["_#{format}"] = callback

  respond: (callback) ->
    callback.call @controller, @ if callback
    method  = @["_#{@controller.format}"]
    if method then method.call(@) else @toFormat()

  _html: ->
    @controller.render action: @controller.action

  _json: ->
    @controller.render json: @options.records

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
      throw error
    else if hasErrors? && defaultAction
      @render action: @defaultAction
    else
      @redirectTo @navigationLocation

  _apiBehavior: (error) ->
    #throw error unless resourceful?

    if get?
      @display resource
    else if post?
      @display resource, status: 'created', location: @apiLocation
    else
      @head 'noContent'

  isResourceful: ->
    @resource.hasOwnProperty("to#{@format.toUpperCase()}")

  resourceLocation: ->
    @options.location || @resources

  defaultRender: ->
    @defaultResponse.call(options)

  display: (resource, givenOptions = {}) ->
    @controller.render _.extend givenOptions, @options, format: @resource

  displayErrors: ->
    @controller.render format: @resourceErrors, status: 'unprocessableEntity'

  hasErrors: ->
    @resource.respondTo?('errors') && !@resource.errors.empty?

  defaultAction: ->
    @action ||= ACTIONS_FOR_VERBS[request.requestMethodSymbol]

  resourceErrors: ->
    if @hasOwnProperty("#{format}ResourceErrors") then @["#{format}RresourceErrors"] else @resource.errors

  jsonResourceErrors: ->
    errors: @resource.errors

module.exports = Tower.Controller.Responder
