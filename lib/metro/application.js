(function() {
  var Application, connect;
  connect = require('connect');
  Application = (function() {
    Application.Configuration = require('./application/configuration');
    Application.routes = function() {
      return this.instance().routes();
    };
    Application.instance = function() {
      var _ref;
      return (_ref = this._instance) != null ? _ref : this._instance = new Metro.Application;
    };
    Application.configure = function(callback) {
      return callback.apply(this);
    };
    Application.prototype.app = null;
    Application.prototype.server = null;
    Application.prototype.env = function() {
      return process.env();
    };
    function Application() {
      var _ref;
      if ((_ref = this.app) == null) {
        this.app = connect();
      }
    }
    Application.prototype.call = function(env) {};
    Application.prototype.routes = function() {
      var _ref;
      return (_ref = this._routes) != null ? _ref : this._routes = new Metro.Routes.Collection;
    };
    Application.prototype.assets = function() {
      var _ref;
      return (_ref = this._assets) != null ? _ref : this._assets = new Metro.Assets.Environment;
    };
    Application.prototype.config = function() {
      var _ref;
      return (_ref = this._config) != null ? _ref : this._config = new Metro.Application.Configuration;
    };
    Application.prototype.stack = function() {
      this.app.use(connect.favicon(Metro.public_path + "/favicon.ico"));
      this.app.use(Metro.Middleware.Static.middleware);
      this.app.use(Metro.Middleware.Query.middleware);
      this.app.use(Metro.Middleware.Assets.middleware);
      this.app.use(connect.bodyParser());
      this.app.use(Metro.Middleware.Dependencies.middleware);
      this.app.use(Metro.Middleware.Cookies.middleware);
      this.app.use(Metro.Middleware.Router.middleware);
      return this.app;
    };
    Application.prototype.listen = function() {
      if (Metro.env !== "test") {
        this.app.listen(Metro.port);
        return console.log("Metro server listening on port " + Metro.port);
      }
    };
    Application.bootstrap = function() {
      require("" + Metro.root + "/config/application");
      Metro.Routes.bootstrap();
      Metro.Models.bootstrap();
      Metro.Views.bootstrap();
      Metro.Controllers.bootstrap();
      return Metro.Application.instance();
    };
    Application.run = function() {
      Metro.Application.instance().stack();
      return Metro.Application.instance().listen();
    };
    return Application;
  })();
  module.exports = Application;
}).call(this);
