class Tower.Store.Ajax extends Tower.Store.Memory
  @requests: []
  @enabled:  true
  @pending:  false

  constructor: ->
    super

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
    data[Tower.Support.String.camelize(record.constructor.name, true)] = record
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

  create: (criteria, callback) ->
    unless criteria.sync == false
      super criteria, (error, records) =>
        callback.call @, error, records if callback
        @createRequest records, criteria
    else
      super

  update: (updates, criteria, callback) ->
    if criteria.sync == true
      super updates, criteria, (error, result) =>
        callback.call @, error, result if callback
        @updateRequest result, criteria
    else
      super

  destroy: (criteria, callback) ->
    unless criteria.sync == false
      super criteria, (error, result) =>
        @destroyRequest result, criteria
        callback.call @, error, result if callback
    else
      super

  createRequest: (records, options = {}) ->
    json = @toJSON(records)
    Tower.urlFor(records.constructor)
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

  sync = ->
    @all (error, records) =>
      changes =
        create:   []
        update:   []
        destroy:  []

      for record in records
        changes[record.syncAction].push(record) if record.syncAction

      @createRequest  changes.create if changes.create?
      @updateRequest  changes.update if changes.update?
      @destroyRequest changes.destroy if changes.destroy?

      true

  refresh: ->

  fetch: ->
