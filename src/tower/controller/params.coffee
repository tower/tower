# @mixin
Tower.Controller.Params =
  ClassMethods:
    # Define a parameter that should be parsed into criteria for a model query.
    #
    # @example
    #   class App.UsersController extends App.ApplicationController
    #     @param "email"
    #
    # @param [String] key
    # @param [Object] options
    # @option options [String] type
    #
    # @return [Tower.HTTP.Param]
    param: (key, options) ->
      @params()[key] = Tower.HTTP.Param.create(key, options)

    # Return all params, or define multiple params at once.
    #
    # @example Pass in an object
    #   class App.UsersController extends App.ApplicationController
    #     @params email: "String"
    #
    # @example Pass in strings
    #   class App.UsersController extends App.ApplicationController
    #     @params "email", "firstName", "lastName"
    #
    # @return [Object]
    params: ->
      if arguments.length
        for arg in arguments
          if typeof arg == "object"
            @param(key, value) for key, value of arg
          else
            @param(arg)

      @metadata().params

  InstanceMethods:
    # Compile the params defined for this controller into a criteria for querying the database.
    #
    # @note The criteria is memoized.
    #
    # @return [Tower.Model.Criteria]
    criteria: ->
      return @_criteria if @_criteria

      @_criteria  = criteria = new Tower.Model.Criteria

      parsers     = @constructor.params()
      params      = @params

      for name, parser of parsers
        if params.hasOwnProperty(name)
          criteria.where(parser.toCriteria(params[name]))

      criteria

module.exports = Tower.Controller.Params
