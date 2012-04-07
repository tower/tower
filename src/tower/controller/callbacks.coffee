# @mixin
Tower.Controller.Callbacks =
  ClassMethods:
    beforeAction: ->
      @before "action", arguments...

    afterAction: ->
      @after "action", arguments...
      
    callbacks: ->
      @metadata().callbacks

module.exports = Tower.Controller.Callbacks
