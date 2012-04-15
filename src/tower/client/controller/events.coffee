Tower.Controller.Events =
  ClassMethods:
    DOM_EVENTS: [
      "click",
      "dblclick",
      "blur",
      "error",
      "focus",
      "focusIn",
      "focusOut",
      "hover",
      "keydown",
      "keypress",
      "keyup",
      "load",
      "mousedown",
      "mouseenter",
      "mouseleave",
      "mousemove",
      "mouseout",
      "mouseover",
      "mouseup",
      "mousewheel",
      "ready",
      "resize",
      "scroll",
      "select",
      "submit",
      "tap",
      "taphold",
      "swipe",
      "swipeleft",
      "swiperight"
    ]

    dispatcher: global

    addEventHandler: (name, handler, options) ->
      if options.type == "socket" || !name.match(@DOM_EVENT_PATTERN)
        @addSocketEventHandler(name, handler, options)
      else
        @addDomEventHandler(name, handler, options)

    socketNamespace: ->
      Tower.Support.String.pluralize(Tower.Support.String.camelize(@name.replace(/(Controller)$/, ""), false))

    addSocketEventHandler: (name, handler, options) ->
      @io ||= Tower.Application.instance().io.connect("/" + @socketNamespace())

      @io.on name, (data) =>
        @_dispatch @io, handler, params: data

    # http://www.ravelrumba.com/blog/event-delegation-jquery-performance/
    addDomEventHandler: (name, handler, options) ->
      parts             = name.split(/\ +/)
      name              = parts.shift()
      selector          = parts.join(" ")
      options.target    = selector if selector && selector != ""
      options.target  ||= "body"
      eventType         = name.split(/[\.:]/)[0]
      method            = @["#{eventType}Handler"]
      if method
        method.call @, name, handler, options
      else
        $(@dispatcher).on name, options.target, (event) =>
          @_dispatch event, handler, options
      @

    _dispatch: (event, handler, options = {}) ->
      controller = @instance()

      controller.elements ||= {}
      controller.params   ||= {}

      _.extend controller.params, options.params if options.params
      _.extend controller.elements, options.elements if options.elements

      if typeof handler == "string"
        controller[handler].call controller, event
      else
        handler.call controller, event

Tower.Controller.Events.ClassMethods.DOM_EVENT_PATTERN = new RegExp("^(#{Tower.Controller.Events.ClassMethods.DOM_EVENTS.join("|")})")

module.exports = Tower.Controller.Events
