Metro.Controller.Params =
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
        @_paramsOptions = Metro.Support.Object.extend(@_paramsOptions || {}, options)
        callback.call(@)
        
      @_params ||= {}
      
    param: (key, options = {}) ->  
      @_params      ||= {}
      @_params[key] = Metro.Net.Param.create(key, Metro.Support.Object.extend({}, @_paramsOptions || {}, options))
  
  scopedParams: ->
    return @_scopedParams if @_scopedParams
    
    @_scopedParams = {}
    
    params = @constructor.params()
    
    #for key, value of params
    #  @_scopedParams[key] = 
  
  withParams: (path, newParams = {}) ->
    params = Metro.Support.Object.extend @query, newParams
    return path if Metro.Support.Object.blank(params)
    queryString = @queryFor(params)
    "#{path}?#{query_string}"
    
  queryFor: (params = {}) ->
    
  paramOperators: (key) ->

module.exports = Metro.Controller.Params
