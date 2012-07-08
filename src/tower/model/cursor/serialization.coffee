# @mixin
Tower.Model.Cursor.Serialization = Ember.Mixin.create
  isCursor: true

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

  # Wondering how this should be invalidated, other than manually calling
  # cursor.propertyDidChange('observableFields'). You don't want to invalidate
  # for every query condition you add, that would hurt server performance.
  # Maybe it should be handled differently on the client and server.
  observableFields: Ember.computed(->
    data    = @toParams()

    # what's more optimized?
    # 1. creating an array and, for each new item you push, first check if array.indexOf(newItem) == -1
    # 2. creating a hash, with all values as `true`, such as `{key1: true, key2: true}`, then `_.keys(hash)`
    # 3. pushing all items in the array, then running `keys = _.uniq(keys)`
    # need to run some tests.

    fields  = []

    if data.sort
      for orderItem in data.sort
        fields.push(orderItem[0])

    fields  = _.uniq fields.concat(_.keys(data.conditions))

    fields
  ).cacheable()

  # List of models that this cursor observe.
  # 
  # The simple case is the owner model for the cursor.
  # The more complex case is where the query conditions for the cursor
  # are based on properties of a related model, such as 
  # `App.Post.includes('author').where('author.email', /a/)`. A lot of those "join" queries
  # aren't supported in MongoDB, but this is still good to have.
  # 
  # @todo list out the cases when this will be more than the just the owner model.
  observableTypes: Ember.computed(->
    [@model.className()]
  ).cacheable()

  # Registers cursor in global set, to watch for changes in models matching it's conditions.
  # @todo Think about name, possibly ['observable', 'register', 'publish', 'watch'].
  #   The name "observable" feels like it follows the ember naming conventions.
  observable: (falseFlag) ->
    # Should probably add a watcher on the Tower.cursors computed property, not sure it will work though.
    if falseFlag == false
      Tower.removeCursor(@)
    else
      Tower.addCursor(@)
    @

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
    if Ember.EXTEND_PROTOTYPES
      clone = @concat()#Tower.Model.CursorMixin.apply(@concat())
      clone.isCursor = true
    else
      clone = @constructor.create()
      if cloneContent
        content = Ember.get(@, 'content') || Ember.A([])
        clone.setProperties(content: content) if content

    clone.make(model: @model, instantiate: @instantiate)
    clone.merge(@)
    clone

  load: (records) ->
    if Ember.EXTEND_PROTOTYPES
      @clear()
      @addObjects(records)
    else
     Ember.set(@, 'content', records)

  reset: ->
    if Ember.EXTEND_PROTOTYPES
      @clear()
      @
    else
      Ember.set(@, 'content', [])

  # @todo Ideally, refresh wont remove then add back items in the array.
  #   Instead, it should only insert/remove/sort what needs to be changed.
  #   This will make the views snappier.
  refresh: (callback) ->
    @reset()
    @all(callback)

  stringify: (pretty) ->
    _.stringify(@, pretty)

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
    @returnArray = cursor.returnArray
    @

  toParams: ->
    data          = {}
    
    sort          = @get('order')
    conditions    = @conditions()
    page          = @currentPage
    limit         = @get('limit')
    includes      = @get('includes')
    
    data.sort       = sort if sort && sort.length
    data.conditions = conditions if conditions
    data.page       = page if page
    data.limit      = limit if limit && limit
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

    for conditions in @_where
      _.deepMergeWithArrays(result, conditions)

    # @todo refactor
    if @ids && @ids.length
      delete result.id
      if @ids.length == 1
        @returnArray = false
      else
        @returnArray = true

      ids = @ids
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
