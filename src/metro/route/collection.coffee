# https://github.com/cloudhead/journey

class Collection
  set:    []
  named:  {}
  
  draw: (callback) ->
    mapper              = new Metro.Route.Mapper(@).instance_eval(callback)
    @
    
  add: (path, conditions, defaults, name) ->
    route               = Metro.Route.new(path, conditions, defaults, name)
    @set.push route
    @named[name] = route if name?
    route
    
  clear: ->
    @set    = []
    @named  = {}
    
exports = module.exports = Collection
