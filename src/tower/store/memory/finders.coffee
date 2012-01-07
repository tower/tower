Tower.Store.Memory.Finders =  
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
    
    if Tower.Support.Object.isPresent(query)
      sort    = options.sort
      limit   = options.limit || Tower.Store.defaultLimit
      
      for key, record of records
        result.push(record) if @matches(record, query)
        # break if result.length >= limit
      
      result = @sort(result, sort) if sort
      
      result = result[0..limit - 1] if limit
    else
      for key, record of records
        result.push(record)
    
    callback.call(self, null, result) if callback

    result
  
  first: (query, options, callback) ->
    record = null
    @all query, options, (error, records) -> 
      record = records[0]
      callback.call(@, error, record) if callback
    record
  
  last: (query, options, callback) ->
    record = null
    @all query, options, (error, records) -> 
      record = records[records.length - 1]
      callback.call(@, error, record) if callback
    record
  
  count: (query, options, callback) ->
    result = 0
    
    @all query, options, (error, records) -> 
      result = records.length
      callback.call(@, error, result) if callback
      
    result
    
  # store.sort [{one: "two", hello: "world"}, {one: "four", hello: "sky"}], [["one", "asc"], ["hello", "desc"]]
  sort: ->
    Tower.Support.Array.sortBy(arguments...)
    
module.exports = Tower.Store.Memory.Finders
