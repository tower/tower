class Tower.Application extends Tower.Engine
  @_callbacks: {}
  
  @extended: ->
    global[@className()] = @create()

  @before 'initialize', 'setDefaults'

  setDefaults: ->
    Tower.Model.default "store", Tower.Store.Ajax
    Tower.Model.field "id", type: "Id"

    true

  @configure: (block) ->
    @initializers().push block

  @initializers: ->
    @_initializers ||= []

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
    Tower.cookies = Tower.HTTP.Cookies.parse()
    Tower.agent   = new Tower.HTTP.Agent(JSON.parse(Tower.cookies["user-agent"] || '{}'))

  listen: ->
    return if @listening
    @listening = true
    
    if Tower.history && Tower.history.enabled
      Tower.history.Adapter.bind global, "statechange", =>
        state     = Tower.history.getState()
        location  = new Tower.HTTP.Url(state.url)
        request   = new Tower.HTTP.Request(url: state.url, location: location, params: _.extend(title: state.title, (state.data || {})))
        response  = new Tower.HTTP.Response(url: state.url, location: location)
        Tower.Middleware.Router request, response, (error) =>
          console.log error if error
      $(global).trigger("statechange")
    else
      console.warn "History not enabled"

  run: ->
    @listen()

module.exports = Tower.Application
