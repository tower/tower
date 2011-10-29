fs = require('fs')
# https://github.com/fairfieldt/coffeescript-concat/blob/master/coffeescript-concat.coffee
# https://github.com/serpentem/coffee-toaster
# http://requirejs.org/
# _require = global.require
# global.require = (path) ->
#   Metro.Support.Dependencies.loadPath(path)

class Dependencies
  @load: (directory) ->
    paths = require('findit').sync directory
    @loadPath(path) for path in paths
  
  @loadPath: (path) ->
    self  = @
    keys  = @keys
    klass = Metro.Support.Path.basename(path).split(".")[0]
    klass = Metro.Support.String.camelize("_#{klass}")
    unless keys[klass]
      keys[klass]   = new Metro.Support.Path(path)
      global[klass] = require(path)
      
  @clear: ->
    @clearDependency(key) for key, file of @keys
  
  @clearDependency: (key) ->
    file = @keys[key]
    delete require.cache[require.resolve(file.path)]
    global[key] = null
    delete global[key]
    @keys[key] = null
    delete @keys[key]
    
  @reloadModified: ->
    self = @
    keys = @keys
    for key, file of keys
      if file.stale()
        self.clearDependency(key)
        keys[key]   = file
        global[key] = require(file.path)
    
  @keys: {}
    
module.exports = Dependencies
