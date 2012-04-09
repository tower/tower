Tower.Controller.Events =
  ClassMethods:
    addEventHandler: (name, handler, options) ->
      @_addSocketEventHandler name, handler, options

    _addSocketEventHandler: (name, handler, options) ->
      @_socketHandlers ||= {}
      @_socketHandlers[name] = handler

    applySocketEventHandlers: ->
      @addSocketEventHandler name, handler for name, handler of @_socketHandlers

    socketNamespace: ->
      Tower.Support.String.pluralize(Tower.Support.String.camelize(@name.replace(/(Controller)$/, ""), false))

    addSocketEventHandler: (name, handler, options) ->
      unless @io
        @io = Tower.Application.instance().io.of("/" + @socketNamespace()).on "connection", (socket) =>
          @socket = socket
          @registerHandler(socket, eventType, handler) for eventType, handler of @_socketHandlers

    registerHandler: (socket, eventType, handler) ->
      # Register all event handlers besides connection and disconnect
      if eventType isnt 'connection' and eventType isnt 'disconnect'
        socket.on eventType, (data) =>
          @_dispatch socket, handler, _.extend data

      # Immediately call the "connection" handler
      else if eventType is "connection"
        @_dispatch socket, handler

    _dispatch: (event, handler, locals = {}) ->
      controller = new @

      for key, value of locals
        controller.params[key] = value

      if typeof handler == "string"
        controller[handler].call controller, event
      else
        handler.call controller, event

module.exports = Tower.Controller.Events
