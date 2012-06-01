# Soon this should handle batch requests.
# 
# Perhaps this Ajax store is not really a "store", but more of a "sync" protocol.
# Then, you can have an Ajax sync method for both Memory and LocalStorage.
class Tower.Store.Ajax extends Tower.Store.Memory
  @requests: []
  @enabled:  true
  @pending:  false

  init: ->
    @_super(arguments...)

    @deleted = {}

  @defaults:
    contentType: 'application/json'
    dataType:    'json'
    processData: false
    headers:     {'X-Requested-With': 'XMLHttpRequest'}

  @ajax: (params, defaults) ->
    $.ajax($.extend({}, @defaults, defaults, params))

  @toJSON: (record, method, format) ->
    data          = {}
    data[_.camelize(record.constructor.className(), true)] = record
    data._method  = method
    data.format   = format
    JSON.stringify(data)

  @disable: (callback) ->
    if @enabled
      @enabled = false
      do callback
      @enabled = true
    else
      do callback

  @requestNext: ->
    next = @requests.shift()
    if next
      @request(next)
    else
      @pending = false

  @request: (callback) ->
    (do callback).complete(=> do @requestNext)

  @queue: (callback) ->
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

  queue: (callback) ->
    @constructor.queue callback

  request: ->
    @constructor.request arguments...

  ajax: ->
    @constructor.ajax arguments...

  toJSON: ->
    @constructor.toJSON arguments...
    
  find: (criteria, callback) ->

  insert: (criteria, callback) ->
    unless criteria.sync == false
      @_super criteria, (error, records) =>
        callback.call(@, error, records) if callback
        @createRequest records, criteria
    else
      @_super(criteria, callback)

  update: (updates, criteria, callback) ->
    if criteria.sync == true
      @_super updates, criteria, (error, result) =>
        callback.call @, error, result if callback
        @updateRequest result, criteria
    else
      super

  destroy: (criteria, callback) ->
    unless criteria.sync == false
      @_super criteria, (error, result) =>
        @destroyRequest result, criteria
        callback.call @, error, result if callback
    else
      super

  createRequest: (records, options = {}) ->
    json  = @toJSON(records)
    url   = Tower.urlFor(records.constructor)
    @queue =>
      params =
        url:  url
        type: "POST"
        data: json

      @ajax(options, params)
        .success(@createSuccess(records))
        .error(@createFailure(records))

  createSuccess: (record) ->
    (data, status, xhr) =>
      id = record.id
      record = @find(id)
      @records[data.id] = record
      delete @records[id]
      record.updateAttributes data

  createFailure: (record) ->
    @failure(record)

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

  findRequest: (options) ->
    @queue =>
      params =
        type: "GET"
        data: @toJSON(record)

      @ajax({}, params)
        .success(@findSuccess(options))
        .error(@findFailure(options))

  findSuccess: (options) ->
    (data, status, xhr) =>
      if _.isPresent(data)
        @load(data)

  findFailure: (record) ->
    (xhr, statusText, error) =>

  findOneRequest: (options, callback) ->
    @queue =>
      params =
        type: "GET"
        data: @toJSON(record)

      @ajax({}, params)
        .success(@findSuccess(options))
        .error(@findFailure(options))

  findOneSuccess: (options) ->
    (data, status, xhr) =>

  findOneFailure: (options) ->
    (xhr, statusText, error) =>

  # @todo Removes all models and fetches new ones.
  # 
  # It has to manage all of the published cursors as well.
  refresh: ->
    
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
  fetch: (criteria, callback) ->
    params        = {}
    
    sort          = criteria.get('sort')
    conditions    = criteria.conditions()
    page          = criteria.get('page')
    limit         = criteria.get('limit')
    
    params.sort       = sort if sort
    params.conditions = conditions if conditions
    params.page       = page if page
    params.limit      = limit if limit
    
    @queue =>
      params =
        type: "POST"
        data: params

      @ajax({}, params)
        .success(@findSuccess(options))
        .error(@findFailure(options))