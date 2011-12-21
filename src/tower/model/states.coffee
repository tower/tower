# @states "status", ->
#   @state "draft"
#   @state "published"
#   @state "archived"
#   
#   @event "publish", ->
#     @transition from: "draft", to: "published"
Tower.Model.States =
  ClassMethods:
    states: (name) ->
      @stateMachines()[name] = new Tower.Event.StateMachine(arguments...)
    
    stateMachines: ->
      @_stateMachines ||= {}

module.exports = Tower.Model.States
