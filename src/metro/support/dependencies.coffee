_ = require("underscore")
_.mixin(require("underscore.string"))

fs = require('fs')

# _require = global.require
# global.require = (path) ->
#   Metro.Support.Dependencies.load_path(path)

class Dependencies
  @load: (directory) ->
    paths = require('findit').sync directory
    @load_path(path) for path in paths
  
  @load_path: (path) ->
    self  = @
    keys  = @keys
    klass = Metro.Support.File.basename(path).split(".")[0]
    klass = _.camelize("_#{klass}")
    unless keys[klass]
      keys[klass]   = new Metro.Support.File(path)
      global[klass] = require(path)
      #fs.watchFile path, (curr, prev) ->
      # if +curr.mtime != +prev.mtime
      #   self.clear_dependency(klass)
      #   keys[klass]   = path 
      #   global[klass] = require(path)
      
  @clear: ->
    @clear_dependency(key) for key, file of @keys
  
  @clear_dependency: (key) ->
    file = @keys[key]
    delete require.cache[file.path]
    global[key] = null
    delete global[key]
    @keys[key] = null
    delete @keys[key]
    
  @reload_modified: ->
    self = @
    keys = @keys
    for key, file of keys
      if file.stale()
        self.clear_dependency(key)
        keys[key]   = file
        global[key] = require(file.path)
    
  @keys: {}
    
module.exports = Dependencies
