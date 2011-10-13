(function() {
  var Metro, Route, exports;
  require('./support/class');
  Route = (function() {
    Route.Collection = require('../lib/route/collection');
    Route.Mapper = require('../lib/route/mapper');
    Route.ANCHOR_CHARACTERS_REGEX = /\A(\\A|\^)|(\\Z|\\z|\$)\Z/;
    Route.SHORTHAND_REGEX = /[\w/]+$/;
    Route.WILDCARD_PATH = /\*([^/\)]+)\)?$/;
    Route.include(Route.Mapper);
    Route.prototype.app = null;
    Route.prototype.name = null;
    Route.prototype.path = null;
    Route.prototype.verb = null;
    Route.prototype.defaults = {};
    Route.prototype.ip = null;
    function Route(path, scope, defaults, name) {
      this.name = name;
      this.path = this.build_path(path);
      this.scope = scope;
      this.options = scope.options || {};
      this.verb = scope.request_method || /(?:)/;
      this.ip = scope.ip || /(?:)/;
    }
    Route.prototype.to = function() {
      return this.options.to;
    };
    Route.prototype.default_controller = function() {
      return this.options.controller || this.scope.controller;
    };
    Route.prototype.default_action = function() {
      return this.options.action || this.scope.action;
    };
    Route.prototype.build_path = function(path) {
      return "" + path + "(.:format)";
    };
    return Route;
  })();
  Metro = {
    Route: Route
  };
  exports = module.exports = Metro;
}).call(this);
