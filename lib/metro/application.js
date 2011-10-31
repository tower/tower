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