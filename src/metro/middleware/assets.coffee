class Assets
  @middleware: (request, response, next) -> (new Assets).call(request, response, next)
  
  call: (request, response, next) ->
    start_time = new Date()
    asset      = Metro.Application.assets().find(request.path)
    if !asset
      @not_found_response()
    else if @not_modified(asset)
      @not_modified_response(asset)
    else
      @ok_response(asset)
  
  forbidden_request: (request) ->
    !!request.url.match(/\.{2}/)
    
  not_modified: (asset) ->
    env["HTTP_IF_MODIFIED_SINCE"] == asset.mtime.httpdate
    
  # Returns a 304 Not Modified response tuple
  not_modified_response: (asset, env) ->
    [304, {}, []]
    
  forbidden_response: ->
    [403, {"Content-Type": "text/plain", "Content-Length": "9"}, ["Forbidden"]]
    
  not_found_response: ->
    [404, {"Content-Type": "text/plain", "Content-Length": "9", "X-Cascade": "pass"}, ["Not found"]]
    
  # Returns a 200 OK response tuple
  ok_response: (asset) ->
    if @body_only(env)
      [200, @headers(env, asset, asset.size()), [asset.body()]]
    else
      [200, @headers(env, asset, asset.length), asset]
    
  headers: (env, asset, length) ->
    headers = {}
    # Set content type and length headers
    headers["Content-Type"]   = asset.content_type
    headers["Content-Length"] = length.to_s

    # Set caching headers
    headers["Cache-Control"]  = "public"
    headers["Last-Modified"]  = asset.mtime.httpdate
    headers["ETag"]           = etag(asset)
    
    # If the request url contains a fingerprint, set a long
    # expires on the response
    if asset.path_fingerprint
      headers["Cache-Control"] += ", max-age=31536000"
    # Otherwise set `must-revalidate` since the asset could be modified.
    else
      headers["Cache-Control"] += ", must-revalidate"
    
    headers
  
  etag: (asset) ->
    "#{asset.digest}"
    
module.exports = Assets
