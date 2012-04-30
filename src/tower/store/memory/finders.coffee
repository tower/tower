# @module
Tower.Store.Memory.Finders =
  # @see Tower.Store#find
  find: (criteria, callback) ->
    result      = []
    records     = @records
    conditions  = criteria.conditions()
    
    options     = criteria
    
    if _.isPresent(conditions)
      for key, record of records
        result.push(record) if Tower.Store.Operators.test(record, conditions)
    else
      for key, record of records
        result.push(record)

    sort        = options.get('order')
    limit       = options.get('limit')# || Tower.Store.defaultLimit
    startIndex  = options.get('offset') || 0
    
    result    = @sort(result, sort) if sort.length
    
    endIndex  = startIndex + (limit || result.length) - 1

    result    = result[startIndex..endIndex]
    
    result    = callback.call(@, null, result) if callback
    
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

  # store.sort [{one: 'two', hello: 'world'}, {one: 'four', hello: 'sky'}], [['one', 'asc'], ['hello', 'desc']]
  sort: (records, sortings) ->
    _.sortBy(records, sortings...)

module.exports = Tower.Store.Memory.Finders
