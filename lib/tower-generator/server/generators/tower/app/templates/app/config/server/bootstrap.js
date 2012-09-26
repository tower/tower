<%= app.namespace %>.configure(function() {
  this.use('favicon', Tower.publicPath + '/favicon.png');
  this.use('static',  Tower.publicPath, {maxAge: Tower.publicCacheDuration});
  if (Tower.env != 'production')
    this.use('profiler');
  this.use('logger');
  this.use('query');
  this.use('cookieParser', Tower.config.session.key);
  this.use('session', {secret: Tower.config.session.secret, cookie: {domain: Tower.config.session.cookie.domain}});
  this.use('bodyParser', {uploadDir: './public/uploads'});
  // this.use 'csrf'
  this.use('methodOverride', '_method');
  this.use(Tower.MiddlewareAgent);
  this.use(Tower.MiddlewareLocation);
  // if (Tower.httpCredentials && Tower.branch != 'development')
  //   this.use('basicAuth', Tower.httpCredentials.username, Tower.httpCredentials.password);

  this.use(Tower.MiddlewareRouter);

  // For "web sockets" on heroku:
  // App.io.configure(function() {
  //   App.io.set('transports', ['xhr-polling']);
  // });
});
