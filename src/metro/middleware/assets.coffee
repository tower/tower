class Assets
  @middleware: (request, response, next) -> (new Metro.Middleware.Assets).call(request, response, next)
  
  call: (request, response, next) ->
    assets      = Metro.Application.instance().assets()
    
    return next() unless assets.match(request.uri.pathname)
    
    asset       = assets.find(request.uri.pathname)
    
    respond = (status, headers, body) ->
      response.writeHead status, headers
      response.write body
      response.end()
    
    if !asset
      @not_found_response respond
    #else if @not_modified(asset)
    #  @not_modified_response(asset)
    else
      @ok_response asset, respond
  
  forbidden_request: (request) ->
    !!request.url.match(/\.{2}/)
    
  not_modified: (asset) ->
    env["HTTP_IF_MODIFIED_SINCE"] == asset.mtime.httpdate
    
  # Returns a 304 Not Modified response tuple
  not_modified_response: (asset, callback) ->
    callback 304, {}, []
    
  forbidden_response: (callback) ->
    callback 403, {"Content-Type": "text/plain", "Content-Length": "9"}, "Forbidden"
    
  not_found_response: (callback) ->
    callback 404, {"Content-Type": "text/plain", "Content-Length": "9", "X-Cascade": "pass"}, "Not found"
    
  # Returns a 200 OK response tuple
  ok_response: (asset, callback) ->
    paths = Metro.Application.instance().assets().paths_for(asset.extension)
    self  = @
    asset.render paths: paths, require: Metro.env != "production", (body) ->
      callback 200, self.headers(asset, asset.size()), body
  
  headers: (asset, length) ->
    headers = {}
    # Set content type and length headers
    headers["Content-Type"]   = Metro.Support.Path.content_type("text/#{asset.extension[1..-1]}")
    # headers["Content-Length"] = length
    
    # Set caching headers
    headers["Cache-Control"]  = "public"
    headers["Last-Modified"]  = asset.mtime()#.httpdate
    headers["ETag"]           = @etag(asset)
    
    # If the request url contains a fingerprint, set a long
    # expires on the response
    if asset.path_fingerprint
      headers["Cache-Control"] += ", max-age=31536000"
    # Otherwise set `must-revalidate` since the asset could be modified.
    else
      headers["Cache-Control"] += ", must-revalidate"
    
    headers
  
  etag: (asset) ->
    "#{asset.digest()}"
    
module.exports = Assets
