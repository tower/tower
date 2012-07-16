Tower.Store.Transport.Ajax =
  requests: []
  enabled:  true
  pending:  false
  requesting: false

  defaults:
    contentType: 'application/json'
    dataType:    'json'
    processData: false
    # Setting `async: false` makes it so you can do async data fetching without callbacks!
    # We only probably want this to be false on fetching records in the development env, 
    # so you can do queries in the console and get the data back immediately.
    async:       true # Tower.env == 'production'
    headers:     {'X-Requested-With': 'XMLHttpRequest'}

  ajax: (params, defaults) ->
    $.ajax($.extend({}, @defaults, defaults, params))

  toJSON: (record, method, format) ->
    data          = {}
    # need to think about this more
    # data[record.constructor.toKey()] = record
    # "blog-post" vs "blogPost"
    data[_.camelize(record.constructor.toKey(), true)] = record
    data._method  = method
    # need to some how keep track of session so you don't send the model back to the current client.
    # this might be pretty complicated because everything on the server must be in the context of the saved record
    # and that just about seems impossible.
    # data._socketId = Tower.connection.id
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
    @requesting = true

    callback().complete =>
      @requesting = false
      @requestNext()

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
      @disable =>
        if data && !_.isBlank(data)
          record.updateAttributes(data, sync: false)

      #@record.trigger('ajaxSuccess', data, status, xhr)
      options.success?.apply(@record)

  failure: (record, callback) ->
    (xhr, statusText, error) =>
      json = try JSON.parse(xhr.responseText)
      json ||= {}
      json.status ||= xhr.status
      json.statusText ||= statusText
      json.message ||= error
      # @todo record.rollback()
      callback.call(@, json) if callback
  
  # This is called from {Tower.Net.Connection#clientDidCreate}.
  # 
  # It will iterate through an array of records and create 1
  # Ajax request for each. This will soon be optimized to be single
  # batch request, but it's all about iterative development.
  create: (records, callback) ->
    records = _.toArray(records)
    # need a better way to do this, using batch requests
    for record in records
      do (record) =>
        @queue =>
          params =
            url:  Tower.urlFor(record.constructor)
            type: 'POST'
            data: @toJSON(record)

          @ajax({}, params)
            .success(@createSuccess(record, callback))
            .error(@createFailure(record, callback))

  # Called if a record was successfully created on the server.
  # 
  # The server sends back JSON of the attributes for the single record
  # (will potentially return an array once we get batch requests going).
  # We then have to replace the temporary "client id" with the permanent
  # "server id", and update the record's attributes. To update attributes on a
  # record _without_ saving, use {Tower.Model#setProperties} instead of
  # {Tower.Model#updateAttributes}.
  # 
  # Before it even makes the request, the browser pretends the record has been 'created'.
  # This means it's in the `isSaved` state.
  createSuccess: (record, callback) ->
    (data, status, xhr) =>
      record.setProperties(data) # will cause cursors to update automatically, through events

      callback.call(@, null, record) if callback

  createFailure: (record, callback) ->
    @failure(record, callback)

  update: (records, callback) ->
    for record in records
      do (record) =>
        @queue =>
          data = {}
          # @todo need to keep changes internally until the response gets back
          data[_.camelize(record.constructor.toKey(), true)] = record.get('dirtyAttributes')
          data._method  = 'PUT'
          data.format = 'json'
          params =
            type: 'PUT'
            data: JSON.stringify(data)
            url:  Tower.urlFor(record)

          @ajax({}, params)
            .success(@updateSuccess(record, callback))
            .error(@updateFailure(record, callback))

  updateSuccess: (record, callback) ->
    (data, status, xhr) =>
      record.setProperties(data)

      callback.call(@, null, record) if callback

  updateFailure: (record, callback) ->
    @failure(record, callback)

  destroy: (records, callback) ->
    for record in records
      do (record) =>
        @queue =>
          params  =
          url:        Tower.urlFor(record)
          type:       'POST'
          data:       JSON.stringify(
            format:   'json'
            _method:  'DELETE'
          )
          # haven't yet handled arrays.
          @ajax({}, params)
            .success(@destroySuccess(record, callback))
            .error(@destroyFailure(record, callback))

  # @todo
  destroySuccess: (record, callback) ->
    (data, status, xhr) =>
      callback.call(@, null, record) if callback
      
  destroyFailure: (record, callback) ->
    @failure(record, callback)

  findSuccess: (cursor, callback) ->
    # `data` will look like this:
    # {users: [user1, user1...], conditions: {}, page: 2, limit: 20, sort: []}
    # and all we need to do is load it back into the cursor
    (data, status, xhr) =>
      try
        #callback(null, cursor.build(data))
        data = cursor.model.load(data)
        callback(null, data) if callback
      catch error
        callback(error) if callback

  findFailure: (cursor, callback) ->
    @failure(cursor, callback)

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
  # fetching cursor, and append the ids of the matching records to the `conditions` field.
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
  find: (cursor, callback) ->
    params  = @serializeParamsForFind(cursor)
    records = undefined
    
    @queue =>
      @ajax(params)
        .success(@findSuccess(cursor, (error, data) =>
          callback.call(@, error, data) if callback
          records = data
        ))
        .error(@findFailure(cursor, callback))

    records

  serializeParamsForFind: (cursor) ->
    url     = Tower.urlFor(cursor.model)
    data    = cursor.toParams()
    # tmp until we figure out a better way
    #data.conditions = JSON.stringify(data.conditions) if data.conditions
    data.format = 'json'

    type: 'GET'
    data: $.param(data)
    url:  url

  # Going to merge this during refactoring period.
  # One big copy paste for now :)
  findOne: (cursor, callback) ->
    params  = @serializeParamsForFindOne(cursor)
    records = undefined
    
    @queue =>
      @ajax(params)
        .success(@findSuccess(cursor, (error, data) =>
          data = try data[0]
          callback.call(@, error, data) if callback
          records = data
        ))
        .error(@findFailure(cursor, callback))

    records

  # This is hardcoded at the moment, getting late.
  serializeParamsForFindOne: (cursor) ->
    data    = cursor.toParams()
    delete data.limit
    url     = Tower.urlFor(cursor.model) + '/' + data.conditions.id
    # tmp until we figure out a better way
    #data.conditions = JSON.stringify(data.conditions) if data.conditions
    data.format = 'json'

    type: 'GET'
    data: $.param(data)
    url:  url

module.exports = Tower.Store.Transport.Ajax
