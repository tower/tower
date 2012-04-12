# @module
Tower.Store.Memory.Finders =

  # @see Tower.Store#find
  find: (criteria, callback) ->
    result      = []
    records     = @records
    conditions  = criteria.conditions()
    options     = criteria

    if _.isPresent(conditions)
      sort        = options.get('order')
      limit       = options.get('limit')# || Tower.Store.defaultLimit
      startIndex  = options.get('offset') || 0

      for key, record of records
        result.push(record) if @matches(record, conditions)
        # break if result.length >= limit

      result    = @sort(result, sort) if sort.length

      endIndex  = startIndex + (limit || result.length) - 1

      result    = result[startIndex..endIndex]
    else
      for key, record of records
        result.push(record)

    #result = criteria.export(result) if result.length

    result = callback.call(@, null, result) if callback

    result

  # @see Tower.Store#findOne
  findOne: (criteria, callback) ->
    record = undefined

    criteria.limit(1)

    @find criteria, (error, records) =>
      record = records[0] || null
      callback.call(@, error, record) if callback

    record

  # @see Tower.Store#count
  count: (criteria, callback) ->
    result = undefined

    @find criteria, (error, records) =>
      result = records.length
      callback.call(@, error, result) if callback

    result

  # @see Tower.Store#exists
  exists: (criteria, callback) ->
    result = undefined

    @count criteria, (error, record) =>
      result = !!record
      callback.call(@, error, result) if callback

    result

  # store.sort [{one: "two", hello: "world"}, {one: "four", hello: "sky"}], [["one", "asc"], ["hello", "desc"]]
  sort: (records, sortings) ->
    _.sortBy(records, sortings...)

  matches: (record, query) ->
    self    = @
    success = true
    schema  = @schema()

    for key, value of query
      recordValue = record.get(key)
      if _.isRegExp(value)
        success = recordValue.match(value)
      else if typeof value == "object"
        success = self._matchesOperators(record, recordValue, value)
      else
        value = value.call(record) if typeof(value) == "function"
        success = recordValue == value
      return false unless success

    true

  _matchesOperators: (record, recordValue, operators) ->
    success = true
    self    = @

    for key, value of operators
      if operator = Tower.Store.queryOperators[key]
        value = value.call(record) if _.isFunction(value)
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
          when "$regex", "$match"
            success = self._isMatchOf(recordValue, value)
          when "$notMatch"
            success = self._isNotMatchOf(recordValue, value)
          when "$all"
            success = self._allIn(recordValue, value)
          when "$near"
            success = self._near(recordValue, value)
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
  
  _near: (recordValue, coordinates) ->
    # TODO
    false

module.exports = Tower.Store.Memory.Finders
