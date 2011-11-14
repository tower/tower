class Metro.Controller
  constructor: -> super
  
  @initialize: ->
    Metro.Support.Dependencies.load("#{Metro.root}/app/controllers")
    
  @teardown: ->
    delete @_helpers
    delete @_layout
    delete @_theme
    
  @reload: ->
    @teardown()
    @initialize()
  
  @helper: (object) ->
    @_helpers ||= []
    @_helpers.push(object)
  
  @layout: (layout) ->
    @_layout = layout
  
  @theme: (theme) ->
    @_theme = theme
    
  layout: ->
    layout = @constructor._layout
    if typeof(layout) == "function" then layout.apply(@) else layout
  
  @getter "controllerName", @,   -> Metro.Support.String.camelize(@name)
  @getter "controllerName", @::, -> @constructor.controllerName
  
  clear: ->
    @request  = null
    @response = null
    @headers  = null

require './controller/flash'
require './controller/redirecting'
require './controller/rendering'
require './controller/responding'

Metro.Controller.include Metro.Controller.Flash
Metro.Controller.include Metro.Controller.Redirecting
Metro.Controller.include Metro.Controller.Rendering
Metro.Controller.include Metro.Controller.Responding
    
module.exports = Metro.Controller
