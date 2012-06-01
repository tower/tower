# @mixin
Tower.Model.Cursor.Operations =
  eagerLoad: (object) ->
    @_eagerLoad = _.extend @_eagerLoad, object

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
  #
  # @param [Object] conditions
  where: (conditions) ->
    if conditions instanceof Tower.Model.Cursor
      @merge(conditions)
    else
      @_where.push(conditions)

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
    @_order.push [attribute, direction]

  # Reverses the query so it can find the last one.
  reverseSort: ->
    order = @get('order')
    for set, i in order
      set[1] = if set[1] == 'asc' then 'desc' else 'asc'
    order

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
    @_order

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
    @_order

  # @todo
  gte: ->

  # @todo
  lte: ->

  # @todo
  gt: ->

  # @todo
  lt: ->

  # Records must match all values in the array.
  #
  # @example
  #   App.Post.allIn(tags: ['ruby', 'javascript']).all()
  #
  # @param [Object] attributes
  #
  # @return [Object] the final set of conditions for this cursor.
  allIn: (attributes) ->
    @_whereOperator '$all', attributes

  # @example
  #   App.Post.anyIn(tags: ['ruby', 'javascript']).all()
  anyIn: (attributes) ->
    @_whereOperator '$any', attributes

  # @example
  #   App.Post.notIn(tags: ['.net']).all()
  notIn: (attributes) ->
    @_whereOperator '$nin', attributes

  # @example
  #   App.Post.offset(20).all()
  offset: (number) ->
    @_offset = number

  limit: (number) ->
    @_limit = number

  # The set of fields we want the database to return, no more.
  #
  # @example Return only the `id` from the database.
  #   App.User.select('id').all()
  #
  # @param [Arguments] fields
  #
  # @return [Array] returns the fields for this cursor.
  select: ->
    @_fields = _.flatten _.args(fields)

  includes: ->
    @_includes = _.flatten _.args(arguments)

  uniq: (value) ->
    @_uniq = value

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
    limit = @limit(@_limit || @defaultLimit)
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
    Tower.Store.Operators.test(record, @conditions())

  # @private
  _whereOperator: (operator, attributes) ->
    query = {}
    for key, value of attributes
      query[key] = {}
      query[key][operator] = value
    @where query


  # Alias for {#order}.
Tower.Model.Cursor.Operations.sort = Tower.Model.Cursor.Operations.order

module.exports = Tower.Model.Cursor.Operations
