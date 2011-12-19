Coach.Controller.Layouts =
  ClassMethods:
    layout: (layout) ->
      @_layout = layout
    
    theme: (theme) ->
      @_theme = theme
    
  layout: ->
    layout = @constructor._layout
    if typeof(layout) == "function" then layout.apply(@) else layout
    
module.exports = Coach.Controller.Layouts
