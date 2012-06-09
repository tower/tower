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
    console.log($.extend({}, @defaults, defaults, params))
    $.ajax($.extend({}, @defaults, defaults, params))

  toJSON: (record, method, format) ->
    data          = {}
    data[record.constructor.toKey()] = record
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
      @disable =>
        if data && !_.isBlank(data)
          record.updateAttributes(data, sync: false)

      #@record.trigger('ajaxSuccess', data, status, xhr)
      options.success?.apply(@record)

  failure: (data, callback) ->
    (xhr, statusText, error) =>
      callback.call(@, error) if callback
  
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
        # need to setup clientId
        record.set('id', undefined)
        json  = @toJSON(record)
        url   = Tower.urlFor(record.constructor)
        
        @queue =>
          params =
            url:  url
            type: "POST"
            data: json

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

  update: (record, callback) ->
    @queue =>
      params =
        type: "PUT"
        data: @toJSON(record)
        url: Tower.urlFor(record)

      @ajax({}, params)
        .success(@updateSuccess(record, callback))
        .error(@updateFailure(record, callback))

  updateSuccess: (record, callback) ->
    (data, status, xhr) =>
      record.setProperties(data)

      callback.call(@, null, record) if callback

  updateFailure: (record, callback) ->
    @failure(record, callback)

  destroy: (record, callback) ->
    @queue =>
      # haven't yet handled arrays.
      url     = Tower.urlFor(record)

      params  =
        url:        url
        type:       'POST'
        data:       JSON.stringify(
          format:   'json'
          _method:  'DELETE'
        )

      @ajax({}, params)
        .success(@destroySuccess(record, callback))
        .error(@destroyFailure(record, callback))

  # @todo
  destroySuccess: (record, callback) ->
    (data, status, xhr) =>
      callback.call(@, null, record) if callback
      
  destroyFailure: (record, callback) ->
    @failure(record, callback)

  findSuccess: (criteria, callback) ->
    # `data` will look like this:
    # {users: [user1, user1...], conditions: {}, page: 2, limit: 20, sort: []}
    # and all we need to do is load it back into the criteria
    (data, status, xhr) =>
      try
        #callback(null, criteria.build(data))
        data = criteria.model.load(data)
        #callback(null, data) if callback
      catch error
        callback(error) if callback

  findFailure: (criteria, callback) ->
    @failure(criteria, callback)

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
      @ajax(params)
        .success(@findSuccess(criteria, callback))
        .error(@findFailure(criteria, callback))

  serializeParamsForFind: (criteria) ->
    url     = Tower.urlFor(criteria.model)
    data    = criteria.toJSON()
    # tmp until we figure out a better way
    #data.conditions = JSON.stringify(data.conditions) if data.conditions
    data.format = 'json'

    type: 'GET'
    data: $.param(data)
    url:  url

module.exports = Tower.Store.Transport.Ajax
