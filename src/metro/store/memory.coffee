class Memory
  @operators:
    ">=":       "gte"
    "gte":      "gte"
    ">":        "gt"
    "gt":       "gt"
    "<=":       "lte"
    "lte":      "lte"
    "<":        "lt"
    "lt":       "lt"
    "in":       "in"
    "nin":      "nin"
    "any":      "any"
    "all":      "all"
    "=~":       "m"
    "m":        "m"
    "!~":       "nm"
    "nm":       "nm"
    "=":        "eq"
    "eq":       "eq"
    "!=":       "neq"
    "neq":      "neq"
    "..":       "bi"
    "...":      "be"
   
  constructor: ->
    @array    = [] # used to keep order
    @index    = 
      id:       {} # used for quick indexing by id
  
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
  find: (query, options, callback) ->
    # attributes  = _extract_attributes(query)
    array       = @array
    result      = []
    
    for item in array
      result.push(item) if @matches(item, query)
      
    callback.call(@, result)
    
    @
    
  first: ->
    
  last: ->
    
  create: ->
    
  destroy: ->
    
  set: ->
    
    
  remove: ->
    items       = Array.prototype.slice.call(arguments, 0, arguments.length)
    collection  = @collection
    for item in items
      index = collection.indexOf(item)
      colection.splice(index, 1) if index >= 0
      item.clear() if item.hasOwnProperty("clear")
    
  clear: ->  
    collection  = @collection
    while item = collection.pop()
      item.clear() if item.hasOwnProperty("clear")
    collection
    
  length: ->
    @collection.length
  
  toArray: ->
    @collection
    
  find: (id) ->
    record = @records[id]
    throw('Unknown record') unless record
    record.clone()

  exists: (id) ->
    try
      return @find(id)
    catch e
      return false

  refresh: (values, options = {}) ->
    @records = {} if options.clear
    records = @fromJSON(values)
    
    records = [records] unless isArray(records)

    for record in records
      record.newRecord    = false
      record.id           or= guid()
      @records[record.id] = record

    @trigger('refresh', not options.clear and records)
    @

  select: (callback) ->
    result = (record for id, record of @records when callback(record))
    @cloneArray(result)

  findByAttribute: (name, value) ->
    for id, record of @records
      if record[name] is value
        return record.clone()
    null

  findAllByAttribute: (name, value) ->
    @select (item) ->
      item[name] is value

  each: (callback) ->
    for key, value of @records
      callback(value.clone())

  all: ->
    @cloneArray(@recordsValues())

  first: ->
    record = @recordsValues()[0]
    record?.clone()

  last: ->
    values = @recordsValues()
    record = values[values.length - 1]
    record?.clone()

  count: ->
    @recordsValues().length
  
  deleteAll: ->
    for key, value of @records
      delete @records[key]

  destroyAll: ->
    for key, value of @records
      @records[key].destroy()

  update: (id, atts) ->
    @find(id).updateAttributes(atts)

  create: (atts) ->
    record = new @(atts)
    record.save()

  destroy: (id) ->
    @find(id).destroy()
  
  change: (callbackOrParams) ->
    if typeof callbackOrParams is 'function'
      @bind('change', callbackOrParams)
    else
      @trigger('change', callbackOrParams)
  
  fetch: (callbackOrParams) ->
    if typeof callbackOrParams is 'function'
      @bind('fetch', callbackOrParams)
    else
      @trigger('fetch', callbackOrParams)
  
  toJSON: ->
    @recordsValues()

  fromJSON: (objects) ->
    return unless objects
    if typeof objects is 'string'
      objects = JSON.parse(objects)
    if isArray(objects)
      (new @(value) for value in objects)
    else
      new @(objects)
      
  _operator: (key) ->
    @constructor.operators[key]
  
  _matches: (item, query) ->
    self    = @
    success = true
    
    for key, value of query
      if operator = self._operator(key)
        switch operator
          when "gt"
            success = self._isGreaterThan(item, value)
          when "gte"
            success = self._isGreaterThanOrEqualTo(item, value)
          when "lt"
            success = self._isLessThan(item, value)
          when "lte"
            success = self._isLessThanOrEqualTo(item, value)
          when "eq"
            success = self._isEqualTo(item, value)
          when "neq"
            success = self._isNotEqualTo(item, value)
          when "bi"
            success = self._isBetweenIncluding(item, value)
          when "be"
            success = self._isBetweenExcluding(item, value)
          when "m"
            success = self._isMatchOf(item, value)
          when "nm"
            success = self._isNotMatchOf(item, value)
          when "any"
            success = self._anyIn(item, value)
          when "all"
            success = self._allIn(item, value)
      else
        success = item[key] == value
      return false unless success
    
    true
  
  _isGreaterThan: (item, query) ->
    for attribute, value of query
      return false unless item[attribute] > value
    true
    
  _isGreaterThanOrEqualTo: (item, query) ->
    for attribute, value of query
      return false unless item[attribute] >= value
    true
    
  _isLessThan: (item, query) ->
    for attribute, value of query
      return false unless item[attribute] < value
    true
    
  _isLessThanOrEqualTo: (item, query) ->
    for attribute, value of query
      return false unless item[attribute] <= value
    true
    
  _isEqualTo: (item, query) ->
    for attribute, value of query
      return false unless item[attribute] == value
    true
    
  _isNotEqualTo: (item, query) ->
    for attribute, value of query
      return false unless item[attribute] != value
    true
    
  _isBetweenIncluding: (item, query) ->
    for attribute, value of query
      return false unless item[attribute] >= value[0] && item[attribute] <= value[1]
    true
    
  _isBetweenExcluding: (item, query) ->
    for attribute, value of query
      return false unless item[attribute] >= value[0] && item[attribute] < value[1]
    true
  
  _isMatchOf: (item, query) ->
    for attribute, value of query
      return false unless !!item[attribute].match(value)
    true
    
  _isNotMatchOf: (item, query) ->
    for attribute, value of query
      return false if !!item[attribute].match(value)
    true
    
  _anyIn: (item, query) ->
    for attribute, array of query
      item_array = item[attribute]
      for value in array
        return true if item_array.indexOf(value) > -1
    false
    
  _allIn: (item, query) ->
    for attribute, array of query
      item_array = item[attribute]
      for value in array
        return false if item_array.indexOf(value) == -1
    true
  
module.exports = Memory
