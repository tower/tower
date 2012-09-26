_ = Tower._

# @mixin
Tower.ModelCursorOperations = Ember.Mixin.create
  # @todo will refresh this cursor after x milliseconds,
  # useful when you have a cursor with dates in the conditions.
  refreshInterval: (milliseconds) ->

  invalidate: ->
    @_invalidated = true

  # Join commands.
  #
  # For databases that don't offer joining, it's still useful.
  # For example, in Mongodb, we can use it for 'hasMany through' relations:
  # where in SQL you can use JOIN for this,
  # in Mongodb we can find the ids first, then append them to our query.
  #
  # @example Join comments to Post
  #   App.Post.joins('comments').all()
  #
  # @return [Object] the resulting set of joins.
  joins: (object) ->
    joins = @_joins

    if _.isArray(object)
      joins[key] = true for key in object
    else if typeof object == 'string'
      joins[object] = true
    else
      _.extend joins, object

    joins

  # Methods to remove from the scope.
  #
  # @param [Arguments] keys
  except: ->
    # @criteria.
    @_except = _.flatten _.args(arguments)

  with: (transaction) ->
    @transaction = transaction

  # Set of conditions the database fields must satisfy.
  #
  # @example
  #   App.Post.where(title: 'First Post').all()
  #   App.Post.where('title', 'First Post').all()
  #
  # @param [Object] conditions
  where: (conditions) ->
    if conditions.isCursor
      @merge(conditions)
    else if arguments.length == 2
      object = {}
      object[arguments[0]] = arguments[1]
      @_where.push(object)
    else
      @_where.push(conditions)
    @invalidate()
    @

  # Attribute and direction used for ordering the datastore's result set.
  #
  # @example
  #   App.Post.order('title', 'desc').all()
  #
  # @param [String] attribute
  # @param [String] direction ('asc') can be 'asc' or 'desc'.
  #
  # @return [Array] returns the full set of order commands for this cursor.
  order: (attribute, direction = 'asc') ->
    value = if _.isArray(attribute) then attribute else [attribute, direction]
    @_order.push value
    @invalidate()
    @

  # Reverses the query so it can find the last one.
  reverseSort: ->
    # need to work on this one.
    order = @getCriteria('order')
    order = @_order = [['createdAt', 'asc']] unless order.length
    for orderItem, i in order
      orderItem[1] = if orderItem[1] == 'asc' then 'desc' else 'asc'
    order
    @invalidate()
    @

  # Set of attributes to sort by, ascending.
  #
  # @example
  #   App.Post.asc('title').all()
  #
  # @param [Arguments] attributes
  #
  # @return [Array] returns the full set of order commands for this cursor.
  asc: (attributes...) ->
    @order(attribute) for attribute in attributes
    @

  # Set of attributes to sort by, descending.
  #
  # @example
  #   App.Post.desc('title').all()
  #
  # @param [Arguments] attributes
  #
  # @return [Array] returns the full set of order commands for this cursor.
  desc: (attributes...) ->
    @order(attribute, 'desc') for attribute in attributes
    @

  ne: ->
    @_whereOperator '$neq', arguments...

  # @todo
  gte: ->
    @_whereOperator '$gte', arguments...

  # @todo
  lte: ->
    @_whereOperator '$lte', arguments...

  # @todo
  gt: ->
    @_whereOperator '$gt', arguments...

  # @todo
  lt: ->
    @_whereOperator '$lt', arguments...

  # Records must match all values in the array.
  #
  # @example
  #   App.Post.allIn(tags: ['ruby', 'javascript']).all()
  #
  # @param [Object] attributes
  #
  # @return [Object] the final set of conditions for this cursor.
  allIn: ->
    @_whereOperator '$all', arguments...

  # @example
  #   App.Post.anyIn(tags: ['ruby', 'javascript']).all()
  anyIn: ->
    @_whereOperator '$any', arguments...

  # @example
  #   App.Post.notIn(tags: ['.net']).all()
  notIn: ->
    @_whereOperator '$nin', arguments...

  # @example
  #   App.Post.offset(20).all()
  offset: (number) ->
    @_offset = number
    @invalidate()
    @

  # Experimenting with limit(1) returning single object, which makes sense.
  limit: (number) ->
    @_limit = number
    if number == 1
      @returnArray = false
    else
      delete @returnArray
    @invalidate()
    @

  # The set of fields we want the database to return, no more.
  #
  # @example Return only the `id` from the database.
  #   App.User.select('id').all()
  #
  # @param [Arguments] fields
  #
  # @return [Array] returns the fields for this cursor.
  select: ->
    @_fields = _.flatten _.args(arguments)
    @invalidate()
    @

  includes: ->
    @_includes = _.flatten _.args(arguments)
    @invalidate()
    @

  uniq: (value) ->
    @_uniq = value
    @invalidate()
    @

  # @example
  #   App.Post.page(2).all()
  # 
  # If you call `page` (rather than manually calling `limit` and `offset`),
  # you have now setup a paging operation.  This means in addition to making a query
  # for records, it will also make an _additional_ query 
  # to get the total count of matching records.
  # 
  # @todo Maybe we should make the `count` query part of the `paginate` method instead.
  page: (page) ->
    @limit(@_limit || Tower.ModelCursor::defaultLimit)
    limit = @getCriteria('limit')
    Ember.set @, 'currentPage', page
    @offset((Math.max(1, page) - 1) * limit)

  # https://github.com/manuelbieh/Geolib/blob/master/geolib.js
  # @example Find near specific coordinates.
  #   App.User.near(location: [40.741404, -73.988135])
  #   App.User.near(location: lat: 40.741404, lng: -73.988135)
  #
  # @example Uses default location field for model.
  #   App.User.near(40.741404, -73.988135)
  near: (coordinates) ->
    @where(coordinates: $near: coordinates)

  # @todo Make an awesome geo api.
  #
  # @example [todo]
  #   App.User.near(coordinates).within(5, 'miles')
  #   App.User.near(coordinates).within(distance: 5, unit: 'km')
  #
  # @example Search within a box
  #   App.User.within([40.73083, -73.99756], [40.741404,  -73.988135])
  #   App.User.within(lowerLeft: [40.73083, -73.99756], upperRight: [40.741404,  -73.988135])
  #
  # @example Search within a circle
  #   App.User.within(center: [50, 50], radius: 10)
  #   App.User.within(center: [50, 50], radius: 10)
  #
  # @example Search within a polygon
  #   App.User.within([ 10, 20 ], [ 10, 40 ], [ 30, 40 ], [ 30, 20 ])
  #   App.User.within(a : { x : 10, y : 20 }, b : { x : 15, y : 25 }, c : { x : 20, y : 20 })
  within: (bounds) ->
    @where(coordinates: $maxDistance: bounds)

  test: (record) ->
    # @todo need a subclass tester
    # return false unless record.constructor.className()
    # @todo needs to work on things like MongoDB's ObjectID
    Tower.StoreOperators.test(record, @conditions())

  testEach: (records, callback) ->
    conditions = @conditions()
    delete conditions.type # need to come back to STI
    Tower.StoreOperators.testEach(records, conditions, callback)

  eagerLoad: (records, callback) ->
    return callback() unless records && records.length

    includes  = @getCriteria('includes')

    return callback() if _.isBlank(includes)

    # keys      = if _.isArray(includes) then includes else _.keys(includes)
    hash = {}

    for item in _.flatten(includes)
      if typeof item == 'string'
        hash[item] = null
      else
        _.extend(hash, item)

    keys = _.keys(hash)

    eagerLoad = (key, done) =>
      childKeys = hash[key]
      relation  = @model.relations()[key]
      if relation.isHasOne
        ids = records.getEach('id')
        scope = relation.klass().anyIn(relation.foreignKey, ids)
        scope = scope.includes(childKeys) if childKeys
        scope.all (error, associated) =>
          for record in records
            for item in associated
              if record.get('id').toString() == item.get(relation.foreignKey).toString()
                record.set(relation.name, item)
          # this needs to actually check the relation
          # klass = Tower.constant(_.camelize(key))
          # records[]
          done()
      else if relation.isHasMany && !relation.isHasManyThrough
        ids = records.getEach('id')

        scope = relation.klass().anyIn(relation.foreignKey, ids)
        scope = scope.includes(childKeys) if childKeys
        scope.all (error, associated) =>
          for record in records
            matches = []
            
            for item in associated
              if record.get('id').toString() == item.get(relation.foreignKey).toString()
                matches.push(item)

            record.get(relation.name).load(matches)
          # this needs to actually check the relation
          # klass = Tower.constant(_.camelize(key))
          # records[]
          done()
      else
        ids = records.getEach(relation.foreignKey)
        
        scope = relation.klass().anyIn(id: ids)
        scope = scope.includes(childKeys) if childKeys
        scope.all (error, associated) =>
          for record in records
            for item in associated
              if record.get(relation.foreignKey).toString() == item.get('id').toString()
                record.set(relation.name, item)
          # this needs to actually check the relation
          # klass = Tower.constant(_.camelize(key))
          # records[]
          done()

    Tower.parallel keys, eagerLoad, callback

  # @private
  _whereOperator: (operator, attributes) ->
    query = {}
    
    if typeof attributes == 'string'
      attrs = {}
      attrs[arguments[1]] = arguments[2]
      attributes = attrs

    for key, value of attributes
      query[key] = {}
      query[key][operator] = value
    @where query

  # Alias for {#order}.
Tower.ModelCursorOperations.sort = Tower.ModelCursorOperations.order

module.exports = Tower.ModelCursorOperations
