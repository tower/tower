# https://github.com/cloudhead/journey
# https://github.com/cloudhead/journey/blob/master/lib/journey.js
# https://github.com/rails/journey/blob/master/lib/journey/router.rb
# https://github.com/nodeca/express-railer/blob/master/lib/dispatcher.js
# https://github.com/senchalabs/connect
# https://github.com/1602/express-on-railway
# https://github.com/ciaranj/connect-auth
# http://nodejs.org/docs/v0.3.1/api/http.html
# https://github.com/visionmedia/express-params
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
