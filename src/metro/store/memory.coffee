class Memory
  constructor: ->
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
  find: (query, callback) ->  
    result  = []
    records = @records
    
    if query
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
    
    callback(result) if callback

    result
    
  @alias "select", "find"
  
  first: (query, callback) ->
    result = @find(query, (records) -> callback(records[0]) if callback)
    result[0]
  
  last: (query, callback) ->
    result = @find(query, (records) -> callback(records[records.length - 1]) if callback)
    result[result.length - 1]
  
  all: (query, callback) ->
    @find(query, callback)

  length: (query, callback) ->
    @find(query, (records) -> callback(records.length) if callback).length
    
  @alias "count", "length"
    
  remove: (query, callback) ->
    _records = @records
    
    @select query, (records) ->
      for record in records
        _records.splice(_records.indexOf(record), 1)
      callback(records) if callback
    
  clear: ->
    @records = []
    
  toArray: ->
    @records
    
  create: (record) ->  
    Metro.raise("errors.store.missing_attribute", "id", "Store#create", record) unless record.id
    record.id ?= @generateId()
    @records[record.id] = record
    
  update: (record) ->
    Metro.raise("errors.store.missing_attribute", "id", "Store#update", record) unless record.id
    @records[record.id] = record
  
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
      
      if typeof(value) == 'object'
        success = self._matchesOperators(record[key], value)
      else
        success = record[key] == value
      return false unless success
    
    true
  
  generateId: ->
    @lastId++
    
  _matchesOperators: (record_value, operators) ->
    success = true
    self    = @
    
    for key, value of operators
      if operator = Metro.Store.queryOperators[key]
        switch operator
          when "gt"
            success = self._isGreaterThan(record_value, value)
          when "gte"
            success = self._isGreaterThanOrEqualTo(record_value, value)
          when "lt"
            success = self._isLessThan(record_value, value)
          when "lte"
            success = self._isLessThanOrEqualTo(record_value, value)
          when "eq"
            success = self._isEqualTo(record_value, value)
          when "neq"
            success = self._isNotEqualTo(record_value, value)
          when "m"
            success = self._isMatchOf(record_value, value)
          when "nm"
            success = self._isNotMatchOf(record_value, value)
          when "any"
            success = self._anyIn(record_value, value)
          when "all"
            success = self._allIn(record_value, value)
        return false unless success
      else
        return record_value == operators
    
    true
  
  _isGreaterThan: (record_value, value) ->
    record_value > value
    
  _isGreaterThanOrEqualTo: (record_value, value) ->
    record_value >= value
    
  _isLessThan: (record_value, value) ->
    record_value < value
    
  _isLessThanOrEqualTo: (record_value, value) ->
    record_value <= value
    
  _isEqualTo: (record_value, value) ->
    record_value == value
    
  _isNotEqualTo: (record_value, value) ->
    record_value != value
  
  _isMatchOf: (record_value, value) ->
    !!(if typeof(record_value) == "string" then record_value.match(value) else record_value.exec(value))
    
  _isNotMatchOf: (record_value, value) ->
    !!!(if typeof(record_value) == "string" then record_value.match(value) else record_value.exec(value))
    
  _anyIn: (record_value, array) ->
    for value in array
      return true if record_value.indexOf(value) > -1
    false
    
  _allIn: (record_value, value) ->
    for value in array
      return false if record_value.indexOf(value) == -1
    true
  
module.exports = Memory
