(function() {
  var connect;
  connect = require('connect');
  Metro.Application = (function() {
    function Application() {
      this.server || (this.server = require('connect')());
    }
    Application.instance = function() {
      return this._instance || (this._instance = new Metro.Application);
    };
    Application.initialize = function() {
      if (Metro.Asset) {
        Metro.Asset.initialize();
      }
      Metro.Route.initialize();
      Metro.View.initialize();
      Metro.Controller.initialize();
      require("" + Metro.root + "/config/application");
      return this.instance();
    };
    Application.teardown = function() {
      Metro.Route.teardown();
      Metro.View.teardown();
      Metro.Controller.teardown();
      return delete this._instance;
    };
    Application.prototype.stack = function() {
      this.server.use(connect.favicon(Metro.publicPath + "/favicon.ico"));
      this.server.use(Metro.Middleware.Static.middleware);
      this.server.use(Metro.Middleware.Query.middleware);
      this.server.use(Metro.Middleware.Assets.middleware);
      this.server.use(connect.bodyParser());
      this.server.use(Metro.Middleware.Dependencies.middleware);
      this.server.use(Metro.Middleware.Router.middleware);
      return this.server;
    };
    Application.prototype.listen = function() {
      if (Metro.env !== "test") {
        this.server.listen(Metro.port);
        return console.log("Metro server listening on port " + Metro.port);
      }
    };
    Application.run = function() {
      Metro.Application.instance().stack();
      return Metro.Application.instance().listen();
    };
    return Application;
  })();
  module.exports = Metro.Application;
}).call(this);
