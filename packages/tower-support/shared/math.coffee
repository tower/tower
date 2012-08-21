_.sum = (array) ->
  return 0 if !_.isArray(array) || array.length == 0
  _.reduce array, (sum, n) -> sum += n

_.isNonZero