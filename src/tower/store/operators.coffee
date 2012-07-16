Tower.Store.Operators =
  MAP:
    '>=':         '$gte'
    '$gte':       '$gte'
    '>':          '$gt'
    '$gt':        '$gt'
    '<=':         '$lte'
    '$lte':       '$lte'
    '<':          '$lt'
    '$lt':        '$lt'
    '$in':        '$anyIn'
    '$any':       '$anyIn'
    '$anyIn':     '$anyIn'
    '$nin':       '$notInAll'
    '$notIn':     '$notInAll'
    '$notInAny':  '$notInAny'
    '$all':       '$allIn'
    '=~':         '$match'
    '$m':         '$match'
    '$regex':     '$match'
    '$match':     '$match'
    '$notMatch':  '$notMatch'
    '!~':         '$notMatch'
    '$nm':        '$nm'
    '==':         '$eq'
    '=':          '$eq'
    '$eq':        '$eq'
    '!=':         '$ne'
    '$neq':       '$ne'
    '$ne':        '$ne'
    '$null':      '$null'
    '$notNull':   '$notNull'
    '$exists':    '$exists'
    '$size':      '$size'
    '$elemMatch': '$matchIn'
    '$matchIn':   '$matchIn'
    '$maxDistance': '$maxDistance'

  select: (records, conditions) ->
    _.select records, (record) => @test(record, conditions)

  matching: (records, conditions) ->
    _.select records, (record) => @test(record, conditions)

  notMatching: (records, conditions) ->
    _.select records, (record) => !@test(record, conditions)

  test: (record, conditions) ->
    success = true

    for key, value of conditions
      if key == '$or'
        success = @or record, value
      else if key == '$nor'
        success = @nor record, value
      else
        success = @testValue @_getValue(record, key), value, record

      return false unless success

    success

  testEach: (records, conditions, callback) ->
    for record in records
      callback.call(record, @test(record, conditions), record)
    undefined

  testValue: (recordValue, operators, record) ->
    success = true

    console.log "TESTING", recordValue, operators

    switch _.kind(operators)
      when 'number', 'string', 'float', 'NaN'
        success = recordValue == operators
      when 'undefined', 'null'
        success = recordValue == null || recordValue == undefined
      when 'date'
        success = recordValue.getTime() == operators.getTime()
      when 'array'
        success = _.isEqual(recordValue, operators)
      when 'regex'
        success = @match(recordValue, operators)
      else
        if _.isHash(operators) # simple object of operators
          for key, value of operators
            if operator = Tower.Store.Operators.MAP[key]
              success   = @[operator.replace('$', '')](recordValue, value, record)
            else
              success   = recordValue == operators

            return false unless success
        else # might be more comparable objects, like mongo ObjectIDs
          console.log "NOPE!", recordValue, operators
          success = _.isEqual(recordValue, operators)

    success

  gt: (recordValue, value) ->
    value? && recordValue? && recordValue > value

  gte: (recordValue, value) ->
    value? && recordValue? && recordValue >= value

  lt: (recordValue, value) ->
    value? && recordValue? && recordValue < value

  lte: (recordValue, value) ->
    value? && recordValue? && recordValue <= value

  eq: (recordValue, value) ->
    @_comparable(recordValue) == @_comparable(value)

  neq: (recordValue, value) ->
    @_comparable(recordValue) != @_comparable(value)

  match: (recordValue, value) ->
    !!(recordValue? && value? && if typeof(recordValue) == 'string' then recordValue.match(value) else recordValue.exec(value))

  notMatch: (recordValue, value) ->
    !@match(recordValue, value)

  anyIn: (recordValue, array) ->
    array = _.castArray(array)

    if _.isArray(recordValue)
      for value in array
        return true if _.include(recordValue, value)
    else
      for value in array
        return true if _.isEqual(recordValue, value)
    false

  allIn: (recordValue, array) ->
    array = _.castArray(array)

    if _.isArray(recordValue)
      for value in array
        return false if !_.include(recordValue, value)
    else
      for value in array
        return false if !_.isEqual(recordValue, value)
    true

  notInAny: (recordValue, array) ->
    array = _.castArray(array)

    if _.isArray(recordValue)
      for value in array
        return true if _.include(recordValue, value)
    else
      for value in array
        return true if _.isEqual(recordValue, value)

    false

  notInAll: (recordValue, array) ->
    array = _.castArray(array)

    if _.isArray(recordValue)
      for value in array
        return false if _.indexOf(recordValue, value) != -1
    else
      for value in array
        return false if recordValue == value
    true

  matchIn: (recordValue, value) ->
    return false unless _.isArray(recordValue)

    for item in recordValue
      return true if @test(item, value)

    false

  maxDistance: (recordValue, distance, record) ->
    distance? && record? && record.__distance? && record.__distance <= distance

  exists: (recordValue) ->
    recordValue != undefined

  # need to enforce being array
  size: (recordValue, value) ->
    _.isArray(recordValue) && recordValue.length == value

  or: (record, array) ->
    for conditions in array
      return true if @test(record, conditions)

    false

  nor: (record, array) ->
    for conditions in array
      return false if @test(record, conditions)

    true

  _comparable: (value) ->
    if _.isDate(value)
      value.getTime()
    else if _.isRegExp(value)
      value.toString()
    else
      value

  _getValue: (recordOrObject, key) ->
    if typeof recordOrObject.get == 'function'
      recordOrObject.get(key)
    else
      _.getNestedAttribute recordOrObject, key

Tower.Store.Operators.notIn = Tower.Store.Operators.notInAny

module.exports = Tower.Store.Operators
