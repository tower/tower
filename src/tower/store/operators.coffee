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
    '!~':         '$nm'
    '$nm':        '$nm'
    '==':         '$eq'
    '$eq':        '$eq'
    '!=':         '$neq'
    '$neq':       '$neq'
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
    
  testValue: (recordValue, operators, record) ->
    success = true
    
    switch typeof operators
      when 'number', 'string', 'undefined', 'null', 'NaN'
        success = recordValue == operators
      else
        if _.isRegExp(operators)
          success = @match(recordValue, operators)
        else
          for key, value of operators
            if operator = Tower.Store.Operators.MAP[key]
              success   = @[operator.replace('$', '')](recordValue, value, record)
            else
              success   = recordValue == operators
    
            return false unless success
    
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
        return true if recordValue.indexOf(value) != -1
    else
      for value in array
        return true if recordValue == value
    false

  allIn: (recordValue, array) ->
    array = _.castArray(array)
    
    if _.isArray(recordValue)
      for value in array
        return false if _.indexOf(recordValue, value) == -1
    else
      for value in array
        return false if recordValue != value
    true

  notInAny: (recordValue, array) ->
    array = _.castArray(array)
    
    if _.isArray(recordValue)
      for value in array
        return true if _.indexOf(recordValue, value) != -1
    else
      for value in array
        return true if recordValue == value
        
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
