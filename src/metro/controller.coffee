class Metro.Controller
  constructor: -> super
  
  @Flash:         require './controller/flash'
  @Redirecting:   require './controller/redirecting'
  @Rendering:     require './controller/rendering'
  @Responding:    require './controller/responding'
  
  @include @Flash
  @include @Redirecting
  @include @Rendering
  @include @Responding
  
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
    @_helpers ?= []
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
  
module.exports = Metro.Controller
