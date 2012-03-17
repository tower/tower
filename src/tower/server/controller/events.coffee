Tower.Controller.Events =
  ClassMethods:
    addEventHandler: (name, handler, options) ->
      @_addSocketEventHandler name, handler, options
        
    socketNamespace: ->
      Tower.Support.String.pluralize(Tower.Support.String.camelize(@name.replace(/(Controller)$/, ""), false))
      
    addSocketEventHandler: (name, handler, options) ->
      unless @io
        @_socketHandlers = {}
        
        @io = Tower.Application.instance().socket.of(@socketNamespace()).on "connection", (socket) =>
          for eventType, handler of @_socketHandlers
            do (eventType, handler) ->
              if eventType isnt 'connection' and eventType isnt 'disconnect'
                socket.on eventType, (data) =>
                  @_dispatch undefined, handler, data
      
      @_socketHandlers[name] = handler
    
    _dispatch: (event, handler, locals = {}) ->
      controller = new @
      
      for key, value of locals
        controller.params[key] = value
        
      if typeof handler == "string"
        controller[handler].call controller, event
      else
        handler.call controller, event
    
module.exports = Tower.Controller.Events
