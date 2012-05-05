# @todo Make this more like a {Tower.Model}
class Tower.HTTP.Route extends Tower.Class
  @store: ->
    @_store ||= []

  @byName: {}

  @create: (route) ->
    @byName[route.name] = route
    @store().push(route)

  @find: (name) ->
    @byName[name]
  
  # tmp name
  @findByControllerOptions: (options) ->
    for route in @all()
      controller  = route.controller
      success     = true
      for key, value of options
        success = controller[key] == value
        break unless success
        
      return route if success
    null

  @all: ->
    @store()

  @clear: ->
    @_store = []
    
  @reload: ->
    @clear()
    @draw()

  @draw: (callback) ->
    @_defaultCallback ||= callback
    callback = @_defaultCallback unless callback
    callback.apply(new Tower.HTTP.Route.DSL(@))

  @findController: (request, response, callback) ->
    routes      = Tower.Route.all()

    for route in routes
      controller = route.toController request
      break if controller

    if controller
      controller.call request, response, ->
        callback(controller)
    else
      callback(null)

    controller

  toController: (request) ->
    match = @match(request)

    return null unless match

    method  = request.method.toLowerCase()
    keys    = @keys
    params  = _.extend({}, @defaults, request.query || {}, request.body || {})
    match   = match[1..-1]
    
    for capture, i in match
      key = keys[i].name
      
      if capture && !params[key]?
        capture = decodeURIComponent(capture)
        # need a way to convert :id to integer if it's an integer...
        try
          params[key] = JSON.parse(capture)
        catch error
          params[key] = capture

    controller      = @controller
    params.action   = controller.action if controller
    request.params  = params

    if controller
      controller      = Tower.constant(Tower.namespaced(@controller.className)).create()
    controller

  init: (options) ->
    options     ||= options
    @path         = options.path
    @name         = options.name
    @methods      = _.map _.castArray(options.method || "GET"), (i) -> i.toUpperCase()
    @ip           = options.ip
    @defaults     = options.defaults || {}
    @constraints  = options.constraints
    @options      = options
    @controller   = options.controller
    @keys         = []
    @pattern      = @extractPattern(@path)
    @id           = @path
    if @controller
      @id += @controller.name + @controller.action
      
    @_super()

  get: (name) ->
    @[name]

  match: (requestOrPath) ->
    if typeof requestOrPath == "string" then return @pattern.exec(requestOrPath)
    path    = requestOrPath.location.path
    
    return null unless _.indexOf(@methods, requestOrPath.method.toUpperCase()) > -1
    match = @pattern.exec(path)
    return null unless match
    return null unless @matchConstraints(requestOrPath)
    match

  matchConstraints: (request) ->
    constraints = @constraints

    switch typeof(constraints)
      when "object"
        for key, value of constraints
          switch typeof(value)
            when "string", "number"
              return false unless request[key] == value
            when "function", "object"
              # regexp?
              return false unless !!request.location[key].match(value)
      when "function"
        return constraints.call(request, request)
      else
        return false

    return true

  urlFor: (options = {}) ->
    result = @path
    result = result.replace(new RegExp(":#{key}\\??", "g"), value) for key, value of options
    result = result.replace(new RegExp("\\.?:\\w+\\??", "g"), "")
    result

  extractPattern: (path, caseSensitive, strict) ->
    return path if path instanceof RegExp
    self = @
    return new RegExp('^' + path + '$') if path == "/"

    path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, (_, open, slash, format, symbol, key, close, optional) ->
      optional = (!!optional) || (open + close == "()")
      splat    = symbol == "*"

      self.keys.push
        name:     key
        optional: !!optional
        splat:    splat

      slash   ||= ""
      result = ""
      result += slash if !optional || !splat
      result += "(?:"
      # result += slash if optional
      if format?
        result += if splat then "\\.([^.]+?)" else "\\.([^/.]+?)"
      else
        result += if splat then "/?(.+)" else "([^/\\.]+)"
      result += ")"
      result += "?" if optional

      result
    )

    new RegExp('^' + path + '$', if !!caseSensitive then '' else 'i')

Tower.Route = Tower.HTTP.Route

require './route/dsl'
require './route/urls'
require './route/polymorphicUrls'

Tower.HTTP.Route.include Tower.HTTP.Route.Urls
Tower.HTTP.Route.include Tower.HTTP.Route.PolymorphicUrls

module.exports = Tower.HTTP.Route
