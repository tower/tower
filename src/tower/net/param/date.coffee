class Tower.Net.Param.Date extends Tower.Net.Param
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
    super(_.toDate(value), operators)

module.exports = Tower.Net.Param.Date
