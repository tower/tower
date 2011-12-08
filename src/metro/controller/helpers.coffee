Metro.Controller.Helpers =
  ClassMethods:
    helper: (object) ->
      @_helpers ||= []
      @_helpers.push(object)

    urlHelpers: ->
      routes  = Metro.Route.all()
      result  = {}
      
      for route in routes
        continue unless route.name
        result[route.name + "Path"] = ->
          route.urlFor(arguments...)
        
      result
    
  urlFor: ->
  
module.exports = Metro.Controller.Helpers
