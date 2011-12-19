Coach.Store.Memory.Serialization =    
  matches: (record, query) ->
    self    = @
    success = true
    schema  = @schema()
    
    for key, value of query
      continue if !!Coach.Store.reservedOperators[key]
      recordValue = record[key]
      if Coach.Support.Object.isRegExp(value)
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
    if field && field.type == "Array" && !Coach.Support.Object.isArray(value)
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
      if operator = Coach.Store.queryOperators[key]
        value = value.call(record) if typeof(value) == "function"
        switch operator
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
          when "$any"
            success = self._anyIn(recordValue, value)
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
    for value in array
      return true if recordValue.indexOf(value) > -1
    false
    
  _allIn: (recordValue, value) ->
    for value in array
      return false if recordValue.indexOf(value) == -1
    true
  
module.exports = Coach.Store.Memory.Serialization
