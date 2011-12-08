class Metro.Net.Param
  initialize: (key, options = {}) ->
    self.controller = options.controller
    self.key        = key.toString()
    self.modelName  = options.modelName
    self.namespace  = self.modelName.toS.pluralize.toSym if modelName.present?
    self.exact      = options.exact || false
    self.default    = options.default
  
  parse: (value) -> value
  
  render: (value) -> value
  
  parseValue: (value, operators) ->
    namespace: @namespace, key: @key, operators: operators, value: value
  
  _clean: (string) ->
    string.gsub(/^-/, "").gsub(/^\+-/, "").gsub(/^'|'$/, "").gsub("+", " ").gsub(/^\^/, "").gsub(/\$$/, "").strip

class Metro.Net.Param.String extends Metro.Net.Param
  parse: (value) ->
    arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/).map (node) ->
      values = []
      
      # ([\+\-\^]?[\w@\-_\s\d\.\$]+|-?\'[\w@-_\s\d\+\.\$]+\')
      node.scan(/([\+\-\^]?[\w@_\s\d\.\$]+|-?\'[\w@-_\s\d\+\.\$]+\')/).flatten.each (token) ->
        token.gsub!(/^\+?-+/, "")
        negation = $& && $&.length > 0
        token.gsub!(/^\'(.+)\'$/, "\\1")
        exact    = $& && $&.length > 0
        
        if negation
          operators = [exact ? "!=" : "!~"]
        else
          operators = [exact ? "=" : "=~"]
        end
        
        operators << "^" if token =~ /^\+?\-?\^/
        operators << "$" if token =~ /\$$/
        
        values    << parseValue(clean(token), operators)
      end
      
      values

class Metro.Net.Param.Number extends Metro.Net.Param
  parse: (value) ->
    values  = []
    
    value.toS.split(/[,\|]/).each (string) ->
      if string.match(/([^\.]+)?(\.{2})([^\.]+)?/)
        startsOn  = RegExp.$1
        operator  = RegExp.$2
        endsOn    = RegExp.$3
        range     = []
        range.push parseValue(startsOn, [">="]) if Metro.Support.Object.present(startsOn) && startsOn.match(/^\d/)
        range.push parseValue(endsOn, ["<="])   if Metro.Support.Object.present(endsOn) && endsOn.match(/^\d/)
        values.push range
      else
        values.push [parseValue(string, ["="])]
    
    values
  
  parseValue: (value, operators) ->
    super(value.toI, operators) # or toF ?

class Metro.Net.Param.Limit extends Metro.Net.Param
  parse: (value) ->
    result = value.toS.scan(/(\d+)/).flatten[0]
    Metro.Support.Object.present(result) ? result.toI : self.default
  
  render: (value) ->
    parse(value)

class Metro.Net.Param.Time extends Metro.Net.Param
  parse: (value, as = "time") ->
    values  = []

    value.toS.split(/[\s,\+]/).each (string) ->
      if string =~ /([^\.]+)?(\.\.)([^\.]+)?/
        startsOn, operator, endsOn = $1, $2, $3
        range   = []
        range   << parseValue(startsOn, [">="]) if !!(startsOn.present? && startsOn =~ /^\d/)
        range   << parseValue(endsOn, ["<="])   if !!(endsOn.present? && endsOn =~ /^\d/)
        values  << range
      else
        values  << [parseValue(string, ["="])]

    values

  parseValue: (value, operators) ->
    super(::Time.zone.parse(value), operators)

class Metro.Net.Param.Date extends Metro.Net.Param.Time
  parse: (value) ->
    super(value, "date")
    
class Metro.Net.Param.Order extends Metro.Net.Param
  parse: (value) ->
    value.split(",").map (string) ->
      string.scan(/([\w-]+[^\-\+])([\+\-])?/).map do |token, operator|
        operator = operator == "-" ? "-" : "+"
        token    = clean(token)
        
        if controller.present?
          param = controller.find(token)
          token = param.tableKey
        end

        {:namespace => namespace, :key => token, :operators => [operator]}
  
  
  orderHash: (value) ->
    value.split(",").inject(ActiveSupport::OrderedHash.new) do |hash, string|
      string.scan(/([\w-]+[^\-\+])([\+\-])?/).each do |token, operator|
        hash[clean(token)] = operator == "-" ? "-" : "+"
      end
      hash
      
class Metro.Net.Param.Offset extends Metro.Net.Param
  parse: (value) ->
    result = value.toS.scan(/(\d+)/).flatten[0]
    result.present? ? result.toI : self.default
  
  render: (value) ->
    parse(value)

# Todo
class Metro.Net.Param.Geo extends Metro.Net.Param
  parse: (value) ->
    value.toS.split(/,\s*/).map(&:toF) # [41.31419, -88.1847]
  
  render: (value) ->
    parse(value)

module.exports = Metro.Net.Param
