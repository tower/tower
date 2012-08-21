Tower.SupportRescuable =
  ClassMethods:
    rescueHandlers: ->
      @_rescueHandlers ||= []
    
    rescueFrom: ->
      klasses = _.args(arguments)
      block   = _.extractBlock(klasses)
      options = _.extractOptions(klasses)
      key     = undefined

      unless options.hasOwnProperty("with")
        if block
          options.with = block
        else
          throw new ArgumentError("Need a handler. Supply an options hash that has a `with` key as the last argument.")

      for klass in klasses
        #key = if klass.isA?(Class) && klass <= Exception
        #  klass.name
        if typeof klass == "string"
          key = klass
        else
          throw new ArgumentError("#{klass} is neither an Exception nor a String")

        @rescueHandlers().push [key, options.with]

  InstanceMethods:
    rescueWithHandler: (exception) ->
      if handler = @handlerForRescue(exception)
        if handler.length != 0 then handler.call(exception) else handler.call()
        true

    handlerForRescue: (exception) ->
      handlers  = @constructor.rescueHandlers().reverse()
      rescuer   = undefined
      
      for array in handlers
        [klassName, handler] = array
        
        klass   = Tower.constant(klassName)
        # exception.isA?(klass) if klass
        rescuer = handler

      rescuer

module.exports = Tower.SupportRescuable
