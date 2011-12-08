class Metro.Event extends Metro.Object
  @include
    ClassMethods:
      for: (object, key) ->
        if object.isEventEmitter
          object.event(key)
        else
          new Metro.Event(object, key)
    
    isEvent: true
    
    addHandler: (handler) ->
      @handlers.push handler
      @autofireHandler(handler) if @oneShot
      @

    removeHandler: (handler) ->
      @handlers.splice(1, @handlers.indexOf(handler))
      @

    handlerContext: -> @base
    
    prevent: -> 
      ++@_preventCount

    allow: ->
      --@_preventCount if @_preventCount
      @_preventCount

    isPrevented: -> 
      @_preventCount > 0

    autofireHandler: (handler) ->
      if @_oneShotFired and @_oneShotArgs?
        handler.apply(@handlerContext(), @_oneShotArgs)
    
    resetOneShot: ->
      @_oneShotFired  = false
      @_oneShotArgs   = null
    
    fire: ->
      return false if @isPrevented() or @_oneShotFired
      context   = @handlerContext()
      args      = arguments
      handlers  = @handlers

      if @oneShot
        @_oneShotFired = true
        @_oneShotArgs = arguments

      for handler in handlers
        handler.apply(context, args)

    allowAndFire: ->
      @allow()
      @fire(arguments...)
    
  constructor: (@base, @key) ->
    @handlers       = []
    @_preventCount  = 0
  
module.exports = Metro.Event
