class Route
  @normalize_path: (path) ->
    "/" + path.replace(/^\/|\/$/, "")
  
  name:     null
  path:     null
  ip:       null
  method:   "get"
  options:  {}
  pattern:  //
  segments: []
  keys:     []
  
  constructor: (options) ->
    options    ?= options
    @path       = options.path
    @name       = options.name
    @method     = options.method || "get"
    @ip         = options.ip
    @options    = options
    @pattern    = @extract_pattern(@path)
    #console.log @pattern
    
  match: (path) ->
    @pattern.exec(path)
    
  extract_pattern: (path, case_sensitive, strict) ->
    return path if path instanceof RegExp
    self = @
    path = path.concat((if !!strict then "" else "/?")).replace(/\/\(/g, "(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, (_, slash, format, key, capture, optional) ->
      self.keys.push
        name:     key
        optional: !!optional

      slash = slash or ""
      "" + (if optional then "" else slash) + "(?:" + (if optional then slash else "") + (format or "") + (capture or (format and "([^/.]+?)" or "([^/]+?)")) + ")" + (optional or "")
    ).replace(/([\/.])/g, "\\$1").replace(/(\()?\/\*([^\)\/]*)\)?(\/)?/g, (_, optional, key, slash) ->
      self.keys.push
        name:     key
        optional: !!optional
      
      slash = slash or ""
      "" + (if optional then "" else slash) + "(?:" + (if optional then slash else "") + "(.*))"
    )#.replace(/\*.*/g, "(.*)")
    new RegExp('^' + path + '$', !!case_sensitive ? '' : 'i')

  
exports = module.exports = Route
