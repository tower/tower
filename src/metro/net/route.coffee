class Metro.Net.Route extends Metro.Object
  @store: ->
    @_store ||= []
  
  @create: (route) ->
    @store().push(route)
    
  @all: ->
    @store()
    
  @clear: ->
    @_store = []
  
  @draw: (callback) ->
    callback.apply(new Metro.Net.Route.DSL(@))
  
  constructor: (options) ->
    options     ||= options
    @path         = options.path
    @name         = options.name
    @method       = (options.method || "GET").toUpperCase()
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
    
  match: (requestOrPath) ->
    if typeof requestOrPath == "string" then return @pattern.exec(requestOrPath)
    path  = requestOrPath.location.path
    return null unless requestOrPath.method.toUpperCase() == @method
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
  
Metro.Route = Metro.Net.Route

require './route/dsl'
require './route/urls'
require './route/polymorphicUrls'

Metro.Net.Route.include Metro.Net.Route.Urls
Metro.Net.Route.include Metro.Net.Route.PolymorphicUrls

module.exports = Metro.Net.Route
