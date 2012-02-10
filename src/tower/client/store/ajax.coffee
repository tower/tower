class Tower.Store.Ajax extends Tower.Store.Memory
  @defaults:
    contentType: 'application/json'
    dataType:    'json'
    processData: false
    headers:     {'X-Requested-With': 'XMLHttpRequest'}
    
  @request: (params, defaults) ->
    $.ajax($.extend({}, @defaults, defaults, params))
    
  @queue: (callback) ->
    callback()
    
  @toJSON: (record, format, method) ->
    data          = {}
    data[Tower.Support.String.camelize(record.constructor.name, true)] = record
    data.format   = format
    data._method  = method
    JSON.stringify(data)
  
  queue: (callback) ->
    @constructor.queue callback
    
  request: ->
    @constructor.request arguments...
  
  create: (attributes, options, callback) ->
    unless options.sync == false
      super attributes, options, (error, result) =>
        @createRequest result, options
    else
      super
  
  update: (updates, query, options, callback) ->
    unless options.sync == false
      super update, query, options, (error, result) =>
        @updateRequest result, options
    else
      super
      
  destroy: (query, options, callback) ->
    unless options.sync == false
      super query, options, (error, result) =>
        @destroyRequest result, options
    else
      super
  
  createRequest: (record, options) ->
    @queue ->
      @request {}, type: "POST", data: @toJSON(record)
  
  updateRequest: (record, options, callback) ->
    @queue ->
      @request {}, type: "PUT", data: @toJSON(record)
  
  destroyRequest: (record, options, callback) ->
    @queue ->
      @request {}, type: "DELETE", data: @toJSON(record)
    
  findRequest: (options, callback) ->
    @queue ->
      @request {}, type: "GET", data: @toJSON(record), (data, status, xhr) =>
        unless error
  
  success: (record, options = {}) =>
    (data, status, xhr) =>
      if Tower.Support.Object.isBlank(data)
        data = false
      else
        data = RW.Tile.load(data)
        
      #Ajax.disable =>
      #  if data
      #    # ID change, need to do some shifting
      #    if data.id and @record.id isnt data.id
      #      @record.changeID(data.id)
      #
      #    # Update with latest data
      #    @record.updateAttributes(data.attributes())
      #
      #@record.trigger('ajaxSuccess', data, status, xhr)
      #options.success?.apply(@record)

  failure: (record, options = {}) =>
    (xhr, statusText, error) =>
      options.error?.apply(record)
  
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
  