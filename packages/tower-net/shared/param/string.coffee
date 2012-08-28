class Tower.NetParamString extends Tower.NetParam
  constructor: (key, options = {}) ->
    super(key, options)

    @exact = options.exact == true
  # @todo think of more robust ways of searching API's
  # @example Regex
  #   # For now, you can search by one regex, it can't be used inside a non-regex search
  #   ?title=/tower/
  #   # can't do this:
  #   ?title=-asp,/tower/
  #   # ... but at some point we should handle that, perhaps merging regexps.
  parse: (value) ->
    return [[@parseValue(value, ['$eq'])]] if @exact

    # if you search for regex directly
    value   = value.trim()
    arrays  = null
    value.replace /^\/([^\/]+)\/(gi)?$/, (_, $1) => # matches /asdf/
      arrays = [[@parseValue([@_clean($1)], ['$regex'])]]

    return arrays if arrays

    arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/g)

    for node, i in arrays
      values = []

      # ([\+\-\^]?[\w@\-_\s\d\.\$]+|-?\'[\w@-_\s\d\+\.\$]+\')
      # /([\+\-\^]?[^'-]+|-?\'[^'-]+\')/g
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

module.exports = Tower.NetParamString
