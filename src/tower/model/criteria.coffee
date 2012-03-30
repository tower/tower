# This class has plenty of room for optimization
class Tower.Model.Criteria
  constructor: (args = {}) ->
    args.where    ||= []
    args.joins    ||= {}
    args.order    ||= []
    args.data     ||= [] # records or updates
    args.options  ||= {}
    args.options.instantiate = true unless args.options.hasOwnProperty("instantiate")
    @values       = args
    # options.findOne = conditions.id && conditions.id.hasOwnProperty("$in") && conditions.id.$in.length == 1
    
  addData: (args) ->
    if args.length > 1 || _.isArray(args[0])
      @values.data = _.flatten(args)
      @values.returnArray = true
    else
      @values.data = [args[0]]
      @values.returnArray = false
  
  # Metadata.
  # 
  # @param [Object] options
  # 
  # @return [Object] returns all of the options.
  options: (options) ->
    @values.options = _.extend @values.options, options
  
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
    joins = @values.joins
    
    if Tower.Support.Object.isArray(object)
      joins[key] = true for key in object
    else if typeof object == "string"
      joins[object] = true
    else
      Tower.Support.Object.extend joins, object
      
    joins
  
  # Methods to remove from the scope.
  except: (keys...) ->
    @values.except = keys
  
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
      @values.where.push(conditions)
  
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
    @values.order ||= []
    @values.order.push [attribute, direction]
  
  # Alias for {#order}.
  sort: @::order
  
  defaultSort: (direction) ->
    @
  
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
    @values.order
    
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
  
  # Records must match all values in the array.
  # 
  # @example  
  #   App.Post.allIn(tags: ["ruby", "javascript"]).all()
  # 
  # @param [Object] attributes
  # 
  # @return [Object] the final set of conditions for this criteria.
  allIn: (attributes) ->
    @values.whereOperator "$all", attributes

  # @example  
  #   App.Post.anyIn(tags: ["ruby", "javascript"]).all()
  anyIn: (attributes) ->
    @values.whereOperator "$any", attributes

  # @example  
  #   App.Post.notIn(tags: [".net"]).all()
  notIn: (attributes) ->
    @values.whereOperator "$nin", attributes

  # @example  
  #   App.Post.offset(20).all()
  offset: (number) ->
    @values.offset = number

  limit: (number) ->
    @values.limit = number
  
  # The set of fields we want the database to return, no more.
  # 
  # @example Return only the `id` from the database.
  #   App.User.select("id").all()
  # 
  # @param [Arguments] fields
  # 
  # @return [Array] returns the fields for this criteria.
  select: (fields...) ->
    @values.fields = fields

  includes: ->
    @values.includes = Tower.Support.Array.args(arguments)
    
  uniq: (value) ->
    @values.uniq = value
  
  # @example  
  #   App.Post.page(2).all()
  page: (page) ->
    @offset((page - 1) * @values.limit || 20)
    
  paginate: (options) ->
    limit   = options.perPage || options.limit
    page    = options.page || 1
    @limit(limit)
    @offset((page - 1) * limit)

  # Clone this criteria.
  # 
  # @return [Tower.Model.Criteria]
  clone: ->
    new @constructor(@attributes())
  
  # Merge this criteria with another criteria.
  # 
  # @param [Tower.Model.Criteria] criteria
  # 
  # @return [Tower.Model.Criteria] returns this criteria.
  merge: (criteria) ->
    attributes  = criteria.attributes()
    values      = @values
    values.where = values.where.concat attributes._where if attributes._where.length > 0
    values.order = values.order.concat attributes._order if attributes._order.length > 0
    values.offset = attributes._offset if attributes._offset?
    values.limit = attributes._limit if attributes._limit?
    values.fields = attributes._fields if attributes._fields
    values.offset = attributes._offset if attributes._offset?
    values.joins = attributes._joins if attributes._joins?
    values.through = attributes._through if attributes._through?
    @
    
  # Compiled result from the {#where} arguments.
  # 
  # @return [Object]
  conditions: ->
    result = {}

    for conditions in @values.where
      Tower.Support.Object.deepMergeWithArrays(result, conditions)

    result

  attributes: (to = {}) ->
    values        = @values
    to.where      = values.where.concat()
    to.order      = values.order.concat()
    to.offset     = values.offset  if @values.offset?
    to.limit      = values.limit   if @values.limit?
    to.fields     = values.fields  if @values.fields
    to.includes   = values.includes if @values.includes
    to.joins      = values.joins if @values.joins?
    to.through    = values.through if @values.through?
    to

  # Compiled result from the {#where} arguments, but formatted for creating a model.
  # 
  # This means converting operators such as `$in` into an array, etc.
  # 
  # @return [Object]
  build: ->
    attributes  = {}
    
    for conditions in @values.where
      ## tags: $in: ["a", "b"]
      ## $push: tags: ["c"]
      for key, value of conditions
        # this check needs to be better
        if Tower.Store.isKeyword(key)
          for _key, _value of value
            attributes[_key] = _value
        else if Tower.Support.Object.isHash(value) && value.constructor.name == "Object" && Tower.Store.hasKeyword(value)
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

module.exports = Tower.Model.Criteria
