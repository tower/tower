(function() {
  Metro.Middleware = {
    Dependencies: require('./middleware/dependencies'),
    Router: require('./middleware/router'),
    Cookies: require('./middleware/cookies'),
    Static: require('./middleware/static'),
    Query: require('./middleware/query'),
    Assets: require('./middleware/assets')
  };
}).call(this);
