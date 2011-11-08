class Lookup
  @digests: ->
    @_digests ||= {}
  
  @stylesheetLookup: ->
    @_stylesheetLookup ||= @_createLookup(
      @config.stylesheetDirectory
      @config.stylesheetExtensions
      @config.stylesheetAliases
    )
  
  @javascriptLookup: ->
    @_javascriptLookup ||= @_createLookup(
      @config.javascriptDirectory
      @config.javascriptExtensions
      @config.javascriptAliases
    )
  
  @imageLookup: ->
    @_imageLookup ||= @_createLookup(
      @config.imageDirectory
      @config.imageExtensions
      @config.imageAliases
    )
  
  @fontLookup: ->
    @_fontLookup ||= @_createLookup(
      @config.fontDirectory
      @config.fontExtensions
      @config.fontAliases
    )
  
  @_createLookup: (directory, extensions, aliases) ->
    paths = []
    
    for path in @config.loadPaths
      #path = @join(path, directory) if directory
      paths.push(path)
      paths = paths.concat @directories(path)
    
    root = Metro.root
    
    new Metro.Support.Lookup
      root:       root
      paths:      paths
      extensions: extensions
      aliases:    aliases
  
  # All extensions must start with a "."
  @pathsFor: (extension) ->
    @lookupFor(extension).paths
  
  @lookupFor: (extension) ->
    switch extension
      when ".css" then @stylesheetLookup()
      when ".js" then @javascriptLookup()
      else []
      
  @digestFor: (source) ->
    @digests[source] || source
    
  # Add the extension +ext+ if not present. Return full or scheme-relative URLs otherwise untouched.
  # Prefix with <tt>/dir/</tt> if lacking a leading +/+. Account for relative URL
  # roots. Rewrite the asset path for cache-busting asset ids. Include
  # asset host, if configured, with the correct request protocol.
  #
  # When :relative (default), the protocol will be determined by the client using current protocol
  # When :request, the protocol will be the request protocol
  # Otherwise, the protocol is used (E.g. :http, :https, etc)
  @computePublicPath: (source, options = {}) ->
    return source if @isUrl(source)
    extension = options.extension
    source = @normalizeExtension(source, extension) if extension
    source = @normalizeAssetPath(source, options)
    source = @normalizeRelativeUrlRoot(source, @relativeUrlRoot)
    source = @normalizeHostAndProtocol(source, options.protocol)
    source
    
  @computeAssetHost: ->
    if typeof(@config.host) == "function" then @config.host.call(@) else @config.host
    
  @normalizeExtension: (source, extension) ->
    @basename(source, extension) + extension
  
  @normalizeAssetPath: (source, options = {}) ->
    if @isAbsolute(source)
      source
    else
      source = @join(options.directory, source)
      source = @digestFor(source) unless options.digest == false
      source = "/#{source}" unless !!source.match(/^\//)
      source
      
  @normalizeRelativeUrlRoot: (source, relativeUrlRoot) ->
    if relativeUrlRoot && !source.match(new RegExp("^#{relativeUrlRoot}/"))
      "#{relativeUrlRoot}#{source}"
    else
      source
  
  @normalizeHostAndProtocol: (source, protocol) ->
    host = @computeAssetHost(source)
    #if host && !@isUri(host)
      #if (protocol || @defaultProtocol) == :request && !hasRequest?
      #  host = nil
      #else
      #  host = "#{computeProtocol(protocol)}#{host}"
    if host then "#{host}#{source}" else source
  
  # find path from source and extension
  # this method must be given a real file path!
  @find: (source, options = {}) ->
    paths = @lookup(source, options)
    
    unless paths && paths.length > 0
      Metro.raise "errors.asset.notFound", source, paths#(lookup.paths.map (path) -> "    #{path}").join(",\n")
    
    new Metro.Asset(paths[0], options.extension)
    
  @lookup: (source, options = {}) ->
    source = @normalizeSource(source)

    options.extension ||= @extname(source)
    
    Metro.raise("errors.missingOption", "extension", "Asset#find") if options.extension == ""

    pattern = "(?:" + Metro.Support.RegExp.escape(options.extension) + ")?$"
    source  = source.replace(new RegExp(pattern), options.extension)
    lookup  = @lookupFor(options.extension)
    if lookup then lookup.find(source) else []
    
  @match: (path) ->
    !!path.match(@pathPattern())
    
  @normalizeSource: (source) ->
    source.replace(@pathPattern(), "")
    
  @pathPattern: ->
    @_pathPattern ||= new RegExp("^/(assets|#{@config.stylesheetDirectory}|#{@config.javascriptDirectory}|#{@config.imageDirectory}|#{@config.fontDirectory})/")
    
module.exports = Lookup
