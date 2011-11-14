class Metro.Route
  @include Metro.Model.Scopes
  
  @store: ->
    @_store ||= new Metro.Store.Memory
  
  @create: (route) ->
    @store().create(route)
  
  @normalizePath: (path) ->
    "/" + path.replace(/^\/|\/$/, "")
    
  @initialize: ->
    require "#{Metro.root}/config/routes"
  
  @teardown: ->
    @_store = []
    delete require.cache[require.resolve("#{Metro.root}/config/routes")]
    delete @_store
    
  @reload: ->
    @teardown()
    @initialize()
  
  @draw: (callback) ->
    callback.apply(new Metro.Route.DSL(@))
    @
  
  constructor: (options) ->
    options    ||= options
    @path       = options.path
    @name       = options.name
    @method     = options.method
    @ip         = options.ip
    @defaults   = options.defaults || {}
    @constraints  = options.constraints
    @options    = options
    @controller = options.controller
    @keys       = []
    @pattern    = @extractPattern(@path)
    @id         = @path
    if @controller
      @id += @controller.name + @controller.action
    
  match: (path) ->
    @pattern.exec(path)
    
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
    
    new RegExp('^' + path + '$', if !!caseSensitive then '' else 'i')

require './route/dsl'

module.exports = Metro.Route
