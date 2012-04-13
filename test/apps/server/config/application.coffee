connect = require 'express'

module.exports = global.App = new class App extends Tower.Application
  @configure ->
    @use connect.favicon(Tower.publicPath + "/favicon.ico")
    @use connect.static(Tower.publicPath, maxAge: Tower.publicCacheDuration)
    #@use connect.profiler() if Tower.env != "production"
    #@use connect.logger()
    @use connect.query()
    @use connect.cookieParser()#(Tower.cookieSecret)
    #@use connect.session secret: Tower.sessionSecret
    @use connect.bodyParser()
    #@use connect.csrf()
    @use connect.methodOverride("_method")
    @use Tower.Middleware.Agent
    @use Tower.Middleware.Location
    if Tower.httpCredentials
      @use connect.basicAuth(Tower.httpCredentials.username, Tower.httpCredentials.password)
    @use Tower.Middleware.Router

global.App = App
