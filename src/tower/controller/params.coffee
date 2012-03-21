Tower.Controller.Params =
  ClassMethods:
    params: (options, callback) ->
      if typeof options == 'function'
        callback  =  options
        options   = {}

      if options
        @_paramsOptions = Tower.Support.Object.extend(@_paramsOptions || {}, options)
        callback.call @ if callback

      @_params ||= {}

    param: (key, options = {}) ->
      @_params      ||= {}
      @_params[key] = Tower.HTTP.Param.create(key, Tower.Support.Object.extend({}, @_paramsOptions || {}, options))

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
