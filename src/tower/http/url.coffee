class Tower.HTTP.Url
  @key: ["source", "protocol", "host", "userInfo", "user", "password", "hostname", "port", "relative", "path", "directory", "file", "query", "fragment"]
  @aliases: 
    anchor: "fragment"
  @parser: 
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  
  @querystringParser: /(?:^|&|;)([^&=;]*)=?([^&;]*)/g
  @fragmentParser: /(?:^|&|;)([^&=;]*)=?([^&;]*)/g
  @typeParser: /(youtube|vimeo|eventbrite)/
  
  parse: (string) ->
    key         = @constructor.key
    string      = decodeURI(string)
    parsed      = @constructor.parser[(if @strictMode or false then "strict" else "loose")].exec(string)
    
    attributes  = {}
    @params     = params      = {}
    @fragment   = fragment    = params: {}
    
    i                           = 14
    while i--
      attributes[key[i]]          = parsed[i] || ""
    
    attributes["query"].replace @constructor.querystringParser, ($0, $1, $2) ->
      params[$1]            = $2  if $1
    
    attributes["fragment"].replace @constructor.fragmentParser, ($0, $1, $2) ->
      fragment.params[$1]   = $2  if $1
    
    @segments               = attributes.path.replace(/^\/+|\/+$/g, "").split("/")
    fragment.segments       = attributes.fragment.replace(/^\/+|\/+$/g, "").split("/")
    
    @[key]    ||= value for key, value of attributes
    @root       = (if attributes.host then attributes.protocol + "://" + attributes.hostname + (if attributes.port then ":" + attributes.port else "") else "")
    
    domains     = @hostname.split(".")
    
    @domain     = domains[(domains.length - 1 - @depth)..(domains.length - 1)].join(".")
    @subdomains = domains[0..(domains.length - 2 - @depth)]
    @subdomain  = @subdomains.join(".")
    @port       = parseInt(@port) if @port?

  constructor: (url, depth = 1, strictMode) ->
    @strictMode   = strictMode or false
    @depth        = depth || 1
    @url          = url ||= window.location.toString() if window?
    
    @parse(url)

module.exports = Tower.HTTP.Url
