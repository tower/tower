(function() {
  var Route, exports;
  Route = (function() {
    Route.ANCHOR_CHARACTERS_REGEX = /\A(\\A|\^)|(\\Z|\\z|\$)\Z/;
    Route.SHORTHAND_REGEX = /[\w/]+$/;
    Route.WILDCARD_PATH = /\*([^/\)]+)\)?$/;
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
    Route.prototype.default_controller = function() {
      return this.options.controller || this.scope.controller;
    };
    Route.prototype.default_action = function() {
      return this.options.action || this.scope.action;
    };
    Route.prototype.build_path = function(path) {
      return "" + path + "(.:format)";
    };
    Route.prototype.matches = function(request) {};
    Route.prototype.call = function(request, response) {
      return global[controller_class_name]["new"](request.params.action).call(request, response);
    };
    return Route;
  })();
  exports = module.exports = Route;
}).call(this);
