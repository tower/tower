(function() {
  var DSL, _;
  var __slice = Array.prototype.slice;
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  DSL = (function() {
    function DSL() {}
    DSL.prototype.match = function() {
      var _ref;
      if ((_ref = this.scope) == null) {
        this.scope = {};
      }
      return Metro.Route.create(new Metro.Route(this._extract_options.apply(this, arguments)));
    };
    DSL.prototype.get = function() {
      return this.match_method.apply(this, ["get"].concat(__slice.call(arguments)));
    };
    DSL.prototype.post = function() {
      return this.match_method.apply(this, ["post"].concat(__slice.call(arguments)));
    };
    DSL.prototype.put = function() {
      return this.match_method.apply(this, ["put"].concat(__slice.call(arguments)));
    };
    DSL.prototype["delete"] = function() {
      return this.match_method.apply(this, ["delete"].concat(__slice.call(arguments)));
    };
    DSL.prototype.match_method = function(method) {
      var options;
      options = arguments.pop();
      options.via = method;
      arguments.push(options);
      this.match(options);
      return this;
    };
    DSL.prototype.scope = function() {};
    DSL.prototype.controller = function(controller, options, block) {
      options.controller = controller;
      return this.scope(options, block);
    };
    DSL.prototype.namespace = function(path, options, block) {
      options = _.extend({
        path: path,
        as: path,
        module: path,
        shallow_path: path,
        shallow_prefix: path
      }, options);
      return this.scope(options, block);
    };
    DSL.prototype.constraints = function(options, block) {
      return this.scope({
        constraints: options
      }, block);
    };
    DSL.prototype.defaults = function(options, block) {
      return this.scope({
        defaults: options
      }, block);
    };
    DSL.prototype.resource = function() {};
    DSL.prototype.resources = function() {};
    DSL.prototype.collection = function() {};
    DSL.prototype.member = function() {};
    DSL.prototype.root = function(options) {
      return this.match('/', _.extend({
        as: "root"
      }, options));
    };
    DSL.prototype._extract_options = function() {
      var anchor, constraints, controller, defaults, format, method, name, options, path;
      path = Metro.Route.normalize_path(arguments[0]);
      options = arguments[arguments.length - 1] || {};
      options.path = path;
      format = this._extract_format(options);
      options.path = this._extract_path(options);
      method = this._extract_request_method(options);
      constraints = this._extract_constraints(options);
      defaults = this._extract_defaults(options);
      controller = this._extract_controller(options);
      anchor = this._extract_anchor(options);
      name = this._extract_name(options);
      options = _.extend(options, {
        method: method,
        constraints: constraints,
        defaults: defaults,
        name: name,
        format: format,
        controller: controller,
        anchor: anchor,
        ip: options.ip
      });
      return options;
    };
    DSL.prototype._extract_format = function(options) {};
    DSL.prototype._extract_name = function(options) {
      return options.as;
    };
    DSL.prototype._extract_constraints = function(options) {
      return options.constraints || {};
    };
    DSL.prototype._extract_defaults = function(options) {
      return options.defaults || {};
    };
    DSL.prototype._extract_path = function(options) {
      return "" + options.path + ".:format?";
    };
    DSL.prototype._extract_request_method = function(options) {
      return options.via || options.request_method;
    };
    DSL.prototype._extract_anchor = function(options) {
      return options.anchor;
    };
    DSL.prototype._extract_controller = function(options) {
      var action, controller, to;
      to = options.to.split('#');
      if (to.length === 1) {
        action = to[0];
      } else {
        controller = to[0];
        action = to[1];
      }
      if (controller == null) {
        controller = options.controller || this.scope.controller;
      }
      if (action == null) {
        action = options.action || this.scope.action;
      }
      controller = controller.toLowerCase().replace(/(?:_controller)?$/, "_controller");
      action = action.toLowerCase();
      return {
        name: controller,
        action: action,
        class_name: _.camelize("_" + controller)
      };
    };
    return DSL;
  })();
  module.exports = DSL;
}).call(this);
