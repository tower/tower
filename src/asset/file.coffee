# https://github.com/sstephenson/sprockets/blob/master/lib/sprockets/asset_attributes.rb
class File
  constructor: (environment, logical_path, pathname) ->
    @environment  = environment
    @logical_path = logical_path.to_s
    @pathname     = Pathname.new(pathname)
    @id           = @environment.digest.update(object_id.to_s).to_s
  
  ###
  Returns `Content-Type` from pathname.
  ###
  content_type: ->
    @_content_type ?= @environment.content_type_of(@pathname)
  
  ###
  Get mtime at the time the `Asset` is built.
  ###
  mtime: ->
    @_mtime ?= @environment.stat(@pathname).mtime
  
  ###
  Get length at the time the `Asset` is built.
  ###
  length: ->
    @_length ?= @environment.stat(@pathname).size
  
  ###
  Get content digest at the time the `Asset` is built.
  ###
  digest: ->
    @_digest ?= @environment.file_digest(@pathname).hexdigest
  
  ###
  Return logical path with digest spliced in.
  
    "foo/bar-37b51d194a7513e45b56f6524f2d51f2.js"
  ###
  digest_path: ->
    @environment.attributes_for(@logical_path()).path_with_fingerprint(@digest())
  
  ###
  Returns `Array` of extension `String`s.
  
      "foo.js.coffee"
      # => [".js", ".coffee"]
  ###
  extensions: ->
    @_extensions ?= @pathname.basename.to_s.scan(/\.[^.]+/)
 
  ###
  Gets digest fingerprint.
  
      "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
      # => "0aa2105d29558f3eb790d411d7d8fb66"
  ###
  path_fingerprint: ->
    @pathname.basename(extensions.join).to_s =~ /-([0-9a-f]{7,40})$/ ? $1 : null

  ###
  Injects digest fingerprint into path.
  
      "foo.js"
      # => "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
  ###
  path_with_fingerprint: (digest) ->
    if old_digest = @path_fingerprint()
      @pathname.sub(old_digest, digest).to_s
    else
      @
      #@pathname.to_s.sub(/\.(\w+)$/) { |ext| "-#{digest}#{ext}" }

exports = module.exports = File
