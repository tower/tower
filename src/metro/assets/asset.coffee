class Asset
  constructor: (environment, path) ->
    @environment = environment
    @path        = Metro.Support.File.expand_path(path)
    #@id           = @environment.digest.update(object_id)
  
  stat: ->
    Metro.Support.File.stat(@path)
  
  # Returns `Content-Type` from path.
  content_type: ->
    @_content_type ?= Metro.Support.File.content_type(@path)
  
  # Get mtime at the time the `Asset` is built.
  mtime: ->
    @_mtime ?= Metro.Support.File.stat(@path).mtime
  
  # Get size at the time the `Asset` is built.
  size: ->
    @_size ?= Metro.Support.File.stat(@path).size
  
  # Get content digest at the time the `Asset` is built.
  digest: ->
    @_digest ?= Metro.Support.File.digest(@path)
  
  # Return logical path with digest spliced in.
  # 
  #   "foo/bar-37b51d194a7513e45b56f6524f2d51f2.js"
  # 
  digest_path: ->
    @path_with_fingerprint(@digest())
  
  # Returns `Array` of extension `String`s.
  # 
  #     "foo.js.coffee"
  #     # => [".js", ".coffee"]
  # 
  extensions: ->
    @_extensions ?= Metro.Support.File.extensions(@path)
  
  # Gets digest fingerprint.
  # 
  #     "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
  #     # => "0aa2105d29558f3eb790d411d7d8fb66"
  # 
  path_fingerprint: ->
    result = Metro.Support.File.basename(@path).match(/-([0-9a-f]{32})\.?/)
    if result? then result[1] else null
  
  # Injects digest fingerprint into path.
  # 
  # ``` coffeescript
  # "foo.js" #=> "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
  # ```
  # 
  path_with_fingerprint: (digest) ->
    if old_digest = @path_fingerprint()
      @path.replace(old_digest, digest)
    else
      @path.replace(/\.(\w+)$/, "-#{digest}.\$1")
  
  # Returns file contents as its `body`.
  body: ->
    Metro.Support.File.read(@path)
    
  write: (to, options) ->
    # Gzip contents if filename has '.gz'
    options.compress ?= Metro.Support.File.extname(to) == '.gz'
    
    if options.compress
      # Open file and run it through `Zlib`
      fs.readFile @path, (data) ->
        fs.writeFile "#{to}+", data
    else
      # If no compression needs to be done, we can just copy it into place.
      Metro.Support.File.copy(@path, "#{to}+")
    
    # Atomic write
    FileUtils.mv("#{filename}+", filename)
    
    # Set mtime correctly
    Metro.Support.File.utime(mtime, mtime, filename)

    nil

module.exports = Asset
