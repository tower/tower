# @mixin
Tower.Controller.Helpers =
  ClassMethods:
    helper: (object) ->
      @helpers().push(object)

    helpers: ->
      @metadata().helpers

    layout: (layout) ->
      @_layout = layout

  InstanceMethods:
    layout: ->
      layout = @constructor._layout
      if typeof(layout) == "function" then layout.call(@) else layout

module.exports = Tower.Controller.Helpers
