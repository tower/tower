(function() {
  var Application;
  Application = (function() {
    function Application() {}
    Application.Server = require('./application/server');
    Application.include(Application.Server);
    Application.instance = function() {
      var _ref;
      return (_ref = this._instance) != null ? _ref : this._instance = new Metro.Application;
    };
    Application.initialize = function() {
      require("" + Metro.root + "/config/application");
      Metro.Route.initialize();
      Metro.Model.initialize();
      Metro.View.initialize();
      Metro.Controller.initialize();
      if (Metro.Asset) {
        Metro.Asset.initialize();
      }
      return this.instance();
    };
    Application.teardown = function() {
      Metro.Route.teardown();
      Metro.Model.teardown();
      Metro.View.teardown();
      Metro.Controller.teardown();
      if (Metro.Asset) {
        Metro.Asset.teardown();
      }
      return delete this._instance;
    };
    return Application;
  })();
  module.exports = Application;
}).call(this);
