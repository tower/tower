class Metro.Net.Param
  @perPage          : 20
  @sortDirection    : "ASC"
  @sortKey          : "sort"                 # or "order", etc.
  @limitKey         : "limit"                # or "perPage", etc.
  @pageKey          : "page"
  @separator        : "_"                    # or "-"
  
  # this is not used, just thinking...
  # nested relationships as user[location][city]=san+diego
  @operators:  
    gte             : ":value..t"          
    gt              : ":value...t"
    lte             : "t..:value"
    lte             : "t...:value"
    rangeInclusive : ":i..:f"             # count=0..4
    rangeExclusive : ":i...:f"            # date=2011-08-10...2011-10-03
    in              : [",", "+OR+"]        # tags=ruby,javascript and tags=ruby+OR+javascript
    nin             : "-"                  # tags=-ruby,-javascript and tags=ruby+OR+javascript
    all             : "[:value]"           # tags=[ruby,javascript] and tags=ruby+AND+javascript
    nil             : "[-]"                # tags=[-]
    notNil         : "[+]"                # tags=ruby,[+]
    asc             : ["+", ""]
    desc            : "-"
    geo             : ":lat,:lng,:radius"   # geo=20,-50,7
    
  @create: (key, options) ->
    options.type ||= "String"
    new Metro.Net.Param[options.type](key, options)
    
  constructor: (key, options = {}) ->
    @controller = options.controller
    @key        = key.toString()
    @modelName  = options.modelName
    @namespace  = Metro.Support.String.pluralize(@modelName) if modelName?
    @exact      = options.exact || false
    @default    = options.default
  
  parse: (value) -> value
  
  render: (value) -> value
  
  toScope: (value) ->
    result = @parse(value)
  
  parseValue: (value, operators) ->
    namespace: @namespace, key: @key, operators: operators, value: value
  
  _clean: (string) ->
    string.replace(/^-/, "").replace(/^\+-/, "").replace(/^'|'$/, "").replace("+", " ").replace(/^\^/, "").replace(/\$$/, "").replace(/^\s+|\s+$/, "")

class Metro.Net.Param.String extends Metro.Net.Param
  parse: (value) ->
    arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/)
    
    for node, i in arrays
      values = []
      
      # ([\+\-\^]?[\w@\-_\s\d\.\$]+|-?\'[\w@-_\s\d\+\.\$]+\')
      node.replace /([\+\-\^]?[\w@_\s\d\.\$]+|-?\'[\w@-_\s\d\+\.\$]+\')/g, (_, token) =>
        negation    = false
        exact       = false
        
        token       = token.replace /^(\+?-+)/, (_, $1) ->
          negation  = $1 && $1.length > 0
          ""
          
        token       = token.replace /^\'(.+)\'$/, (_, $1) ->
          exact  = $1 && $1.length > 0
          $1
        
        if negation
          operators = [if exact then "!=" else "!~"]
        else
          operators = [if exact then "=" else "=~"]
        
        operators.push "^" if !!token.match(/^\+?\-?\^/)
        operators.push "$" if !!token.match(/\$$/)
        
        values.push @parseValue(@_clean(token), operators)
        _
      
      arrays[i] = values
    
    arrays
    
  toScope: (value) ->
    nodes   = super(value)[0]
    result  = {}
    for node in nodes
      result[node.key]

module.exports = Metro.Net.Param
