Tower.Model.States =
  ClassMethods:
    states: (name) ->
      @stateMachines()[name] = new Tower.Dispatch.StateMachine(arguments...)
    
    stateMachines: ->
      @_stateMachines ||= {}

module.exports = Tower.Model.States
