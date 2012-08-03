# Right now this is only going to work on "referenced" associations.
#
# @note Thinking about making ./referenced and ./embedded copies,
#   similar to how Mongoid does it.
class Tower.Model.Relation.HasMany extends Tower.Model.Relation
  isHasMany: true
  isCollection: true
  # @option options [String|Function] beforeAdd Callback before an item is added.
  # @option options [String|Function] afterAdd Callback after an item is added.

Tower.Model.Relation.HasMany.CursorMixin = Ember.Mixin.create
  isHasMany: true

  clonePrototype: ->
    clone = @concat()
    clone.isCursor = true
    Tower.Model.Relation.CursorMixin.apply(clone)
    Tower.Model.Relation.HasMany.CursorMixin.apply(clone)

  # @todo
  has: (object) ->
    object  = _.castArray(object)
    records = []
    return false unless records.length
    return false

  validate: (callback) ->
    if @owner.get('isNew')
      throw new Error('You cannot call insert unless the parent is saved')

    callback.call(@)

  build: (callback) ->
    @compileForInsert()
    @_build callback

  insert: (callback) ->
    @validate (error) =>
      @insertReferenced(callback)

  update: (callback) ->
    @validate (error) =>
      @updateReferenced(callback)

  destroy: (callback) ->
    @validate (error) =>
      @destroyReferenced(callback)

  find: (callback) ->
    # when you create a record you want to invalidate this.
    # on the client you don't want to remove the items from the array so the
    # next `all` queries the memory store to find them.
    # on the server you don't want to store the created ones in memory,
    # need to think of an api for server side so we don't end up creating a memory leak.
    return @ if Tower.isServer && @_hasContent(callback)

    @validate (error) =>
      @findReferenced(callback)

  count: (callback) ->
    if @relation.counterCache
      # should probably only do this if there are no conditions
      value = @owner.get(@relation.counterCacheKey)
      callback.call @, null, value if callback
      return value

    @validate (error) =>
      @compileForFind()

      @_runBeforeFindCallbacksOnStore =>
        @_count (error, value) =>
          unless error
            @_runAfterFindCallbacksOnStore =>
              callback.call @, error, value if callback
          else
            callback.call @, error, value if callback

  exists: (callback) ->
    @validate (error) =>
      @compileForFind()

      @_runBeforeFindCallbacksOnStore =>
        @_exists (error, record) =>
          unless error
            @_runAfterFindCallbacksOnStore =>
              callback.call @, error, record if callback
          else
            callback.call @, error, record if callback

  updateCounter: (difference, callback) ->
    owner = @owner
    key   = @relation.counterCacheKey
    owner.updateAttribute(key, owner.get(key) + difference, callback)

  #find: (callback) ->
  #  @validate (error) =>
  #    @findReferenced(callback)

  insertReferenced: (callback) ->
    @compileForInsert()

    @_runBeforeInsertCallbacksOnStore =>
      @_insert (error, record) =>
        unless error
          #@_idCacheRecords(record)

          @_runAfterInsertCallbacksOnStore =>
            # add the id to the array on the owner record after it's insertd
            if @updateOwnerRecord()
              @owner.updateAttributes @ownerAttributes(record), (error) =>
                callback.call(@, error, record) if callback
            else
              callback.call(@, error, record) if callback
        else
          callback.call(@, error, record) if callback
        # record

  updateReferenced: (callback) ->
    @compileForUpdate()

    @_runBeforeUpdateCallbacksOnStore =>
      @_update (error, record) =>
        unless error
          @_runAfterUpdateCallbacksOnStore =>
            callback.call(@, error, record) if callback
        else
          callback.call(@, error, record) if callback

  destroyReferenced: (callback) ->
    @compileForDestroy()

    @_runBeforeDestroyCallbacksOnStore =>
      @_destroy (error, record) =>
        unless error
          @_runAfterDestroyCallbacksOnStore =>
            # @todo this should be moved into the main model
            if @updateOwnerRecord()
              @owner.updateAttributes @ownerAttributesForDestroy(record), (error) =>
                callback.call(@, error, record) if callback
            else
              callback.call(@, error, record) if callback
        else
          callback.call(@, error, record) if callback

  findReferenced: (callback) ->
    @compileForFind()
    returnArray = @returnArray
    result = undefined

    @_runBeforeFindCallbacksOnStore =>
      @_find (error, records) =>
        result = records
        if !error && records
          done = =>
            # it's almost impossible to use the "IdentityMap" from rails in node.js,
            # because this means the "environment" needs to basically be unique
            # for an individual http/tcp request. That is, all models that are in the identity
            # map need to be unique to the _request_. The only way you can do this is if you pass the identity map
            # through every function call, but that would be messy.
            # One possible solution is to not use `App.User.first().posts` or any class methods like that,
            # because class methods are going to be shared globally, and so aren't unique on a per-request basis.
            # Instead, you would use something like `this.first().posts`, where `this` is the controller instance you're in.
            # That way you're accessing the models through the controller, and the controller _is_ unique to the request.
            # By doing that, Tower can internally add meta information to the cursor, such that 
            # `App.User.first().posts` actually means `App.User.env(@).first().posts`, or even just 
            # `App.User.controller(@).first().posts`. Then that `env|controller` method could
            # contain an identity map, in which the store would cache its records. Some might feel this is
            # wiring the model to the controller, but it's really not. It would be abstracted away,
            # and this kind of stuff was relatively common in Rails, where `Thread.current` had variables set in the controller 
            # and accessed from models, but you never really knew. Sometimes that's what it takes.
            # 
            # Going to try that!
            # 
            # This is how Tower should refactor the controller.scope method, and iterating through controller scopes.
            # They really should start from iterating through the model, and if the model is mapped to a controller,
            # then call the controller cursor method, otherwise call it directly on the modelcursor.
            #@owner.get(@relation.name).load(_.castArray(records))
            callback.call(@, error, records) if callback
          @_runAfterFindCallbacksOnStore done, records
        else
          callback.call(@, error, records) if callback

    if returnArray == false then result else @

  # add to set
  add: (callback) ->
    throw new Error unless @relation.idCache

    @owner.updateAttributes @ownerAttributes(), (error) =>
      callback.call @, error, @data if callback

  # remove from set
  remove: (callback) ->
    throw new Error unless @relation.idCache

    @owner.updateAttributes @ownerAttributesForDestroy(), (error) =>
      callback.call @, error, @data if callback

  compile: ->
    owner           = @owner
    relation        = @relation
    inverseRelation = relation.inverse()

    id              = owner.get('id')

    data            = {}

    #if relation.idCache
    #  #defaults[relation.idCacheKey] = $in: [@owner.get('id')]
    #  defaults.id = $in: @owner.get(relation.idCacheKey)
    #  cursor.where(defaults)
    #else
    #  defaults[relation.foreignKey] = $in: @owner.get('id')
    #  cursor.where(defaults)

    if relation.foreignKey
      data[relation.foreignKey]     = id if id != undefined
      # must check here if owner is instance of foreignType
      data[relation.foreignType]  ||= owner.constructor.className() if relation.foreignType

    @where(data)

  compileForInsert: ->
    @compile()

  compileForUpdate: ->
    @compileForFind()

    @returnArray = true unless @ids && @ids.length

  compileForDestroy: ->
    @compileForFind()

  compileForFind: ->
    @compile()

    relation = @relation

    if relation.idCache
      @where(id: $in: @owner.get(relation.idCacheKey))

  updateOwnerRecord: ->
    relation = @relation
    !!(relation && (relation.idCache || relation.counterCache))

  ownerAttributes: (record) ->
    relation = @relation

    #if inverseRelation && inverseRelation.idCache
    #  array = data[inverseRelation.idCacheKey] || []
    #  array.push(id) if array.indexOf(id) == -1
    #  data[inverseRelation.idCacheKey] = array
    #if inverseRelation && inverseRelation.counterCacheKey
    #  data[inverseRelation.counterCacheKey] = 1

    if relation.idCache
      push    = {}
      data    = if record then record.get('id') else @store._mapKeys('id', @data)
      push[relation.idCacheKey] = data
    if relation.counterCacheKey
      inc     = {}
      inc[relation.counterCacheKey] = 1

    updates   = {}
    # probably should be $addToSet
    if push
      if _.isArray(push)
        updates['$addEach']  = push
      else
        updates['$add']  = push

    updates['$inc']       = inc if inc

    updates

  ownerAttributesForDestroy: (record) ->
    relation = @relation

    if relation.idCache
      pull    = {}
      # tmp hack
      pull[relation.idCacheKey] = if @ids && @ids.length then @ids else @owner.get(relation.idCacheKey)
    if relation.counterCacheKey
      inc     = {}
      inc[relation.counterCacheKey] = -1

    updates   = {}
    # probably should be $addToSet
    updates['$pullEach']   = pull if pull
    updates['$inc']       = inc if inc

    updates

  # @private
  _idCacheRecords: (records) ->
    rootRelation = @owner.relation(@relation.name)
    rootRelation.cursor.records = rootRelation.cursor.records.concat _.castArray(records)

class Tower.Model.Relation.HasMany.Cursor extends Tower.Model.Relation.Cursor
  @make: ->
    array = []
    array.isCursor = true
    Tower.Model.Relation.CursorMixin.apply(array)
    Tower.Model.Relation.HasMany.CursorMixin.apply(array)

  @include Tower.Model.Relation.HasMany.CursorMixin

module.exports = Tower.Model.Relation.HasMany
