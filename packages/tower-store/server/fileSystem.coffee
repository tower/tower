File = require('pathfinder').File

class Tower.StoreFileSystem extends Tower.Store
  # add load paths if you need to, e.g.
  # Tower.View.store().loadPaths.push("themes/views")
  init: (loadPaths = []) ->
    @loadPaths = loadPaths
    @records   = {}

  findPath: (query, callback) ->
    path          = query.path
    ext           = query.ext || ""
    prefixes      = query.prefixes || []
    loadPaths     = @loadPaths
    patterns      = []

    if typeof(path) == "string"
      for loadPath in loadPaths
        for prefix in prefixes
          patterns.push new RegExp("#{loadPath}/#{prefix}/#{path}\\.#{ext}")
        patterns.push new RegExp("#{loadPath}/#{path}\\.#{ext}")
    else
      patterns.push path

    templatePaths = File.files.apply(File, loadPaths)

    for pattern in patterns
      for templatePath in templatePaths
        if !!templatePath.match(pattern)
          callback(null, templatePath) if callback
          return templatePath

    callback(null, null) if callback
    null

  find: (query, callback) ->
    path = @findPath query
    return (File.read(path) || "") if path
    null

  defaultPath: (query, callback) ->
    path  = "#{@loadPaths[0]}/#{query.path}"
    path  = path.replace(new RegExp("(\\.#{query.ext})?$"), ".#{query.ext}")

  create: (cursor, callback) ->

  update: (updates, cursor, callback) ->

  destroy: (cursor, callback) ->

  exists: (cursor, callback) ->

  count: (cursor, callback) ->

module.exports = Tower.StoreFileSystem
