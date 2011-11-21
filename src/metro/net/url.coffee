class Metro.Net.Url
  @key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"]
  @aliases: 
    anchor: "fragment"
  @parser: 
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  
  @querystringParser: /(?:^|&|;)([^&=;]*)=?([^&;]*)/g
  @fragmentParser: /(?:^|&|;)([^&=;]*)=?([^&;]*)/g
  @typeParser: /(youtube|vimeo|eventbrite)/
  
  @parse: (string, strictMode) ->
    key                         = Url.key
    string                      = decodeURI(string)
    res                         = Url.parser[(if strictMode or false then "strict" else "loose")].exec(string)
    url                         = 
      attr:   {}
      param:  {}
      seg:    {}
    
    i                           = 14
    while i--
      url.attr[key[i]]          = res[i] or ""
    url.param["query"]          = {}
    url.param["fragment"]       = {}
    url.attr["query"].replace Url.querystringParser, ($0, $1, $2) ->
      url.param["query"][$1]    = $2  if $1
    
    url.attr["fragment"].replace Url.fragmentParser, ($0, $1, $2) ->
      url.param["fragment"][$1] = $2  if $1
    
    url.seg["path"]             = url.attr.path.replace(/^\/+|\/+$/g, "").split("/")
    url.seg["fragment"]         = url.attr.fragment.replace(/^\/+|\/+$/g, "").split("/")
    url.attr["base"]            = (if url.attr.host then url.attr.protocol + "://" + url.attr.host + (if url.attr.port then ":" + url.attr.port else "") else "")
    
    type = Url.typeParser.exec(url.attr.host)
    url.attr["type"] = type[0] if type
    
    url

  constructor: (url, strictMode) ->
    if typeof(url) == "object"
      @data        = url
    else
      if arguments.length == 1 and url == true
        strictMode = true
        url        = undefined
      @strictMode  = strictMode or false
      url          = url
      url         ?= window.location.toString() if window?
      @data        = Url.parse(url, strictMode)
  
  attr: (attr) ->
    attr = Url.aliases[attr] or attr
    (if attr != undefined then @data.attr[attr] else @data.attr)
  
  param: (param) ->
    (if param != undefined then @data.param.query[param] else @data.param.query)
  
  fparam: (param) ->
    (if param != undefined then @data.param.fragment[param] else @data.param.fragment)

  segment: (seg) ->
    if seg == undefined
      @data.seg.path
    else
      seg = (if seg < 0 then @data.seg.path.length + seg else seg - 1)
      @data.seg.path[seg]

  fsegment: (seg) ->
    if seg == undefined
      @data.seg.fragment
    else
      seg = (if seg < 0 then @data.seg.fragment.length + seg else seg - 1)
      @data.seg.fragment[seg]

module.exports = Metro.Net.Url
