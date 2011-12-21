class Tower.Application extends Tower.Class
  @instance: ->
    @_instance
    
  @defaultStack: ->
    @use Tower.Middleware.Location
    #@use Tower.Middleware.Cookies
    @use Tower.Middleware.Router
    @middleware
    
  @use: ->
    @middleware ||= []
    @middleware.push arguments
    
  #use: (route, handle) ->
  use: ->
    @constructor.use arguments...

  constructor: (middlewares = []) ->
    throw new Error("Already initialized application") if Tower.Application._instance
    Tower.Application._instance = @
    Tower.Application.middleware ||= []
    
    @io       = global["io"]
    @History  = global.History
    @stack    = []
    
    @use(middleware) for middleware in middlewares
    
  initialize: ->
    @extractAgent()
    @applyMiddleware()
    @
  
  applyMiddleware: ->  
    middlewares = @constructor.middleware
    
    unless middlewares && middlewares.length > 0
      middlewares = @constructor.defaultStack()
      
    @middleware(middleware...) for middleware in middlewares
    
  middleware: ->
    args    = Tower.Support.Array.args(arguments)
    route   = "/"
    handle  = args.pop()
    unless typeof route == "string"
      handle = route
      route = "/"

    route = route.substr(0, route.length - 1) if "/" is route[route.length - 1]
    
    @stack.push route: route, handle: handle
    
    @
    
  extractAgent: ->
    Tower.cookies = Tower.Net.Cookies.parse()
    Tower.agent   = new Tower.Net.Agent(JSON.parse(Tower.cookies["user-agent"] || '{}'))
    
  listen: ->
    self = @
    return if @listening
    @listening = true

    if @History && @History.enabled
      @History.Adapter.bind global, "statechange", ->
        state     = History.getState()
        location  = new Tower.Net.Url(state.url)
        request   = new Tower.Net.Request(url: state.url, location: location, params: Tower.Support.Object.extend(title: state.title, (state.data || {})))
        response  = new Tower.Net.Response(url: state.url, location: location)
        # History.log State.data, State.title, State.url
        self.handle request, response
    else
      _console.warn "History not enabled"

    # History.pushState state: 1, "State 1", "?state=1"
    # History.back()
    # History.go 2

  run: ->
    @listen()
    
  handle: (request, response, out) ->
    env   = Tower.env
    
    next  = (err) ->
      layer               = undefined
      path                = undefined
      c                   = undefined
      request.url         = removed + request.url
      request.originalUrl = request.originalUrl or request.url
      removed             = ""
      layer               = stack[index++]
      if not layer or response.headerSent
        return out(err) if out
        if err
          msg = (if "production" is env then "Internal Server Error" else err.stack or err.toString())
          console.error err.stack or err.toString()  unless "test" is env
          return request.socket.destroy()  if response.headerSent
          response.statusCode = 500
          response.setHeader "Content-Type", "text/plain"
          response.end msg
        else
          response.statusCode = 404
          response.setHeader "Content-Type", "text/plain"
          response.end "Cannot " + request.method + " " + request.url
        return
      try
        path = request.location.path
        path = "/"  if `undefined` is path
        return next(err) unless 0 is path.indexOf(layer.route)
        c = path[layer.route.length]
        return next(err)  if c and "/" isnt c and "." isnt c
        removed = layer.route
        request.url = request.url.substr(removed.length)
        request.url = "/" + request.url  unless "/" is request.url[0]
        arity = layer.handle.length
        if err
          if arity is 4
            layer.handle err, request, response, next
          else
            next err
        else if arity < 4
          layer.handle request, response, next
        else
          next()
      catch e
        next e
        
    writeHead = response.writeHead
    stack     = @stack
    removed   = ""
    index     = 0
    
    next()
