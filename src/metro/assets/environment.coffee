file = require("file")

class Environment
  public_path: "./public"
  load_paths: ["./app/assets"]
  
  # This is appended to the load paths and public paths
  assets_directory:     "assets"
  stylesheet_directory: "stylesheets"
  javascript_directory: "javascripts"
  asset_host: ""
  
  # cached full path to the asset
  asset_id: (source) ->
    
  
  rewrite_host_and_protocol: (source, protocol) ->
    host = @compute_asset_host(source)
    if host && !@is_uri(host)
      #if (protocol || @default_protocol) == :request && !has_request?
      #  host = nil
      #else
      #  host = "#{compute_protocol(protocol)}#{host}"
    host ? "#{host}#{source}" : source
  
  compute_asset_host: (source) ->
    host = @asset_host
    
  is_url: (path) ->
    !!path.match(/^[-a-z]+:\/\/|^cid:|^\/\//)
  
  # Return the filesystem path for the source
  compute_source_path: (source, dir, ext) ->
    
  # Add the extension +ext+ if not present. Return full or scheme-relative URLs otherwise untouched.
  # Prefix with <tt>/dir/</tt> if lacking a leading +/+. Account for relative URL
  # roots. Rewrite the asset path for cache-busting asset ids. Include
  # asset host, if configured, with the correct request protocol.
  #
  # When :relative (default), the protocol will be determined by the client using current protocol
  # When :request, the protocol will be the request protocol
  # Otherwise, the protocol is used (E.g. :http, :https, etc)
  compute_public_path: (source, dir, options) ->
    return source if @is_uri(source)
    
    source = rewrite_extension(source, dir, options[:ext]) if options.ext
    source = rewrite_asset_path(source, dir, options)
    source = rewrite_relative_url_root(source, relative_url_root)
    source = rewrite_host_and_protocol(source, options.protocol)
    source
    
  # give it a key and an extension and it will give you the source path of the file
  public_source_path: (path, options) ->
    ext     = options.ext
    throw new Error("what's the extension? (e.g. options.ext = 'css')") unless ext?
    dir     = file.dirname(source)
    name    = file.basename(source)
    ext     = file.extname(source)
    
    source  =
  
  # pass in a complete path, and it will find it.
  # useful for the asset server
  find: (path) ->
    
module.exports = Environment
