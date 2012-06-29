# @mixin
Tower.Model.Cursor.Serialization =
  defaultLimit: 20

  make: (options = {}) ->
    _.extend @, options
    @model      ||= options.model
    @store        = if @model then @model.store() else undefined

    #@transaction  = options.transaction || new Tower.Store.Transaction

    @instantiate  = options.instantiate != false

    @_where       = options.where || []
    @_joins       = options.joins || {}
    @_order       = @_array(options.order)
    @_data        = @_array(options.data)
    @_except      = @_array(options.except, true)
    @_includes    = @_array(options.includes, true)
    @_offset      = options.offset
    @_limit       = options.limit
    @_fields      = options.fields
    @_uniq        = options.uniq
    @_eagerLoad   = options.eagerLoad || {}
    @_near        = options.near
    Ember.set(@, 'content', Ember.A([])) if Tower.isClient
    # options.findOne = conditions.id && conditions.id.hasOwnProperty('$in') && conditions.id.$in.length == 1

  # Get the conditions, order, limit, fields, offset, or other private variables.
  # @todo remove this old helper
  get: (key) ->
    if key == 'content'
      Ember.get(@, key)
    else
      @["_#{key}"]

  # Must pass in array, and it will give you either an array or object back,
  # depending on what was passed into the scope.
  export: (result) ->
    result = result[0] if @returnArray == false
    delete @data
    delete @returnArray
    result

  addData: (args) ->
    if args.length && args.length > 1 || _.isArray(args[0])
      @data = _.flatten(args)
      @returnArray = true
    else
      @data = _.flatten [args]#if args[0]? then [args[0]] else []
      @returnArray = false

  addIds: (args) ->
    ids = @ids ||= []

    if args.length

      for object in args
        continue unless object?
        id = if object instanceof Tower.Model then object.get('id') else object
        ids.push(id) if ids.indexOf(id) == -1

      #@where(id: $in: ids)

    ids

  has: (object) ->
    false

  # ideally we can call this to free up some memory on this object.
  compile: ->

  # Show query that will be used for the datastore.
  # @todo
  explain: (callback) ->

  # Clone this cursor.
  #
  # @return [Tower.Model.Criteria]
  clone: (cloneContent = true) ->
    clone = @constructor.create()
    if cloneContent
      content = Ember.get(@, 'content') || Ember.A([])
      clone.setProperties(content: content) if content
    clone.make(model: @model, instantiate: @instantiate)
    clone.merge(@)
    clone

  load: (records) ->
    Ember.set(@, 'content', records)

  reset: ->
    Ember.set(@, 'content', [])

  # Merge this cursor with another cursor.
  #
  # @param [Tower.Model.Criteria] cursor
  #
  # @return [Tower.Model.Criteria] returns this cursor.
  merge: (cursor) ->
    @_where     = @_where.concat cursor._where
    @_order     = @_order.concat cursor._order
    @_offset    = cursor._offset
    @_limit     = cursor._limit
    @_fields    = cursor._fields
    @_except    = cursor._except
    @_includes  = cursor._includes if cursor._includes && cursor._includes.length # need a better way of overriding, not quite right yet.
    @currentPage = cursor.currentPage
    @_joins     = _.extend {}, cursor._joins
    @_eagerLoad = _.extend {}, cursor._eagerLoad
    @_near      = cursor._near
    @

  toJSON: ->
    data          = {}
    
    sort          = @get('order')
    conditions    = @conditions()
    page          = @currentPage
    limit         = @get('limit')
    includes      = @get('includes')
    
    data.sort       = sort if sort && sort.length
    data.conditions = conditions if conditions
    data.page       = page if page
    data.limit      = limit if limit
    data.includes   = includes if includes && includes.length

    data

  _compileAttributes: (object, conditions) ->
    for key, value of conditions
      oldValue = result[key]
      if oldValue
        if _.isArray(oldValue)
          object[key] = oldValue.concat value
        else if typeof oldValue == 'object' && typeof value == 'object'
          object[key] = Tower.Support.Object.deepMergeWithArrays(object[key], value)
        else
          object[key] = value
      else
        object[key] = value

  # Compiled result from the {#where} arguments.
  #
  # @return [Object]
  conditions: ->
    result = {}
    args = _.args(arguments, 1)

    for conditions in @_where
      _.deepMergeWithArrays(result, conditions)

    if @ids && @ids.length
      delete result.id
      if @ids.length == 1
        @returnArray = false
      else
        @returnArray = true

      ids = @ids
      # tmp

      if @store.constructor.className() == 'Memory'
        ids = _.map ids, (id) -> id.toString()
      result.id = $in: ids

    result

  # Compiled result from the {#where} arguments, but formatted for creating a model.
  #
  # This means converting operators such as `$in` into an array, etc.
  #
  # @return [Object]
  attributes: ->
    attributes  = {}

    for conditions in @_where
      ## tags: $in: ['a', 'b']
      ## $push: tags: ['c']
      for key, value of conditions
        # this check needs to be better
        if Tower.Store.isKeyword(key)
          for _key, _value of value
            attributes[_key] = _value
        else if _.isHash(value) && value.constructor.name == 'Object' && Tower.Store.hasKeyword(value)
          for _key, _value of value
            attributes[key] = _value
        else
          attributes[key] = value

    for key, value of attributes
      delete attributes[key] if value == undefined

    attributes

  # @private
  _each: (cursor, iterator, callback) ->
    data = !!cursor.data
    @store.find cursor, (error, records) =>
      if error
        callback.call @, error, records
      else
        Tower.parallel records, iterator, (error) =>
          unless callback
            throw error if error
          else
            callback.call @, error, @export(records) if callback

  _array: (existing, orNull) ->
    if existing && existing.length then existing.concat() else (if orNull then null else [])

module.exports = Tower.Model.Cursor.Serialization
