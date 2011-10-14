(function() {
  var Application, exports;
  Application = (function() {
    Application.Configuration = require('../lib/application/configuration');
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
    Application.prototype.app = function() {
      var _ref;
      return (_ref = this._app) != null ? _ref : this._app = express.createServer();
    };
    function Application() {}
    Application.prototype.call = function(env) {};
    Application.prototype.env_config = function() {
      var _ref;
      return (_ref = this._env_config) != null ? _ref : this._env_config = {};
    };
    Application.prototype.routes = function() {
      var _ref;
      return (_ref = this._routes) != null ? _ref : this._routes = new Metro.Route.Collection;
    };
    Application.prototype.initializers = function() {};
    Application.prototype.config = function() {
      var _ref;
      return (_ref = this._config) != null ? _ref : this._config = new Metro.Application.Configuration;
    };
    Application.prototype.default_middleware_stack = function() {};
    Application.bootstrap = function() {
      require("" + Metro.root + "/config/application.js");
      Metro.Route.bootstrap();
      Metro.Model.bootstrap();
      Metro.View.bootstrap();
      return Metro.Controller.bootstrap();
    };
    return Application;
  })();
  exports = module.exports = Application;
}).call(this);
