class Configuration
  @include Metro.Support.Concern
  
  @bootstrap: ->
    Metro.Support.Dependencies.load("#{Metro.root}/app/controllers")
  
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
  
  @getter "controller_name", @    -> Metro.Support.String.underscore(@name)
  @getter "controller_name", @::  -> @constructor.controller_name