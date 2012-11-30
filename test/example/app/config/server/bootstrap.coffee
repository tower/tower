App.configure ->
  @use 'favicon', Tower.publicPath + '/favicon.png'
  @use 'static',  Tower.publicPath, maxAge: Tower.publicCacheDuration
  #@use 'profiler' if Tower.env != 'production'
  #@use 'logger'
  @use 'query'
  @use 'cookieParser', Tower.config.session.key
  @use 'session', secret: Tower.config.session.secret, cookie: {domain: Tower.config.session.cookie.domain}
  @use 'bodyParser', uploadDir: Tower.joinPath(Tower.srcRoot, 'tmp/uploads')
  #@use 'csrf'
  @use 'methodOverride', '_method'
  # don't expose your platform to hackers
  @use (request, response, next) ->
    response.removeHeader('X-Powered-By')
    next()
  @use Tower.MiddlewareAgent
  @use Tower.MiddlewareLocation
  #if Tower.httpCredentials && Tower.branch != 'development'
  #  @use 'basicAuth', Tower.httpCredentials.username, Tower.httpCredentials.password
  
  @use Tower.MiddlewareRouter