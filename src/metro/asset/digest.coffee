class Digest
  @include Metro.Support.Concern
  
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
  
module.exports = Digest
