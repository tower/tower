# @module
Tower.SupportEventEmitter =
  #included: ->
  #  @events = {}

  isEventEmitter: true

  events: ->
    @_events ||= {}

  hasEventListener: (key) ->
    _.isPresent(@events(), key)

  event: (key) ->
    @events()[key] ||= new Tower.Event(@, key)

  # Examples:
  #
  #     @on "click .item a", "clickItem"
  #     @on "click", "clickItem", target: ".item a"
  #
  # Use jQuery to set relavant parent/child elements using jQuery `find`, `parents`, `closest`, etc.
  #
  #     @on "click", "clickItem", selector: ".item a", find: {meta: "span small"}, closest: {title: ".item h1"}
  #     #=> @titleElement = @targetElement.closest(".item h1")
  on: ->
    args = _.args(arguments)

    if typeof args[args.length - 1] == "object"
      options = args.pop()
      if args.length == 0
        eventMap  = options
        options   = {}
    else
      options = {}

    if typeof args[args.length - 1] == "object"
      eventMap = args.pop()
    else
      eventMap = {}
      eventMap[args.shift()] = args.shift()

    # this is essentially what I'm doing above
    #switch args.length
    #  # @on click: "clickHandler", keypress: "keypressHandler"
    #  when 1
    #  # @on "click", "clickHandler"
    #  # @on "click", -> alert '!'
    #  # @on {click: "clickHandler", keypress: "keypressHandler"}, {type: "socket"}
    #  when 2
    #  # @on "click", "clickHandler", type: "socket"
    #  when 3

    for eventType, handler of eventMap
      @addEventHandler(eventType, handler, options)

  addEventHandler: (type, handler, options) ->
    @event(type).addHandler(handler)

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
    event = @event(key)
    event.fire.call event, _.args(arguments, 1)

  allowAndFire: (key) ->
    @event(key).allowAndFire(_.args(arguments, 1))

module.exports = Tower.SupportEventEmitter
