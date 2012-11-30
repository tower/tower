# @mixin
Tower.ControllerCallbacks =
  ClassMethods:
    # Callback to run before any action.
    beforeAction: ->
      @before 'action', arguments...

    # Callback to run after any action.
    afterAction: ->
      @after 'action', arguments...

    # All of the callbacks defined for this controller.
    #
    # @return [Object]
    callbacks: ->
      @metadata().callbacks
