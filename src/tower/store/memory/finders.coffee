Tower.Store.Memory.Finders =
  find: (conditions, options, callback) ->
    result  = []
    records = @records
    
    if Tower.Support.Object.isPresent(conditions)
      sort    = options.sort
      limit   = options.limit || Tower.Store.defaultLimit
      
      for key, record of records
        result.push(record) if @matches(record, conditions)
        # break if result.length >= limit
      
      result = @sort(result, sort) if sort
      
      result = result[0..limit - 1] if limit
    else
      for key, record of records
        result.push(record)
    
    callback.call(@, null, result) if callback
    
    result
    
  findOne: (conditions, options, callback) ->
    record = null
    options.limit = 1
    @find conditions, options, (error, records) => 
      record = records[0]
      callback.call(@, error, record) if callback
    record
  
  count: (conditions, options, callback) ->
    result = 0
    @find conditions, options, (error, records) =>
      result = records.length
      callback.call(@, error, result) if callback
    result
    
  exists: (conditions, options, callback) ->
    result = false
    
    @count conditions, options, (error, record) =>
      result = !!record
      callback.call(@, error, result) if callback
    
    result
    
  # store.sort [{one: "two", hello: "world"}, {one: "four", hello: "sky"}], [["one", "asc"], ["hello", "desc"]]
  sort: (records, sortings) ->
    Tower.Support.Array.sortBy(records, sortings...)
    
module.exports = Tower.Store.Memory.Finders
