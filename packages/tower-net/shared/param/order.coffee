# Specifies what properties are sortable
# 
# @todo create ability limit sortable properties, in case 
# you don't want to allow the user to sort specific properties
class Tower.Net.Param.Order extends Tower.Net.Param
  parse: (value) ->
    values  = []
    array   = value.toString().split(/\s*,/)

    for string in array
      string.replace /([\w-]+[^\-\+])([\+\-])?/, (_, token, operator) =>
        operator    = if operator == "-" then "DESC" else "ASC"
        token       = @_clean(token)
        controller  = @controller

        #if controller
        #  param = controller.params()[token]

        values.push token, operator

    values

module.exports = Tower.Net.Param.Order
