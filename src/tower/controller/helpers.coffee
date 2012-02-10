Tower.Controller.Helpers =
  ClassMethods:
    helper: (object) ->
      @_helpers ||= []
      @_helpers.push(object)
      
    layout: (layout) ->
      @_layout = layout
      
  layout: ->
    layout = @constructor._layout
    if typeof(layout) == "function" then layout.apply(@) else layout

module.exports = Tower.Controller.Helpers
