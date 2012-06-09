# Interface to {Tower.Model.Cursor}, used to build database operations.
class Tower.Model.Scope
  @finderMethods: [
    'find'
    'all'
    'first'
    'last'
    'count'
    'exists'
    'fetch'
    'instantiate'
    'pluck'
    'live'
  ]

  @persistenceMethods: [
    'insert'
    'update'
    'create'
    'destroy'
    'build'
  ]

  # These methods are added to {Tower.Model}.
  @queryMethods: [
    'where'
    'order'
    'sort'
    'asc'
    'desc'
    'gte'
    'gt'
    'lte'
    'lt'
    'limit'
    'offset'
    'select'
    'joins'
    'includes'
    'excludes'
    'paginate'
    'page'
    'allIn'
    'allOf'
    'alsoIn'
    'anyIn'
    'anyOf'
    'notIn'
    'near'
    'within'
  ]

  # Map of human readable query operators to
  # normalized query operators to pass to a {Tower.Store}.
  @queryOperators:
    '>=':         '$gte'
    '$gte':       '$gte'
    '>':          '$gt'
    '$gt':        '$gt'
    '<=':         '$lte'
    '$lte':       '$lte'
    '<':          '$lt'
    '$lt':        '$lt'
    '$in':        '$in'
    '$nin':       '$nin'
    '$any':       '$any'
    '$all':       '$all'
    '=~':         '$regex'
    '$m':         '$regex'
    '$regex':     '$regex'
    '$match':     '$match'
    '$notMatch':  '$notMatch'
    '!~':         '$nm'
    '$nm':        '$nm'
    '=':          '$eq'
    '$eq':        '$eq'
    '!=':         '$neq'
    '$neq':       '$neq'
    '$null':      '$null'
    '$notNull':   '$notNull'
    '$near':      '$near'

  constructor: (cursor) ->
    @cursor = cursor

  # Check if this scope or relation contains this object
  #
  # @param [Object] object an object or array of objects.
  has: (object) ->
    @cursor.has(object)

  # tells us we want to register it to the cursors list
  # might rename to [live, subscribe, publish, io]
  live: ->
    @

  # Builds one or many records based on the scope's cursor.
  #
  # @example Build single record
  #   App.User.build(firstName: 'Lance')
  #
  # @example Build multiple records
  #   # splat arguments
  #   App.User.build({firstName: 'Lance'}, {firstName: 'John'})
  #   # or pass in an explicit array of records
  #   App.User.build([{firstName: 'Lance'}, {firstName: 'John'}])
  #
  # @example Build by passing in records
  #   App.User.build(new User(firstName: 'Lance'))
  #
  # @example Build from scope
  #   # single record
  #   App.User.where(firstName: 'Lance').build()
  #   # multiple records
  #   App.User.where(firstName: 'Lance').build([{lastName: 'Pollard'}, {lastName: 'Smith'}])
  #
  # @example Build without instantiating the object in memory
  #   App.User.options(instantiate: false).where(firstName: 'Lance').build()
  #
  # @return [void] Requires a callback to get the data.
  build: ->
    cursor          = @compile()
    args            = _.args(arguments)
    callback        = _.extractBlock(args)
    # for `create`, the rest of the arguments must be records

    cursor.addData(args)

    cursor.build(callback)

  # Creates one or many records based on the scope's cursor.
  #
  # @example Create single record
  #   App.User.insert(firstName: 'Lance')
  #
  # @example Create multiple records
  #   # splat arguments
  #   App.User.insert({firstName: 'Lance'}, {firstName: 'John'})
  #   # or pass in an explicit array of records
  #   App.User.insert([{firstName: 'Lance'}, {firstName: 'John'}])
  #
  # @example Create by passing in records
  #   App.User.insert(new User(firstName: 'Lance'))
  #
  # @example Create from scope
  #   # single record
  #   App.User.where(firstName: 'Lance').insert()
  #   # multiple records
  #   App.User.where(firstName: 'Lance').insert([{lastName: 'Pollard'}, {lastName: 'Smith'}])
  #
  # @example Create without instantiating the object in memory
  #   App.User.options(instantiate: false).where(firstName: 'Lance').insert()
  #
  # @return [void] Requires a callback to get the data.
  insert: ->
    cursor          = @compile()
    args            = _.args(arguments)
    callback        = _.extractBlock(args)
    # for `insert`, the rest of the arguments must be records

    cursor.addData(args)

    cursor.insert(callback)

  create: @::insert

  # Updates records based on the scope's cursor.
  #
  # @example Update by id
  #   App.User.update(1, firstName: 'Lance')
  #   App.User.update(1, 2, firstName: 'Lance')
  #   App.User.update([1, 2], firstName: 'Lance')
  #
  # @example Update all
  #   App.User.update(firstName: 'Lance')
  #
  # @example Update by passing in records
  #   App.User.update(userA, firstName: 'Lance')
  #   App.User.update(userA, userB, firstName: 'Lance')
  #   App.User.update([userA, userB], firstName: 'Lance')
  #
  # @example Update from scope
  #   App.User.where(firstName: 'John').update(firstName: 'Lance')
  #   App.User.where(firstName: 'John').update(1, 2, 3, firstName: 'Lance')
  #
  # @return [void] Requires a callback to get the data.
  update: ->
    cursor          = @compile()
    args            = _.flatten _.args(arguments)
    callback        = _.extractBlock(args)
    # for `update`, the last argument before the callback must be the updates you're making
    updates         = args.pop()

    throw new Error('Must pass in updates hash') unless updates && typeof updates == 'object'

    cursor.addData(updates)

    cursor.addIds(args)

    cursor.update(callback)

  # Deletes records based on the scope's cursor.
  #
  # @example Destroy by id
  #   App.User.destroy(1)
  #   App.User.destroy(1, 2)
  #   App.User.destroy([1, 2])
  #
  # @example Destroy all
  #   App.User.destroy()
  #
  # @example Update by passing in records
  #   App.User.destroy(userA)
  #   App.User.destroy(userA, userB)
  #   App.User.destroy([userA, userB])
  #
  # @example Update from scope
  #   App.User.where(firstName: 'John').destroy()
  #   App.User.where(firstName: 'John').destroy(1, 2, 3)
  #
  # @return [void] Requires a callback to get the data.
  destroy: ->
    cursor          = @compile()
    args            = _.flatten _.args(arguments)
    callback        = _.extractBlock(args)

    cursor.addIds(args)

    cursor.destroy(callback)

  # Add to set.
  add: ->
    cursor          = @compile()
    args            = _.args(arguments)
    callback        = _.extractBlock(args)
    # for `create`, the rest of the arguments must be records

    cursor.addData(args)

    cursor.add(callback)

  # Remove from set.
  remove: ->
    cursor          = @compile()
    args            = _.flatten _.args(arguments)
    callback        = _.extractBlock(args)

    cursor.addIds(args)

    cursor.remove(callback)

  # Updates one or many records based on the scope's cursor.
  #
  # @example Find single record
  #   # find record with `id` 45
  #   App.User.find(45)
  #
  # @example Find multiple records
  #   # splat arguments
  #   App.User.find(10, 20)
  #   # or pass in an explicit array of records
  #   App.User.find([10, 20])
  #
  # @example Create from scope
  #   App.User.where(firstName: 'Lance').find(1, 2)
  #
  # @return [undefined] Requires a callback to get the data.
  find: ->
    cursor          = @compile()
    args            = _.flatten _.args(arguments)
    callback        = _.extractBlock(args)

    cursor.addIds(args)

    cursor.find(callback)

  # Find the first record matching this scope's cursor.
  #
  # @param [Function] callback
  first: (callback) ->
    cursor = @compile()
    cursor.findOne(callback)

  # Find the last record matching this scope's cursor.
  #
  # @param [Function] callback
  last: (callback) ->
    cursor = @compile()
    cursor.reverseSort()
    cursor.findOne(callback)

  # Find all the records matching this scope's cursor.
  #
  # @param [Function] callback
  all: (callback) ->
    @compile().find(callback)

  # Returns an array of column values directly from the underlying table/collection.
  # This also works with serialized attributes.
  # @todo
  pluck: (attributes...) ->
    @compile().find(callback)

  # Show query that will be used for the datastore.
  # @todo
  explain: ->
    @compile().explain(callback)

  # Count the number of records matching this scope's cursor.
  #
  # @param [Function] callback
  count: (callback) ->
    @compile().count(callback)

  # Check if a record exists that matches this scope's cursor.
  #
  # @param [Function] callback
  exists: (callback) ->
    @compile().exists(callback)

  fetch: (callback) ->
    @compile().fetch(callback)

  # @todo
  batch: ->
    @

  # Metadata.
  #
  # @param [Object] options
  #
  # @return [Object] returns all of the options.
  options: (options) ->
    _.extend(@cursor.options, options)

  compile: ->
    @cursor.clone()

  # Clone this scope (and the critera attached to it).
  #
  # @return [Tower.Model.Scope]
  clone: ->
    new @constructor(@cursor.clone())

for key in Tower.Model.Scope.queryMethods
  do (key) =>
    Tower.Model.Scope::[key] = ->
      clone = @clone()
      clone.cursor[key](arguments...)
      clone

module.exports = Tower.Model.Scope