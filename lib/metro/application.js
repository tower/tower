(function() {
  var Application;
  Application = (function() {
    function Application() {}
    Application.Configuration = require('./application/configuration');
    Application.Server = require('./application/server');
    Application.instance = function() {
      var _ref;
      return (_ref = this._instance) != null ? _ref : this._instance = new Metro.Application;
    };
    return Application;
  })();
  module.exports = Application;
}).call(this);
