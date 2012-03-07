Tower.Controller.Callbacks =
  ClassMethods:
    beforeAction: ->
      @before "action", arguments...
      
    afterAction: ->
      @after "action", arguments...

module.exports = Tower.Controller.Callbacks
