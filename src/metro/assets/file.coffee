fs      = require('fs')
crypto  = require('crypto')
mime    = require('mime')
_path   = require('path')
util    = require('util')

class File
  @stat: (path) ->
    fs.statSync(path)
  
  # see http://nodejs.org/docs/v0.3.1/api/crypto.html#crypto
  @digest_hash: ->
    crypto.createHash('md5')
    
  @digest: (path, data) ->
    stat = @stat(path)
    return unless stat?
    data ?= @read(path)
    return unless data?
    @digest_hash().update(data).digest("hex")
      
  @read: (path) ->
    fs.readFileSync(path)
    
  @content_type: (path) ->
    mime.lookup(path)
    
  @mtime: (path) ->
    @stat(path).mtime
    
  @expand_path: (path) ->
    _path.normalize(path)
  
  @basename: (path) ->
    _path.basename(path)
    
  @extname: (path) ->
    _path.extname(path)
    
  @exists: (path) ->
    _path.exists(path)
    
  @extensions: (path) ->
    @basename(path).split(".")[1..-1]
  
  # http://stackoverflow.com/questions/4568689/how-do-i-move-file-a-to-a-different-partition-in-node-js  
  # https://gist.github.com/992478
  @copy: (from, to) ->
    old_file = fs.createReadStream(from)
    new_file = fs.createWriteStream(to)
    new_file.once 'open', (data) ->
      util.pump(old_file, new_file)
    
  constructor: (environment, path) ->
    @environment = environment
    @path        = @constructor.expand_path(path)
    #@id           = @environment.digest.update(object_id)
  
  stat: ->
    @constructor.stat(@path)
  
  # Returns `Content-Type` from path.
  content_type: ->
    @_content_type ?= @constructor.content_type(@path)
  
  # Get mtime at the time the `Asset` is built.
  mtime: ->
    @_mtime ?= @constructor.stat(@path).mtime
  
  # Get size at the time the `Asset` is built.
  size: ->
    @_size ?= @constructor.stat(@path).size
  
  # Get content digest at the time the `Asset` is built.
  digest: ->
    @_digest ?= @constructor.digest(@path)
  
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
    @_extensions ?= @constructor.extensions(@path)
  
  # Gets digest fingerprint.
  # 
  #     "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
  #     # => "0aa2105d29558f3eb790d411d7d8fb66"
  # 
  path_fingerprint: ->
    result = @constructor.basename(@path).match(/-([0-9a-f]{32})\.?/)
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
    @constructor.read(@path)
    
  write: (to, options) ->
    # Gzip contents if filename has '.gz'
    options.compress ?= @constructor.extname(to) == '.gz'
    
    if options.compress
      # Open file and run it through `Zlib`
      fs.readFile @path, (data) ->
        fs.writeFile "#{to}+", data
    else
      # If no compression needs to be done, we can just copy it into place.
      @constructor.copy(@path, "#{to}+")
    
    # Atomic write
    FileUtils.mv("#{filename}+", filename)
    
    # Set mtime correctly
    @constructor.utime(mtime, mtime, filename)

    nil

module.exports = File
