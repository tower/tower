_ = Tower._

# @mixin
Tower.ControllerHelpers =
  ClassMethods:
    helper: (object) ->
      @helpers().push(object)

    helpers: ->
      @metadata().helpers

    layout: (layout) ->
      @metadata().layout = layout

  layout: ->
    layout = @constructor.metadata().layout
    if typeof(layout) == 'function' then layout.call(@) else layout

module.exports = Tower.ControllerHelpers
