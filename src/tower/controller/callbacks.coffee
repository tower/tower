Tower.Controller.Callbacks =
  ClassMethods:
    beforeAction: ->
      @before "action", arguments...
      
    beforeFilter: ->
      @before "action", arguments...
      
    afterAction: ->
      @after "action", arguments...
      
    afterFilter: ->
      @after "action", arguments...

module.exports = Tower.Controller.Callbacks
