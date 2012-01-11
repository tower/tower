Tower.Controller.Params =
  ClassMethods:
    
    # @params limit: 20, sort: "created_at desc", ->
    #   @param "name", to: "users.fullName", type: "string"
    #   @param "email"
    #   @param "status"
    #   @param "role", to: {roles: "name"}, type: "string"
    #   @param "createdAt"
    params: (options, callback) ->
      if typeof options == 'function'
        callback  =  options
        options   = {}
      
      if options
        @_paramsOptions = Tower.Support.Object.extend(@_paramsOptions || {}, options)
        callback.call(@)
        
      @_params ||= {}
      
    param: (key, options = {}) ->  
      @_params      ||= {}
      @_params[key] = Tower.Dispatch.Param.create(key, Tower.Support.Object.extend({}, @_paramsOptions || {}, options))
  
  criteria: ->
    return @_criteria if @_criteria
    
    @_criteria = criteria = new Tower.Model.Criteria
    
    parsers = @constructor.params()
    params  = @params
    
    for name, parser of parsers
      if params.hasOwnProperty(name)
        criteria.where(parser.toCriteria(params[name]))
        
    criteria
  
  withParams: (path, newParams = {}) ->
    params = Tower.Support.Object.extend @query, newParams
    return path if Tower.Support.Object.blank(params)
    queryString = @queryFor(params)
    "#{path}?#{query_string}"
    
  queryFor: (params = {}) ->
    
  paramOperators: (key) ->

module.exports = Tower.Controller.Params
