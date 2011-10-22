class Assets
  @middleware: (request, response, next) -> (new Assets).call(request, response, next)
  
  call: (request, response, next) ->
    assets      = Metro.Application.instance().assets()
    
    return next() unless assets.match(request.uri.pathname)
    
    asset       = assets.find(request.uri.pathname)
    
    if !asset
      result = @not_found_response()
    #else if @not_modified(asset)
    #  @not_modified_response(asset)
    else
      result = @ok_response(asset)
    
    response.writeHead result[0], result[1]
    response.write result[2]
    response.end()
  
  forbidden_request: (request) ->
    !!request.url.match(/\.{2}/)
    
  not_modified: (asset) ->
    env["HTTP_IF_MODIFIED_SINCE"] == asset.mtime.httpdate
    
  # Returns a 304 Not Modified response tuple
  not_modified_response: (asset) ->
    [304, {}, []]
    
  forbidden_response: ->
    [403, {"Content-Type": "text/plain", "Content-Length": "9"}, ["Forbidden"]]
    
  not_found_response: ->
    [404, {"Content-Type": "text/plain", "Content-Length": "9", "X-Cascade": "pass"}, ["Not found"]]
    
  # Returns a 200 OK response tuple
  ok_response: (asset) ->
    #if @body_only(env)
    #  [200, @headers(asset, asset.size()), [asset.body()]]
    #else
    paths = Metro.Application.instance().assets().paths_for(asset.extension)
    [200, @headers(asset, asset.size()), asset.render(paths: paths)]
      
  body_only: ->
    
  headers: (asset, length) ->
    headers = {}
    # Set content type and length headers
    headers["Content-Type"]   = Metro.Support.Path.content_type("text/#{asset.extensions()[0][1..-1]}")
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
