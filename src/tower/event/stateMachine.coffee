# @states "status", ->
#   @state "draft"
#   @state "published"
#   @state "archived"
#   
#   @event "publish", ->
#     @transition from: "draft", to: "published"
class Tower.Event.StateMachine
  constructor: (name, options, block) ->
    if typeof options == "function"
      block  = options
      options   = {}
    
    block.call(@)
    
    @events = []
    @states = []
  
  transition: (from, to) ->
    
  state: (name) ->
    @states.push name
    
  event: (name, block) ->
    @events.push name
    
module.exports = Tower.Event.StateMachine
