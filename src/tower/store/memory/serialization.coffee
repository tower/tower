Tower.Store.Memory.Serialization =    
  matches: (record, query) ->
    self    = @
    success = true
    schema  = @schema()
    
    for key, value of query
      continue if !!Tower.Store.reservedOperators[key]
      recordValue = record.get(key)
      if Tower.Support.Object.isRegExp(value)
        success = recordValue.match(value)
      else if typeof value == "object"
        success = self._matchesOperators(record, recordValue, value)
      else
        value = value.call(record) if typeof(value) == "function"
        success = recordValue == value
      return false unless success
    
    true
  
  generateId: ->
    @lastId++
    
  _updateAttribute: (attributes, key, value) ->
    field       = @schema()[key]
    if field && field.type == "Array" && !Tower.Support.Object.isArray(value)
      attributes[key] ||= []
      attributes[key].push value
    else if @_atomicModifier(key)
      @["_#{key.replace("$", "")}AtomicUpdate"](attributes, value)
    else
      attributes[key] = value
    
  _atomicModifier: (key) ->
    !!@constructor.atomicModifiers[key]
    
  _pushAtomicUpdate: (attributes, value) ->
    for _key, _value of value
      attributes[_key] ||= []
      attributes[_key].push _value
    attributes
    
  _pullAtomicUpdate: (attributes, value) ->
    for _key, _value of value
      _attributeValue = attributes[_key]
      if _attributeValue
        for item in _value
          _attributeValue.splice _attributeValue.indexOf(item), 1
    attributes
    
  _matchesOperators: (record, recordValue, operators) ->
    success = true
    self    = @
    
    for key, value of operators
      if operator = Tower.Store.queryOperators[key]
        value = value.call(record) if typeof(value) == "function"
        switch operator
          when "$in", "$any"
            success = self._anyIn(recordValue, value)
          when "$nin"
            success = self._notIn(recordValue, value)
          when "$gt"
            success = self._isGreaterThan(recordValue, value)
          when "$gte"
            success = self._isGreaterThanOrEqualTo(recordValue, value)
          when "$lt"
            success = self._isLessThan(recordValue, value)
          when "$lte"
            success = self._isLessThanOrEqualTo(recordValue, value)
          when "$eq"
            success = self._isEqualTo(recordValue, value)
          when "$neq"
            success = self._isNotEqualTo(recordValue, value)
          when "$regex"
            success = self._isMatchOf(recordValue, value)
          when "$nm"
            success = self._isNotMatchOf(recordValue, value)
          when "$all"
            success = self._allIn(recordValue, value)
        return false unless success
      else
        return recordValue == operators
    
    true
  
  _isGreaterThan: (recordValue, value) ->
    recordValue && recordValue > value
    
  _isGreaterThanOrEqualTo: (recordValue, value) ->
    recordValue && recordValue >= value
    
  _isLessThan: (recordValue, value) ->
    recordValue && recordValue < value
    
  _isLessThanOrEqualTo: (recordValue, value) ->
    recordValue && recordValue <= value
    
  _isEqualTo: (recordValue, value) ->
    recordValue == value
    
  _isNotEqualTo: (recordValue, value) ->
    recordValue != value
  
  _isMatchOf: (recordValue, value) ->
    !!(if typeof(recordValue) == "string" then recordValue.match(value) else recordValue.exec(value))
    
  _isNotMatchOf: (recordValue, value) ->
    !!!(if typeof(recordValue) == "string" then recordValue.match(value) else recordValue.exec(value))
    
  _anyIn: (recordValue, array) ->
    if _.isArray(recordValue)
      for value in array
        return true if recordValue.indexOf(value) > -1
    else
      for value in array
        return true if recordValue == value
    false
    
  _notIn: (recordValue, array) ->
    if _.isArray(recordValue)
      for value in array
        return false if recordValue.indexOf(value) > -1
    else
      for value in array
        return false if recordValue == value
    true
    
  _allIn: (recordValue, array) ->
    if _.isArray(recordValue)
      for value in array
        return false if recordValue.indexOf(value) == -1
    else
      for value in array
        return false if recordValue != value
    true
  
module.exports = Tower.Store.Memory.Serialization
