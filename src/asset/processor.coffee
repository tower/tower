file   = require("file")
fs     = require('fs')
_      = require("underscore")

class Processor
  constructor: (compressor) ->
    @_compressor = compressor
    
  compressor: ->
    @_compressor
    
  process: (options) ->
    self   = @
    result = {}
    
    if _.isArray(options.files)
      options.map = _.inject(
        options.files, 
        (hash, file) -> hash[file.replace(/\.(js|css)$/, "")] = file ; hash, 
        {}
      )
    else
      options.map = {}
      files = []
      for key of options.files
        options.map[key.replace(/\.(js|css)$/, "")] = options.files[key]
      options.files = files
    
    for key, files of options.map
      string = ''
      for path in options.paths
        file.walkSync path, (_path, _directories, _files) ->
          items = _.intersection(options.files, _files)
          for item in items
            string = string + self.compressor().compress(fs.readFileSync([_path, item].join("/"), 'utf8'))
      result[key] = string
    result
    
  compile: (options) ->
    dir  = options.path
    throw new Error("You must pass in a directory as 'path'") unless dir?
    data = @process(options)
    ext  = "." + @extension
    for key, string of data
      name = [dir, key].join("/") + ext
      fs.writeFileSync name, string
    
exports = module.exports = Processor
