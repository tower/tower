(function() {
  var Controller;
  Controller = (function() {
    function Controller() {
      Controller.__super__.constructor.apply(this, arguments);
    }
    Controller.Flash = require('./controller/flash');
    Controller.Redirecting = require('./controller/redirecting');
    Controller.Rendering = require('./controller/rendering');
    Controller.Responding = require('./controller/responding');
    Controller.include(Controller.Flash);
    Controller.include(Controller.Redirecting);
    Controller.include(Controller.Rendering);
    Controller.include(Controller.Responding);
    Controller.initialize = function() {
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/controllers");
    };
    Controller.teardown = function() {
      delete this._helpers;
      delete this._layout;
      return delete this._theme;
    };
    Controller.helper = function(object) {
      var _ref;
      if ((_ref = this._helpers) == null) {
        this._helpers = [];
      }
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
    Controller.getter("controller_name", Controller, function() {
      return Metro.Support.String.underscore(this.name);
    });
    Controller.getter("controller_name", Controller.prototype, function() {
      return this.constructor.controller_name;
    });
    return Controller;
  })();
  module.exports = Controller;
}).call(this);
