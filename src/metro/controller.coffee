class Controller
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
  
  @getter "controller_name", @,   -> Metro.Support.String.underscore(@name)
  @getter "controller_name", @::, -> @constructor.controller_name
  
module.exports = Controller
