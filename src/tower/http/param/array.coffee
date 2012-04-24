# @example
#   /?tags=[rails],-[-node,javascript],-[grails],-java,[male,-female]
#   /?tags=rails,node
#   /?tags=rails,-[flex,.net]
class Tower.HTTP.Param.Array extends Tower.HTTP.Param
  parse: (value) ->
    values    = []
    # [rails],-[-node,javascript],-[grails],-java,[male,-female]
    array     = value.toString().split(/(-?\[[^\]]+\]|-?\w+)/g)
    
    for string in array
      negatedSet    = false
      isSet         = false
      
      continue if _.isBlank(string)
      
      string        = string.replace /^(-)/, (_, $1) ->
        negatedSet  = !!($1 && $1.length > 0)
        ""
      
      string        = string.replace /([\[\]])/g, (_, $1) ->
        isSet       = !!($1 && $1.length > 0)
        ""
      
      continue if _.isBlank(string)
      
      tokens        = string.split(/,/g)
      set           = []
      
      for token in tokens
        negated     = false
        
        token       = token.replace /^(-)/, (_, $1) ->
          negated   = !!($1 && $1.length > 0)
          ""
          
        continue if _.isBlank(token)
        
        if isSet
          operators = [if negated || negatedSet then '$notInAll' else '$allIn']
        else
          operators = [if negated || negatedSet then '$notInAny' else '$anyIn']
        
        set.push @parseValue([token], operators)
      
      values.push set
      
    values

module.exports = Tower.HTTP.Param.Array
