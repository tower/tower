class Tower.Net.Param.String extends Tower.Net.Param
  parse: (value) ->
    arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/g)

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

        values.push @parseValue([@_clean(token)], operators)
        _

      arrays[i] = values

    arrays

module.exports = Tower.Net.Param.String
