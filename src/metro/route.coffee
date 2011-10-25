class Route
  @DSL: require './route/dsl'
  
  @normalize_path: (path) ->
    "/" + path.replace(/^\/|\/$/, "")
  
  name:     null
  path:     null
  ip:       null
  method:   null
  options:  null
  pattern:  null
  keys:     null
  
  draw: (callback) ->
    mapper              = new Metro.Routes.Mapper(@).instance_eval(callback)
    @
    
  add: (route) ->
    @set.push route
    @named[route.name] = route if route.name?
    route
    
  clear: ->
    @set    = []
    @named  = {}
  
  constructor: (options) ->
    options    ?= options
    @path       = options.path
    @name       = options.name
    @method     = options.method
    @ip         = options.ip
    @defaults   = options.defaults || {}
    @constraints  = options.constraints
    @options    = options
    @controller = options.controller
    @keys       = []
    @pattern    = @extract_pattern(@path)
    
  match: (path) ->
    @pattern.exec(path)
    
  extract_pattern: (path, case_sensitive, strict) ->
    return path if path instanceof RegExp
    self = @
    return new RegExp('^' + path + '$') if path == "/"
    # console.log(path)
    path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, (_, open, slash, format, symbol, key, close, optional) ->
      optional = (!!optional) || (open + close == "()")
      splat    = symbol == "*"
      
      self.keys.push
        name:     key
        optional: !!optional
        splat:    splat
      
      slash   ?= ""
      result = ""
      if !optional || !splat
        result += slash
      
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
    # console.log(path)
    new RegExp('^' + path + '$', !!case_sensitive ? '' : 'i')

  
exports = module.exports = Route

Routes =
  Route:        require('./routes/route')
  Collection:   require('./routes/collection')
  Mapper:       require('./routes/mapper')
  
  bootstrap: ->
    require("#{Metro.root}/config/routes")
    
  reload: ->
    delete require.cache["#{Metro.root}/config/routes"]
    Metro.Application._routes = null
    @bootstrap()
    
module.exports = Routes
