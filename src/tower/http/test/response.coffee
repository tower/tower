class Tower.HTTP.Test.Response extends Tower.HTTP.Response
  constructor: ->
    super

    @set "host", "test.host"
    @set "remoteAddress", "0.0.0.0"
    @set "userAgent", "Tower Testing"

  set: (key, value) ->
    @[key](value)

  host: (value) ->
    @_host = value if arguments.length
    @_host

  requestMethodGet: (method) ->
    @env['REQUEST_METHOD'] = method.toString().toUpperCase() if arguments.length
    @env['REQUEST_METHOD']

  host: (host) ->
    @env['HTTP_HOST'] = host if arguments.length
    @env['HTTP_HOST']

  port: (number) ->
    @env['SERVER_PORT'] = number if arguments.length
    @env['SERVER_PORT']

  requestUri: (uri) ->
    @env['REQUEST_URI'] = uri if arguments.length
    @env['REQUEST_URI']

  path: (path) ->
    @env['PATH_INFO'] = path if arguments.length
    @env['PATH_INFO']

  action: (actionName) ->
    pathParameters["action"] = actionName.toString()

  ifModifiedSince: (lastModified) ->
    @env['HTTP_IF_MODIFIED_SINCE'] = lastModified

  ifNoneMatch: (etag) ->
    @env['HTTP_IF_NONE_MATCH'] = etag

  remoteAddr: (addr) ->
    @env['REMOTE_ADDR'] = addr

  userAgent: (userAgent) ->
    @env['HTTP_USER_AGENT'] = userAgent

  accept: (mimeTypes) ->
    @env['HTTP_ACCEPT'] = mimeTypes.join(',')

  cookies: ->
    @_cookies ||= {}
