# This class has plenty of room for optimization,
# but it's now into a form I'm starting to like.
class Tower.Model.Criteria extends Tower.Class
  defaultLimit: 20

  @include Tower.Support.Callbacks

  constructor: (options = {}) ->
    @model        = options.model
    @store        = if @model then @model.store() else undefined

    @instantiate  = options.instantiate != false

    @_where       = options.where || []
    @_joins       = options.joins || {}
    @_order       = @_array(options.order)
    @_data        = @_array(options.data)
    @_except      = @_array(options.except, true)
    @_includes    = @_array(options.except, true)
    @_offset      = options.offset
    @_limit       = options.limit
    @_fields      = options.fields
    @_uniq        = options.uniq
    @_eagerLoad   = options.eagerLoad || {}
    @_near        = options.near
    # options.findOne = conditions.id && conditions.id.hasOwnProperty("$in") && conditions.id.$in.length == 1

  # Must pass in array, and it will give you either an array or object back,
  # depending on what was passed into the scope.
  export: (result) ->
    result = result[0] if @returnArray == false
    delete @data
    delete @returnArray
    result

  # Get the conditions, order, limit, fields, offset, or other private variables.
  get: (key) ->
    @["_#{key}"]

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

  eagerLoad: (object) ->
    @_eagerLoad = _.extend @_eagerLoad, object

  has: (object) ->
    false

  # Join commands.
  #
  # For databases that don't offer joining, it's still useful.
  # For example, in MongoDB, we can use it for "hasMany through" relations:
  # where in SQL you can use JOIN for this,
  # in MongoDB we can find the ids first, then append them to our query.
  #
  # @example Join comments to Post
  #   App.Post.joins("comments").all()
  #
  # @return [Object] the resulting set of joins.
  joins: (object) ->
    joins = @_joins

    if _.isArray(object)
      joins[key] = true for key in object
    else if typeof object == "string"
      joins[object] = true
    else
      _.extend joins, object

    joins

  # Methods to remove from the scope.
  #
  # @param [Arguments] keys
  except: ->
    @_except = _.flatten _.args(arguments)

  # Set of conditions the database fields must satisfy.
  #
  # @example
  #   App.Post.where(title: "First Post").all()
  #
  # @param [Object] conditions
  where: (conditions) ->
    if conditions instanceof Tower.Model.Criteria
      @merge(conditions)
    else
      @_where.push(conditions)

  # Attribute and direction used for ordering the datastore's result set.
  #
  # @example
  #   App.Post.order("title", "desc").all()
  #
  # @param [String] attribute
  # @param [String] direction ("asc") can be "asc" or "desc".
  #
  # @return [Array] returns the full set of order commands for this criteria.
  order: (attribute, direction = "asc") ->
    @_order.push [attribute, direction]

  # Alias for {#order}.
  sort: @::order

  # Reverses the query so it can find the last one.
  reverseSort: ->
    order = @get('order')
    for set, i in order
      set[1] = if set[1] == "asc" then "desc" else "asc"
    order

  # Set of attributes to sort by, ascending.
  #
  # @example
  #   App.Post.asc("title").all()
  #
  # @param [Arguments] attributes
  #
  # @return [Array] returns the full set of order commands for this criteria.
  asc: (attributes...) ->
    @order(attribute) for attribute in attributes
    @_order

  # Set of attributes to sort by, descending.
  #
  # @example
  #   App.Post.desc("title").all()
  #
  # @param [Arguments] attributes
  #
  # @return [Array] returns the full set of order commands for this criteria.
  desc: (attributes...) ->
    @order(attribute, "desc") for attribute in attributes
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
  #   App.Post.allIn(tags: ["ruby", "javascript"]).all()
  #
  # @param [Object] attributes
  #
  # @return [Object] the final set of conditions for this criteria.
  allIn: (attributes) ->
    @_whereOperator "$all", attributes

  # @example
  #   App.Post.anyIn(tags: ["ruby", "javascript"]).all()
  anyIn: (attributes) ->
    @_whereOperator "$any", attributes

  # @example
  #   App.Post.notIn(tags: [".net"]).all()
  notIn: (attributes) ->
    @_whereOperator "$nin", attributes

  # @example
  #   App.Post.offset(20).all()
  offset: (number) ->
    @_offset = number

  limit: (number) ->
    @_limit = number

  # The set of fields we want the database to return, no more.
  #
  # @example Return only the `id` from the database.
  #   App.User.select("id").all()
  #
  # @param [Arguments] fields
  #
  # @return [Array] returns the fields for this criteria.
  select: ->
    @_fields = _.flatten _.args(fields)

  includes: ->
    @_includes = _.flatten _.args(arguments)

  uniq: (value) ->
    @_uniq = value

  # @example
  #   App.Post.page(2).all()
  page: (page) ->
    limit = @limit(@_limit || @defaultLimit)
    @offset((Math.max(1, page) - 1) * limit)

  paginate: (options) ->
    limit   = options.perPage || options.limit
    page    = options.page || 1
    @limit(limit)
    @offset((page - 1) * limit)

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
  # @example
  #   App.User.near(coordinates).within(5, "miles")
  #   App.User.near(coordinates).within(distance: 5, unit: "km")
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

  build: (callback) ->
    @_build(callback)

  _build: (callback) ->
    store       = @store
    attributes  = @attributes()

    data        = @data
    data.push({}) unless data.length

    result      = []

    for item in data
      if item instanceof Tower.Model
        _.extend(item.attributes, attributes, item.attributes)
      else
        item = store.serializeModel(_.extend({}, attributes, item))

      result.push(item)

    result = if @returnArray then result else result[0]

    callback.call(@, null, result) if callback

    result

  create: (callback) ->
    @_create(callback)

  _create: (callback) ->
    records = undefined

    if @instantiate
      returnArray   = @returnArray
      @returnArray  = true
      records       = @build()
      @returnArray  = returnArray

      iterator = (record, next) ->
        if record
          record.save(next)
        else
          next()

      Tower.async records, iterator, (error) =>
        unless callback
          throw error if error
          records = records[0] if !returnArray
        else
          return callback(error) if error
          records = records[0] if !returnArray
          callback(error, records)
    else
      @store.create @, callback

    records

  update: (callback) ->
    @_update callback

  _update: (callback) ->
    updates = @data[0]

    if @instantiate
      iterator = (record, next) =>
        record.updateAttributes(updates, next)

      @_each @, iterator, callback
    else
      @store.update updates, @, callback

  destroy: (callback) ->
    @_destroy callback

  _destroy: (callback) ->
    if @instantiate
      iterator = (record, next) ->
        record.destroy(next)

      @_each @, iterator, callback
    else
      @store.destroy @, callback

  find: (callback) ->
    @_find callback

  _find: (callback) ->
    if @one
      @store.findOne @, callback
    else
      @store.find @, (error, records) =>
        records = @export(records) if !error && records.length?
        callback.call @, error, records if callback
        records

  # hack
  findOne: (callback) ->
    @limit(1)
    @returnArray = false
    @find callback

  count: (callback) ->
    @_count callback

  _count: (callback) ->
    @store.count @, callback

  exists: (callback) ->
    @_exists callback

  _exists: (callback) ->
    @store.exists @, callback

  # add to set
  add: (callback) ->

  # remove from set
  remove: (callback) ->

  # Show query that will be used for the datastore.
  # @todo
  explain: (callback) ->

  # Clone this criteria.
  #
  # @return [Tower.Model.Criteria]
  clone: ->
    (new @constructor(model: @model, instantiate: @instantiate)).merge(@)

  # Merge this criteria with another criteria.
  #
  # @param [Tower.Model.Criteria] criteria
  #
  # @return [Tower.Model.Criteria] returns this criteria.
  merge: (criteria) ->
    @_where     = @_where.concat criteria._where
    @_order     = @_order.concat criteria._order
    @_offset    = criteria._offset
    @_limit     = criteria._limit
    @_fields    = criteria._fields
    @_except    = criteria._except
    @_includes  = criteria._includes
    @_joins     = _.extend {}, criteria._joins
    @_eagerLoad = _.extend {}, criteria._eagerLoad
    @_near      = criteria._near
    @

  toJSON: ->
    where:     @_where
    order:     @_order
    offset:    @_offset
    limit:     @_limit
    fields:    @_fields
    except:    @_except
    includes:  @_includes
    joins:     @_joins
    eagerLoad: @_eagerLoad
    near:      @_near

  # Compiled result from the {#where} arguments.
  #
  # @return [Object]
  conditions: ->
    result = {}

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
      if @store.constructor.name == "Memory"
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
      ## tags: $in: ["a", "b"]
      ## $push: tags: ["c"]
      for key, value of conditions
        # this check needs to be better
        if Tower.Store.isKeyword(key)
          for _key, _value of value
            attributes[_key] = _value
        else if _.isHash(value) && value.constructor.name == "Object" && Tower.Store.hasKeyword(value)
          for _key, _value of value
            attributes[key] = _value
        else
          attributes[key] = value

    for key, value of attributes
      delete attributes[key] if value == undefined

    attributes

  # @private
  _whereOperator: (operator, attributes) ->
    query = {}
    for key, value of attributes
      query[key] = {}
      query[key][operator] = value
    @where query

  # @private
  _each: (criteria, iterator, callback) ->
    data = !!criteria.data
    @store.find criteria, (error, records) =>
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

module.exports = Tower.Model.Criteria
