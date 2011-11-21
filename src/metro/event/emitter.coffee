Metro.Event.Emitter =
  #included: ->
  #  @events = {}
  
  isEventEmitter: true
  
  events: ->
    @_events ||= {}
  
  hasEvent: (key) ->
    Metro.Support.Object.isPresent(@events(), key)
    
  event: (key) ->
    events()[key] ||= new Metro.Event(@, key)
    
  on: (key, handler) ->
    @event(key).addHandler(handler)
  
  mutation: (wrappedFunction) ->
    ->
      result = wrappedFunction.apply(this, arguments)
      @event('change').fire(this, this)
      result
      
  prevent: (key) ->
    @event(key).prevent()
    @
    
  allow: (key) ->
    @event(key).allow()
    @
    
  isPrevented: (key) ->
    @event(key).isPrevented()
    
  fire: (key) ->
    @event(key).fire(Metro.Support.Array.args(arguments, 1))
    
  allowAndFire: (key) ->
    @event(key).allowAndFire(Metro.Support.Array.args(arguments, 1))

module.exports = Metro.Event.Emitter
