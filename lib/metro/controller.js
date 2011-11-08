(function() {
  Metro.Controller = (function() {
    function Controller() {
      Controller.__super__.constructor.apply(this, arguments);
    }
    Controller.initialize = function() {
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/controllers");
    };
    Controller.teardown = function() {
      delete this._helpers;
      delete this._layout;
      return delete this._theme;
    };
    Controller.reload = function() {
      this.teardown();
      return this.initialize();
    };
    Controller.helper = function(object) {
      this._helpers || (this._helpers = []);
      return this._helpers.push(object);
    };
    Controller.layout = function(layout) {
      return this._layout = layout;
    };
    Controller.theme = function(theme) {
      return this._theme = theme;
    };
    Controller.prototype.layout = function() {
      var layout;
      layout = this.constructor._layout;
      if (typeof layout === "function") {
        return layout.apply(this);
      } else {
        return layout;
      }
    };
    Controller.getter("controllerName", Controller, function() {
      return Metro.Support.String.camelize(this.name);
    });
    Controller.getter("controllerName", Controller.prototype, function() {
      return this.constructor.controllerName;
    });
    Controller.prototype.clear = function() {
      this.request = null;
      this.response = null;
      return this.headers = null;
    };
    return Controller;
  })();
  require('./controller/flash');
  require('./controller/redirecting');
  require('./controller/rendering');
  require('./controller/responding');
  Metro.Controller.include(Metro.Controller.Flash);
  Metro.Controller.include(Metro.Controller.Redirecting);
  Metro.Controller.include(Metro.Controller.Rendering);
  Metro.Controller.include(Metro.Controller.Responding);
  module.exports = Metro.Controller;
}).call(this);
