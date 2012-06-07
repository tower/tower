# @mixin
Tower.Controller.Params =
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
    # @return [Tower.Net.Param]
    param: (key, options) ->
      @params()[key] = Tower.Net.Param.create(key, options)

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

  InstanceMethods:
    # Compile the params defined for this controller into a cursor for querying the database.
    #
    # @note The cursor is memoized.
    #
    # @return [Tower.Model.Cursor]
    cursor: ->
      return @_cursor if @_cursor

      cursor = Tower.Model.Cursor.create()
      cursor.make()

      if @request.method.toUpperCase() == 'POST'
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

      for key, value of conditions
        delete conditions[key] unless parsers.hasOwnProperty(key)

      cursor.where(conditions)
      cursor.order(sort)  if sort && sort.length
      cursor.limit(limit) if limit
      cursor.page(page)   if page

      cursor

    _buildCursorFromGet: (cursor) ->
      parsers     = @constructor.params()
      params      = @params

      for name, parser of parsers
        if params.hasOwnProperty(name)
          if params[name] && typeof params[name] == 'string'
            cursor.where(parser.toCursor(params[name]))
          else if name == 'sort'
            cursor.order(params[name])
          else
            object = {}
            object[name] = params[name]
            cursor.where(object)

      cursor

module.exports = Tower.Controller.Params
