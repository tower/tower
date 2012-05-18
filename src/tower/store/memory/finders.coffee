# @module
Tower.Store.Memory.Finders =
  # @see Tower.Store#find
  find: (criteria, callback) ->
    result      = []
    records     = @records
    conditions  = criteria.conditions()
    usingGeo    = @_conditionsUseGeo(conditions)
    options     = criteria

    # If $near, calculate and add __distance to all records. Remove $near from conditions
    if usingGeo
      @_calculateDistances(records, @_getCoordinatesFromConditions(conditions))
      @_prepareConditionsForTesting(conditions)

    if _.isPresent(conditions)
      for key, record of records
        result.push(record) if Tower.Store.Operators.test(record, conditions)
    else
      for key, record of records
        result.push(record)

    sort        = if usingGeo then @_getGeoSortCriteria() else options.get('order')
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

  # TODO: Unhardcode coordinates field
  _getCoordinatesFromConditions: (conditions) ->
    conditions.coordinates['$near'] if _.isObject(conditions) && conditions.coordinates?

  _getGeoSortCriteria: ->
    [['__distance','asc']]

  # TODO: Unhardcode coordinates field
  _calculateDistances: (records, nearCoordinate) ->
    center = {latitude: nearCoordinate.lat, longitude: nearCoordinate.lng}
    for index, record of records
      coordinates = record.get('coordinates')
      coordinates = {latitude: coordinates.lat, longitude: coordinates.lng}

      record.__distance = Tower.Support.Geo.getDistance(center, coordinates)

  # Adjusts the given conditions so they can be used
  _prepareConditionsForTesting: (conditions) ->
    return unless _.isPresent(conditions) && conditions.coordinates?
    delete conditions.coordinates['$near']

  _conditionsUseGeo: (conditions) ->
    return false unless _.isObject(conditions)
    return true for key, value of conditions when _.isPresent(value['$near']) || _.isPresent(value['$maxDistance'])

module.exports = Tower.Store.Memory.Finders
