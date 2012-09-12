_ = Tower._

# @mixin
Tower.ControllerParams =
  ClassMethods:
    # Define a parameter that should be parsed into cursor for a model query.
    #
    # @example
    #   class App.UsersController extends App.ApplicationController
    #     @param 'email'
    #
    # @param [String] key
    # @param [Object] options
    # @option options [String] type
    #
    # @return [Tower.NetParam]
    param: (key, options = {}) ->
      options.resourceType = @metadata().resourceType
      @params()[key] = Tower.NetParam.create(key, options)

    # Return all params, or define multiple params at once.
    #
    # @example Pass in an object
    #   class App.UsersController extends App.ApplicationController
    #     @params email: 'String'
    #
    # @example Pass in strings
    #   class App.UsersController extends App.ApplicationController
    #     @params 'email', 'firstName', 'lastName'
    #
    # @return [Object]
    params: ->
      if arguments.length
        for arg in arguments
          if typeof arg == 'object'
            @param(key, value) for key, value of arg
          else
            @param(arg)

      @metadata().params

    # @todo refactor
    _buildCursorFromGet: (params, cursor) ->
      parsers     = @params()
      
      for name, parser of parsers
        if params.hasOwnProperty(name)
          if name == 'sort'
            cursor.order(parser.parse(params[name]))
          else if name == 'limit'
            cursor.limit(parser.extractValue(params[name]))
          else if name == 'page'
            cursor.page(parser.extractValue(params[name]))
          else if typeof params[name] == 'string'
            # @todo this shouldn't have to necessarily build a cursor, maybe there's a lighter way.
            cursor.where(parser.toCursor(params[name]))
          else
            object = {}
            object[name] = params[name]
            cursor.where(object)

      cursor

  # Compile the params defined for this controller into a cursor for querying the database.
  #
  # @note The cursor is memoized.
  #
  # @return [Tower.ModelCursor]
  cursor: ->
    return @_cursor if @_cursor

    cursor = Tower.ModelCursor.create()
    cursor.make()
    
    if @params.conditions # @request.method.toUpperCase() == 'POST'
      @_cursor = @_buildCursorFromPost(cursor)
    else
      @_cursor = @_buildCursorFromGet(cursor)

    @_cursor

  _buildCursorFromPost: (cursor) ->
    parsers     = @constructor.params()
    params      = @params
    conditions  = @params.conditions
    page        = @params.page
    limit       = @params.limit
    sort        = @params.sort

    # @todo
    cleanConditions = (hash) ->
      for key, value of hash
        if key == '$or' || key == '$nor'
          cleanConditions(item) for item in value
        else
          # @todo make more robust
          # You should only be able to query the id when
          # it is:
          # - included in a route (e.g. nested routes, userId, etc.),
          # - defined by `belongsTo` on the controller
          # - defined by `param` on the controller
          delete hash[key] unless parsers.hasOwnProperty(key) || key.match(/id$/i)

      hash

    conditions = cleanConditions(conditions)

    cursor.where(conditions)
    cursor.order(sort)  if sort && sort.length
    cursor.limit(limit) if limit
    cursor.page(page)   if page

    cursor

  _buildCursorFromGet: (cursor) ->
    @constructor._buildCursorFromGet(@get('params'), cursor)

module.exports = Tower.ControllerParams
