var connect;
connect = require('connect');
Metro.Application.Server = (function() {
  function Server() {}
  Server.prototype.stack = function() {
    this.server.use(connect.favicon(Metro.publicPath + "/favicon.ico"));
    this.server.use(Metro.Middleware.Static.middleware);
    this.server.use(Metro.Middleware.Query.middleware);
    this.server.use(Metro.Middleware.Assets.middleware);
    this.server.use(connect.bodyParser());
    this.server.use(Metro.Middleware.Dependencies.middleware);
    this.server.use(Metro.Middleware.Cookies.middleware);
    this.server.use(Metro.Middleware.Router.middleware);
    return this.server;
  };
  Server.prototype.listen = function() {
    if (Metro.env !== "test") {
      this.server.listen(Metro.port);
      return console.log("Metro server listening on port " + Metro.port);
    }
  };
  Server.run = function() {
    Metro.Application.instance().stack();
    return Metro.Application.instance().listen();
  };
  return Server;
})();
module.exports = Metro.Application.Server;