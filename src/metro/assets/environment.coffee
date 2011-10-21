_ = require('underscore')

class Environment
  public_path: "./public"
  load_paths: ["./app/assets"]
  
  # This is appended to the load paths and public paths
  asset_directory:     "assets"
  
  stylesheet_directory: "stylesheets"
  stylesheet_extensions: ["css", "styl", "scss", "less"]
  
  javascript_directory: "javascripts"
  javascript_extensions: ["js", "coffee", "ejs"]
  
  asset_host:           null
  relative_root_url:    null
  
  stylesheet_lookup: ->
    directory   = @stylesheet_directory
    extensions  = @stylesheet_extensions
    paths       = []
    for path in @load_paths
      path = Metro.Support.Path.join(path, directory)
      paths.push(path)
      paths = paths.concat Metro.Support.Path.directories(path)
    
    @_stylesheet_lookup ?= new Metro.Support.Lookup
      root:       Metro.root
      paths:      paths
      extensions: extensions
      
  javascript_lookup: ->
    directory   = @javascript_directory
    extensions  = @javascript_extensions
    paths       = []
    for path in @load_paths
      path = Metro.Support.Path.join(path, directory)
      paths.push(path)
      paths = paths.concat Metro.Support.Path.directories(path)
    
    @_javascript_lookup ?= new Metro.Support.Lookup
      root:       Metro.root
      paths:      paths
      extensions: extensions
      aliases:
        js: ["coffee", "coffeescript"]
        coffee: ["coffeescript"]
      
  digest: (source) ->
    @digests[source] || source
    
  # Add the extension +ext+ if not present. Return full or scheme-relative URLs otherwise untouched.
  # Prefix with <tt>/dir/</tt> if lacking a leading +/+. Account for relative URL
  # roots. Rewrite the asset path for cache-busting asset ids. Include
  # asset host, if configured, with the correct request protocol.
  #
  # When :relative (default), the protocol will be determined by the client using current protocol
  # When :request, the protocol will be the request protocol
  # Otherwise, the protocol is used (E.g. :http, :https, etc)
  compute_public_path: (source, options = {}) ->
    return source if Metro.Support.Path.is_url(source)
    extension = options.extension
    source = @normalize_extension(source, extension) if extension
    source = @normalize_asset_path(source, options)
    source = @normalize_relative_url_root(source, @relative_url_root)
    source = @normalize_host_and_protocol(source, options.protocol)
    source
    
  compute_asset_host: ->
    if typeof(@asset_host) == "function" then @asset_host.call(@) else @asset_host
    
  normalize_extension: (source, extension) ->
    Metro.Support.Path.basename(source, extension) + extension
  
  normalize_asset_path: (source, options = {}) ->
    if Metro.Support.Path.is_absolute(source)
      source
    else
      source = Metro.Support.Path.join(options.directory, source)
      source = @digest(source) unless options.digest == false
      source = "/#{source}" unless !!source.match(/^\//)
      source
      
  normalize_relative_url_root: (source, relative_url_root) ->
    if relative_url_root && !source.match(new RegExp("^#{relative_url_root}/"))
      "#{relative_url_root}#{source}"
    else
      source
  
  normalize_host_and_protocol: (source, protocol) ->
    host = @compute_asset_host(source)
    #if host && !@is_uri(host)
      #if (protocol || @default_protocol) == :request && !has_request?
      #  host = nil
      #else
      #  host = "#{compute_protocol(protocol)}#{host}"
    if host then "#{host}#{source}" else source
  
  read: (source, options = {}) ->
    
    
  # find path from source and extension
  # this method must be given a real file path!
  find: (source, options = {}) ->
    paths = @lookup(source, options)
    
    return null unless paths && paths.length > 0
    
    new Metro.Assets.Asset(paths[0], options.extension)
    
  lookup: (source, options = {}) ->
    source = source.replace(@path_pattern(), "")
    
    options.extension ?= Metro.Support.Path.extname(source)
    
    if options.extension == ".css"
      @stylesheet_lookup().find(source)
    else if options.extension == ".js"
      @javascript_lookup().find(source)
    else
      []
      
  match: (path) ->
    !!path.match(@path_pattern())
    
  path_pattern: ->
    @_path_pattern ?= new RegExp("^/(#{@asset_directory}|#{@stylesheet_directory}|#{@javascript_directory})/")
    
module.exports = Environment
