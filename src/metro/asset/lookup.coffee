class Lookup
  @digests: ->
    @_digests ?= {}
  
  @stylesheet_lookup: ->
    @_stylesheet_lookup ?= @_create_lookup(
      @config.stylesheet_directory
      @config.stylesheet_extensions
      @config.stylesheet_aliases
    )
  
  @javascript_lookup: ->
    @_javascript_lookup ?= @_create_lookup(
      @config.javascript_directory
      @config.javascript_extensions
      @config.javascript_aliases
    )
  
  @image_lookup: ->
    @_image_lookup ?= @_create_lookup(
      @config.image_directory
      @config.image_extensions
      @config.image_aliases
    )
  
  @font_lookup: ->
    @_font_lookup ?= @_create_lookup(
      @config.font_directory
      @config.font_extensions
      @config.font_aliases
    )
  
  @_create_lookup: (directory, extensions, aliases) ->
    paths = []
    
    for path in @config.load_paths
      path = @join(path, directory)
      paths.push(path)
      paths = paths.concat @directories(path)
    
    new Metro.Support.Lookup
      root:       Metro.root
      paths:      paths
      extensions: extensions
      aliases:    aliases
  
  # All extensions must start with a "."
  @paths_for: (extension) ->
    @lookup_for(extension).paths
  
  @lookup_for: (extension) ->
    switch extension
      when ".css" then @stylesheet_lookup()
      when ".js" then @javascript_lookup()
      else []
      
  @digest_for: (source) ->
    @digests[source] || source
    
  # Add the extension +ext+ if not present. Return full or scheme-relative URLs otherwise untouched.
  # Prefix with <tt>/dir/</tt> if lacking a leading +/+. Account for relative URL
  # roots. Rewrite the asset path for cache-busting asset ids. Include
  # asset host, if configured, with the correct request protocol.
  #
  # When :relative (default), the protocol will be determined by the client using current protocol
  # When :request, the protocol will be the request protocol
  # Otherwise, the protocol is used (E.g. :http, :https, etc)
  @compute_public_path: (source, options = {}) ->
    return source if @is_url(source)
    extension = options.extension
    source = @normalize_extension(source, extension) if extension
    source = @normalize_asset_path(source, options)
    source = @normalize_relative_url_root(source, @relative_url_root)
    source = @normalize_host_and_protocol(source, options.protocol)
    source
    
  @compute_asset_host: ->
    if typeof(@config.host) == "function" then @config.host.call(@) else @config.host
    
  @normalize_extension: (source, extension) ->
    @basename(source, extension) + extension
  
  @normalize_asset_path: (source, options = {}) ->
    if @is_absolute(source)
      source
    else
      source = @join(options.directory, source)
      source = @digest_for(source) unless options.digest == false
      source = "/#{source}" unless !!source.match(/^\//)
      source
      
  @normalize_relative_url_root: (source, relative_url_root) ->
    if relative_url_root && !source.match(new RegExp("^#{relative_url_root}/"))
      "#{relative_url_root}#{source}"
    else
      source
  
  @normalize_host_and_protocol: (source, protocol) ->
    host = @compute_asset_host(source)
    #if host && !@is_uri(host)
      #if (protocol || @default_protocol) == :request && !has_request?
      #  host = nil
      #else
      #  host = "#{compute_protocol(protocol)}#{host}"
    if host then "#{host}#{source}" else source
  
  # find path from source and extension
  # this method must be given a real file path!
  @find: (source, options = {}) ->
    source = source.replace(@path_pattern(), "")
    
    options.extension ?= @extname(source)
    
    Metro.raise("errors.missing_option", "extension", "Asset#find") if options.extension == ""
    
    pattern = "(?:" + Metro.Support.Lookup.prototype.escape(options.extension) + ")?$"
    source  = source.replace(new RegExp(pattern), options.extension)
    lookup  = @lookup_for(options.extension)
    paths   = lookup.find(source) if lookup
    
    return null unless paths && paths.length > 0
    
    new Metro.Asset(paths[0], options.extension)
    
  @match: (path) ->
    !!path.match(@path_pattern())
    
  @path_pattern: ->
    @_path_pattern ?= new RegExp("^/(assets|#{@config.stylesheet_directory}|#{@config.javascript_directory}|#{@config.image_directory}|#{@config.font_directory})/")
    
module.exports = Lookup
