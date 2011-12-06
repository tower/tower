File = require('pathfinder').File

class Metro.Store.FileSystem extends Metro.Object
  # add load paths if you need to, e.g.
  # Metro.View.store().loadPaths.push("themes/views")
  constructor: (loadPaths = []) ->
    @loadPaths = loadPaths
    @records   = {}
    
  findPath: (query, callback) ->
    path          = query.path
    return @records[path] if @records[path]
    pattern       = if typeof(path) == "string" then new RegExp(path + "\\.", "i") else path
    
    templatePaths = File.files.apply(File, @loadPaths)
    
    for templatePath in templatePaths
      if !!pattern.exec(templatePath)
        @records[path] = templatePath
        callback(null, templatePath) if callback
        return templatePath
        
    callback(null, null) if callback
    null
    
  find: (query, callback) ->
    path = @findPath query
    return File.read(path) if path
    null
    
  @alias "select", "find"
  
  first: (query, callback) ->
  
  last: (query, callback) ->
  
  all: (query, callback) ->
  
  length: (query, callback) ->
    
  @alias "count", "length"
    
  remove: (query, callback) ->
    
  clear: ->
    
  toArray: ->
    
  create: (record, callback) ->
    @collection().insert(record, callback)
    
  update: (record) ->
    
  destroy: (record) ->
    
  sort: ->
  
module.exports = Metro.Store.FileSystem
