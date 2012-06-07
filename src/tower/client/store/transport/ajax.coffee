Tower.Store.Transport.Ajax =
  requests: []
  enabled:  true
  pending:  false

  defaults:
    contentType: 'application/json'
    dataType:    'json'
    processData: false
    headers:     {'X-Requested-With': 'XMLHttpRequest'}

  ajax: (params, defaults) ->
    $.ajax($.extend({}, @defaults, defaults, params))

  toJSON: (record, method, format) ->
    data          = {}
    data[record.constructor.toKey()] = record
    data._method  = method
    data.format   = format
    JSON.stringify(data)

  disable: (callback) ->
    if @enabled
      @enabled = false
      do callback
      @enabled = true
    else
      do callback

  requestNext: ->
    next = @requests.shift()
    if next
      @request(next)
    else
      @pending = false

  request: (callback) ->
    (do callback).complete(=> do @requestNext)

  queue: (callback) ->
    return unless @enabled

    if @pending
      @requests.push(callback)
    else
      @pending = true
      @request(callback)

    callback

  success: (record, options = {}) ->
    (data, status, xhr) =>
      Ajax.disable =>
        if data && !_.isBlank(data)
          record.updateAttributes(data, sync: false)

      #@record.trigger('ajaxSuccess', data, status, xhr)
      options.success?.apply(@record)

  failure: (record, options = {}) ->
    (xhr, statusText, error) =>
      options.error?.apply(record)
    
  willCreateRecords: (records, options = {}) ->
    json  = @toJSON(records)
    url   = Tower.urlFor(records.constructor)
    
    @queue =>
      params =
        url:  url
        type: "POST"
        data: json

      @ajax(options, params).success(@createSuccess(records)).error(@createFailure(records))

  createSuccess: (record) ->
    (data, status, xhr) =>
      id = record.id
      record = @find(id)
      @records[data.id] = record
      delete @records[id]
      record.updateAttributes data

  createFailure: (record) ->
    @failure(record)

  didCreateRecords: (records) ->

  updateRequest: (record, options, callback) ->
    @queue =>
      params =
        type: "PUT"
        data: @toJSON(record)

      @ajax({}, params)
        .success(@updateSuccess(record))
        .error(@updateFailure(record))

  updateSuccess: (record) ->
    (data, status, xhr) =>
      record = Tower.constant(@className).find(record.id)
      record.updateAttributes(data)

  updateFailure: (record) ->
    (xhr, statusText, error) =>

  destroyRequest: (record, criteria) ->
    @queue =>
      # haven't yet handled arrays.
      record  = record[0] if _.isArray(record)
      url     = Tower.urlFor(record)

      params  =
        url:        url
        type:       'POST'
        data:       JSON.stringify(
          format:   'json'
          _method:  'DELETE'
        )

      @ajax({}, params)
        .success(@destroySuccess(record))
        .error(@destroyFailure(record))

  destroySuccess: (data) ->
    (data, status, xhr) =>
      delete @deleted[data.id]

  destroyFailure: (record) ->
    (xhr, statusText, error) =>

  findSuccess: (criteria, callback) ->
    # `data` will look like this:
    # {users: [user1, user1...], conditions: {}, page: 2, limit: 20, sort: []}
    # and all we need to do is load it back into the criteria
    (data, status, xhr) =>
      if _.isPresent(data)
        @load(data)

  findFailure: (criteria, callback) ->
    (xhr, statusText, error) =>

  # Makes a request with JSON like this:
  #     {
  #       "sort": ["firstName", "asc"],
  #       "page": 2,
  #       "limit": 20,
  #       "conditions": [{"firstName": {"=~": "/^[az]/i"}}]
  #     }
  # 
  # And you get a response back like this:
  #     {
  #       "sort": ["firstName", "asc"],
  #       "page": 2,
  #       "limit": 20,
  #       "conditions": [{"firstName": {"=~": "/^[az]/i"}}],
  #       "count": 337,
  #       "data": [{"firstName": "Andy"}, {"firstName": "Zach"}, ...]
  #     }
  # 
  # If you want to just `count` the records, or test if they exist,
  # you can add a boolean key to the JSON request:
  #     {"count": true}
  # 
  # @todo Once you reach the end of your paginated collection,
  #   it should no longer make requests.
  #
  # Say you first search for all users with `firstName` starting with the letter "a",
  # then you search for all users with `firstName` starting with either letter "a" or "b".
  # When you do the first search, say it returns the first page of 20 records.
  # Then when you do the next search, what should happen?  It's not smart enough
  # to know it's already fetched those records, so it will return them again.
  # There is the possibility that we test all the records currently on the client against the
  # fetching criteria, and append the ids of the matching records to the `conditions` field.
  # This way that "a" or "b" request might look like this:
  #     {
  #       "page": 1,
  #       "limit": 20,
  #       "conditions": [{"firstName": {"=~": "/^[ab]/i"}, "id": {"$notIn": [1, 2, 3...]}}]
  #     }
  # 
  # ... we'll have to run performance tests to see if this kind of optimization actually helps.
  # It would be preventing the serialization of, in this case, 20 records we already have on the client, 
  # which decreases the amount of data we have to send over the wire.  But the extra complexity of
  # that `$notIn` query might slow the query down enough to nullify benefit you'd get from decreasing
  # the size of the data sent over the wire.
  # 
  # Ooh, this just made me think.  One way to be able to do real-time pub/sub from client to server
  # is to have the server TCP request a list of ids or `updatedAt` values from the client to do the diff...
  find: (criteria, callback) ->
    params = @serializeParamsForFind(criteria)
    
    @queue =>
      @ajax({}, params)
        .success(@findSuccess(criteria, callback))
        .error(@findFailure(criteria, callback))

  serializeParamsForFind: (criteria) ->
    url     = Tower.urlFor(criteria.model)
    data    = criteria.toJSON()

    type: 'POST'
    data: JSON.stringify(data)
    url:  url

module.exports = Tower.Store.Transport.Ajax
