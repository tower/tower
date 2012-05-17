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
      _.pluralize(_.camelize(@className().replace(/(Controller)$/, ''), false))

    addSocketEventHandler: (name, handler, options) ->
      unless @io
        @io = Tower.Application.instance().io.of('/' + @socketNamespace()).on 'connection', (socket) =>
          @socket = socket
          @registerHandler(socket, eventType, handler) for eventType, handler of @_socketHandlers

    registerHandler: (socket, eventType, handler) ->
      # Register all event handlers besides connection and disconnect
      if eventType != 'connection' && eventType != 'disconnect'
        socket.on eventType, (data) =>
          @_dispatch socket, handler, _.extend data

      # Immediately call the 'connection' handler
      else if eventType == 'connection'
        @_dispatch socket, handler

    _dispatch: (event, handler, locals = {}) ->
      # we should think about having 1 controller instance per connected user
      # such as Tower.connections[sessionId] == {postsController: instance, commentsController: instance, etc.}
      controller = @create()

      for key, value of locals
        controller.params[key] = value

      if typeof handler == 'string'
        controller[handler].call controller, event
      else
        handler.call controller, event

module.exports = Tower.Controller.Events
