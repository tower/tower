var Application, exports;
Application = (function() {
  function Application() {}
  Application.Configuration = require('../lib/application/configuration');
  Application.routes = function() {
    return this.instance().routes();
  };
  Application.instance = function() {
    var _ref;
    return (_ref = this._instance) != null ? _ref : this._instance = new Metro.Application;
  };
  Application.prototype.app = function() {};
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
  return Application;
})();
exports = module.exports = Application;