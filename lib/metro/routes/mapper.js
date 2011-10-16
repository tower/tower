(function() {
  var Mapper, exports, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice;
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  Mapper = (function() {
    __extends(Mapper, Class);
    function Mapper(collection) {
      this.collection = collection;
    }
    Mapper.prototype.match = function() {
      var _ref;
      if ((_ref = this.scope) == null) {
        this.scope = {};
      }
      return this.collection.add(new Metro.Routes.Route(this._extract_options.apply(this, arguments)));
    };
    Mapper.prototype.get = function() {
      return this.match_method.apply(this, ["get"].concat(__slice.call(arguments)));
    };
    Mapper.prototype.post = function() {
      return this.match_method.apply(this, ["post"].concat(__slice.call(arguments)));
    };
    Mapper.prototype.put = function() {
      return this.match_method.apply(this, ["put"].concat(__slice.call(arguments)));
    };
    Mapper.prototype["delete"] = function() {
      return this.match_method.apply(this, ["delete"].concat(__slice.call(arguments)));
    };
    Mapper.prototype.match_method = function(method) {
      var options;
      options = arguments.pop();
      options.via = method;
      arguments.push(options);
      this.match(options);
      return this;
    };
    Mapper.prototype.scope = function() {};
    Mapper.prototype.controller = function(controller, options, block) {
      options.controller = controller;
      return this.scope(options, block);
    };
    Mapper.prototype.namespace = function(path, options, block) {
      options = _.extend({
        path: path,
        as: path,
        module: path,
        shallow_path: path,
        shallow_prefix: path
      }, options);
      return this.scope(options, block);
    };
    Mapper.prototype.constraints = function(options, block) {
      return this.scope({
        constraints: options
      }, block);
    };
    Mapper.prototype.defaults = function(options, block) {
      return this.scope({
        defaults: options
      }, block);
    };
    Mapper.prototype.resource = function() {};
    Mapper.prototype.resources = function() {};
    Mapper.prototype.collection = function() {};
    Mapper.prototype.member = function() {};
    Mapper.prototype.root = function(options) {
      return this.match('/', _.extend({
        as: "root"
      }, options));
    };
    Mapper.prototype._extract_options = function() {
      var constraints, controller, defaults, format, options, path, request_method, segments;
      path = Metro.Routes.Route.normalize_path(arguments[0]);
      options = arguments[arguments.length - 1] || {};
      options.path = path;
      format = this._extract_format(options);
      options.path = this._extract_path(options);
      request_method = this._extract_request_method(options);
      segments = this._extract_segments(options);
      constraints = this._extract_constraints(options);
      defaults = this._extract_defaults(options);
      controller = this._extract_controller(options);
      options = _.extend(options, {
        request_method: request_method,
        constraints: constraints,
        defaults: defaults,
        name: options.as,
        path: path,
        format: format,
        controller: controller,
        anchor: options.anchor,
        ip: options.ip
      });
      return options;
    };
    Mapper.prototype._extract_format = function(options) {};
    Mapper.prototype._extract_constraints = function(options) {
      return options.constraints || {};
    };
    Mapper.prototype._extract_defaults = function(options) {
      return options.defaults || {};
    };
    Mapper.prototype._extract_path = function(options) {
      return "" + options.path + "(.:format)";
    };
    Mapper.prototype._extract_request_method = function(options) {
      return options.via || options.request_method;
    };
    Mapper.prototype._extract_segments = function(options) {
      return _.map(options.path.match(/:\w+/g) || [], function(key) {
        return key.replace(/^:/, "");
      });
    };
    Mapper.prototype._extract_controller = function(options) {
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
      return {
        name: controller,
        action: action,
        class_name: _.camelize("_" + controller)
      };
    };
    return Mapper;
  })();
  exports = module.exports = Mapper;
}).call(this);
