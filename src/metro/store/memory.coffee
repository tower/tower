class Metro.Store.Memory extends Metro.Store
  constructor: (options) ->
    super(options)
    
    @records  = {}
    @lastId   = 0
  
  # Add index, passing in an array of attribute names
  # 
  #   store.addIndex("email", "active")
  addIndex: ->
    attributes  = Array.prototype.slice.call(arguments, 0, arguments.length)
    @index[attributes] = key
    @
  
  # Remove index, passing in an array of attribute names  
  removeIndex: ->
    attributes  = Array.prototype.slice.call(arguments, 0, arguments.length)
    delete @index[attributes]
    @
  
  # Find all matches, given an options hash.
  # 
  # This options hash is the result of chained criteria for a Model,
  # or you can manually write it.
  #
  # @example Find where `createdAt` is greater than or equal to 2 days ago
  # 
  #     store.find ">=": "createdAt": 2.days().ago()
  # 
  # @example Find where `email` matches "gmail.com".
  # 
  #     store.find "=~": "email": /gmail\.com/
  #     store.find "=~": "email": "gmail.com"
  #     store.find "email": /gmail\.com/
  # 
  # @example Find where `tags` at least has one of the following...
  # 
  #     store.find _any: tags: ["tomato", "cucumber"]
  # 
  # @example Find where `tags` must have all of the following...
  # 
  #     store.find _all: tags: ["tomato", "cucumber"]
  # 
  all: (query, options, callback) ->
    result  = []
    records = @records
    self    = @
    
    if Metro.Support.Object.isPresent(query)
      sort    = query._sort
      limit   = query._limit || Metro.Store.defaultLimit
      
      for key, record of records
        result.push(record) if @matches(record, query)
        # break if result.length >= limit
      
      result = @sort(result, query._sort) if sort
      
      result = result[0..limit - 1] if limit
    else
      for key, record of records
        result.push(record)
    
    callback.call(self, null, result) if callback

    result
  
  first: (query, options, callback) ->
    record = null
    @all query, (error, records) -> 
      record = records[0]
      callback.call(@, error, record) if callback
    record
  
  last: (query, options, callback) ->
    record = null
    @all query, (error, records) -> 
      record = records[records.length - 1]
      callback.call(@, error, record) if callback
    record
  
  count: (query, options, callback) ->
    result = 0
    @all query, (error, records) -> 
      result = records.length
      callback.call(@, error, result) if callback
    result
  
  deleteAll: (query, options, callback) ->
    _records = @records
    
    @all query, (error, records) ->
      unless error
        for record in records
          _records.splice(_records.indexOf(record), 1)
      callback.call(@, error, records) if callback
    
  clear: ->
    @records = []
    
  create: (attributes, callback) ->
    attributes.id ?= @generateId()
    record        = @serializeAttributes(attributes)
    @records[attributes.id] = record
    callback.call @, null, record if callback
    record
    
  update: (query, attributes, callback) ->
    self = @
    
    @all query, (error, records) ->
      unless error
        for record, i in records
          for key, value of attributes
            self._updateAttribute(record.attributes, key, value)
            
      callback.call(@, error, records) if callback
  
  destroy: (record) ->
    @find(id).destroy()
  
  # store.sort [{one: "two", hello: "world"}, {one: "four", hello: "sky"}], [["one", "asc"], ["hello", "desc"]]
  sort: ->
    Metro.Support.Array.sortBy(arguments...)
    
  matches: (record, query) ->
    self    = @
    success = true
    
    for key, value of query
      continue if !!Metro.Store.reservedOperators[key]
      recordValue = record[key]
      if typeof(value) == 'object'
        success = self._matchesOperators(record, recordValue, value)
      else
        value = value.call(record) if typeof(value) == "function"
        success = recordValue == value
      return false unless success
    
    true
  
  generateId: ->
    @lastId++
    
  _updateAttribute: (attributes, key, value) ->
    if @_atomicModifier(key)
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
      if operator = Metro.Store.queryOperators[key]
        value = value.call(record) if typeof(value) == "function"
        switch operator
          when "gt"
            success = self._isGreaterThan(recordValue, value)
          when "gte"
            success = self._isGreaterThanOrEqualTo(recordValue, value)
          when "lt"
            success = self._isLessThan(recordValue, value)
          when "lte"
            success = self._isLessThanOrEqualTo(recordValue, value)
          when "eq"
            success = self._isEqualTo(recordValue, value)
          when "neq"
            success = self._isNotEqualTo(recordValue, value)
          when "m"
            success = self._isMatchOf(recordValue, value)
          when "nm"
            success = self._isNotMatchOf(recordValue, value)
          when "any"
            success = self._anyIn(recordValue, value)
          when "all"
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
  
module.exports = Metro.Store.Memory
