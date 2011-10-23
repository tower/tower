_     = require('underscore')
async = require('async')

class Asset extends (require("../support/path"))
  @digest_path: (path) ->
    @path_with_fingerprint(path, @digest(path))
    
  @path_fingerprint: (path) ->
    result = Metro.Support.Path.basename(path).match(/-([0-9a-f]{32})\.?/)
    if result? then result[1] else null
    
  @path_with_fingerprint: (path, digest) ->
    if old_digest = @path_fingerprint(path)
      path.replace(old_digest, digest)
    else
      path.replace(/\.(\w+)$/, "-#{digest}.\$1")
  
  constructor: (path, extension) ->
    @path        = Metro.Support.Path.expand_path(path)
    @extension   = extension || @extensions()[0]
  
  # Return logical path with digest spliced in.
  # 
  #   "foo/bar-37b51d194a7513e45b56f6524f2d51f2.js"
  # 
  digest_path: ->
    @constructor.digest_path(@path)
  
  # Gets digest fingerprint.
  # 
  #     "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
  #     # => "0aa2105d29558f3eb790d411d7d8fb66"
  # 
  path_fingerprint: ->
    @constructor.path_fingerprint(@path)
  
  # Injects digest fingerprint into path.
  # 
  # ``` coffeescript
  # "foo.js" #=> "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
  # ```
  # 
  path_with_fingerprint: (digest) ->
    @constructor.path_with_fingerprint(@path, digest)
    
  write: (to, options) ->
    # Gzip contents if filename has '.gz'
    options.compress ?= Metro.Support.Path.extname(to) == '.gz'
    
    if options.compress
      # Open file and run it through `Zlib`
      fs.readFile @path, (data) ->
        fs.writeFile "#{to}+", data
    else
      # If no compression needs to be done, we can just copy it into place.
      Metro.Support.Path.copy(@path, "#{to}+")
    
    # Atomic write
    FileUtils.mv("#{filename}+", filename)
    
    # Set mtime correctly
    Metro.Support.Path.utime(mtime, mtime, filename)

    nil
  
  paths: (options, callback) ->
    self = @
    @parts options, (parts) ->
      paths = []
      paths.push(part.path) for part in parts
      callback.call self, paths
    
  parts: (options, callback) ->
    if typeof(options) == "function"
      callback  = options
      options   = {}
    options    ?= {}
    
    self        = @
    extension   = @extension
    
    require_directives = if options.hasOwnProperty("require") then options.require else true
    
    data = @read()
    
    if require_directives
      callback.call self, Metro.Assets.processor_for(extension[1..-1]).parse(data, self.path)
    else
      callback.call self, [content: data, path: self.path]
    
  parse: (options, callback) ->
    if typeof(options) == "function"
      callback  = options
      options   = {}
    options    ?= {}
    
    Metro.raise("errors.missing_callback", "Asset#render") unless callback
    
    self        = @
    extension   = @extension
    result      = []
    terminator  = "\n"
    
    @parts (options, parts) ->
      iterate = (part, next) ->
        if part.hasOwnProperty("content")
          self.compile part.content, _.extend({}, options), (data) ->
            part.content = data
            result.push(part)
            next()
        else
          child = Metro.Application.instance().assets().find(part.path, extension: extension)
          if child
            child.render _.extend({}, options), (data) ->
              part.content = data
              result.push(part)
              next()
          else
            console.log "Dependency '#{part.path}' not found in #{self.path}"
            next()
    
      async.forEachSeries parts, iterate, ->
        callback.call(self, result)
        
  render: (options, callback) ->
    if typeof(options) == "function"
      callback  = options
      options   = {}
    options    ?= {}
    result      = ""
    terminator  = "\n"
    self        = @
    @parse options, (parts) ->
      for part in parts
        result += part.content
      result += terminator
      callback.call(self, result)
    
  compile: (data, options, callback) ->
    options ?= {}
    self    = @
    iterate = (compiler, next) ->
      compiler.compile data, _.extend({}, options), (error, result) ->
        data = result
        next()
    
    async.forEachSeries @compilers(), iterate, ->
      callback.call(self, data)
    
  compilers: ->
    unless @_compilers
      extensions  = @extensions()
      result      = []
      
      for extension in extensions
        compiler = Metro.Compilers.find(extension[1..-1])
        result.push(compiler) if compiler
        
      @_compilers = result
      
    @_compilers
  
module.exports = Asset
