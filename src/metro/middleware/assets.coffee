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
      @notFoundResponse respond
    #else if @notModified(asset)
    #  @notModifiedResponse(asset)
    else
      @okResponse asset, respond
  
  forbiddenRequest: (request) ->
    !!request.url.match(/\.{2}/)
    
  notModified: (asset) ->
    env["HTTP_IF_MODIFIED_SINCE"] == asset.mtime.httpdate
    
  # Returns a 304 Not Modified response tuple
  notModifiedResponse: (asset, callback) ->
    callback 304, {}, []
    
  forbiddenResponse: (callback) ->
    callback 403, {"Content-Type": "text/plain", "Content-Length": "9"}, "Forbidden"
    
  notFoundResponse: (callback) ->
    callback 404, {"Content-Type": "text/plain", "Content-Length": "9", "X-Cascade": "pass"}, "Not found"
    
  # Returns a 200 OK response tuple
  okResponse: (asset, callback) ->
    paths = Metro.Application.instance().assets().pathsFor(asset.extension)
    self  = @
    asset.render paths: paths, require: Metro.env != "production", (body) ->
      callback 200, self.headers(asset, asset.size()), body
  
  headers: (asset, length) ->
    headers = {}
    # Set content type and length headers
    headers["Content-Type"]   = Metro.Support.Path.contentType("text/#{asset.extension[1..-1]}")
    # headers["Content-Length"] = length
    
    # Set caching headers
    headers["Cache-Control"]  = "public"
    headers["Last-Modified"]  = asset.mtime()#.httpdate
    headers["ETag"]           = @etag(asset)
    
    # If the request url contains a fingerprint, set a long
    # expires on the response
    if asset.pathFingerprint
      headers["Cache-Control"] += ", max-age=31536000"
    # Otherwise set `must-revalidate` since the asset could be modified.
    else
      headers["Cache-Control"] += ", must-revalidate"
    
    headers
  
  etag: (asset) ->
    "#{asset.digest()}"
    
module.exports = Assets
