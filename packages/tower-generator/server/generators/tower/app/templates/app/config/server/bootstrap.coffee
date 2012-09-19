<%= app.namespace %>.configure ->
  @use 'favicon', Tower.publicPath + '/favicon.png'
  @use 'static',  Tower.publicPath, maxAge: Tower.publicCacheDuration
  @use 'logger'
  @use 'query'
  @use 'cookieParser', Tower.config.session.key
  @use 'session', secret: Tower.config.session.secret, cookie: {domain: Tower.config.session.cookie.domain}
  @use 'bodyParser', uploadDir: './public/uploads'
  #@use 'csrf'
  @use 'methodOverride', '_method'
  @use Tower.MiddlewareAgent
  @use Tower.MiddlewareLocation
  # if Tower.httpCredentials && Tower.branch != 'development'
  #   @use 'basicAuth', Tower.httpCredentials.username, Tower.httpCredentials.password

  @use Tower.MiddlewareRouter

  # For "web sockets" on heroku:
  # App.io.configure ->
  #   App.io.set('transports', ['xhr-polling'])
