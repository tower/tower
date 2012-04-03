class Tower.HTTP.Param.Order extends Tower.HTTP.Param
  parse: (value) ->
    values  = []
    array   = value.toString().split(/\s*,/)

    for string in array
      string.replace /([\w-]+[^\-\+])([\+\-])?/, (_, token, operator) =>
        operator    = operator == "-" ? "-" : "+"
        token       = @_clean(token)
        controller  = @controller

        #if controller
        #  param = controller.params()[token]

        values.push token, operator

    values

module.exports = Tower.HTTP.Param.Order
