Metro.Controller.Params =
  ClassMethod:
    
    # @params limit: 20, sort: "created_at desc", ->
    #   @param "name", to: "users.fullName", type: "string"
    #   @param "email"
    #   @param "status"
    #   @param "role", to: {roles: "name"}, type: "string"
    #   @param "createdAt"
    params: (options = {}) ->
  
  scopedParams: ->
  
  withParams: (path, newParams = {}) ->
    params = Metro.Support.Object.extend @query, newParams
    return path if Metro.Support.Object.blank(params)
    queryString = @queryFor(params)
    "#{path}?#{query_string}"
    
  queryFor: (params = {}) ->
    
  paramOperators: (key) ->
    
module.exports = Metro.Controller.Params
