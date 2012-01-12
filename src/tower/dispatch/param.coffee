class Tower.Dispatch.Param
  @perPage:       20
  @sortDirection: "ASC"
  @sortKey:       "sort"                 # or "order", etc.
  @limitKey:      "limit"                # or "perPage", etc.
  @pageKey:       "page"
  @separator:     "_"                    # or "-"
  
  # this is not used, just thinking...
  # nested relationships as user[location][city]=san+diego
  @operators:
    gte:            ":value..t"          
    gt:             ":value...t"
    lte:            "t..:value"
    lte:            "t...:value"
    rangeInclusive: ":i..:f"             # count=0..4
    rangeExclusive: ":i...:f"            # date=2011-08-10...2011-10-03
    in:             [",", "+OR+"]        # tags=ruby,javascript and tags=ruby+OR+javascript
    nin:            "-"                  # tags=-ruby,-javascript and tags=ruby+OR+javascript
    all:            "[:value]"           # tags=[ruby,javascript] and tags=ruby+AND+javascript
    nil:            "[-]"                # tags=[-]
    notNil:         "[+]"                # tags=ruby,[+]
    asc:            ["+", ""]
    desc:           "-"
    geo:            ":lat,:lng,:radius"   # geo=20,-50,7
    
  @create: (key, options) ->
    options.type ||= "String"
    new Tower.Dispatch.Param[options.type](key, options)
    
  constructor: (key, options = {}) ->
    @controller = options.controller
    @key        = key
    @attribute  = options.as || @key
    @modelName  = options.modelName
    @namespace  = Tower.Support.String.pluralize(@modelName) if modelName?
    @exact      = options.exact || false
    @default    = options.default
  
  parse: (value) -> value
  
  render: (value) -> value
  
  toCriteria: (value) ->
    nodes     = @parse(value)
    criteria  = new Tower.Model.Criteria
    for set in nodes
      for node in set
        attribute = node.attribute
        operator  = node.operators[0]
        query = {}
        if operator == "$eq"
          query[attribute] = node.value
        else
          query[attribute] = {}
          query[attribute][operator] = node.value
          
        criteria.where(query)
    criteria
  
  parseValue: (value, operators) ->
    namespace: @namespace, key: @key, operators: operators, value: value, attribute: @attribute
  
  _clean: (string) ->
    string.replace(/^-/, "").replace(/^\+-/, "").replace(/^'|'$/, "").replace("+", " ").replace(/^\^/, "").replace(/\$$/, "").replace(/^\s+|\s+$/, "")

class Tower.Dispatch.Param.String extends Tower.Dispatch.Param
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
          operators = [if exact then "$neq" else "$notMatch"]
        else
          operators = [if exact then "$eq" else "$match"]
        
        operators.push "^" if !!token.match(/^\+?\-?\^/)
        operators.push "$" if !!token.match(/\$$/)
        
        values.push @parseValue(@_clean(token), operators)
        _
      
      arrays[i] = values
    
    arrays
    
class Tower.Dispatch.Param.Date extends Tower.Dispatch.Param
  parse: (value) ->
    values  = []
    array   = value.toString().split(/[\s,\+]/)
    
    for string in array
      isRange = false
      
      string.replace /([^\.]+)?(\.\.)([^\.]+)?/, (_, startsOn, operator, endsOn) =>
        isRange = true
        range   = []
        range.push @parseValue(startsOn, ["$gte"]) if !!(startsOn && startsOn.match(/^\d/))
        range.push @parseValue(endsOn, ["$lte"])   if !!(endsOn && endsOn.match(/^\d/))
        values.push range
      
      values.push [@parseValue(string, ["$eq"])] unless isRange
    
    values
    
  parseValue: (value, operators) ->
    super(Tower.date(value), operators)
    
class Tower.Dispatch.Param.Number extends Tower.Dispatch.Param
  parse: (value) ->
    values  = []
    array   = value.toString().split(/[,\|]/)
    
    for string in array
      isRange   = false
      negation  = !!string.match(/^\^/)
      string    = string.replace(/^\^/, "")
      
      string.replace /([^\.]+)?(\.{2})([^\.]+)?/, (_, startsOn, operator, endsOn) =>
        isRange = true
        range   = []
        range.push @parseValue(startsOn, ["$gte"]) if !!(startsOn && startsOn.match(/^\d/))
        range.push @parseValue(endsOn, ["$lte"])   if !!(endsOn && endsOn.match(/^\d/))
        values.push range
      
      unless isRange
        values.push [@parseValue(string, ["$eq"])]
      
    values
    
  parseValue: (value, operators) ->
    super(parseFloat(value), operators)
    
class Tower.Dispatch.Param.Array extends Tower.Dispatch.Param
  parse: (value) ->
    values  = []
    array   = value.toString().split(/[,\|]/)
    
    for string in array
      isRange   = false
      negation  = !!string.match(/^\^/)
      string    = string.replace(/^\^/, "")
      
      string.replace /([^\.]+)?(\.{2})([^\.]+)?/, (_, startsOn, operator, endsOn) =>
        isRange = true
        range   = []
        range.push @parseValue(startsOn, ["$gte"]) if !!(startsOn && startsOn.match(/^\d/))
        range.push @parseValue(endsOn, ["$lte"])   if !!(endsOn && endsOn.match(/^\d/))
        values.push range
      
      unless isRange
        values.push [@parseValue(string, ["$eq"])]
      
    values

module.exports = Tower.Dispatch.Param
