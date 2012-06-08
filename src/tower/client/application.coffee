###
global error handling

$(window).error (event) ->
  try
    App.errorHandler(event)
  catch error
    console.log(error)
###

class Tower.Application extends Tower.Engine
  @_callbacks: {}

  @extended: ->
    __app   = @create()
    __name  = @className()
    try eval("#{__name} = __app") # b/c of variable scoping
    global[__name] = __app

  @before 'initialize', 'setDefaults'

  setDefaults: ->
    #Tower.Model.default "store", Tower.Store.Ajax
    #Tower.Model.field "id", type: "Id"

    true

  @instance: ->
    @_instance

  teardown: ->
    Tower.Route.reload()

  init: ->
    @_super arguments...

    throw new Error("Already initialized application") if Tower.Application._instance

    Tower.Application._instance = @

    @io = global.io

  ready: ->
    @_super arguments...

    #$("a").on 'click', ->
    #  Tower.get($(this).attr("href"))

  initialize: ->
    @extractAgent()
    @setDefaults()
    @

  extractAgent: ->
    Tower.cookies = Tower.Net.Cookies.parse()
    Tower.agent   = new Tower.Net.Agent(JSON.parse(Tower.cookies["user-agent"] || '{}'))

    # going to make this work with sockets in just a minute
    Tower.connections["1"] = Tower.Net.Connection.create()

  listen: ->
    return if @listening
    @listening = true

    if Tower.history && Tower.history.enabled
      Tower.history.Adapter.bind global, "statechange", =>
        state     = Tower.history.getState()
        location  = new Tower.Net.Url(state.url)
        request   = new Tower.Net.Request(url: state.url, location: location, params: _.extend(title: state.title, (state.data || {})))
        response  = new Tower.Net.Response(url: state.url, location: location)
        Tower.Middleware.Router request, response, (error) =>
          console.log error if error
      $(global).trigger("statechange")
    else
      console.warn "History not enabled"

  run: ->
    @listen()

module.exports = Tower.Application
