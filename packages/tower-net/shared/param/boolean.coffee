class Tower.NetParamBoolean extends Tower.NetParam
  parse: (value) ->
    values  = []
    array   = value.toString().split(/[,\|]/)

    for string in array
      continue if _.isEmpty(string)
      string    = string.replace(/^\^/, '')

      values.push [@parseValue(string, ['$eq'])]

    values

  parseValue: (value, operators) ->
    super(!!(/^(true|1)$/i).test(value), operators)
    # super(parseFloat(value), operators)

module.exports = Tower.NetParamBoolean
