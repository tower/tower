connect = require('connect')

class Server
  constructor: ->
    @server ?= connect()#.createServer()
    
  stack: ->
    @server.use connect.favicon(Metro.public_path + "/favicon.ico")
    @server.use Metro.Middleware.Static.middleware
    @server.use Metro.Middleware.Query.middleware 
    @server.use Metro.Middleware.Assets.middleware
    @server.use connect.bodyParser()
    @server.use Metro.Middleware.Dependencies.middleware
    @server.use Metro.Middleware.Cookies.middleware
    @server.use Metro.Middleware.Router.middleware
    @server
    
  listen: ->
    unless Metro.env == "test"
      @server.listen(Metro.port)
      console.log("Metro server listening on port #{Metro.port}")
  
  @run: ->
    Metro.Application.instance().stack()
    Metro.Application.instance().listen()
  
module.exports = Server
