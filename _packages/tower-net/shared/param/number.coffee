class Tower.NetParamNumber extends Tower.NetParam
  constructor: (key, options = {}) ->
    super(key, options)
    # For `page` and `limit` you don't want to allow negative numbers
    @allowNegative  = if options.hasOwnProperty('allowNegative') then !!options.allowNegative else true
    # @todo
    @allowFloat     = if options.hasOwnProperty('allowFloat') then !!options.allowFloat else true
    # By default the param will accept ranges, unless explicitly set to false
    range   = @allowRange  = if options.hasOwnProperty('allowRange') then !!options.allowRange else true
    @parse  = @parseRange if range

  parse: (value) ->
    values = []
    if typeof value == 'string'
      value = parseInt(value)
    if typeof value == 'number'
      unless !@allowNegative && value < 0
        values.push [@parseValue(value, ["$eq"])]
    values

  # @todo tmp hack
  extractValue: (value) ->
    value = @parse(value)[0]
    value = value[0].value if value?
    value

  parseRange: (value) ->
    values  = []
    array   = value.split(/[,\|]/)

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

module.exports = Tower.NetParamNumber
