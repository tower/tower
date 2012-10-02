File = require('pathfinder').File
_ = Tower._
_path = require('path')

class Tower.StoreFileSystem extends Tower.Store
  @reopen
    # add load paths if you need to, e.g.
    # Tower.View.store().loadPaths.push("themes/views")
    init: (loadPaths = []) ->
      @loadPaths = loadPaths
      @records   = {}

    # @todo this needs to be modified by the file watcher in tower-application/server/application.coffee
    getTemplatePaths: ->
      @_templatePaths ||= _.map File.files.apply(File, _.map(@loadPaths, (i) -> _path.join(Tower.root, i))), (i) ->
        _path.relative(Tower.root, i)

    findPath: (query, callback) ->
      path          = query.path.replace(/\//g, _path.sep)
      ext           = query.ext || ""
      prefixes      = query.prefixes || []
      loadPaths     = _.map @loadPaths, (i) -> i.replace(/\//g, _path.sep)
      patterns      = []
      sep           = _path.sep

      if typeof(path) == "string"
        for loadPath in loadPaths
          for prefix in prefixes
            patterns.push new RegExp(_.regexpEscape("#{loadPath}#{sep}#{prefix}#{sep}#{path}\.#{ext}"))
          patterns.push new RegExp(_.regexpEscape("#{loadPath}#{sep}#{path}\.#{ext}"))
      else
        patterns.push path

      templatePaths = @getTemplatePaths()
      
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
      path  = "#{@loadPaths[0]}#{_path.sep}#{query.path}"
      path  = path.replace(new RegExp("(\\.#{query.ext})?$"), ".#{query.ext}")

    create: (cursor, callback) ->

    update: (updates, cursor, callback) ->

    destroy: (cursor, callback) ->

    exists: (cursor, callback) ->

    count: (cursor, callback) ->

module.exports = Tower.StoreFileSystem
