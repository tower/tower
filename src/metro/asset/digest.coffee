class Digest
  @include Metro.Support.Concern
  
  @digestPath: (path) ->
    @pathWithFingerprint(path, @digest(path))
    
  @pathFingerprint: (path) ->
    result = Metro.Support.Path.basename(path).match(/-([0-9a-f]{32})\.?/)
    if result? then result[1] else null
    
  @pathWithFingerprint: (path, digest) ->
    if oldDigest = @pathFingerprint(path)
      path.replace(oldDigest, digest)
    else
      path.replace(/\.(\w+)$/, "-#{digest}.\$1")
  
  # Return logical path with digest spliced in.
  # 
  #   "foo/bar-37b51d194a7513e45b56f6524f2d51f2.js"
  # 
  digestPath: ->
    @constructor.digestPath(@path)
  
  # Gets digest fingerprint.
  # 
  #     "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
  #     # => "0aa2105d29558f3eb790d411d7d8fb66"
  # 
  pathFingerprint: ->
    @constructor.pathFingerprint(@path)
  
  # Injects digest fingerprint into path.
  # 
  # ``` coffeescript
  # "foo.js" #=> "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
  # ```
  # 
  pathWithFingerprint: (digest) ->
    @constructor.pathWithFingerprint(@path, digest)
  
module.exports = Digest
