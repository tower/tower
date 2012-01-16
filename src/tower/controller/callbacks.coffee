Tower.Controller.Callbacks =
  ClassMethods:
    beforeAction: ->
      @before "action", arguments...
      
    afterAction: ->
      @before "action", arguments...

module.exports = Tower.Controller.Callbacks
