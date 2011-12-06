fs = require('fs')
File  = require('pathfinder').File
# https://github.com/fairfieldt/coffeescript-concat/blob/master/coffeescript-concat.coffee
# https://github.com/serpentem/coffee-toaster
# http://requirejs.org/
# _require = global.require
# global.require = (path) ->
#   Metro.Support.Dependencies.loadPath(path)

Metro.Support.Dependencies =
  load: (directory) ->
    paths = File.files(directory) if File.exists(directory)
    paths ||= []
    for path in paths
      @loadPath(path) if !!path.match(/\.(coffee|js)/)
  
  loadPath: (path) ->
    self  = @
    keys  = @keys
    klass = File.basename(path).split(".")[0]
    klass = Metro.Support.String.camelize("#{klass}")
    
    unless keys[klass]
      keys[klass]   = new File(path)
      global[klass] ||= require(path)
      
  clear: ->
    @clearDependency(key) for key, file of @keys
  
  clearDependency: (key) ->
    file = @keys[key]
    delete require.cache[require.resolve(file.path)]
    global[key] = null
    delete global[key]
    @keys[key] = null
    delete @keys[key]
    
  reloadModified: ->
    self = @
    keys = @keys
    for key, file of keys
      if file.stale()
        self.clearDependency(key)
        keys[key]   = file
        global[key] = require(file.path)
    
  keys: {}
    
module.exports = Metro.Support.Dependencies
