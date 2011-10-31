Metro.Application = (function() {
  function Application() {
    var _ref;
    if ((_ref = this.server) == null) {
      this.server = require('connect')();
    }
  }
  Application.instance = function() {
    var _ref;
    return (_ref = this._instance) != null ? _ref : this._instance = new Metro.Application;
  };
  Application.initialize = function() {
    if (Metro.Asset) {
      Metro.Asset.initialize();
    }
    Metro.Route.initialize();
    Metro.Model.initialize();
    Metro.View.initialize();
    Metro.Controller.initialize();
    require("" + Metro.root + "/config/application");
    return this.instance();
  };
  Application.teardown = function() {
    Metro.Route.teardown();
    Metro.Model.teardown();
    Metro.View.teardown();
    Metro.Controller.teardown();
    return delete this._instance;
  };
  return Application;
})();
require('./application/server');
Metro.Application.include(Metro.Application.Server);
module.exports = Metro.Application;