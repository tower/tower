# This class has plenty of room for optimization
class Tower.Model.Criteria
  constructor: (args = {}) ->
    @[key] = value for key, value of args
    @_where ||= []
    @_order ||= []
    
  joins: (object) ->
    joins = @_joins ||= {}
    if Tower.Support.Object.isArray(object)
      joins[key] = true for key in object
    else if typeof object == "string"
      joins[object] = true
    else
      Tower.Support.Object.extend joins, object
    @
    
  through: (scope) ->
    @_through = scope

  where: (conditions) ->
    if conditions instanceof Tower.Model.Criteria
      @merge(conditions)
    else
      @_where.push(conditions)

  order: (attribute, direction = "asc") ->
    @_order ||= []
    @_order.push [attribute, direction]
    #@mergeOptions sort: [[attribute, direction]]

  asc: (attributes...) ->
    @order(attribute) for attribute in attributes

  desc: (attributes...) ->
    @order(attribute, "desc") for attribute in attributes

  allIn: (attributes) ->
    @_whereOperator "$all", attributes

  anyIn: (attributes) ->
    @_whereOperator "$any", attributes

  notIn: (attributes) ->
    @_whereOperator "$nin", attributes

  offset: (number) ->
    @_offset = number
    #@mergeOptions offset: number

  limit: (number) ->
    @_limit = number
    @mergeOptions limit: number

  select: ->
    @_fields = Tower.Support.Array.args(arguments)

  includes: ->
    @_includes = Tower.Support.Array.args(arguments)

  page: (number) ->
    @offset(number)

  paginate: (options) ->
    limit   = options.perPage || options.limit
    page    = options.page || 1
    @limit(limit)
    @offset((page - 1) * limit)

  clone: ->
    new @constructor(@attributes())

  merge: (criteria) ->
    attributes = criteria.attributes()
    @_where = @_where.concat attributes._where if attributes._where.length > 0
    @_order = @_order.concat attributes._order if attributes._order.length > 0
    @_offset = attributes._offset if attributes._offset?
    @_limit = attributes._limit if attributes._limit?
    @_fields = attributes._fields if attributes._fields
    @_offset = attributes._offset if attributes._offset?
    @_joins = attributes._joins if attributes._joins?
    @_through = attributes._through if attributes._through?
    @

  options: ->
    options = {}
    options.offset  = @_offset  if @_offset?
    options.limit   = @_limit   if @_limit?
    options.fields  = @_fields  if @_fields
    options.sort    = @_order   if @_order.length > 0
    options.joins   = @_joins   if @_joins?
    options.through   = @_through   if @_through?
    options
    
  conditions: ->
    result = {}

    for conditions in @_where
      Tower.Support.Object.deepMergeWithArrays(result, conditions)

    result

  attributes: (to = {}) ->
    to._where     = @_where.concat()
    to._order     = @_order.concat()
    to._offset    = @_offset  if @_offset?
    to._limit     = @_limit   if @_limit?
    to._fields    = @_fields  if @_fields
    to._includes  = @_includes if @_includes
    to._joins     = @_joins if @_joins?
    to._through   = @_through if @_through?
    to

  toQuery: ->
    conditions: @conditions(), options: @options()

  toUpdate: ->
    @toQuery()

  toCreate: ->
    attributes  = {}
    options     = {}
    
    for conditions in @_where
      # tags: $in: ["a", "b"]
      # $push: tags: ["c"]
      for key, value of conditions
        if Tower.Store.isKeyword(key)
          for _key, _value of value
            attributes[_key] = _value
        # this check needs to be better
        else if Tower.Support.Object.isHash(value) && value.constructor.name == "Object" && Tower.Store.hasKeyword(value)
          for _key, _value of value
            attributes[key] = _value
        else
          attributes[key] = value

    for key, value of attributes
      delete attributes[key] if value == undefined

    attributes: attributes, options: options

  mergeOptions: (options) ->
    options

  # @private
  _whereOperator: (operator, attributes) ->
    query = {}
    for key, value of attributes
      query[key] = {}
      query[key][operator] = value
    @where query

module.exports = Tower.Model.Criteria