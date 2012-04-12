class App extends Tower.Application
  @configure ->
    @use "favicon", Tower.publicPath + "/favicon.png"
    @use "static",  Tower.publicPath, maxAge: Tower.publicCacheDuration
    @use "profiler" if Tower.env != "production"
    @use "logger"
    @use "query"
    @use "cookieParser", Tower.config.session.key
    @use "session", secret: Tower.config.session.secret, cookie: {domain: Tower.config.session.cookie.domain}
    @use "bodyParser", uploadDir: "./public/uploads"
    #@use "csrf"
    @use "methodOverride", "_method"
    @use Tower.Middleware.Agent
    @use Tower.Middleware.Location
    #if Tower.httpCredentials && Tower.branch != "development"
    #  @use "basicAuth", Tower.httpCredentials.username, Tower.httpCredentials.password
    
    @use Tower.Middleware.Router

module.exports = global.App = new App
